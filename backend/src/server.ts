import fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import ideaRoutes from './routes/ideaRoutes';
import briefRoutes from './routes/briefRoutes';
import derivativeRoutes from './routes/derivativeRoutes';
import publishingRoutes from './routes/publishingRoutes';
import versionControlRoutes from './routes/versionControlRoutes';
import engagementRoutes from './routes/engagementRoutes';
import { exportRoutes } from './routes/exportRoutes';
import { sharingRoutes } from './routes/sharingRoutes';
import { analyticsRoutes } from './routes/analyticsRoutes';
import { costTrackingRoutes } from './routes/costTrackingRoutes';

dotenv.config();

const server = fastify({
  logger: true
});

// Register CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3910',
  'http://localhost:3911'
];

// Add Vercel production URLs if available
if (process.env.VERCEL_URL) {
  allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
}
if (process.env.NEXT_PUBLIC_FRONTEND_URL) {
  allowedOrigins.push(process.env.NEXT_PUBLIC_FRONTEND_URL);
}

server.register(cors, {
  origin: (origin, cb) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return cb(null, true);
    
    // Check if origin is allowed or is a Vercel preview URL
    if (allowedOrigins.includes(origin) || origin.includes('.vercel.app')) {
      return cb(null, true);
    }
    
    return cb(new Error('Not allowed by CORS'), false);
  },
  credentials: true
});

// Register routes
server.register(ideaRoutes, { prefix: '/api' });
server.register(briefRoutes, { prefix: '/api' });
server.register(derivativeRoutes, { prefix: '/api' });
server.register(publishingRoutes, { prefix: '/api' });
server.register(versionControlRoutes, { prefix: '/api' });
server.register(engagementRoutes, { prefix: '/api' });
server.register(exportRoutes, { prefix: '/api/exports' });
server.register(sharingRoutes, { prefix: '/api/sharing' });
server.register(analyticsRoutes, { prefix: '/api/analytics' });
server.register(costTrackingRoutes, { prefix: '/api/costs' });

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

// Only start server if not in Vercel environment
if (!process.env.VERCEL) {
  start();
}

// Export for Vercel
export default server;
