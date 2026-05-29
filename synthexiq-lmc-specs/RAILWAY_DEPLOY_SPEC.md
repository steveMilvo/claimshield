# Railway Deploy Spec — SynthexIQ
## First production deployment

**For:** whoever has the SynthexIQ source on disk + Railway CLI access
**Time estimate:** 30–60 minutes for a clean first deploy
**Region target:** Singapore (`asia-southeast1`) — closest Railway region to Australia

---

## ⚠️ Read before you start

**Australian data residency.** Railway has no AU region. NDIS participant data on a Singapore server may not satisfy your Privacy Act obligations or your participants' plan managers. Before any real participant joins, **either**:

- (a) Get a written privacy-officer sign-off that Singapore hosting is acceptable for the specific data set, including a transborder data flow assessment under APP 8, **or**
- (b) Treat this Railway deploy as MVP/staging only, and migrate to an AU region before launch (Fly.io Sydney is the easiest path — the Dockerfile from AUDIT_NOTES Round 1 already supports it)

This spec doesn't decide for you. It just gets you deploying.

---

## What you're deploying

From `AUDIT_NOTES.md` (Round 1):
- Express + tRPC server, Node 20, pnpm
- Multi-stage Dockerfile (deps → build → prod-deps → runtime, alpine, non-root, tini)
- MySQL via Drizzle ORM
- Drizzle migrations released via `pnpm exec drizzle-kit migrate`
- Stripe webhooks, Telegram webhook/poller, agent runner, KB, 6 vertical bundles

**What this spec replaces from Round 1:** `fly.toml` → `railway.json` + Railway dashboard config. The Dockerfile and `.dockerignore` stay as-is.

---

## Step 1 — Railway project setup (5 min)

```bash
# In the synthexiq repo root
railway login
railway init synthexiq-prod
railway link
```

Pick the new project when prompted. Set the region:

```bash
railway environment production
railway service        # creates the default service; name it "synthexiq-app"
```

In the Railway dashboard:
- Project Settings → Region → **Singapore (asia-southeast1)**
- Project Settings → Team → assign to whoever else needs access

---

## Step 2 — Provision MySQL (5 min)

```bash
railway add --plugin mysql
```

This adds a MySQL plugin in the same region as the project. Railway auto-injects `DATABASE_URL` into your service env.

**Verify connection string format.** Railway gives you a `DATABASE_URL` like:
```
mysql://root:PASSWORD@containers-us-west-12.railway.app:7732/railway
```

Confirm your Drizzle config (`drizzle.config.ts`) accepts this format — if it expects separate host/user/password env vars, set those too.

**MySQL version note.** Railway's MySQL plugin defaults to a recent 8.x. If the SynthexIQ schema uses any 5.7-specific syntax, validate the migrations apply cleanly on 8.x before going live.

---

## Step 3 — Set secrets (10 min)

In the Railway dashboard → service → Variables, add every var listed in `.env.example` from AUDIT_NOTES Round 1. The critical ones:

```
NODE_ENV=production
APP_URL=https://<your-railway-domain>     # set after Step 4
JWT_SECRET=<openssl rand -hex 32>          # MUST be ≥32 chars
CORS_ORIGINS=https://<your-railway-domain>
PORT=3000                                   # Railway uses this
RUN_SCHEDULER=1                             # leader machine only

# Stripe — all 19 STRIPE_PRICE_* + secret + webhook signing
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_SYNTHEXIQ_STARTER=price_...
# ... etc

# Telegram
TELEGRAM_BOT_TOKEN=...

# OAuth (if used)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Anthropic — required for agentRunner.ts
ANTHROPIC_API_KEY=sk-ant-...
```

**Hard rule:** never paste live secrets into a chat or commit them. Use `railway variables set KEY=VALUE` from a terminal session, then `railway variables` to verify.

---

## Step 4 — Create `railway.json` (5 min)

Drop this file at the repo root:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "startCommand": "node dist/server/index.js",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 60,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

