# Team tasks

Each task lives in its own files, so the three of us can work in parallel without merge conflicts.

**How to work**
1. `git checkout main && git pull`, then create your branch named after you: `git checkout -b mayan` / `moaaz` / `habiba`.
2. Only edit the files listed in your task (plus one line at the bottom of `BUILD_LOG.md`).
3. Push your branch and open a **Pull Request** into `main`. Habiba reviews and merges.
   - Vercel is on the free Hobby plan, so it only deploys commits authored by Habiba. Previews of the
     `mayan` and `moaaz` branches show as **Blocked**. That is expected, not an error in your code.
     Test your work locally with `npm run dev` instead.
   - Habiba merges with **"Create a merge commit"** only. "Squash and merge" and "Rebase and merge"
     keep your name as the commit author, so Vercel would block the production deploy.
   - Never push to `main` yourself and never click Merge yourself, for the same reason.
4. Using Claude in WebStorm? Tell it: *"Do Task A from docs/TASKS.md"*. It already reads
   `CLAUDE.md` for the project rules.

---

## Task A: Mayan, crypto module (branch: `mayan`)

Build the encryption and hashing helpers that the rest of the app will use. **Don't wire them into
routes yet**, Habiba does that when the login/posting flow is ready.

**Files**
- `server/crypto.js`
- `server/crypto.test.js`
- `scripts/gen-keys.js`
- `docs/crypto.md`
- `.env.example` (add two lines)

**`server/crypto.js` exports**
| Function | Does |
|---|---|
| `encrypt(plaintext)` → `string` | AES-256-GCM with a fresh random 12-byte IV every call. Returns one string, `v1:<iv>:<authTag>:<ciphertext>` (base64 parts), so it fits in one `TEXT` column. |
| `decrypt(payload)` → `string` | Reverses it. Must **throw** if anything was tampered with (that's what the GCM auth tag is for). |
| `authorTag(userId, postId)` → hex | `HMAC-SHA256(PEPPER, "author:" + userId + ":" + postId)`, the anonymous ownership tag for posts. |
| `reporterTag(userId, postId)` → hex | Same idea with `"report:"` prefix, so a reporter can only report a post once but stays anonymous. |
| `safeEqual(a, b)` → bool | Constant-time comparison of two tags (`crypto.timingSafeEqual`). |

- Keys come from env vars: `DATA_KEY` (32 random bytes, base64) and `PEPPER` (32 random bytes, base64).
  Throw a clear error if either is missing or the wrong length. Never hard-code a key.
- Use only Node's built-in `node:crypto`, no extra packages.

**`scripts/gen-keys.js`**: prints a fresh `DATA_KEY=` and `PEPPER=` line to paste into `.env`.

**`.env.example`**: add empty `DATA_KEY=` and `PEPPER=` lines with a comment.

**Tests** (`server/crypto.test.js`, run with `npm test`, uses built-in `node:test`):
- encrypt → decrypt returns the original text (including emoji and Arabic text)
- encrypting the same text twice gives **different** output (random IV)
- changing one character of the payload makes `decrypt` throw
- decrypting with a different `DATA_KEY` throws
- `authorTag` is the same for the same inputs, and different for a different post or user

**`docs/crypto.md`** (half a page, for the report): why GCM (confidentiality + integrity), why the IV
must be random and never reused, and **why HMAC with a secret pepper instead of a plain SHA-256** of
the user id. (Hint: there are only a few thousand student ids. How long would it take to hash them all?)

**Done when:** `npm test` passes and the PR is open.

---

## Task B: Moaaz, k-anonymity + threat model (branch: `moaaz`)

**Files**
- `analytics/requirements.txt` (`pandas`)
- `analytics/make_sample.py`
- `analytics/k_anonymity.py`
- `analytics/README.md`
- `docs/threat-model.md`

**`analytics/make_sample.py`**: generates `analytics/stats_raw.csv` with ~300 **synthetic** rows
(no real data): `faculty, year, gender, age, post_count`. Make some faculties small (e.g. 3 people
in Pharmacy Y4) so that some rows are unique, which is the problem k-anonymity solves.
(Later we'll swap this for a real export from the app.)

**`analytics/k_anonymity.py`**
1. Load `stats_raw.csv`. Quasi-identifiers: `faculty, year, gender, age`.
2. Print **k before** = size of the smallest group sharing the same quasi-identifiers (expect k = 1).
3. Generalise: age → ranges (`18-20`, `21-23`, `24+`), year → `Y1-2` / `Y3-4`, faculties with
   fewer than k people → `Other`, post_count → bins (`0`, `1-5`, `6-20`, `20+`).
4. Suppress (drop) any groups still smaller than k.
5. Print **k after**, how many rows were suppressed, and save `analytics/stats_anonymised.csv`.
6. Take `k` as a command-line argument: `python k_anonymity.py --k 5`.

**`analytics/README.md`**: how to run it, plus a small before/after table you can paste into the report.

**`docs/threat-model.md`**: assets (poster identity, post content, passwords, MFA secrets),
attackers (curious admin, malicious student, database thief, network sniffer), and a **STRIDE
table** where every threat maps to the control that stops it (role checks in the API, MFA, AES-GCM,
HMAC author tags, TLS/HSTS, EXIF stripping, k-anonymity, fuzzy timestamps). Use the threats from
section 4 of the proposal as your starting list.

**Done when:** `python analytics/k_anonymity.py --k 5` prints k before/after, and the PR is open.

---

## Task C: Habiba (with Claude), login, roles and posting (branch: `habiba`)

- `server/permissions.js`: the six-role permission matrix, plus `requirePerm()` middleware
- Sign up / log in with bcrypt, session cookie
- Posting (goes to `brewing`), Moderator approve/hide, reactions, reports
- Then: TOTP MFA, and wiring in Mayan's `crypto.js`
- Later: the "new cups served" banner, Spill Inspection console, `attack.sh`

---

## Coming next (after these merge)
- **Mayan:** EXIF stripping for photo uploads (`sharp`)
- **Moaaz:** real stats export endpoint for the k-anonymity script, plus the contingency runbook
  (misconfigured role / leaked MFA secret)
- **Everyone:** `attack.sh` role tests, demo rehearsal, report sections
