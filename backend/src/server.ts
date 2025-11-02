import fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import ideaRoutes from './routes/ideaRoutes';

dotenv.config();

const server = fastify({
  logger: true
});

// Register CORS
server.register(cors, {
  origin: ['http://localhost:3000', 'http://localhost:3910', 'http://localhost:3911'],
  credentials: true
});

// Register routes
server.register(ideaRoutes, { prefix: '/api' });

// Health check endpoint
server.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001');
    await server.listen({ port, host: '0.0.0.0' });
    console.log(`Server listening on http://localhost:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
