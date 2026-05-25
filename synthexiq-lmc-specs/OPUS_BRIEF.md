# SynthexIQ — LMC Build Brief for Opus
## Priority 1–5 only. Do not touch Bucket 3 (voice, image comparison, NDIA export).

---

## Your context

You are continuing work on **SynthexIQ** (`C:\Users\smilv\audited-apps\synthexiq`), a
general-purpose AI agent platform for multiple verticals (Real Estate, Aged Care,
NDIS, RevEngine Pro, AuditMate, Concierge Production).

A previous Claude session produced `AUDIT_NOTES.md` — read it first. It documents
Rounds 1–6 of work already completed. Do not redo or undo anything in those rounds.

You are now adding the AI Launchpad Learning Module Content (LMC) billing
infrastructure. The LMC is an NDIS-funded eLMS with 20 modules (05–24). Each module
has 3 billable "touchpoints" that participants trigger via slash commands in Telegram.
The platform must record NDIS billing audit evidence for every touchpoint.

---

## Non-negotiable architecture rules

1. **Do NOT restructure `server/services/agentRunner.ts`.** It is 2000 lines and the
   core of the platform. Touch it only for the single line-1048 fix listed in
   Priority 1 below.

2. **Do NOT hardcode LMC or NDIS logic into core files.** The rules:
   - New DB tables → new migration file in `drizzle/`
   - New NDIS/LMC agents, skills, workflows → add to `server/services/bundles/ndis.ts` only
   - Core files (`agentRunner.ts`, `telegramPoller.ts`, `telegramWebhook.ts`,
     `_core/index.ts`) → touch only for the specific fixes listed in Priority 1–4
   - **One exception:** the slash command pre-dispatcher goes in `telegramPoller.ts`
     and `telegramWebhook.ts` as a generic router. Do NOT hardcode module names
     — use regex pattern matching.

3. **SynthexIQ is multi-vertical.** Never make a change that only works for NDIS.
   If you're adding a generic capability (e.g. a billing event table), design it so
   other verticals could use it too.

4. **The CA pathway (opt-in affiliate) has different billing rules.** Trigger phrases
   `/submit_capath_NN_[a|b|c]` must be handled separately from official course
   triggers `/submit_modNN_[a|b|c]`. CA events are NOT NDIS-billable by default.

---

## Read these files first (do not skip)

```
AUDIT_NOTES.md                              ← what's already done (Rounds 1–6)
server/services/agentRunner.ts              ← core, 2000 lines, understand it
server/services/bundles/ndis.ts             ← LMC-specific features go here
server/services/telegramPoller.ts           ← inbound polling path
server/telegramWebhook.ts                   ← inbound webhook path
server/services/heartbeatScheduler.ts       ← cron jobs (add SLA checks here)
server/_core/index.ts                       ← boot sequence, env validation
drizzle/schema.ts                           ← Drizzle table definitions
drizzle/0011_billing_subscriptions.sql      ← most recent migration (for context)
package.json                                ← confirm pnpm, Drizzle version
```

Also read the spec files in `synthexiq-lmc-specs/` (committed alongside this brief):
```
synthexiq-lmc-specs/CAPABILITY_AUDIT_REVISED.md  ← what exists vs what to build
synthexiq-lmc-specs/drizzle/0012_billing_events.sql
synthexiq-lmc-specs/drizzle/0013_participant_modules.sql
synthexiq-lmc-specs/drizzle/0014_participant_consents.sql
synthexiq-lmc-specs/server/lmc/triggerRouter.ts   ← draft implementation
```

---

## Priority 1 — Deploy path fix (one line, do this first)

**File:** `server/services/agentRunner.ts`, line 1048

Read the line. It is likely a hardcoded path, URL, or require() that works in dev
but breaks inside the multi-stage Docker container where the working directory differs.

Common fix patterns:
- Replace `./dist/` or `../dist/` with `path.join(__dirname, '..', 'dist')` (or
  equivalent relative to the compiled output location)
- Replace a hardcoded `localhost` URL with `process.env.APP_URL`
- Replace a `require('../../something')` with a path that survives the Docker
  `COPY dist/ .` step

