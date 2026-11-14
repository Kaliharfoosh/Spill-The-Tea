// Database layer.
// - On Vercel (and whenever DATABASE_URL is set) we talk to Neon Postgres over TLS.
// - Locally without DATABASE_URL we use PGlite: real Postgres compiled to WASM,
//   stored in ./.pglite, so teammates can run the app with zero setup.
// Both expose the same query(sql, params) -> { rows } shape.

import { SCHEMA } from './schema.js';
import { seed } from './seed.js';

let dbPromise;

async function connect() {
  if (process.env.DATABASE_URL) {
    const { default: pg } = await import('pg');
    const pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: true }, // TLS in transit: app server -> database
      max: 3,
    });
    // Create tables + demo data on first start. The advisory lock stops two
    // serverless instances starting at once from seeding twice.
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('SELECT pg_advisory_xact_lock(7331)');
      await client.query(SCHEMA);
      await seed(client);
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
    return { kind: 'neon', query: (sql, params) => pool.query(sql, params) };
  }

  const { PGlite } = await import('@electric-sql/pglite');
  const lite = new PGlite('./.pglite');
  const db = { kind: 'pglite', query: (sql, params) => lite.query(sql, params), exec: (sql) => lite.exec(sql) };
  await db.exec(SCHEMA);
  await seed(db);
  return db;
}

export function getDb() {
  dbPromise ??= connect();
  return dbPromise;
}

export async function query(sql, params = []) {
  const db = await getDb();
  return db.query(sql, params);
}
