import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ideaService } from '../services/ideaService';
import { CreateIdeaInput, UpdateIdeaInput, GenerateIdeasRequest } from '../types';

async function ideaRoutes(fastify: FastifyInstance) {
  // GET /api/ideas - Get all ideas
  fastify.get('/ideas', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const ideas = await ideaService.getAllIdeas();
      return reply.send(ideas);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // GET /api/ideas/:id - Get idea by ID
  fastify.get('/ideas/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const idea = await ideaService.getIdeaById(parseInt(id));
      
      if (!idea) {
        return reply.status(404).send({ error: 'Idea not found' });
      }
      
      return reply.send(idea);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // POST /api/ideas - Create new idea
  fastify.post('/ideas', {
    schema: {
      body: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          rationale: { type: 'string' },
          persona: { type: 'string' },
          industry: { type: 'string' },
          status: { type: 'string' }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const ideaData = request.body as CreateIdeaInput;
      const idea = await ideaService.createIdea(ideaData);
      return reply.status(201).send(idea);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // PUT /api/ideas/:id - Update idea
  fastify.put('/ideas/:id', {
    schema: {
      body: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          rationale: { type: 'string' },
          persona: { type: 'string' },
          industry: { type: 'string' },
          status: { type: 'string' }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const updateData = request.body as UpdateIdeaInput;
      const idea = await ideaService.updateIdea(parseInt(id), updateData);
      
      if (!idea) {
        return reply.status(404).send({ error: 'Idea not found' });
      }
      
      return reply.send(idea);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // DELETE /api/ideas/:id - Delete idea
  fastify.delete('/ideas/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const deleted = await ideaService.deleteIdea(parseInt(id));
      
      if (!deleted) {
        return reply.status(404).send({ error: 'Idea not found' });
      }
      
      return reply.status(204).send();
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // POST /api/ideas/generate - Generate AI-powered ideas
  fastify.post('/ideas/generate', {
    schema: {
      body: {
        type: 'object',
        required: ['persona', 'industry'],
        properties: {
          persona: { type: 'string', minLength: 1 },
          industry: { type: 'string', minLength: 1 },
          model: { type: 'string', enum: ['gemini', 'deepseek'], default: 'gemini' },
          temperature: { type: 'number', minimum: 0, maximum: 2, default: 0.7 }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const generateRequest = request.body as GenerateIdeasRequest;
      const ideas = await ideaService.generateIdeas(generateRequest);
      
      return reply.send({
        success: true,
        ideas,
        count: ideas.length
      });
    } catch (error) {
      fastify.log.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return reply.status(500).send({
        success: false,
        error: errorMessage
      });
    }
  });
}

export default ideaRoutes;
