// Database schema. Kept as a JS string (not a .sql file) so Vercel bundles it
// with the serverless function automatically.
//
// Privacy notes (see CLAUDE.md):
// - posts has NO user_id column. Authorship is an HMAC tag added in a later step,
//   so nobody, admins included, can join a post back to a user.
// - users.email and post content get AES-256-GCM encryption in the crypto step.

export const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  handle        TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  role          TEXT NOT NULL DEFAULT 'sipper'
                CHECK (role IN ('sipper','spiller','witness','verifier','moderator','admin')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS posts (
  id          SERIAL PRIMARY KEY,
  content     TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'brewing'
              CHECK (status IN ('brewing','served','drained')),
  verdict     TEXT CHECK (verdict IN ('steeped','weak')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reactions (
  post_id  INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  kind     TEXT NOT NULL CHECK (kind IN ('hot','cold','more')),
  count    INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (post_id, kind)
);
`;
