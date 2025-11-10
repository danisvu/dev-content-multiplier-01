import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DerivativeService, CreateDerivativeInput, UpdateDerivativeInput, GenerateDerivativesRequest } from '../services/derivativeService';

async function derivativeRoutes(fastify: FastifyInstance) {
  const derivativeService = new DerivativeService();

  // GET /api/derivatives/:id - Get derivative by ID
  fastify.get('/derivatives/:id', async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        return reply.status(400).send({ error: 'Invalid derivative ID' });
      }

      const derivative = await derivativeService.getDerivative(id);

      if (!derivative) {
        return reply.status(404).send({ error: 'Derivative not found' });
      }

      return reply.status(200).send(derivative);
    } catch (error) {
      console.error('Error fetching derivative:', error);
      return reply.status(500).send({
        error: 'Failed to fetch derivative',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/derivatives/brief/:briefId - Get derivatives by brief ID
  fastify.get('/derivatives/brief/:briefId', async (
    request: FastifyRequest<{ Params: { briefId: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const briefId = parseInt(request.params.briefId);

      if (isNaN(briefId)) {
        return reply.status(400).send({ error: 'Invalid brief ID' });
      }

      const derivatives = await derivativeService.getDerivativesByBrief(briefId);
      return reply.status(200).send(derivatives);
    } catch (error) {
      console.error('Error fetching derivatives by brief:', error);
      return reply.status(500).send({
        error: 'Failed to fetch derivatives',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // POST /api/derivatives - Create or update derivative
  fastify.post<{ Body: CreateDerivativeInput }>('/derivatives', async (
    request: FastifyRequest<{ Body: CreateDerivativeInput }>,
    reply: FastifyReply
  ) => {
    try {
      const { briefId, platform, content } = request.body;

      if (!briefId || !platform || !content) {
        return reply.status(400).send({
          error: 'Missing required fields: briefId, platform, content'
        });
      }

      const derivative = await derivativeService.createDerivative({
        briefId,
        platform,
        content
      });

      return reply.status(201).send(derivative);
    } catch (error) {
      console.error('Error creating derivative:', error);
      return reply.status(500).send({
        error: 'Failed to create derivative',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // POST /api/derivatives/generate - Generate derivatives from brief
  fastify.post<{ Body: GenerateDerivativesRequest }>('/derivatives/generate', async (
    request: FastifyRequest<{ Body: GenerateDerivativesRequest }>,
    reply: FastifyReply
  ) => {
    try {
      const { briefId, platforms, model, temperature } = request.body;

      if (!briefId || !platforms || platforms.length === 0) {
        return reply.status(400).send({
          error: 'Missing required fields: briefId, platforms (array)'
        });
      }

      const derivatives = await derivativeService.generateDerivatives({
        briefId,
        platforms,
        model,
        temperature
      });

      return reply.status(201).send(derivatives);
    } catch (error) {
      console.error('Error generating derivatives:', error);
      return reply.status(500).send({
        error: 'Failed to generate derivatives',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // PUT /api/derivatives/:id - Update derivative
  fastify.put<{ Params: { id: string }, Body: UpdateDerivativeInput }>('/derivatives/:id', async (
    request: FastifyRequest<{ Params: { id: string }, Body: UpdateDerivativeInput }>,
    reply: FastifyReply
  ) => {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        return reply.status(400).send({ error: 'Invalid derivative ID' });
      }

      const derivative = await derivativeService.updateDerivative(id, request.body);
      return reply.status(200).send(derivative);
    } catch (error) {
      console.error('Error updating derivative:', error);
      return reply.status(500).send({
        error: 'Failed to update derivative',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // DELETE /api/derivatives/:id - Delete derivative
  fastify.delete('/derivatives/:id', async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        return reply.status(400).send({ error: 'Invalid derivative ID' });
      }

      const success = await derivativeService.deleteDerivative(id);

      if (!success) {
        return reply.status(404).send({ error: 'Derivative not found' });
      }

      return reply.status(204).send();
    } catch (error) {
      console.error('Error deleting derivative:', error);
      return reply.status(500).send({
        error: 'Failed to delete derivative',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/derivatives/stats - Get derivative statistics
  fastify.get('/derivatives/stats', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const stats = await derivativeService.getDerivativeStats();
      return reply.status(200).send(stats);
    } catch (error) {
      console.error('Error fetching derivative stats:', error);
      return reply.status(500).send({
        error: 'Failed to fetch statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}

export default derivativeRoutes;
