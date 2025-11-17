import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Support both local DATABASE_URL and Vercel PostgreSQL
const databaseUrl = process.env.DATABASE_URL ||
                    process.env.POSTGRES_PRISMA_URL ||
                    process.env.POSTGRES_URL_NON_POOLING ||
                    process.env.POSTGRES_URL;

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not configured. Cannot connect to database.');
    }
    pool = new Pool({
      connectionString: databaseUrl,
      max: process.env.NODE_ENV === 'production' ? 5 : 20,
    });
  }
  return pool;
}

export async function query(text: string, params?: any[]): Promise<any> {
  try {
    const currentPool = getPool();
    const client: PoolClient = await currentPool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function getClient(): Promise<PoolClient> {
  try {
    const currentPool = getPool();
    return await currentPool.connect();
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

export default {
  query,
  getClient,
  getPool,
};