**Why these settings:**
- `builder: DOCKERFILE` — uses your existing multi-stage Dockerfile (don't let Railway switch to Nixpacks)
- `startCommand` — adjust if your Dockerfile's CMD already starts the right binary; this line overrides it
- `healthcheckPath: /api/health` — the same path your Fly config used. If `/api/health` doesn't exist yet, **add it now** before the auth middleware in `_core/index.ts` (this is a one-line route returning `{ok: true}`; flagged in AUDIT_NOTES checklist as still pending)
- `restartPolicyMaxRetries: 3` — bounded to avoid crash loops

Commit `railway.json`.

---

## Step 5 — Database migrations on deploy (5 min)

Railway doesn't have a direct `release_command` like Fly. Two options:

**Option A — release phase hook (preferred):**

Add to `package.json`:
```json
"scripts": {
  "railway:release": "pnpm exec drizzle-kit migrate"
}
```

In Railway dashboard → service → Settings → Deploy → **Pre-Deploy Command**:
```
pnpm run railway:release
```

Railway runs this before the new container takes traffic. If it fails, the deploy aborts.

**Option B — run on container start (fallback):**

Modify your Dockerfile's CMD to run migrations first:
```dockerfile
CMD ["/bin/sh", "-c", "pnpm exec drizzle-kit migrate && node dist/server/index.js"]
```

**Use Option A.** Option B re-runs migrations on every restart and racy with multiple instances.

---

## Step 6 — Generate a public domain (2 min)

```bash
railway domain
```

Railway gives you `synthexiq-app-production.up.railway.app`. Add as a custom domain:

```bash
railway domain add synthexiq.com
```

Update DNS at your registrar:
- `CNAME synthexiq.com → synthexiq-app-production.up.railway.app`
- TLS is auto-provisioned by Railway

Update env vars to use the real domain:
```bash
railway variables set APP_URL=https://synthexiq.com
railway variables set CORS_ORIGINS=https://synthexiq.com,https://www.synthexiq.com
```

---

## Step 7 — First deploy (5 min)

```bash
railway up
```

Railway builds the Docker image, runs the pre-deploy migration, starts the container. Watch the logs:

```bash
railway logs --tail
```

Look for:
- ✅ migrations applied cleanly (`drizzle-kit migrate` output, "X migrations applied")
- ✅ `assertProductionEnv` passes (the env validator from AUDIT_NOTES Round 1, throws if any required var missing)
- ✅ Express listening on `PORT`
- ✅ `startHeartbeatScheduler` and `startMonthlyBudgetReset` start (only if `RUN_SCHEDULER=1`)
- ✅ Health check returns 200 within 60s

If the container crash-loops, run `railway logs` and check for:
- DB connection refused → DATABASE_URL malformed or plugin not in same region
- JWT_SECRET too short → must be ≥32 chars in production
- Missing STRIPE_PRICE_* → all 19 must be set
- agentRunner.ts:1048 path error → the Priority 1 fix from OPUS_BRIEF is still outstanding

---

## Step 8 — Wire Stripe + Telegram webhooks (10 min)

### Stripe webhook
- Stripe Dashboard → Developers → Webhooks → Add endpoint
- URL: `https://synthexiq.com/api/stripe/webhook`
- Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- Copy the signing secret → `railway variables set STRIPE_WEBHOOK_SECRET=whsec_...`

### Telegram bot webhook
```bash
curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
  -d "url=https://synthexiq.com/api/telegram/webhook"
```

Verify:
```bash
curl "https://api.telegram.org/bot<BOT_TOKEN>/getWebhookInfo"
```

Should report your URL with `pending_update_count: 0` and `last_error_date: null`.

---

## Step 9 — Smoke test (10 min)

1. **Health:** `curl https://synthexiq.com/api/health` → `{"ok":true}`
2. **Register:** open `https://synthexiq.com` → sign up a test user
3. **Bundles:** install a test bundle (per the Round 2 commerce flow)
4. **Stripe:** complete a test checkout with `4242 4242 4242 4242` → confirm `users.pricingTier = "starter"`
5. **Telegram:** DM the bot from a test account → confirm the specialist responds (not Xena)
6. **Migration trace:** in MySQL, run `SELECT * FROM __drizzle_migrations` → all 11 (or more) migrations listed

If any of these fail, **don't** proceed to lay LMC on top. Fix the deploy first.

---

## Step 10 — Hand off to the LMC build (Priority 1–5 from OPUS_BRIEF)

Once steps 1–9 pass, the platform is ready. The OPUS_BRIEF.md priority list now applies:

1. Fix `agentRunner.ts:1048` (one line) — Priority 1
2. Run migrations 0012, 0013, 0014 (committed in `synthexiq-lmc-specs/drizzle/`)
3. Drop `triggerRouter.ts` into `server/services/lmc/`
4. Wire into `telegramWebhook.ts` and `telegramPoller.ts`
5. Add SLA heartbeat to `heartbeatScheduler.ts`

Each migration is just `pnpm exec drizzle-kit migrate` after committing the new SQL file — Railway's pre-deploy hook handles it.

---

## Scaling notes

- **Single instance** is fine until ~200 active participants. Scheduler is set to leader-only via `RUN_SCHEDULER=1`. If you scale beyond 1 instance, set `RUN_SCHEDULER=0` on all but one machine (the AUDIT_NOTES Round 1 gate).
- **MySQL plugin** scales vertically only on Railway. For >1000 active participants, plan to migrate to PlanetScale, RDS, or self-hosted MySQL.
- **Egress bandwidth** Singapore → Australian users adds ~80–100ms latency. Telegram bot interactions stay fast; image uploads will feel slower. Acceptable for MVP, less so for daily heavy use.

---

## Rollback

```bash
railway deployments         # lists recent deploys
railway rollback <deploy-id> # rolls back to that revision
```

DB migrations don't auto-roll-back. If a migration broke things, you need to write a corrective migration forward (don't try to undo with hand-rolled SQL on production).

