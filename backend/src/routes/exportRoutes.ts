import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ExportService } from '../services/exportService';

export async function exportRoutes(
  server: FastifyInstance,
  options: any
) {
  const exportService = new ExportService(server.pg);

  /**
   * Export derivatives as CSV
   * GET /api/exports/derivatives/:briefId/csv
   */
  server.get<{ Params: { briefId: string } }>(
    '/derivatives/:briefId/csv',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { briefId } = request.params as { briefId: string };
        const { platforms } = request.query as { platforms?: string };

        const csv = await exportService.exportDerivativesAsCSV(
          parseInt(briefId),
          {
            platforms: platforms ? platforms.split(',') : undefined,
          }
        );

        reply
          .header('Content-Type', 'text/csv')
          .header(
            'Content-Disposition',
            `attachment; filename="derivatives-${briefId}-${Date.now()}.csv"`
          )
          .send(csv);
      } catch (error) {
        console.error('Export derivatives CSV error:', error);
        reply.code(500).send({
          error: 'Failed to export derivatives',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  /**
   * Export derivatives as ICS (iCalendar)
   * GET /api/exports/derivatives/:briefId/ics
   */
  server.get<{ Params: { briefId: string } }>(
    '/derivatives/:briefId/ics',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { briefId } = request.params as { briefId: string };

        const ics = await exportService.exportDerivativesAsICS(
          parseInt(briefId)
        );

        reply
          .header('Content-Type', 'text/calendar')
          .header(
            'Content-Disposition',
            `attachment; filename="publishing-schedule-${briefId}-${Date.now()}.ics"`
          )
          .send(ics);
      } catch (error) {
        console.error('Export derivatives ICS error:', error);
        reply.code(500).send({
          error: 'Failed to export publishing schedule',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  /**
   * Export derivatives as JSON
   * GET /api/exports/derivatives/:briefId/json
   */
  server.get<{ Params: { briefId: string } }>(
    '/derivatives/:briefId/json',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { briefId } = request.params as { briefId: string };
        const { includeVersionHistory, includeMetadata } = request.query as {
          includeVersionHistory?: string;
          includeMetadata?: string;
        };

        const json = await exportService.exportDerivativesAsJSON(
          parseInt(briefId),
          {
            includeVersionHistory: includeVersionHistory === 'true',
            includeMetadata: includeMetadata === 'true',
          }
        );

        reply
          .header('Content-Type', 'application/json')
          .header(
            'Content-Disposition',
            `attachment; filename="derivatives-${briefId}-${Date.now()}.json"`
          )
          .send(json);
      } catch (error) {
        console.error('Export derivatives JSON error:', error);
        reply.code(500).send({
          error: 'Failed to export derivatives',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  /**
   * Export version history as CSV
   * GET /api/exports/versions/:derivativeId/csv
   */
  server.get<{ Params: { derivativeId: string } }>(
    '/versions/:derivativeId/csv',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { derivativeId } = request.params as { derivativeId: string };

        const csv = await exportService.exportVersionHistoryAsCSV(
          parseInt(derivativeId)
        );

        reply
          .header('Content-Type', 'text/csv')
          .header(
            'Content-Disposition',
            `attachment; filename="version-history-${derivativeId}-${Date.now()}.csv"`
          )
          .send(csv);
      } catch (error) {
        console.error('Export version history error:', error);
        reply.code(500).send({
          error: 'Failed to export version history',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );
}