Fix it, run `pnpm build` locally to confirm no TypeScript errors, document what
it was and what you changed.

---

## Priority 2 — Billing events: migration + slash command router

### 2a. Run the migration
Copy `synthexiq-lmc-specs/drizzle/0012_billing_events.sql` to `drizzle/` and run it.
Verify the two tables (`billing_events`, `crisis_events`) are created.

Update `drizzle/schema.ts` with the corresponding Drizzle table definitions
(match the pattern used for `billing_subscriptions` in `0011`).

### 2b. Implement the DB helpers in `server/db.ts`
The draft at `synthexiq-lmc-specs/server/lmc/triggerRouter.ts` lists the helpers
with stub bodies and `throw new Error('Not implemented')`. Implement all of them
using Drizzle queries. They are:

```
getParticipantEmailByTelegramId(telegramId, db)
getParticipantTelegramId(email, db)
getSupportWorkerTelegramIdForParticipant(email, db)
getOnCallSupportWorkerTelegramId(db)
createBillingEvent(params, db)
getOpenBillingEvent(email, moduleNum, touchpoint, db)
closeMostRecentOpenBillingEvent(swTelegramId, participantEmail, db)
```

**Note:** You will need a `telegram_id` column on `users` (or a join table linking
Telegram IDs to user emails). Check if this already exists. If not, add a migration
`0016_user_telegram_id.sql` with `ALTER TABLE users ADD COLUMN telegram_id BIGINT NULL`.

**Note:** You will need a concept of "support worker assigned to participant". Check
if this already exists (look for any `assigned_sw` or similar column). If not, add it
as `ALTER TABLE users ADD COLUMN assigned_sw_email VARCHAR(255) NULL`.

### 2c. Wire the trigger router into the Telegram inbound pipeline
Create `server/services/lmc/triggerRouter.ts` from the draft (adapt imports to
match your actual project structure).

In `telegramWebhook.ts` and `telegramPoller.ts`, find the point where an inbound
message is first processed (before the specialist agent resolver). Add:

```typescript
// 1. Crisis pre-check (Priority 4 — add now, not later, for safety)
await checkForCrisis(msg, db);

// 2. LMC trigger phrase router
const handled = await handleLmcTrigger(msg, db);
if (handled) return;

// 3. existing specialist routing continues below...
```

### 2d. Detect SW replies and close billing events
In the same inbound pipeline, after identifying that the SENDER is a support worker
(not a participant), add:

```typescript
if (isSupportWorker && targetParticipantEmail) {
  await handleSwReplyIfBillingOpen(msg.from.id, targetParticipantEmail, db);
}
```

You need to figure out how the current code distinguishes a SW sending a message vs
a participant sending a message. Look at how `assignedAgentId` and specialist routing
works — the same context should tell you whether the sender is a human SW or a participant.

---

## Priority 3 — Participant modules: migration + module state

### 3a. Run the migration
Copy `synthexiq-lmc-specs/drizzle/0013_participant_modules.sql` to `drizzle/` and run it.
Update `drizzle/schema.ts` with the Drizzle table definition.

### 3b. Add remaining DB helpers to `server/db.ts`
```
getParticipantModuleState(email, moduleNum, db)
upsertParticipantModule(email, moduleNum, fields, db)
getOpenBillingEventsOlderThan(seconds, db)
getParticipantsWithNoEventIn(seconds, db)
```

### 3c. Ensure `checkAndAdvanceModule` is called
It is called from `handleSwReplyIfBillingOpen` in `triggerRouter.ts`. Verify the
chain: SW reply → `closeMostRecentOpenBillingEvent` → `checkAndAdvanceModule` →
`upsertParticipantModule(nextModule, { unlockedAt: now })` → Telegram notification.

### 3d. Add Replit-facing tRPC endpoint
Add to the NDIS router (or a new `lmc` router):

```typescript
// trpc.lmc.moduleState — called by Replit front-end to lock/unlock module pages
moduleState: protectedProcedure
  .input(z.object({ participantEmail: z.string().email(), moduleNum: z.number() }))
  .query(async ({ input, ctx }) => {
    return db.getParticipantModuleState(input.participantEmail, input.moduleNum);
  }),

// trpc.lmc.billingEvents — SW caseload queue
billingEvents: protectedProcedure
  .input(z.object({ swEmail: z.string().email().optional() }))
  .query(async ({ input, ctx }) => {
    // Return open billing events for this SW's participants, sorted by age
  }),
```

