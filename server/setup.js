// One-off: create tables and demo data in the Neon database.
// Usage: put DATABASE_URL in .env (or run `vercel env pull .env`), then `npm run db:setup`.
import pg from 'pg';
import { SCHEMA } from './schema.js';
import { seed } from './seed.js';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Add it to .env first.');
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: true } });
await pool.query(SCHEMA);
const seeded = await seed(pool);
console.log(seeded ? 'Tables created and demo data added.' : 'Tables ready (data already present, seed skipped).');
await pool.end();
