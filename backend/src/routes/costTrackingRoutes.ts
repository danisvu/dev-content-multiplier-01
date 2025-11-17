import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { CostTrackingService } from '../services/costTrackingService';
import database from '../database';

export async function costTrackingRoutes(
  server: FastifyInstance,
  options: any
) {
  const costTrackingService = new CostTrackingService(database);

  /**
   * Record a cost transaction
   * POST /api/costs/record
   */
  server.post<{ Body: any }>(
    '/record',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const {
          derivativeId,
          costType,
          provider,
          costAmount,
          tokensUsed,
          inputTokens,
          outputTokens,
          requestMetadata,
        } = request.body as any;

        if (!derivativeId || !costType || costAmount === undefined) {
          return reply.code(400).send({
            error: 'derivativeId, costType, and costAmount are required',
          });
        }

        const record = await costTrackingService.recordCost({
          derivativeId,
          costType,
          provider,
          costAmount: parseFloat(costAmount),
          tokensUsed,
          inputTokens,
          outputTokens,
          requestMetadata,
        });

        reply.code(201).send({
          message: 'Cost recorded successfully',
          record,
        });
      } catch (error) {
        console.error('Record cost error:', error);
        reply.code(500).send({
          error: 'Failed to record cost',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  /**
   * Get cost breakdown for a specific derivative
   * GET /api/costs/derivative/:derivativeId
   */
  server.get<{ Params: { derivativeId: string } }>(
    '/derivative/:derivativeId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { derivativeId } = request.params as { derivativeId: string };

        const cost = await costTrackingService.getDerivativeCost(
          parseInt(derivativeId)
        );

        if (!cost) {
          return reply.code(404).send({
            error: 'Derivative not found',
          });
        }

        reply.send({
          cost,
        });
      } catch (error) {
        console.error('Get derivative cost error:', error);
        reply.code(500).send({
          error: 'Failed to get derivative cost',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  /**
   * Get cost breakdown for all derivatives in a brief
   * GET /api/costs/brief/:briefId
   */
  server.get<{ Params: { briefId: string } }>(
    '/brief/:briefId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { briefId } = request.params as { briefId: string };

        const costs = await costTrackingService.getBriefCosts(
          parseInt(briefId)
        );

        reply.send({
          briefId: parseInt(briefId),
          derivatives: costs,
          summary: {
            total_cost: costs.reduce((sum, c) => sum + c.total_cost, 0),
            average_cost_per_derivative:
              costs.length > 0
                ? costs.reduce((sum, c) => sum + c.total_cost, 0) / costs.length
                : 0,
            derivative_count: costs.length,
          },
        });
      } catch (error) {
        console.error('Get brief costs error:', error);
        reply.code(500).send({
          error: 'Failed to get brief costs',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  /**
   * Get aggregate cost summary for a brief
   * GET /api/costs/summary/:briefId
   */
  server.get<{ Params: { briefId: string } }>(
    '/summary/:briefId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { briefId } = request.params as { briefId: string };

        const summary = await costTrackingService.getBriefCostSummary(
          parseInt(briefId)
        );

        if (!summary) {
          return reply.code(404).send({
            error: 'Brief not found or no costs recorded',
          });
        }

        reply.send({
          summary,
        });
      } catch (error) {
        console.error('Get cost summary error:', error);
        reply.code(500).send({
          error: 'Failed to get cost summary',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  /**
   * Get cost statistics for a date range
   * GET /api/costs/stats
   */
  server.get<{ Querystring: any }>(
    '/stats',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { startDate, endDate, provider, costType } = request.query as {
          startDate?: string;
          endDate?: string;
          provider?: string;
          costType?: string;
        };

        const stats = await costTrackingService.getCostStats({
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
          provider,
          costType,
        });

        reply.send({
          stats,
        });
      } catch (error) {
        console.error('Get cost stats error:', error);
        reply.code(500).send({
          error: 'Failed to get cost statistics',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  /**
   * Export costs as CSV
   * GET /api/costs/export/:briefId/csv
   */
  server.get<{ Params: { briefId: string } }>(
    '/export/:briefId/csv',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { briefId } = request.params as { briefId: string };

        const csv = await costTrackingService.exportCostsAsCSV(
          parseInt(briefId)
        );

        reply
          .header('Content-Type', 'text/csv')
          .header(
            'Content-Disposition',
            `attachment; filename="costs-${briefId}-${Date.now()}.csv"`
          )
          .send(csv);
      } catch (error) {
        console.error('Export costs CSV error:', error);
        reply.code(500).send({
          error: 'Failed to export costs',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );
}
