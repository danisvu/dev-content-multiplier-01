import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AnalyticsService } from '../services/analyticsService';

export async function analyticsRoutes(
  server: FastifyInstance,
  options: any
) {
  const analyticsService = new AnalyticsService(server.pg);

  /**
   * Get funnel analytics (ideas → briefs → derivatives → published)
   * GET /api/analytics/funnel
   */
  server.get<{ Querystring: any }>(
    '/funnel',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { startDate, endDate } = request.query as {
          startDate?: string;
          endDate?: string;
        };

        const funnel = await analyticsService.getFunnelAnalytics({
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
        });

        reply.send({
          analytics: funnel,
        });
      } catch (error) {
        console.error('Get funnel analytics error:', error);
        reply.code(500).send({
          error: 'Failed to get funnel analytics',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  /**
   * Get platform-specific analytics
   * GET /api/analytics/platforms
   */
  server.get<{ Querystring: any }>(
    '/platforms',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const platforms = await analyticsService.getPlatformAnalytics();

        reply.send({
          platforms,
        });
      } catch (error) {
        console.error('Get platform analytics error:', error);
        reply.code(500).send({
          error: 'Failed to get platform analytics',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  /**
   * Get derivative analytics with trends
   * GET /api/analytics/derivatives
   */
  server.get<{ Querystring: any }>(
    '/derivatives',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { startDate, endDate } = request.query as {
          startDate?: string;
          endDate?: string;
        };

        const analytics = await analyticsService.getDerivativeAnalytics({
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
        });

        reply.send({
          analytics,
        });
      } catch (error) {
        console.error('Get derivative analytics error:', error);
        reply.code(500).send({
          error: 'Failed to get derivative analytics',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  /**
   * Get time series data
   * GET /api/analytics/timeseries
   */
  server.get<{ Querystring: any }>(
    '/timeseries',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { groupBy, startDate, endDate } = request.query as {
          groupBy?: 'day' | 'week' | 'month';
          startDate?: string;
          endDate?: string;
        };

        const data = await analyticsService.getTimeSeriesData({
          groupBy: groupBy || 'day',
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
        });

        reply.send({
          data,
          groupBy: groupBy || 'day',
        });
      } catch (error) {
        console.error('Get time series data error:', error);
        reply.code(500).send({
          error: 'Failed to get time series data',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  /**
   * Get detailed conversion funnel
   * GET /api/analytics/conversion-funnel
   */
  server.get<{ Querystring: any }>(
    '/conversion-funnel',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { platform, startDate, endDate } = request.query as {
          platform?: string;
          startDate?: string;
          endDate?: string;
        };

        const funnel = await analyticsService.getConversionFunnel({
          platform,
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
        });

        reply.send({
          funnel,
        });
      } catch (error) {
        console.error('Get conversion funnel error:', error);
        reply.code(500).send({
          error: 'Failed to get conversion funnel',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );
}
