import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DerivativeService } from '../services/derivativeService';
import { EventLogService } from '../services/eventLogService';
import { MailchimpService } from '../services/mailchimpService';

interface PublishRequest {
  derivativeIds: number[];
  userId?: string;
}

async function publishingRoutes(fastify: FastifyInstance) {
  const derivativeService = new DerivativeService();
  const eventLogService = new EventLogService();

  // POST /api/publishing/derivatives - Publish multiple derivatives
  fastify.post<{ Body: PublishRequest }>('/publishing/derivatives', async (
    request: FastifyRequest<{ Body: PublishRequest }>,
    reply: FastifyReply
  ) => {
    try {
      const { derivativeIds, userId } = request.body;

      if (!derivativeIds || !Array.isArray(derivativeIds) || derivativeIds.length === 0) {
        return reply.status(400).send({
          error: 'Missing or invalid field: derivativeIds (array of numbers)'
        });
      }

      // Get user info from headers if not provided
      const headerUserId = request.headers['x-user-id'];
      const userIdFromHeader = Array.isArray(headerUserId) ? headerUserId[0] : headerUserId;
      const finalUserId = userId || userIdFromHeader || 'anonymous';

      const { published, failed } = await derivativeService.publishDerivatives(derivativeIds, finalUserId);

      // Log batch publishing event
      await eventLogService.logEvent({
        eventType: 'publishing.batch',
        entityType: 'derivatives',
        userId: finalUserId,
        metadata: {
          total: derivativeIds.length,
          published: published.length,
          failed: failed.length,
          failedIds: failed,
          publishedIds: published.map(d => d.id)
        },
        status: failed.length === 0 ? 'success' : 'failed'
      });

      return reply.status(200).send({
        message: `Published ${published.length}/${derivativeIds.length} derivatives`,
        published: published,
        failed: failed,
        summary: {
          total: derivativeIds.length,
          successCount: published.length,
          failureCount: failed.length
        }
      });
    } catch (error) {
      console.error('Error publishing derivatives:', error);

      await eventLogService.logEvent({
        eventType: 'publishing.batch',
        entityType: 'derivatives',
        userId: request.headers['x-user-id']?.toString() || 'anonymous',
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });

      return reply.status(500).send({
        error: 'Failed to publish derivatives',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // POST /api/publishing/derivative/:id - Publish single derivative
  fastify.post<{ Params: { id: string } }>('/publishing/derivative/:id', async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const id = parseInt(request.params.id);
      const userId = request.headers['x-user-id']?.toString() || 'anonymous';

      if (isNaN(id)) {
        return reply.status(400).send({ error: 'Invalid derivative ID' });
      }

      const derivative = await derivativeService.publishDerivative(id, userId);

      return reply.status(200).send({
        message: 'Derivative published successfully',
        derivative: derivative
      });
    } catch (error) {
      console.error('Error publishing derivative:', error);
      return reply.status(500).send({
        error: 'Failed to publish derivative',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/event-logs - Get event logs (with optional filtering)
  fastify.get<{ Querystring: { eventType?: string, entityType?: string, entityId?: string, limit?: string, offset?: string } }>('/event-logs', async (
    request: FastifyRequest<{ Querystring: { eventType?: string, entityType?: string, entityId?: string, limit?: string, offset?: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { eventType, entityType, entityId, limit = '50', offset = '0' } = request.query;
      const limitNum = Math.min(parseInt(limit) || 50, 100);
      const offsetNum = parseInt(offset) || 0;

      let logs;

      if (eventType) {
        logs = await eventLogService.getEventsByType(eventType, limitNum, offsetNum);
      } else if (entityType && entityId) {
        const id = parseInt(entityId);
        if (isNaN(id)) {
          return reply.status(400).send({ error: 'Invalid entity ID' });
        }
        logs = await eventLogService.getEventsByEntity(entityType, id, limitNum);
      } else {
        // Return all events if no filter
        const allLogsResult = await (fastify as any).db.query(
          `SELECT * FROM event_logs ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
          [limitNum, offsetNum]
        );
        logs = allLogsResult.rows;
      }

      return reply.status(200).send({
        events: logs,
        pagination: {
          limit: limitNum,
          offset: offsetNum
        }
      });
    } catch (error) {
      console.error('Error fetching event logs:', error);
      return reply.status(500).send({
        error: 'Failed to fetch event logs',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/event-logs/stats - Get event statistics
  fastify.get<{ Querystring: { eventType?: string } }>('/event-logs/stats', async (
    request: FastifyRequest<{ Querystring: { eventType?: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { eventType } = request.query;
      const stats = await eventLogService.getEventStats(eventType);

      return reply.status(200).send({
        stats: stats
      });
    } catch (error) {
      console.error('Error fetching event stats:', error);
      return reply.status(500).send({
        error: 'Failed to fetch event statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // POST /api/event-logs/cleanup - Clean up old event logs (admin only)
  fastify.post<{ Body: { daysOld?: number } }>('/event-logs/cleanup', async (
    request: FastifyRequest<{ Body: { daysOld?: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const { daysOld = 30 } = request.body;

      if (daysOld < 1) {
        return reply.status(400).send({
          error: 'daysOld must be greater than 0'
        });
      }

      const deletedCount = await eventLogService.cleanOldEvents(daysOld);

      await eventLogService.logEvent({
        eventType: 'event_logs.cleanup',
        userId: request.headers['x-user-id']?.toString() || 'admin',
        metadata: {
          daysOld: daysOld,
          deletedCount: deletedCount
        },
        status: 'success'
      });

      return reply.status(200).send({
        message: `Deleted ${deletedCount} event logs older than ${daysOld} days`,
        deletedCount: deletedCount
      });
    } catch (error) {
      console.error('Error cleaning up event logs:', error);
      return reply.status(500).send({
        error: 'Failed to clean up event logs',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // POST /api/publishing/mailchimp - Create and send Mailchimp campaign
  fastify.post<{ Body: { apiKey: string; campaignName: string; campaignSubject: string; emailContent: string; audienceId?: string } }>('/publishing/mailchimp', async (
    request: FastifyRequest<{ Body: { apiKey: string; campaignName: string; campaignSubject: string; emailContent: string; audienceId?: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { apiKey, campaignName, campaignSubject, emailContent, audienceId } = request.body;

      // Log API key details
      console.log('🔑 [BACKEND] Received apiKey:', apiKey);
      console.log('🔑 [BACKEND] API key length:', apiKey?.length);
      console.log('🔑 [BACKEND] API key starts with:', apiKey?.substring(0, 30));
      console.log('🔑 [BACKEND] API key ends with:', apiKey?.substring(apiKey.length - 10));

      // Validate required fields
      if (!apiKey || !campaignName || !campaignSubject || !emailContent) {
        return reply.status(400).send({
          error: 'Missing required fields: apiKey, campaignName, campaignSubject, emailContent'
        });
      }

      const mailchimpService = new MailchimpService();
      const result = await mailchimpService.createAndSendCampaign({
        apiKey,
        campaignName,
        campaignSubject,
        emailContent,
        audienceId
      });

      // Log the Mailchimp publishing event (skip if table doesn't exist)
      try {
        await eventLogService.logEvent({
          eventType: 'publishing.mailchimp',
          entityType: 'campaign',
          userId: request.headers['x-user-id']?.toString() || 'anonymous',
          metadata: {
            campaignId: result.campaignId,
            campaignName: campaignName,
            emailsSent: result.emailsSent,
            subscribers: result.subscribers
          },
          status: result.success ? 'success' : 'failed'
        });
      } catch (logError) {
        console.warn('Warning: Could not log event (database table may not exist):', logError);
      }

      return reply.status(200).send({
        success: result.success,
        message: result.message,
        campaignId: result.campaignId,
        emailsSent: result.emailsSent,
        subscribers: result.subscribers,
        timestamp: result.timestamp
      });
    } catch (error) {
      console.error('Error creating Mailchimp campaign:', error);

      // Try to log error (skip if table doesn't exist)
      try {
        await eventLogService.logEvent({
          eventType: 'publishing.mailchimp',
          entityType: 'campaign',
          userId: request.headers['x-user-id']?.toString() || 'anonymous',
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
      } catch (logError) {
        console.warn('Warning: Could not log error event:', logError);
      }

      return reply.status(500).send({
        success: false,
        error: 'Failed to create Mailchimp campaign',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}

export default publishingRoutes;
