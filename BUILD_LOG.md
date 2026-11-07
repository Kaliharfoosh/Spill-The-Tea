# Build log

One line per milestone: date, who, what, and the privacy/security reason.

| Date | Who | What | Why (privacy / security) |
|---|---|---|---|
| 2026-11-07 | Habiba (with Claude) | Project scaffold: React + Vite frontend, Express API, Postgres schema (users, posts, reactions), demo seed data, Vercel config | `posts` table deliberately has no `user_id`, so authorship can't be joined back to a user. Public feed only returns `served` posts, with fuzzy timestamps to resist timing correlation. Security headers (HSTS, nosniff, no-referrer) on every API response. |
| 2026-11-07 | Habiba (with Claude) | Deployed to Vercel with Neon Postgres (Frankfurt). API also runs in Frankfurt (`fra1`). Tables auto-create on first start. Team task split in `docs/TASKS.md`. | Data stored in an EU region (GDPR jurisdiction; relevant to Egypt's Law 151/2020 limits on cross-border transfer). App-to-database traffic is TLS-encrypted. |
