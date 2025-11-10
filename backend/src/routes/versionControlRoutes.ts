import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { VersionControlService } from '../services/versionControlService';
import { DerivativeService } from '../services/derivativeService';

interface CreateVersionRequest {
  derivativeId: number;
  content: string;
  changeSummary?: string;
  changeType: 'created' | 'edited' | 'ai_regenerated' | 'rollback';
  changeReason?: string;
}

interface RollbackRequest {
  targetVersionId: number;
  userId?: string;
}

interface CompareRequest {
  version1Id: number;
  version2Id: number;
}

async function versionControlRoutes(fastify: FastifyInstance) {
  const versionControlService = new VersionControlService();
  const derivativeService = new DerivativeService();

  // GET /api/versions/:derivativeId - Get all versions of a derivative
  fastify.get('/versions/:derivativeId', async (
    request: FastifyRequest<{ Params: { derivativeId: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const derivativeId = parseInt(request.params.derivativeId);

      if (isNaN(derivativeId)) {
        return reply.status(400).send({ error: 'Invalid derivative ID' });
      }

      const versions = await versionControlService.getDerivativeVersions(derivativeId);
      return reply.status(200).send(versions);
    } catch (error) {
      console.error('Error fetching versions:', error);
      return reply.status(500).send({
        error: 'Failed to fetch versions',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/versions/timeline/:derivativeId - Get version timeline
  fastify.get('/versions/timeline/:derivativeId', async (
    request: FastifyRequest<{ Params: { derivativeId: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const derivativeId = parseInt(request.params.derivativeId);

      if (isNaN(derivativeId)) {
        return reply.status(400).send({ error: 'Invalid derivative ID' });
      }

      const timeline = await versionControlService.getVersionTimeline(derivativeId);
      return reply.status(200).send(timeline);
    } catch (error) {
      console.error('Error fetching timeline:', error);
      return reply.status(500).send({
        error: 'Failed to fetch timeline',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/version/:versionId - Get specific version
  fastify.get('/version/:versionId', async (
    request: FastifyRequest<{ Params: { versionId: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const versionId = parseInt(request.params.versionId);

      if (isNaN(versionId)) {
        return reply.status(400).send({ error: 'Invalid version ID' });
      }

      const version = await versionControlService.getVersion(versionId);

      if (!version) {
        return reply.status(404).send({ error: 'Version not found' });
      }

      return reply.status(200).send(version);
    } catch (error) {
      console.error('Error fetching version:', error);
      return reply.status(500).send({
        error: 'Failed to fetch version',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // POST /api/versions - Create new version
  fastify.post<{ Body: CreateVersionRequest }>('/versions', async (
    request: FastifyRequest<{ Body: CreateVersionRequest }>,
    reply: FastifyReply
  ) => {
    try {
      const { derivativeId, content, changeSummary, changeType, changeReason } = request.body;

      if (!derivativeId || !content || !changeType) {
        return reply.status(400).send({
          error: 'Missing required fields: derivativeId, content, changeType'
        });
      }

      const userId = request.headers['x-user-id']?.toString() || 'system';

      const version = await versionControlService.createVersion({
        derivativeId,
        content,
        changeSummary,
        changeType,
        changeReason,
        changedBy: userId
      });

      // Update the derivative's content to the new version
      await derivativeService.updateDerivative(derivativeId, { content });

      return reply.status(201).send(version);
    } catch (error) {
      console.error('Error creating version:', error);
      return reply.status(500).send({
        error: 'Failed to create version',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // POST /api/versions/rollback - Rollback to specific version
  fastify.post<{ Body: RollbackRequest }>('/versions/rollback', async (
    request: FastifyRequest<{ Body: RollbackRequest }>,
    reply: FastifyReply
  ) => {
    try {
      const { targetVersionId, userId: providedUserId } = request.body;

      if (!targetVersionId) {
        return reply.status(400).send({
          error: 'Missing required field: targetVersionId'
        });
      }

      const userId = providedUserId || request.headers['x-user-id']?.toString() || 'system';

      // Get the target version to find derivative ID
      const targetVersion = await versionControlService.getVersion(targetVersionId);
      if (!targetVersion) {
        return reply.status(404).send({ error: 'Target version not found' });
      }

      const rollbackVersion = await versionControlService.rollbackToVersion(
        targetVersion.derivative_id,
        targetVersionId,
        userId
      );

      // Update the derivative's content to the rolled back version
      await derivativeService.updateDerivative(targetVersion.derivative_id, {
        content: rollbackVersion.content
      });

      return reply.status(200).send({
        message: 'Successfully rolled back to previous version',
        version: rollbackVersion
      });
    } catch (error) {
      console.error('Error rolling back version:', error);
      return reply.status(500).send({
        error: 'Failed to rollback version',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // POST /api/versions/compare - Compare two versions
  fastify.post<{ Body: CompareRequest }>('/versions/compare', async (
    request: FastifyRequest<{ Body: CompareRequest }>,
    reply: FastifyReply
  ) => {
    try {
      const { version1Id, version2Id } = request.body;

      if (!version1Id || !version2Id) {
        return reply.status(400).send({
          error: 'Missing required fields: version1Id, version2Id'
        });
      }

      const comparison = await versionControlService.compareVersions(version1Id, version2Id);
      return reply.status(200).send(comparison);
    } catch (error) {
      console.error('Error comparing versions:', error);
      return reply.status(500).send({
        error: 'Failed to compare versions',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // DELETE /api/version/:versionId - Delete a version (non-current only)
  fastify.delete('/version/:versionId', async (
    request: FastifyRequest<{ Params: { versionId: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const versionId = parseInt(request.params.versionId);
      const userId = request.headers['x-user-id']?.toString() || 'system';

      if (isNaN(versionId)) {
        return reply.status(400).send({ error: 'Invalid version ID' });
      }

      const success = await versionControlService.deleteVersion(versionId, userId);

      if (!success) {
        return reply.status(404).send({ error: 'Version not found' });
      }

      return reply.status(204).send();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';

      if (errorMsg.includes('current')) {
        return reply.status(400).send({
          error: 'Cannot delete the current version'
        });
      }

      console.error('Error deleting version:', error);
      return reply.status(500).send({
        error: 'Failed to delete version',
        details: errorMsg
      });
    }
  });

  // GET /api/versions/stats/:derivativeId - Get version statistics
  fastify.get('/versions/stats/:derivativeId', async (
    request: FastifyRequest<{ Params: { derivativeId: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const derivativeId = parseInt(request.params.derivativeId);

      if (isNaN(derivativeId)) {
        return reply.status(400).send({ error: 'Invalid derivative ID' });
      }

      const stats = await versionControlService.getVersionStats(derivativeId);
      return reply.status(200).send(stats);
    } catch (error) {
      console.error('Error fetching version stats:', error);
      return reply.status(500).send({
        error: 'Failed to fetch statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // POST /api/versions/purge/:derivativeId - Purge old versions
  fastify.post<{ Params: { derivativeId: string }, Body: { keepCount?: number } }>(
    '/versions/purge/:derivativeId',
    async (
      request: FastifyRequest<{ Params: { derivativeId: string }, Body: { keepCount?: number } }>,
      reply: FastifyReply
    ) => {
      try {
        const derivativeId = parseInt(request.params.derivativeId);
        const { keepCount = 10 } = request.body;
        const userId = request.headers['x-user-id']?.toString() || 'admin';

        if (isNaN(derivativeId)) {
          return reply.status(400).send({ error: 'Invalid derivative ID' });
        }

        if (keepCount < 1) {
          return reply.status(400).send({
            error: 'keepCount must be at least 1'
          });
        }

        const deletedCount = await versionControlService.purgeOldVersions(derivativeId, keepCount);

        return reply.status(200).send({
          message: `Deleted ${deletedCount} old versions, keeping last ${keepCount}`,
          deletedCount
        });
      } catch (error) {
        console.error('Error purging versions:', error);
        return reply.status(500).send({
          error: 'Failed to purge versions',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  );
}

export default versionControlRoutes;
