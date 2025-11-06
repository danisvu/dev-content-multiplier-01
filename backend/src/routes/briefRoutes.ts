import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { BriefService } from '../services/briefService';
import { CreateBriefInput, UpdateBriefInput, GenerateBriefRequest } from '../types';

async function briefRoutes(fastify: FastifyInstance) {
  const briefService = new BriefService();

  // GET /api/briefs - Get all briefs
  fastify.get('/briefs', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const briefs = await briefService.getAllBriefs();
      return reply.status(200).send(briefs);
    } catch (error) {
      console.error('Error fetching briefs:', error);
      return reply.status(500).send({ 
        error: 'Failed to fetch briefs',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/briefs/:id - Get brief by ID
  fastify.get('/briefs/:id', async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const id = parseInt(request.params.id);
      
      if (isNaN(id)) {
        return reply.status(400).send({ error: 'Invalid brief ID' });
      }

      const brief = await briefService.getBriefById(id);
      
      if (!brief) {
        return reply.status(404).send({ error: 'Brief not found' });
      }

      return reply.status(200).send(brief);
    } catch (error) {
      console.error('Error fetching brief:', error);
      return reply.status(500).send({ 
        error: 'Failed to fetch brief',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/briefs/idea/:ideaId - Get briefs by idea ID
  fastify.get('/briefs/idea/:ideaId', async (
    request: FastifyRequest<{ Params: { ideaId: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const ideaId = parseInt(request.params.ideaId);
      
      if (isNaN(ideaId)) {
        return reply.status(400).send({ error: 'Invalid idea ID' });
      }

      const briefs = await briefService.getBriefsByIdeaId(ideaId);
      return reply.status(200).send(briefs);
    } catch (error) {
      console.error('Error fetching briefs by idea:', error);
      return reply.status(500).send({ 
        error: 'Failed to fetch briefs',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/briefs/status/:status - Get briefs by status
  fastify.get('/briefs/status/:status', async (
    request: FastifyRequest<{ Params: { status: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { status } = request.params;
      const briefs = await briefService.getBriefsByStatus(status);
      return reply.status(200).send(briefs);
    } catch (error) {
      console.error('Error fetching briefs by status:', error);
      return reply.status(500).send({ 
        error: 'Failed to fetch briefs',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/briefs/stats - Get brief statistics
  fastify.get('/briefs/stats', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const stats = await briefService.getBriefStats();
      return reply.status(200).send(stats);
    } catch (error) {
      console.error('Error fetching brief stats:', error);
      return reply.status(500).send({ 
        error: 'Failed to fetch statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // POST /api/briefs/generate - Generate brief from idea using AI
  fastify.post('/briefs/generate', async (
    request: FastifyRequest<{ Body: GenerateBriefRequest }>,
    reply: FastifyReply
  ) => {
    try {
      const generateRequest = request.body;

      // Validation
      if (!generateRequest.idea_id) {
        return reply.status(400).send({ 
          error: 'Missing required field',
          required: ['idea_id']
        });
      }

      // Generate brief using AI
      const generatedBrief = await briefService.generateBriefFromIdea(generateRequest);
      
      return reply.status(201).send({
        success: true,
        brief: generatedBrief,
        message: 'Brief generated successfully by AI'
      });
    } catch (error) {
      console.error('Error generating brief:', error);
      
      // Handle idea not found
      if (error instanceof Error && error.message.includes('not found')) {
        return reply.status(404).send({ 
          error: 'Idea not found',
          details: error.message
        });
      }

      // Handle invalid status (403 Forbidden)
      if (error instanceof Error && error.message.includes('status must be')) {
        return reply.status(403).send({ 
          error: 'Invalid idea status',
          details: error.message,
          required_status: 'selected',
          hint: 'Update the idea status to "selected" before generating a brief'
        });
      }

      // Handle other errors
      return reply.status(500).send({ 
        error: 'Failed to generate brief',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // POST /api/briefs - Create new brief
  fastify.post('/briefs', async (
    request: FastifyRequest<{ Body: CreateBriefInput }>,
    reply: FastifyReply
  ) => {
    try {
      const briefData = request.body;

      // Validation
      if (!briefData.idea_id || !briefData.title || !briefData.content_plan) {
        return reply.status(400).send({ 
          error: 'Missing required fields',
          required: ['idea_id', 'title', 'content_plan']
        });
      }

      const newBrief = await briefService.createBrief(briefData);
      return reply.status(201).send(newBrief);
    } catch (error) {
      console.error('Error creating brief:', error);
      return reply.status(500).send({ 
        error: 'Failed to create brief',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // PUT /api/briefs/:id - Update brief
  fastify.put('/briefs/:id', async (
    request: FastifyRequest<{ 
      Params: { id: string };
      Body: UpdateBriefInput;
    }>,
    reply: FastifyReply
  ) => {
    try {
      const id = parseInt(request.params.id);
      
      if (isNaN(id)) {
        return reply.status(400).send({ error: 'Invalid brief ID' });
      }

      const briefData = request.body;
      const updatedBrief = await briefService.updateBrief(id, briefData);
      
      if (!updatedBrief) {
        return reply.status(404).send({ error: 'Brief not found' });
      }

      return reply.status(200).send(updatedBrief);
    } catch (error) {
      console.error('Error updating brief:', error);
      return reply.status(500).send({ 
        error: 'Failed to update brief',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // DELETE /api/briefs/:id - Delete brief
  fastify.delete('/briefs/:id', async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const id = parseInt(request.params.id);
      
      if (isNaN(id)) {
        return reply.status(400).send({ error: 'Invalid brief ID' });
      }

      const deleted = await briefService.deleteBrief(id);
      
      if (!deleted) {
        return reply.status(404).send({ error: 'Brief not found' });
      }

      return reply.status(200).send({ 
        message: 'Brief deleted successfully',
        id 
      });
    } catch (error) {
      console.error('Error deleting brief:', error);
      return reply.status(500).send({ 
        error: 'Failed to delete brief',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}

export default briefRoutes;

