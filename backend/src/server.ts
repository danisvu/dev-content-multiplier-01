import fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import ideaRoutes from './routes/ideaRoutes';
import briefRoutes from './routes/briefRoutes';
import derivativeRoutes from './routes/derivativeRoutes';
import publishingRoutes from './routes/publishingRoutes';
import versionControlRoutes from './routes/versionControlRoutes';
import engagementRoutes from './routes/engagementRoutes';

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
server.register(briefRoutes, { prefix: '/api' });
server.register(derivativeRoutes, { prefix: '/api' });
server.register(publishingRoutes, { prefix: '/api' });
server.register(versionControlRoutes, { prefix: '/api' });
server.register(engagementRoutes, { prefix: '/api' });

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