---

## What NOT to do

- **Don't put DATABASE_URL in the repo.** Railway injects it. The `.env.example` file documents the var but never the value.
- **Don't run `railway up` against the production environment from your local machine without confirming the active environment first.** Use `railway environment` to verify.
- **Don't disable healthchecks** to "just get it deployed". A failing healthcheck means something is genuinely wrong; suppressing it hides production breakage.
- **Don't run two instances with `RUN_SCHEDULER=1`.** Cron jobs duplicate, billing events get logged twice, money gets miscounted.
- **Don't expose `/api/external/v1`** without rate limiting (the AUDIT_NOTES Round 1 follow-up list flagged this as still pending — keyed by `serviceToken.tokenId`).

---

## Cost rough estimate (Railway pricing as of mid-2026)

| Resource | Tier | Estimated $/month |
|---|---|---|
| 1× service container (1 CPU / 2 GB RAM) | Hobby | $20 |
| MySQL plugin (1 GB storage) | Hobby | $10 |
| Public domain | included | $0 |
| Egress (~50 GB) | included | $0 |
| **Total (light usage)** | | **~$30/mo** |

At ~50 participants + daily bot activity, expect $40–$80/mo. Scale up the container to 4 CPU / 8 GB ($80) before it hits memory pressure with the agent runner.

---

## Quick reference

| Action | Command |
|---|---|
| Tail logs | `railway logs --tail` |
| Open shell | `railway shell` |
| Set var | `railway variables set KEY=VALUE` |
| List vars | `railway variables` |
| Rollback | `railway rollback <id>` |
| Run migration manually | `railway run pnpm exec drizzle-kit migrate` |
| MySQL CLI | `railway run mysql $DATABASE_URL` |

---

*Spec assumes Cowork (or whoever has SynthexIQ source + Railway access) runs the deploy. I can't run `railway up` from here — no source code access and no Railway token in this container.*
