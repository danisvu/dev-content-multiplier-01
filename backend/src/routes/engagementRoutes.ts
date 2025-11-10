import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { EngagementSimulationService, SimulationRequest } from '../services/engagementSimulationService';

interface SimulateEngagementRequest {
  content: string;
  platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'tiktok';
  tone?: string;
  hashtags?: string[];
  mentions?: string[];
  timestamp?: string;
}

async function engagementRoutes(fastify: FastifyInstance) {
  const engagementService = new EngagementSimulationService();

  // POST /api/engagement/simulate - Simulate engagement metrics
  fastify.post<{ Body: SimulateEngagementRequest }>('/engagement/simulate', async (
    request: FastifyRequest<{ Body: SimulateEngagementRequest }>,
    reply: FastifyReply
  ) => {
    try {
      const { content, platform, tone, hashtags, mentions, timestamp } = request.body;

      if (!content || !platform) {
        return reply.status(400).send({
          error: 'Missing required fields: content, platform'
        });
      }

      const simulationRequest: SimulationRequest = {
        content,
        platform,
        tone,
        hashtags,
        mentions,
        timestamp: timestamp ? new Date(timestamp) : new Date()
      };

      const prediction = await engagementService.simulateEngagement(simulationRequest);

      return reply.status(200).send(prediction);
    } catch (error) {
      console.error('Error simulating engagement:', error);
      return reply.status(500).send({
        error: 'Failed to simulate engagement',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/engagement/best-times/:platform - Get best posting times
  fastify.get<{ Params: { platform: string } }>('/engagement/best-times/:platform', async (
    request: FastifyRequest<{ Params: { platform: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { platform } = request.params;

      const validPlatforms = ['twitter', 'linkedin', 'facebook', 'instagram', 'tiktok'];
      if (!validPlatforms.includes(platform)) {
        return reply.status(400).send({
          error: 'Invalid platform. Must be one of: ' + validPlatforms.join(', ')
        });
      }

      const bestTimes = engagementService.getPlatformBestTimes(platform);

      return reply.status(200).send({
        platform,
        best_times: bestTimes
      });
    } catch (error) {
      console.error('Error fetching best times:', error);
      return reply.status(500).send({
        error: 'Failed to fetch best times',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/engagement/tips/:platform - Get engagement tips
  fastify.get<{ Params: { platform: string } }>('/engagement/tips/:platform', async (
    request: FastifyRequest<{ Params: { platform: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { platform } = request.params;

      const validPlatforms = ['twitter', 'linkedin', 'facebook', 'instagram', 'tiktok'];
      if (!validPlatforms.includes(platform)) {
        return reply.status(400).send({
          error: 'Invalid platform. Must be one of: ' + validPlatforms.join(', ')
        });
      }

      const tips = engagementService.getEngagementTips(platform);

      return reply.status(200).send({
        platform,
        tips,
        count: tips.length
      });
    } catch (error) {
      console.error('Error fetching tips:', error);
      return reply.status(500).send({
        error: 'Failed to fetch tips',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // POST /api/engagement/content-score - Calculate content score
  fastify.post<{ Body: SimulateEngagementRequest }>('/engagement/content-score', async (
    request: FastifyRequest<{ Body: SimulateEngagementRequest }>,
    reply: FastifyReply
  ) => {
    try {
      const { content, platform, tone, hashtags, mentions, timestamp } = request.body;

      if (!content || !platform) {
        return reply.status(400).send({
          error: 'Missing required fields: content, platform'
        });
      }

      const simulationRequest: SimulationRequest = {
        content,
        platform,
        tone,
        hashtags,
        mentions,
        timestamp: timestamp ? new Date(timestamp) : new Date()
      };

      const prediction = await engagementService.simulateEngagement(simulationRequest);
      const score = engagementService.calculateContentScore(prediction.factors);

      return reply.status(200).send({
        content_score: score,
        score_level: score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'fair' : 'poor',
        factors: prediction.factors,
        metrics: prediction.moderate
      });
    } catch (error) {
      console.error('Error calculating content score:', error);
      return reply.status(500).send({
        error: 'Failed to calculate content score',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/engagement/platforms - Get all supported platforms
  fastify.get('/engagement/platforms', async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const platforms = [
        {
          name: 'twitter',
          displayName: 'Twitter/X',
          characterLimit: 280,
          emoji: '𝕏'
        },
        {
          name: 'linkedin',
          displayName: 'LinkedIn',
          characterLimit: 3000,
          emoji: '💼'
        },
        {
          name: 'facebook',
          displayName: 'Facebook',
          characterLimit: 63206,
          emoji: 'f'
        },
        {
          name: 'instagram',
          displayName: 'Instagram',
          characterLimit: 2200,
          emoji: '📷'
        },
        {
          name: 'tiktok',
          displayName: 'TikTok',
          characterLimit: 2200,
          emoji: '🎵'
        }
      ];

      return reply.status(200).send({
        platforms,
        count: platforms.length
      });
    } catch (error) {
      console.error('Error fetching platforms:', error);
      return reply.status(500).send({
        error: 'Failed to fetch platforms',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}

export default engagementRoutes;
