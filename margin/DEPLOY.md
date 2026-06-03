# Deploying Margin

Margin is a standard Next.js 14 app. It runs two ways with **zero code changes**:

- **No `DATABASE_URL`** → uses the local JSON file store (`data/margin-db.json`), or an
  in-memory store on a read-only filesystem. Great for local dev and quick demos.
- **`DATABASE_URL` set** → uses Postgres (Neon, Supabase, RDS, …). This is the production path.

## Railway (Postgres + app in one project, ~10 minutes)

Railway is the smallest number of moving parts: the database and the app live in the same
project, and `DATABASE_URL` is wired between them for you. `railway.json` (in this folder) and a
`PORT`-aware start command are already committed, so it's mostly clicking.

1. **New Project → Deploy from GitHub repo** → pick this repo.
2. In the service: **Settings → Root Directory = `margin`** (this app lives in a subfolder).
   Nixpacks auto-detects Next.js; no build config needed.
3. **Add Postgres:** in the project, **+ New → Database → Add PostgreSQL**.
4. **Wire the database into the app service.** In the app service → **Variables → New Variable
   → Add Reference** → select the Postgres service's `DATABASE_URL`. (Using the reference picks
   the private-network URL, which is fast and free of egress.)
5. **Add the other variables** on the app service:

   | Variable | Required | Notes |
   |---|---|---|
   | `DATABASE_URL` | ✅ | The reference you added in step 4 |
   | `ANTHROPIC_API_KEY` | recommended | Turns on the real Claude scorer + safeguarding triage |
   | `PGSSL` | only if needed | Set to `disable` if you see a TLS error on Railway's internal Postgres. The default (`prefer`) usually just works. |
   | `MARGIN_MODEL` | optional | Defaults to a current Claude model |
   | `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | optional | Enables "Continue with Google" |

6. **Deploy.** The schema is created lazily on first request, so there's nothing else to run.
   (Optional: open the app service shell and run `npm run db:setup` to seed + verify.)
7. **Generate a domain:** app service → **Settings → Networking → Generate Domain**. Visit it.
8. **Google sign-in (optional):** add `https://YOUR-RAILWAY-DOMAIN/api/auth/google/callback`
   as an authorised redirect URI in the Google Cloud console.

> CLI alternative: `npm i -g @railway/cli`, then `railway login`, `cd margin`,
> `railway init`, `railway add` (Postgres), `railway up`. The dashboard flow above is easier
> for a first deploy.

## Recommended alternative: Vercel + Neon (free tiers, ~10 minutes)

1. **Create a Postgres database** (Neon or Supabase). Copy the connection string
   (Neon gives you a `postgres://…?sslmode=require` URL — perfect, SSL is on by default).

2. **Push this repo to GitHub** and import it into Vercel.
   - Set the **Root Directory** to `margin` (this app lives in a subfolder).
   - Framework preset: **Next.js** (auto-detected).

3. **Set environment variables** in Vercel (Project → Settings → Environment Variables):

   | Variable | Required | Notes |
   |---|---|---|
   | `DATABASE_URL` | ✅ | Your Postgres connection string |
   | `ANTHROPIC_API_KEY` | recommended | Turns on the real Claude scorer + safeguarding triage; without it the app uses the mock engine |
   | `MARGIN_MODEL` | optional | Defaults to a current Claude model |
   | `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | optional | Enables "Continue with Google" on `/signin` |

4. **Initialise the database** (creates the schema + seeds the demo class). Either:
   - Run locally once: `DATABASE_URL=… npm run db:setup`, **or**
   - Just open the deployed app — the schema is created lazily and idempotently on first request.

5. **Google sign-in (optional):** in the Google Cloud console, add
   `https://YOUR-DOMAIN/api/auth/google/callback` as an authorised redirect URI.

That's it — visit your Vercel URL.

## Notes & caveats

- **Sessions** are currently a base64 (not encrypted/signed) cookie — fine for a pilot, but
  swap for an encrypted session (NextAuth / iron-session) before a wider rollout. The session
  shape is isolated in `src/lib/server/identity.ts`.
- **Schema** is JSONB-backed (`students.model`, `alerts.alert`) for speed of iteration; migrate
  to normalised columns + an event log when analytics needs it. The store API won't change.
- **Local Postgres** (no TLS): set `DATABASE_URL=postgres://user@127.0.0.1:5432/margin` and
  `PGSSL=disable`.
- **Data residency:** for AU/NZ pilots, choose a database region in-country (Neon/Supabase both
  offer Sydney) to keep student data onshore.

## Other hosts

Any Node host that runs `next build` + `next start` works (Railway, Render, Fly.io, a VM).
Provide `DATABASE_URL` and run `npm run db:setup` (or let lazy schema creation handle it).
