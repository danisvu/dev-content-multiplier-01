import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Support both local DATABASE_URL and Vercel PostgreSQL
const databaseUrl = process.env.DATABASE_URL ||
                    process.env.POSTGRES_PRISMA_URL ||
                    process.env.POSTGRES_URL_NON_POOLING ||
                    process.env.POSTGRES_URL;

if (!databaseUrl) {
  console.warn('⚠️  DATABASE_URL not configured. Database features will not work.');
}

const pool = new Pool({
  connectionString: databaseUrl,
  max: process.env.NODE_ENV === 'production' ? 5 : 20,
});

export async function query(text: string, params?: any[]): Promise<any> {
  const client: PoolClient = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

export async function getClient(): Promise<PoolClient> {
  return await pool.connect();
}

export default pool;
