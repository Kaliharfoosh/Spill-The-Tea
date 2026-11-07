# Build log

One line per milestone: date, who, what, and the privacy/security reason.

| Date | Who | What | Why (privacy / security) |
|---|---|---|---|
| 2026-11-07 | Habiba (with Claude) | Project scaffold: React + Vite frontend, Express API, Postgres schema (users, posts, reactions), demo seed data, Vercel config | `posts` table deliberately has no `user_id`, so authorship can't be joined back to a user. Public feed only returns `served` posts, with fuzzy timestamps to resist timing correlation. Security headers (HSTS, nosniff, no-referrer) on every API response. |
