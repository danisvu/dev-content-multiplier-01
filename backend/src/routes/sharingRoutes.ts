import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { SharingService } from '../services/sharingService';

export async function sharingRoutes(
  server: FastifyInstance,
  options: any
) {
  const sharingService = new SharingService(server.pg);

  /**
   * Create a new shareable preview link
   * POST /api/sharing/create
   */
  server.post<{ Body: any }>(
    '/create',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const {
          briefId,
          previewType,
          password,
          expiresIn,
          maxViews,
          allowComments,
          allowDownloads,
          createdBy,
        } = request.body;

        if (!briefId) {
          return reply.code(400).send({
            error: 'briefId is required',
          });
        }

        const shareLink = await sharingService.createShareLink({
          briefId,
          previewType: previewType || 'full',
          password,
          expiresIn,
          maxViews,
          allowComments,
          allowDownloads,
          createdBy,
        });

        reply.code(201).send({
          message: 'Share link created successfully',
          shareLink,
          shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/shared/${shareLink.token}`,
        });
      } catch (error) {
        console.error('Create share link error:', error);
        reply.code(500).send({
          error: 'Failed to create share link',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  /**
   * Get a shareable preview (publicly accessible)
   * GET /api/sharing/preview/:token
   */
  server.get<{ Params: { token: string }; Querystring: any }>(
    '/preview/:token',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { token } = request.params as { token: string };
        const { password } = request.query as { password?: string };

        // Get share link with validation
        const shareLink = await sharingService.getShareLink(token, password);

        // Log access
        await sharingService.logPreviewAccess({
          sharedPreviewId: shareLink.id,
          ipAddress: request.ip,
          userAgent: request.headers['user-agent'],
        });

        // Get brief data
        const briefResult = await server.pg.query(
          `SELECT id, title, content, status, created_at FROM briefs WHERE id = $1`,
          [shareLink.brief_id]
        );

        if (briefResult.rows.length === 0) {
          return reply.code(404).send({
            error: 'Brief not found',
          });
        }

        const brief = briefResult.rows[0];

        // Get derivatives
        let derivatives = [];
        if (
          shareLink.preview_type === 'full' ||
          shareLink.preview_type === 'derivatives_only'
        ) {
          const derivResult = await server.pg.query(
            `SELECT * FROM derivatives WHERE brief_id = $1 ORDER BY platform`,
            [shareLink.brief_id]
          );
          derivatives = derivResult.rows;
        }

        // Get version history if requested
        let versionHistory = {};
        if (shareLink.preview_type === 'full' || shareLink.preview_type === 'version_history') {
          for (const deriv of derivatives) {
            const versionResult = await server.pg.query(
              `SELECT * FROM derivative_versions WHERE derivative_id = $1 ORDER BY version_number`,
              [deriv.id]
            );
            versionHistory[deriv.id] = versionResult.rows;
          }
        }

        reply.code(200).send({
          shareLink: {
            token: shareLink.token,
            previewType: shareLink.preview_type,
            requiresPassword: shareLink.require_password,
            allowComments: shareLink.allow_comments,
            allowDownloads: shareLink.allow_downloads,
            viewCount: shareLink.view_count,
            expiresAt: shareLink.expires_at,
          },
          brief,
          derivatives,
          ...(Object.keys(versionHistory).length > 0 && {
            versionHistory,
          }),
        });
      } catch (error) {
        console.error('Get share preview error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';

        if (message === 'Share link not found') {
          return reply.code(404).send({ error: message });
        }
        if (message === 'Share link has expired') {
          return reply.code(410).send({ error: message });
        }
        if (message === 'Share link view limit exceeded') {
          return reply.code(429).send({ error: message });
        }
        if (message === 'Password required for this share link') {
          return reply.code(401).send({ error: message });
        }
        if (message === 'Invalid password') {
          return reply.code(401).send({ error: message });
        }

        reply.code(500).send({
          error: 'Failed to retrieve preview',
          details: message,
        });
      }
    }
  );

  /**
   * Get all share links for a brief
   * GET /api/sharing/brief/:briefId
   */
  server.get<{ Params: { briefId: string } }>(
    '/brief/:briefId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { briefId } = request.params as { briefId: string };

        const shareLinks = await sharingService.getBriefShareLinks(
          parseInt(briefId)
        );

        reply.send({
          briefId: parseInt(briefId),
          shareLinks: shareLinks.map((link) => ({
            ...link,
            shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/shared/${link.token}`,
          })),
        });
      } catch (error) {
        console.error('Get brief share links error:', error);
        reply.code(500).send({
          error: 'Failed to get share links',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  /**
   * Get statistics for a share link
   * GET /api/sharing/stats/:shareLinkId
   */
  server.get<{ Params: { shareLinkId: string } }>(
    '/stats/:shareLinkId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { shareLinkId } = request.params as { shareLinkId: string };

        const stats = await sharingService.getShareLinkStats(
          parseInt(shareLinkId)
        );

        reply.send({
          stats,
        });
      } catch (error) {
        console.error('Get share link stats error:', error);
        reply.code(500).send({
          error: 'Failed to get statistics',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  /**
   * Update share link settings
   * PUT /api/sharing/:shareLinkId
   */
  server.put<{ Params: { shareLinkId: string }; Body: any }>(
    '/:shareLinkId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { shareLinkId } = request.params as { shareLinkId: string };
        const { expiresIn, maxViews, allowComments, allowDownloads } =
          request.body;

        const updated = await sharingService.updateShareLink(
          parseInt(shareLinkId),
          {
            expiresIn,
            maxViews,
            allowComments,
            allowDownloads,
          }
        );

        reply.send({
          message: 'Share link updated successfully',
          shareLink: updated,
        });
      } catch (error) {
        console.error('Update share link error:', error);
        reply.code(500).send({
          error: 'Failed to update share link',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  /**
   * Revoke a share link
   * POST /api/sharing/:shareLinkId/revoke
   */
  server.post<{ Params: { shareLinkId: string } }>(
    '/:shareLinkId/revoke',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { shareLinkId } = request.params as { shareLinkId: string };

        await sharingService.revokeShareLink(parseInt(shareLinkId));

        reply.send({
          message: 'Share link revoked successfully',
        });
      } catch (error) {
        console.error('Revoke share link error:', error);
        reply.code(500).send({
          error: 'Failed to revoke share link',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  /**
   * Delete a share link permanently
   * DELETE /api/sharing/:shareLinkId
   */
  server.delete<{ Params: { shareLinkId: string } }>(
    '/:shareLinkId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { shareLinkId } = request.params as { shareLinkId: string };

        await sharingService.deleteShareLink(parseInt(shareLinkId));

        reply.send({
          message: 'Share link deleted successfully',
        });
      } catch (error) {
        console.error('Delete share link error:', error);
        reply.code(500).send({
          error: 'Failed to delete share link',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );
}