### 3e. Wire SLA check into heartbeatScheduler.ts
In `startHeartbeatScheduler()`, add a check that runs every 60 minutes:

```typescript
await checkOpenBillingEventSLAs(db);
```

Import `checkOpenBillingEventSLAs` from `server/services/lmc/triggerRouter.ts`.

---

## Priority 4 — Crisis keyword pre-check (Safety)

The `checkForCrisis()` function is in `triggerRouter.ts`. This runs BEFORE the
agent. It does three things:
1. Immediately sends Lifeline / 13YARN / 000 links to the participant
2. Creates a `crisis_events` row
3. Notifies the on-call SW (use `getOnCallSupportWorkerTelegramId`)

**Important:** It does NOT return early or block the agent. The NDIS Participant Guide
agent already has `participant-enquiry-triage` which also handles crisis — both should
fire. The pre-check fires even if the agent is slow or unavailable.

The `crisis_events` table is defined in `0012_billing_events.sql`. Update
`drizzle/schema.ts` for it.

---

## Priority 5 — Consent records

### 5a. Run the migration
Copy `synthexiq-lmc-specs/drizzle/0014_participant_consents.sql` to `drizzle/` and run it.
Update `drizzle/schema.ts`.

### 5b. Add a consent gate to the Telegram inbound pipeline
Before processing ANY message from a participant for the first time, check:

```typescript
const hasConsent = await db.getParticipantConsent(participantEmail, 'telegram_messaging');
if (!hasConsent) {
  await sendTelegramMessage(msg.chat.id,
    `👋 Before we start, I need your permission to use this chat for your AI Launchpad program.\n\n` +
    `Your support worker will need to confirm this with you. ` +
    `Type *YES* to confirm you're happy to use Telegram for your NDIS-funded learning sessions.`
  );
  // Store pending consent intent — SW confirms in their dashboard
  return;
}
```

This only fires once per participant. After consent is recorded, it never fires again.

---

## What NOT to touch

- **Do NOT touch** Stripe billing, bundle install gating, or pricing UI — Rounds 1–2
  completed these and they work.
- **Do NOT touch** the Aged Care, Real Estate, RevEngine Pro, AuditMate, or
  Concierge Production bundles.
- **Do NOT touch** the Xena system prompt — Round 3 rewrote it correctly.
- **Do NOT touch** Rounds 1–6 Telegram routing (SPECIALIST_FALLBACK_NAMES) — it works.
- **Do NOT implement** voice mode, image comparison, NDIA audit export format, local
  SW booking, or right-to-erasure. These are explicitly out of scope.

---

## Pre-deploy checklist after this round

- [ ] `pnpm build` passes with no TypeScript errors
- [ ] All 4 new migrations run on a local MySQL instance
- [ ] Manual test: Participant sends `/submit_mod05_a` → billing_events row created →
      SW receives notification → SW replies → billing_events row closed → participant
      notified → participant_modules touchpoint_a_closed_at stamped
- [ ] Manual test: Participant sends `/submit_mod05_c` after a and b closed →
      module 05 marked complete → module 06 unlocked → participant notified
- [ ] Manual test: Participant sends "want to die" → Lifeline message received
      immediately → crisis_events row created → on-call SW notified
- [ ] `pnpm exec drizzle-kit migrate` runs cleanly on Fly via release_command
- [ ] `pnpm install && pnpm build && pnpm start` smoke test on Fly staging

---

## After this round — inform Steve of:

1. Whether `telegram_id` already existed on `users` or you had to add it
2. Whether an `assigned_sw_email` (or equivalent) already existed
3. Exact fix applied at agentRunner.ts line 1048
4. Any schema design decisions you made that weren't specified here
5. Any Priority 1–5 item you could NOT complete and why

Do not start Priority 6+ items (SW dashboard, NDIA export, voice, local SW booking)
without a new brief from Steve.
