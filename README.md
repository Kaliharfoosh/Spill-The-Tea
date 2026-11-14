# 🫖 Spill The Tea

An anonymous campus "tea" and confessions board, built as a privacy-hardened mini-application
for the BUE Data Privacy module (26CSCN26H).

**Core privacy property:** posts are public, but who wrote them is secret, even from admins.

**Live:** https://spill-the-tea-jet.vercel.app

## Run it locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:5173. With no `.env`, the app uses a built-in local Postgres (PGlite)
with demo data, so no database setup is needed.

To use the real cloud database instead, copy `.env.example` to `.env` and fill in `DATABASE_URL`.

## Deploy (Vercel + Neon)

1. Import this GitHub repo in Vercel (framework: Vite, detected from `vercel.json`).
2. In the Vercel project: **Storage → Create Database → Neon** (free plan) and connect it.
   This adds `DATABASE_URL` to the project automatically. Then redeploy.
3. Tables and demo data are created automatically on the first request.
4. Every push to `main` redeploys automatically.

## Project layout

```
api/index.js               Vercel serverless entry (wraps the Express app); must stay in api/
backend/
  app.js                   Express API: routes, security headers (all access checks go here)
  server.js                Local dev server (npm run dev); Vercel uses api/index.js instead
  db/connection.js         Neon (production) / PGlite (local) database connection
  db/schema.js             Tables
  db/seed.js               Demo data (inserted only into an empty database)
frontend/
  index.html               Page shell
  vite.config.js           Vite config; proxies /api to the local API on :3001
  src/                     React app (App.jsx, main.jsx, styles.css)
docs/                      Delivery plan (PLAN.html) and team task briefs (TASKS.md)
evidence/                  Screenshots and command output for the report
CLAUDE.md                  Project rules (also read by Claude Code)
BUILD_LOG.md               Who built what, and why
```

## Team
Habiba Mohamed Harfoosh · Mayan Tamer Nassar · Moaaz Mohamed Saeed
