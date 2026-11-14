# Build log

One line per milestone: date, who, what, and the privacy/security reason.

| Date | Who | What | Why (privacy / security) |
|---|---|---|---|
| 2026-11-07 | Habiba (with Claude) | Project scaffold: React + Vite frontend, Express API, Postgres schema (users, posts, reactions), demo seed data, Vercel config | `posts` table deliberately has no `user_id`, so authorship can't be joined back to a user. Public feed only returns `served` posts, with fuzzy timestamps to resist timing correlation. Security headers (HSTS, nosniff, no-referrer) on every API response. |
| 2026-11-07 | Habiba (with Claude) | Deployed to Vercel with Neon Postgres (Frankfurt). API also runs in Frankfurt (`fra1`). Tables auto-create on first start. Team task split in `docs/TASKS.md`. | Data stored in an EU region (GDPR jurisdiction; relevant to Egypt's Law 151/2020 limits on cross-border transfer). App-to-database traffic is TLS-encrypted. |
| 2026-11-14 | Habiba (with Claude) | Delivery plan `docs/PLAN.html`: 6 phases (Weeks 3–12), team rules, scope guard, 24 work packages split by complexity points (17 / 17 / 18), proposed permission matrix, demo run-sheet, report split | Closes gaps against the brief: anonymised stats must be loaded back into the app, contingency needs real tools (reset MFA, revoke sessions, restore), admin audit log, HMAC blind index for encrypted email, HMAC reaction tags so users can react once without being identified. |
| 2026-11-14 | Habiba (with Claude) | Reorganised the repo like our cloud project: `backend/` (Express API, `db/`), `frontend/` (React + Vite), `api/` (Vercel entry), `docs/`, `evidence/`. Removed the `mayan.md` / `moaaz.md` git test files. Teammates can now merge their own PRs to `main`. | The test files put student IDs in a public repository (data minimisation). Separating backend from frontend makes it obvious that access checks live in `backend/`, never in the React code. |
