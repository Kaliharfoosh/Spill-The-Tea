# Spill The Tea - project rules for Claude

Anonymous campus tea / confessions board for the BUE Data Privacy module (26CSCN26H, Option 1:
Secure & Privacy-Hardened Mini-Application). Team: Habiba Harfoosh, Mayan Nassar, Moaaz Saeed.
Every team member must be able to explain every part, so keep code simple, commented where
the *security reason* isn't obvious, and add a line to BUILD_LOG.md for each milestone.

## Stack
- React 19 + Vite (`frontend/`), Express 5 API (`backend/app.js`), served on Vercel via `api/index.js`.
- Database: Neon Postgres in production (`DATABASE_URL`, TLS required). Locally, if
  `DATABASE_URL` is empty, PGlite (Postgres in WASM, `./.pglite`) is used automatically.
- Schema lives in `backend/db/schema.js`, demo data in `backend/db/seed.js`. Use only `query(sql, params)`
  from `backend/db/connection.js` with `$1` placeholders: never build SQL with string concatenation.
- Run locally: `npm run dev` (web on :5173, API on :3001).

## Privacy & security rules (non-negotiable)
1. **No one can unmask a poster, admins included.** `posts` must never get a `user_id` column or
   any reversible link to a user. Ownership = `HMAC-SHA256(PEPPER, user_id + ':' + post_id)`.
2. **Access control is enforced in the API**, via the permission matrix in `backend/permissions.js`
   and a `requirePerm()` middleware on every route. Hiding a button in React is never the check.
3. Roles: sipper, spiller, witness, verifier, moderator, admin. No role has an `unmask` permission.
4. Sensitive fields (user email/student ID, post content, TOTP secrets) are AES-256-GCM encrypted
   at rest; keys come from env vars, never from the database or the repo.
5. Passwords: bcrypt. MFA: TOTP (speakeasy + qrcode).
6. Never log post authors, reporter identities, passwords, codes or decrypted sensitive data.
7. Never expose exact post timestamps to clients; use the fuzzy time labels.
8. Reports store a hashed reporter tag, never a reporter id.
9. Secrets only in `.env` / Vercel env vars. `.env` is git-ignored.

## Theme vocabulary
Posts are "cups". Status: `brewing` (pending) → `served` (approved) / `drained` (hidden).
Verifier verdicts: `steeped` (confirmed) / `weak` (unverified). Reactions: hot ☕, cold 🧊, more 🫖.
