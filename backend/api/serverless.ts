import { VercelRequest, VercelResponse } from '@vercel/node';
import server from '../src/server';

let isReady = false;

// Initialize server once
const initServer = async () => {
  if (!isReady) {
    await server.ready();
    isReady = true;
  }
  return server;
};

// Vercel serverless handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const app = await initServer();
    await app.inject({
      method: req.method || 'GET',
      url: req.url || '/',
      headers: req.headers as any,
      payload: req.body,
    }).then((response) => {
      res.status(response.statusCode);
      
      // Set headers
      Object.entries(response.headers).forEach(([key, value]) => {
        res.setHeader(key, value as string);
      });
      
      res.send(response.payload);
    });
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

