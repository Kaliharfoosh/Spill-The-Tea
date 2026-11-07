# 🫖 Spill The Tea

An anonymous campus "tea" and confessions board, built as a privacy-hardened mini-application
for the BUE Data Privacy module (26CSCN26H).

**Core privacy property:** posts are public, but who wrote them is secret, even from admins.

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
   This adds `DATABASE_URL` to the project automatically.
3. Create the tables once from your machine:
   ```bash
   npx vercel env pull .env
   npm run db:setup
   ```
4. Every push to `main` redeploys automatically.

## Project layout

```
api/index.js        Vercel serverless entry (wraps the Express app)
server/app.js       Express API: routes, security headers (all access checks go here)
server/db.js        Neon (production) / PGlite (local) database connection
server/schema.js    Tables
server/seed.js      Demo data
server/setup.js     Creates tables + demo data in Neon
src/                React frontend
CLAUDE.md           Project rules (also read by Claude Code)
BUILD_LOG.md        Who built what, and why
```

## Team
Habiba Mohamed Harfoosh · Mayan Tamer Nassar · Moaaz Mohamed Saeed
