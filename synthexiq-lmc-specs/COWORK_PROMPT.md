# Cowork Handoff Prompt
## Copy-paste below into a fresh Cowork Claude Code session at `C:\Users\smilv\audited-apps\synthexiq`

---

```
You are continuing work on SynthexIQ — a general-purpose AI agent platform for
multiple verticals (Real Estate, Aged Care, NDIS, RevEngine Pro, AuditMate,
Concierge Production). You have the codebase at C:\Users\smilv\audited-apps\synthexiq.

A previous Claude session produced AUDIT_NOTES.md in the repo, documenting
Rounds 1–6 of work already completed. READ THAT FIRST. Do not redo or undo
any of those rounds.

You are now implementing the AI Launchpad Learning Module Content (LMC) — an
NDIS-funded SLES (School Leaver Employment Supports) eLMS delivered to NDIS
participants aged 17–22. The platform must:

- Record NDIS billing audit evidence for every participant interaction
- Track 8 outcome dimensions monthly per participant
- Produce NDIA-grade annual reports at plan review
- Support cohort delivery at the Group Skill Development line item
- Gate enrolment behind a 7-stage intake flow
- Defend the "self-employment as SLES outcome" framing at audit

The full LMC spec library lives in this repo:
https://github.com/stevemilvo/claimshield/tree/claude/bold-brahmagupta-CzPNY/synthexiq-lmc-specs

Fetch this branch first:

  git clone --branch claude/bold-brahmagupta-CzPNY \
    https://github.com/stevemilvo/claimshield.git \
    /tmp/lmc-specs

The specs you need are in /tmp/lmc-specs/synthexiq-lmc-specs/.
The curriculum content is in /tmp/lmc-specs/ (the three Markdown files
prefixed AI_Launchpad_LMC_v3_*).

────────────────────────────────────────────────────────────────────────────

NON-NEGOTIABLE ARCHITECTURE RULES

1. DO NOT restructure server/services/agentRunner.ts. It is 2000 lines and
   the core of the platform. Touch it only for the single line-1048 fix
   in Phase 1 below.

2. DO NOT hardcode LMC or NDIS logic into core files. Rules:
   - New DB tables → new migration files in drizzle/
   - New NDIS/LMC agents, skills, workflows → only in server/services/bundles/ndis.ts
   - Core files (agentRunner.ts, telegramPoller.ts, telegramWebhook.ts,
     _core/index.ts) → touched only for the specific fixes listed in each phase
   - One exception: the slash command pre-dispatcher in telegramPoller.ts
     and telegramWebhook.ts as a generic router. Do NOT hardcode module
     names — use regex pattern matching from MASTER_TRIGGER_PHRASE_REFERENCE.md.

3. SynthexIQ is multi-vertical. Never make a change that only works for NDIS.
   If you're adding a generic capability (billing event table, cohort table,
   outcomes table), design it so other verticals could use it too.

4. The CA pathway (opt-in affiliate) has different billing rules. Trigger
   phrases /submit_capath_NN_[a|b|c] are NOT NDIS-billable by default.

5. Do NOT touch Stripe billing, bundle install gating, pricing UI, Xena's
   system prompt, Telegram routing fallback names, or Round 1–6 work that
   AUDIT_NOTES.md documents as complete. Those are stable.

6. Australian data residency — already resolved by Fly.io Sydney per Round 1.
   Keep it that way. Do not introduce dependencies that require non-AU
   regions.

────────────────────────────────────────────────────────────────────────────

READ THESE FILES FIRST (DO NOT SKIP)

Existing SynthexIQ codebase:
  AUDIT_NOTES.md                              ← Rounds 1–6 work done
  server/services/agentRunner.ts              ← core, understand it
  server/services/bundles/ndis.ts             ← LMC features go here
  server/services/telegramPoller.ts           ← inbound polling
  server/telegramWebhook.ts                   ← inbound webhook
  server/services/heartbeatScheduler.ts       ← cron jobs
  server/_core/index.ts                       ← boot, env validation
  drizzle/schema.ts                           ← table definitions
  drizzle/0011_billing_subscriptions.sql      ← most recent migration
  package.json                                ← confirm pnpm, Drizzle version

Spec library in /tmp/lmc-specs/synthexiq-lmc-specs/:
  CAPABILITY_AUDIT_REVISED.md                 ← what exists vs what to build
  MASTER_TRIGGER_PHRASE_REFERENCE.md          ← canonical 130 trigger phrases
  drizzle/0012_billing_events.sql             ← Phase 1
  drizzle/0013_participant_modules.sql        ← Phase 2
  drizzle/0014_participant_consents.sql       ← Phase 3
  drizzle/0015_module_sub_key.sql             ← Phase 4 (enables 04C)
  drizzle/0016_sles_outcomes.sql              ← Phase 5
  drizzle/0017_local_sw_visits.sql            ← Phase 8
  drizzle/0018_alumni_records.sql             ← Phase 8
  drizzle/0019_group_delivery.sql             ← Phase 6
  drizzle/0020_intake_assessments.sql         ← Phase 7
  server/lmc/triggerRouter.ts                 ← draft implementation
  SW_REPLY_TEMPLATES.md                       ← 63 quick-reply templates
  WEB_CLIENT_MODULE_PAGE_SPEC.md              ← front-end spec
  SW_CASELOAD_DASHBOARD_SPEC.md               ← SW dashboard spec
  SLES_OUTCOMES_DASHBOARD_SPEC.md             ← outcomes dashboard spec
  SLES_ENROLMENT_GATE_SPEC.md                 ← intake spec
  GROUP_WORKSHOP_REFACTOR_SPEC.md             ← cohort delivery spec
  WEEKLY_DELIVERY_RHYTHM_SPEC.md              ← weekly schedule structure
  LOCAL_SW_ACTIVATION_SPEC.md                 ← field visit flow
  ALUMNI_PATHWAYS_SPEC.md                     ← post-graduation
  NDIA_AUDIT_EXPORT_SPEC.md                   ← billing audit export format
  NDIA_AUDIT_DEFENCE_PACK.md                  ← auditor playbook

Curriculum content in /tmp/lmc-specs/ (parent):
  AI_Launchpad_LMC_v3_Modules_05-24.md
  AI_Launchpad_LMC_v3_Year2_Modules_25-36.md
  AI_Launchpad_Module_04C_Money_Benefits_Rules.md

────────────────────────────────────────────────────────────────────────────

IMPLEMENTATION PHASES — APPLY IN THIS ORDER

After each phase: commit with the prefix specified, run pnpm build, smoke
test, and report progress before proceeding to the next phase.

──────────────────────────────────────────────────────────
PHASE 1 — Deploy path fix (one line, do this first)
──────────────────────────────────────────────────────────

File: server/services/agentRunner.ts, line 1048.

The line is a hardcoded path, URL, or require() that works in dev but breaks
inside the multi-stage Docker container.

Common fix patterns:
- Replace ./dist/ or ../dist/ with path.join(__dirname, '..', 'dist')
- Replace hardcoded localhost URL with process.env.APP_URL
- Replace require('../../something') with a path that survives the Docker
  COPY dist/ . step

Fix it, run pnpm build to confirm no TypeScript errors.

Commit: "fix(agentRunner): line 1048 path fix for Docker runtime"

──────────────────────────────────────────────────────────
PHASE 2 — Billing events foundation
──────────────────────────────────────────────────────────

2a. Copy /tmp/lmc-specs/synthexiq-lmc-specs/drizzle/0012_billing_events.sql
    to drizzle/. Run pnpm exec drizzle-kit migrate. Verify both billing_events
    and crisis_events tables created.

2b. Update drizzle/schema.ts with Drizzle table definitions for both tables.
    Match the pattern used for billing_subscriptions in 0011.

2c. Pre-check: does users have a telegram_id column? If not, add
    drizzle/0012a_user_telegram_id.sql:
        ALTER TABLE users ADD COLUMN telegram_id BIGINT NULL;

2d. Pre-check: does users have an assigned_sw_email column? If not, add
    drizzle/0012b_user_assigned_sw.sql:
        ALTER TABLE users ADD COLUMN assigned_sw_email VARCHAR(255) NULL;

2e. Implement the DB helpers in server/db.ts (signatures from
    /tmp/lmc-specs/synthexiq-lmc-specs/server/lmc/triggerRouter.ts):

      getParticipantEmailByTelegramId(telegramId, db)
      getParticipantTelegramId(email, db)
      getSupportWorkerTelegramIdForParticipant(email, db)
      getOnCallSupportWorkerTelegramId(db)
      createBillingEvent(params, db)
      getOpenBillingEvent(email, moduleNum, touchpoint, db)
      closeMostRecentOpenBillingEvent(swTelegramId, participantEmail, db)

2f. Create server/services/lmc/triggerRouter.ts by adapting the draft from
    /tmp/lmc-specs/synthexiq-lmc-specs/server/lmc/triggerRouter.ts. Adjust
    imports to match your project structure.

2g. Wire into telegramWebhook.ts and telegramPoller.ts at the point where
    inbound messages are first processed (before specialist agent resolver):

      await checkForCrisis(msg, db);                  // Phase 4 — call now
      const handled = await handleLmcTrigger(msg, db);
      if (handled) return;
      // existing specialist routing continues...

2h. Add SW reply detection. In the same inbound pipeline, after identifying
    the sender is a SW (not a participant):

      if (isSupportWorker && targetParticipantEmail) {
        await handleSwReplyIfBillingOpen(msg.from.id, targetParticipantEmail, db);
      }

    Figure out how the current code distinguishes SW from participant senders.
    Look at how assignedAgentId and specialist routing work.

Commit: "feat(lmc): billing events + slash command trigger router"

──────────────────────────────────────────────────────────
PHASE 3 — Participant modules + module unlocking
──────────────────────────────────────────────────────────

3a. Copy drizzle/0013_participant_modules.sql to drizzle/. Run migrate.

3b. Update drizzle/schema.ts.

3c. Add DB helpers to server/db.ts:
      getParticipantModuleState(email, moduleNum, db)
      upsertParticipantModule(email, moduleNum, fields, db)
      getOpenBillingEventsOlderThan(seconds, db)
      getParticipantsWithNoEventIn(seconds, db)

3d. Verify checkAndAdvanceModule chain: SW reply → close billing event →
    check all 3 touchpoints closed → unlock next module → Telegram
    notification to participant.

3e. Add web-client-facing tRPC endpoint in your existing tRPC router:
      trpc.lmc.moduleState({ participantEmail, moduleNum }) → returns
      ParticipantModuleRow.

3f. Add SLA heartbeat. In heartbeatScheduler.ts, add hourly call to
    checkOpenBillingEventSLAs from triggerRouter.ts.

Commit: "feat(lmc): participant module state + unlock chain + SLA heartbeat"

──────────────────────────────────────────────────────────
PHASE 4 — Crisis pre-check (safety — non-negotiable)
──────────────────────────────────────────────────────────

The crisis_events table from Phase 2 needs the pre-check live. Crisis
keywords trigger:
1. Immediate Lifeline/13YARN/000 reply to participant
2. crisis_events row insert
3. On-call SW notification within 5 minutes

This was already wired in step 2g above. Verify it's calling correctly
on inbound. Test with the keyword "want to die" in a test Telegram chat —
must produce the Lifeline reply within 1 second.

Commit: "feat(lmc): crisis pre-check verified on inbound pipeline"

──────────────────────────────────────────────────────────
PHASE 5 — Consent records + bridge modules (04B + 04C)
──────────────────────────────────────────────────────────

5a. Copy drizzle/0014_participant_consents.sql + 0015_module_sub_key.sql.
    Migrate.

5b. Update drizzle/schema.ts for both.

5c. Add consent gate at first-message-from-participant in the inbound
    pipeline. Before processing any message:
      const hasConsent = await db.getParticipantConsent(email, 'telegram_messaging');
      if (!hasConsent) { send onboarding consent message; return; }

5d. Update triggerRouter.ts to handle the new BRIDGE_TRIGGER regex
    /^\/submit_mod04(b|c)_(a|b|c)$/i and the 04B → 04C → 05 unlock chain
    (uses module_sub_key column added by 0015). The full draft is in
    /tmp/lmc-specs/synthexiq-lmc-specs/server/lmc/triggerRouter.ts and
    already includes this — confirm your copy matches.

5e. Update LMC_MODULE_RANGE to { min: 5, max: 36 } in triggerRouter.ts.
    Year 2 modules (25-36) use the same regex pattern as Year 1.

Commit: "feat(lmc): consent gate + 04B/04C bridge modules + Year 2 range"

──────────────────────────────────────────────────────────
PHASE 6 — SLES Outcomes Dashboard
──────────────────────────────────────────────────────────

6a. Copy drizzle/0016_sles_outcomes.sql. Migrate.

6b. Update drizzle/schema.ts for sles_monthly_snapshots, sles_annual_reports,
    sles_goals.

6c. Build the monthly snapshot capture cron. Add to heartbeatScheduler.ts:
    captureSlesMonthlySnapshots runs on the 1st of each month at 02:00 AEST.
    Per the SLES_OUTCOMES_DASHBOARD_SPEC.md, sum data from:
      - billing_events (activity hours billable)
      - money tracker (income)
      - customer records (customer count)
      - SW template variant choices (independence ratio)
      - quiz_responses (quiz pass rate)
    Write one row per active participant per month. Idempotent.

6d. Build the tRPC endpoints from the spec — participant view, SW view,
    manager view, audit export view. Scope each properly.

6e. Build the annual report PDF generator. Use a server-side PDF library
    (Puppeteer or pdfkit). 8 pages per the spec. Sign-off fields required.

Commit: "feat(lmc): SLES outcomes dashboard + monthly snapshot + annual report"

──────────────────────────────────────────────────────────
PHASE 7 — Cohort delivery (the margin lever)
──────────────────────────────────────────────────────────

7a. Copy drizzle/0019_group_delivery.sql. Migrate. Creates cohorts,
    cohort_members, workshops, adds delivery_mode + workshop_id to
    billing_events.

7b. Update drizzle/schema.ts.

7c. Add WORKSHOP_TRIGGER regex to triggerRouter.ts:
      /^\/cohort_workshop_attended_(\d+)_(\d{2})(?:_([bc]))?$/i
    Handler: parse workshop_id + module_num, lookup cohort_members,
    create N simultaneous billing_events rows (N = attendees, max 4 normally,
    actual attendance), all with delivery_mode='group_workshop',
    workshop_id=<id>, NDIS line item='Capacity Building — Group Skill
    Development (1:4)'.

7d. Add /sw/cohorts dashboard view + cohort calendar generator.

7e. Verify NDIA Audit Export from Phase 6 includes delivery_mode column
    and applies the Group rate correctly.

Commit: "feat(lmc): cohort workshop delivery at NDIS Group rate"

──────────────────────────────────────────────────────────
PHASE 8 — Intake gate (no enrolment without this)
──────────────────────────────────────────────────────────

8a. Copy drizzle/0020_intake_assessments.sql. Migrate.

8b. Update drizzle/schema.ts.

8c. Build the 7-stage intake flow per SLES_ENROLMENT_GATE_SPEC.md.
    tRPC endpoints listed there. Stage 5 (Trial Week) uses 04B+04C
    safety gates as the actual validation.

8d. Build /apply public route + /intake/my-application participant route
    + /sw/intake SW route + /manager/intake manager route.

8e. Stage 7 formal enrolment must:
    - Set users.role = 'participant'
    - Seed participant_modules: 04B unlocked (module_num=4, sub_key='b'),
      04C completed (per trial week), Module 05 unlocked
    - Create cohort_members row
    - Seed initial sles_goals rows
    - Send welcome message via bot

Commit: "feat(lmc): 7-stage intake gate + service agreement flow"

──────────────────────────────────────────────────────────
PHASE 9 — Local SW visits + Alumni records
──────────────────────────────────────────────────────────

9a. Copy drizzle/0017_local_sw_visits.sql + 0018_alumni_records.sql.
    Migrate.

9b. Update drizzle/schema.ts for both.

9c. Build local SW workflows per LOCAL_SW_ACTIVATION_SPEC.md:
    - /book_local_visit command
    - postcode-distance matching using Australia Post centroid data
      (download from data.gov.au)
    - travel_reimbursement_claims auto-generation when participant plan
      allows travel

9d. Build alumni workflows per ALUMNI_PATHWAYS_SPEC.md:
    - Certificate PDF generator + UUID + public verification page at
      /verify/cert/:certificateId (no auth, partial PII only)
    - Monthly alumni check-in bot job
    - Three pathways (A, B, C) with COI controls on Pathway C
      (30-day cooling-off, mandatory disclosure)

Commit: "feat(lmc): local SW field visits + alumni records + certificates"

────────────────────────────────────────────────────────────────────────────

WHAT NOT TO TOUCH

- Stripe billing, bundle install gating, pricing UI — Round 2 work
- Aged Care, Real Estate, RevEngine Pro, AuditMate, Concierge Production
  bundles — Round 3–6 work
- Xena's system prompt — Round 3
- SPECIALIST_FALLBACK_NAMES — Rounds 3–6
- Existing tests — extend, don't replace

────────────────────────────────────────────────────────────────────────────

WHAT'S OUT OF SCOPE (DO NOT IMPLEMENT)

- Voice mode (Whisper STT + TTS)
- AI image comparison for Module 06 honesty check
- Live caption transcription
- Right-to-erasure flow
- Full white-label multi-tenancy (Phase 4 of the SLES Pivot Strategy —
  not required for first launch)
- Module 01 + forovideo.io video generation (still blocked on info)

────────────────────────────────────────────────────────────────────────────

PRE-DEPLOY CHECKLIST (RUN AFTER PHASE 9)

[ ] pnpm build passes with no TypeScript errors
[ ] All 9 new migrations applied cleanly on local MySQL
[ ] Smoke test 1: Participant sends /submit_mod04b_a → billing_events row
    created → SW receives notification → SW replies → row closed →
    participant_modules touchpoint_a_closed_at stamped
[ ] Smoke test 2: Participant completes 04B → 04C unlocks → completes 04C
    → Module 05 unlocks
[ ] Smoke test 3: Crisis keyword "want to die" → Lifeline message
    received in <1s → crisis_events row → on-call SW notified
[ ] Smoke test 4: SW types /cohort_workshop_attended_42_07 → 4
    billing_events rows created at Group rate
[ ] Smoke test 5: New applicant submits Stage 1 form → reaches Stage 4
    Readiness Conversation → fails on hard criteria → polite signposting
[ ] Smoke test 6: Active participant earns 12 months of activity → monthly
    snapshots capture → annual report generates → all sign-offs gate
    correctly
[ ] pnpm exec drizzle-kit migrate runs cleanly on Fly via release_command
[ ] pnpm install && pnpm build && pnpm start smoke test on Fly staging

────────────────────────────────────────────────────────────────────────────

REPORT PROGRESS AT END OF EACH PHASE

After each phase, report back to the user with:
1. What changed (files modified, files created)
2. Migrations applied + verification result
3. Smoke test outcome (pass/fail + key evidence)
4. Anything that diverged from the spec (and why)
5. Any spec inconsistencies you noticed (so the spec library can be updated)
6. Open questions or blockers

If something is unclear or the spec disagrees with the current SynthexIQ
reality, STOP and ask. Do not improvise on regulated content (NDIS
billing, audit format, consent flow). Improvising on operational details
(naming, file structure, library choice) is fine.

If a phase can't complete (blocked by missing infrastructure, unclear
requirement, breaking change risk), report the blocker and stop. Do not
push past blockers silently.

Once Phase 9 is green, the LMC implementation is functionally complete
for first launch. Front-end work (web client, SW dashboard) is a separate
workstream that can run in parallel — those specs are also in the library.

Begin with reading AUDIT_NOTES.md.
```

---

## Usage notes

- **Length:** the prompt is ~400 lines. Paste it whole.
- **Timing:** Cowork should take 2-4 weeks of focused work to complete Phase 1-9. Don't expect it in one session.
- **Reporting:** Cowork will report after each phase. Forward those reports back to this session if you want me to update specs based on what Cowork found.
- **Blockers:** Cowork is instructed to stop and ask on regulated content (billing, consent, audit format). Operational improvising (file paths, library choices) is allowed.

When Cowork's done with Phase 9, the LMC is implementable end-to-end. Front-end work (web client, SW dashboard) is a parallel workstream — those specs are in the same library.