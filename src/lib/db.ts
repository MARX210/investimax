import { Pool } from 'pg';

// Declare a global variable to hold the pool.
// In a serverless environment, this helps reuse connections across function invocations.
let pool: Pool | undefined;

function getPool() {
  if (!pool) {
    if (!process.env.POSTGRES_URL) {
      throw new Error('POSTGRES_URL environment variable is not set');
    }
    
    pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl: {
        rejectUnauthorized: false, // Required for many cloud providers
      },
    });
  }
  return pool;
}

export const db = {
  query: (text: string, params?: any[]) => {
    const pool = getPool();
    return pool.query(text, params);
  },
};
