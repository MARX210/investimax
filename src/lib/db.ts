import { Pool } from 'pg';

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false, // Required for many cloud providers
  },
});

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
};
