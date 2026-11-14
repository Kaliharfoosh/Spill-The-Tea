// The Express API. Every permission check will live here (server side),
// never only in the React UI.

import express from 'express';
import { query, getDb } from './db/connection.js';

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '20kb' }));

// Security headers. HSTS tells browsers to only ever use HTTPS (TLS in transit).
app.use((req, res, next) => {
  res.set({
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'Cache-Control': 'no-store',
  });
  next();
});

app.get('/api/health', async (req, res) => {
  const db = await getDb();
  res.json({ ok: true, database: db.kind });
});

// Fuzzy time: never expose exact post timestamps (timing-correlation defence).
function fuzzyTime(date) {
  const hours = (Date.now() - new Date(date).getTime()) / 36e5;
  if (hours < 6) return 'freshly brewed';
  if (hours < 24) return 'earlier today';
  if (hours < 48) return 'yesterday';
  if (hours < 24 * 7) return 'this week';
  return 'a while ago';
}

// Public feed: only served (approved) tea.
app.get('/api/posts', async (req, res) => {
  const { rows } = await query(`
    SELECT p.id, p.content, p.verdict, p.created_at,
           COALESCE(json_object_agg(r.kind, r.count) FILTER (WHERE r.kind IS NOT NULL), '{}') AS reactions
    FROM posts p
    LEFT JOIN reactions r ON r.post_id = p.id
    WHERE p.status = 'served'
    GROUP BY p.id
    ORDER BY p.created_at DESC
    LIMIT 50`);

  res.json(rows.map(({ created_at, ...post }) => ({ ...post, when: fuzzyTime(created_at) })));
});

app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something spilled on our side' });
});

export default app;
