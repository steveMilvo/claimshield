# SLES Enrolment Gate — Spec
## Intake flow that protects program outcomes by enrolling only suitable participants

**For:** the team building the AI Launchpad intake / onboarding flow
**Purpose:** Define the eligibility gate that runs before any participant is enrolled into SLES delivery. Bad enrolment harms participants AND wastes $22k of funding AND damages the program's outcome stats — this gate exists to prevent all three.

**Reads from:** participant submission via web client + supporting documents
**Writes to:** new `intake_assessments` table (migration 0018) + creates `users.role='participant'` only on successful gate pass

---

## Why the gate matters

A SLES participant who's mis-enrolled (wrong age, wrong funding, low readiness, unstable circumstances) typically:
- Drops out within 3 months
- Generates a poor outcome report at year-end, which the NDIA notes
- Reduces the program's cohort completion rate (a key partner sales metric)
- Damages the participant's confidence in disability supports generally

A 15-minute readiness conversation at intake prevents 3-6 months of wasted SW time and protects the participant from a bad experience. **The gate is non-negotiable.**

---

## The 7-stage intake flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Stage 1  ELIGIBILITY CHECKLIST          (self-serve, ~5 min, web client)    │
│ Stage 2  FUNDING VERIFICATION           (with planner / nominee, async)     │
│ Stage 3  CONSENT BRIEFING               (with primary support, async)       │
│ Stage 4  READINESS CONVERSATION         (1:1 with intake SW, 30 min sync)   │
│ Stage 5  TRIAL WEEK                     (Modules 04B + 04C, ~10 days)       │
│ Stage 6  COHORT MATCH                   (program coordinator, async)        │
│ Stage 7  FORMAL ENROLMENT               (signed Service Agreement)          │
└─────────────────────────────────────────────────────────────────────────────┘
```

Each stage either passes, requires remediation, or stops the process. The participant is not enrolled until all 7 stages pass.

---

## Stage 1 — Eligibility Checklist

**Format:** Web form. ~5 min. Participant or primary support can fill.

**Mandatory checks (all must be YES):**

```
[ ] Age 17–22 (negotiable up to 24 with plan justification)
[ ] Has finished or is finishing high school (Year 12 or equivalent)
[ ] Has, or will have, an NDIS plan with SLES funding allocated
[ ] Has a primary support person (family member, guardian, established SW)
    available for the 2-year program
[ ] Lives within reach of the service area (cohort attendance required)
[ ] Can access internet daily (phone or computer)
[ ] Has a Telegram account or can set one up with help
```

**Soft checks (NOT pass/fail — captured for context):**

```
- What payment(s) are you on? (DSP / YA / JS / None / Other)
- Are you engaged with DES? (Yes / No / Don't know)
- What disability or condition affects your day? (Free text)
- What kind of business are you drawn to? (Free text)
- What times of day work best for you? (Morning / Afternoon / Evening / Mixed)
- Anything we should know that affects how we support you? (Free text)
```

**Outcome:**
- All mandatory YES → advance to Stage 2
- Any mandatory NO → polite "not this program right now" + signposting to alternatives + 6-month re-eligibility note

---

## Stage 2 — Funding Verification

**Format:** Conversation with the participant's NDIS planner / Local Area Coordinator (LAC) / nominee. Can be async via email + form.

**What gets verified:**
- Current NDIS plan includes Capacity Building — Skill Development line item with sufficient hours
- If specifically SLES-funded: plan explicitly notes SLES allocation
- Plan expires more than 12 months out (to support full Year 1 delivery)
- Plan manager (self / plan-managed / agency-managed) noted

**Plan manager handling:**
- **Self-managed:** participant pays AI Launchpad directly; flexible
- **Plan-managed:** participant's plan manager pays AI Launchpad on receipt of invoice; flexible
- **Agency-managed:** AI Launchpad must be a registered NDIS provider; rigid invoicing through NDIS portal

If AI Launchpad is NOT yet a registered NDIS provider, Agency-managed participants cannot enrol — flag and signpost.

**Outcome:**
- Funding confirmed → advance to Stage 3
- Funding gap → support the participant + nominee in requesting a plan review (this can take 4-12 weeks); pause intake
- Hard ineligible (Agency-managed + unregistered AI Launchpad) → signpost to alternative

---

## Stage 3 — Consent Briefing

**Format:** Async pack delivered to participant + primary support; 1-hour read-through. Optionally a 30-min video call with the intake SW.

**What gets covered:**
1. **What SLES delivery looks like** (the Weekly Delivery Rhythm — show the typical week)
2. **Data and privacy** (the 4 consent types from migration 0014):
   - `data_processing` — we store your activity records
   - `telegram_messaging` — we use Telegram for billable touchpoints
   - `billing_audit` — we generate NDIA audit evidence
   - `ndis_data_sharing` — we share with your plan manager when needed
3. **The 5 Golden Rules from Module 04B** (so participant + support know them upfront)
4. **What the program WILL do** — set up a real business, support 8-12 hours/week, work toward income outcomes
5. **What the program WILL NOT do** — replace mental health support, replace medical care, guarantee specific income, take over decisions
6. **The participant's rights** — withdraw consent at any time, request all their data, leave the program

**Consent signing:**
- Each consent type signed separately (participant + guardian if applicable)
- Stored in `participant_consents` (existing migration 0014)
- Version of the consent text recorded (v1.0 currently)

**Outcome:**
- All 4 consents signed → advance to Stage 4
- Any consent declined → pause, conversation with intake SW about what specifically is concerning, possibly proceed without that consent type if non-critical
- Withdrawn at any future point → ceases the relevant data processing

---

## Stage 4 — Readiness Conversation

**Format:** 30-minute sync voice or video call with the intake SW. Participant + primary support invited. Billable as an intake / assessment activity (different NDIS line item from Capacity Building — check current Pricing Arrangements).

**What gets explored (in plain English, by the SW):**

```
"Tell me about yourself in your own words."
(Listen for: communication style, self-awareness, energy)

"What kind of business idea do you have? Or would you like one?"
(Listen for: is this their idea or someone else's? genuine interest?)

"Tell me about a time something went hard for you and what you did about it."
(Listen for: resilience, support network, self-knowledge)

"What's a typical day for you right now?"
(Listen for: stability, structure, energy levels, sleep)

"What do you want your life to look like in 2 years?"
(Listen for: hope, realism, alignment with what SLES can deliver)

"Anything you'd want us to know about how to support you well?"
(Listen for: accessibility needs, triggers, communication preferences)

"Anything you'd want us to know that you haven't had a chance to share?"
(Listen for: safeguarding flags, recent crises, missing information)
```

**Hard readiness criteria (all must be YES):**

```
[ ] Participant can engage in conversation for 30 min (with breaks if needed)
[ ] Participant expresses some genuine interest in business / their own income
[ ] No active unmanaged mental health crisis at this moment
[ ] No active substance issue that would prevent sustained engagement
[ ] Primary support person is present, supportive, and not coercive
[ ] No safeguarding concern that would require a different support pathway first
```

**Soft readiness signals (captured by SW, not pass/fail):**
- Energy level: high / medium / low
- Communication style: verbal / mixed / text-preferred / Easy Read needed
- Stated business interest: clear / exploring / no idea yet
- Family / support stability: strong / variable / fragile
- Goals coherence: clear / forming / unrealistic
- Trust level with SW after 30 min: warm / cautious / wary

**Outcome:**
- All hard YES → SW writes a readiness summary; advance to Stage 5
- Any hard NO → polite "not the right time" + warm signposting to alternatives (mental health support, AOD support, advocacy, different NDIS program) + 6-month re-engage note
- Edge cases → SW + program manager review within 48 hours, decision conveyed warmly

**Documentation:**
A free-text readiness summary written by the intake SW immediately after the call, stored in `intake_assessments.readiness_summary`. The summary becomes the foundation for the SW's later monthly snapshot narratives and the annual report's "SW observation" section.

---

## Stage 5 — Trial Week (Modules 04B + 04C)

**Format:** ~10 days where the participant completes Module 04B (AI Tools Tour) and Module 04C (Money & Benefits Rules) with light SW support.

**Why a trial:**
- Participant gets to FEEL the program before committing 2 years
- AI Launchpad gets to see how the participant actually engages (vs how they presented at Stage 4)
- The two hard safety gates (04B-C sync safety call, 04C-C benefits adviser conversation) ARE the trial — passing them means readiness has been validated
- Both modules are billable, so the trial isn't wasted SW time even if the participant doesn't continue

**Trial milestones:**
1. Day 1: Web client onboarded, Telegram bot connected
2. Day 2-4: Module 04B (AI Tools)
3. Day 5: 04B-C safety sign-off (sync voice call)
4. Day 6-9: Module 04C (Money & Benefits Rules) — including the free benefits adviser conversation
5. Day 10: 04C-C confirmed (sync voice call)

**Outcome:**
- Both 04B-C and 04C-C passed → advance to Stage 6
- Stuck on 04B (AI tools too overwhelming) → SW + manager review, possibly extend trial 2 weeks with more support
- Stuck on 04C (benefits situation too tangled) → resolve with benefits adviser first; may take 4-6 weeks
- Withdraws / disengages → graceful exit; intake doesn't proceed

**Billing during trial:**
- Module 04B touchpoints: standard Individual Skill Development line item
- Module 04C touchpoints: standard Individual Skill Development line item
- Intake SW time: separate intake / assessment line item (check current Pricing Arrangements)

---

## Stage 6 — Cohort Match

**Format:** Async. Program coordinator matches the participant to one of the rolling 4-month cohort intakes.

**Match criteria (from the Group Workshop Refactor spec):**
- Same program year
- Same intake month
- Compatible scheduling
- Similar business interests (diverse, not identical)
- Communication styles
- No interpersonal conflict (rare)

If no current cohort has a slot → participant joins a forming cohort (start within 6 weeks).

**Outcome:**
- Cohort assigned → advance to Stage 7
- No cohort within 8 weeks → check with participant: extend wait, or transfer to 1:1-only delivery temporarily, or reschedule intake for next cycle

---

## Stage 7 — Formal Enrolment

**Format:** Signed Service Agreement (participant + guardian if applicable + AI Launchpad).

**Service Agreement contents:**
1. Participant identification + plan details
2. Program description (Year 1: Modules 04B + 04C + 05-24; Year 2: Modules 25-36)
3. Weekly delivery rhythm (the standard template from the Weekly Delivery Rhythm spec)
4. Cohort assignment
5. Assigned regular SW + alumni SW
6. Billing line items + frequency (line items quoted; rates not — those are NDIA-set)
7. NDIA reporting cadence (monthly snapshots + annual report)
8. Privacy and consent terms (cross-references the signed consents from Stage 3)
9. Goals set at intake (transferred to `sles_goals` table from migration 0016)
10. Withdrawal terms (always available, no penalty)
11. Complaint process (NDIS QSC escalation path)

**Sign-offs:**
- Participant signature
- Guardian / nominee signature (if applicable)
- Plan manager acknowledgment (for plan-managed participants)
- Intake SW signature
- Program manager counter-signature

**Outcome (this is the moment of formal enrolment):**
- `users.role` set to `'participant'`
- `participant_modules` seeded with Module 04B unlocked, Module 04C unlocked (because trial completed both)
- Module 05 unlocked (because 04C is complete)
- Cohort membership row created in `cohort_members`
- Initial `sles_goals` rows created
- Welcome message sent via bot
- First cohort workshop calendar invite issued

---

## Database additions — Migration 0018

```sql
-- File: drizzle/0018_intake_assessments.sql
-- Purpose: Track the 7-stage SLES intake flow for every applicant.

CREATE TABLE intake_assessments (
  id                            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  applicant_email               VARCHAR(255)  NOT NULL,
  applicant_full_name           VARCHAR(255)  NOT NULL,
  applicant_dob                 DATE          NOT NULL,
  primary_support_email         VARCHAR(255)  NULL,
  primary_support_name          VARCHAR(255)  NULL,
  primary_support_relationship  VARCHAR(50)   NULL,

  -- Stage 1: Eligibility checklist
  stage1_completed_at           DATETIME      NULL,
  age_eligible                  BOOLEAN       NULL,
  school_status_eligible        BOOLEAN       NULL,
  has_ndis_plan                 BOOLEAN       NULL,
  has_primary_support           BOOLEAN       NULL,
  within_service_area           BOOLEAN       NULL,
  has_internet_daily            BOOLEAN       NULL,
  has_or_can_telegram           BOOLEAN       NULL,
  centrelink_payment            ENUM('DSP','YA','JS','none','other','unknown') NULL,
  engaged_with_des              ENUM('yes','no','dont_know') NULL,
  disability_context            TEXT          NULL,
  business_interest             TEXT          NULL,
  preferred_times               VARCHAR(100)  NULL,
  support_notes                 TEXT          NULL,

  -- Stage 2: Funding verification
  stage2_completed_at           DATETIME      NULL,
  ndis_plan_expiry              DATE          NULL,
  ndis_plan_manager_type        ENUM('self','plan_managed','agency_managed') NULL,
  sles_funding_confirmed        BOOLEAN       NULL,
  cb_skill_dev_hours_available  SMALLINT UNSIGNED NULL,
  funding_verification_notes    TEXT          NULL,

  -- Stage 3: Consent briefing
  stage3_completed_at           DATETIME      NULL,
  consent_briefing_method       ENUM('async_read','video_call','in_person') NULL,
  all_4_consents_signed         BOOLEAN       NULL,

  -- Stage 4: Readiness conversation
  stage4_completed_at           DATETIME      NULL,
  intake_sw_email               VARCHAR(255)  NULL,
  readiness_summary             TEXT          NULL,
  hard_readiness_passed         BOOLEAN       NULL,
  energy_level                  ENUM('high','medium','low') NULL,
  communication_style           ENUM('verbal','mixed','text','easy_read') NULL,
  business_interest_clarity     ENUM('clear','exploring','none') NULL,
  support_stability             ENUM('strong','variable','fragile') NULL,
  goals_coherence               ENUM('clear','forming','unrealistic') NULL,
  trust_level                   ENUM('warm','cautious','wary') NULL,

  -- Stage 5: Trial week
  stage5_started_at             DATETIME      NULL,
  stage5_completed_at           DATETIME      NULL,
  mod04b_passed                 BOOLEAN       NULL,
  mod04c_passed                 BOOLEAN       NULL,
  trial_outcome                 ENUM('passed','extended','withdrew','stuck') NULL,
  trial_notes                   TEXT          NULL,

  -- Stage 6: Cohort match
  stage6_completed_at           DATETIME      NULL,
  matched_cohort_id             INT UNSIGNED  NULL,
  match_notes                   TEXT          NULL,

  -- Stage 7: Formal enrolment
  stage7_completed_at           DATETIME      NULL,
  service_agreement_signed_at   DATETIME      NULL,
  service_agreement_pdf_url     VARCHAR(500)  NULL,
  manager_countersigned_at      DATETIME      NULL,

  -- Overall outcome
  current_stage                 TINYINT UNSIGNED NOT NULL DEFAULT 1,
  final_outcome                 ENUM('enrolled','declined','withdrew','deferred','signposted') NULL,
  final_outcome_at              DATETIME      NULL,
  decline_reason                VARCHAR(255)  NULL,
  signpost_referred_to          VARCHAR(255)  NULL,

  PRIMARY KEY (id),
  UNIQUE KEY uq_intake (applicant_email),
  INDEX idx_intake_stage    (current_stage),
  INDEX idx_intake_outcome  (final_outcome),
  CONSTRAINT fk_intake_cohort FOREIGN KEY (matched_cohort_id) REFERENCES cohorts(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## tRPC endpoints

```ts
// Applicant-facing (web client)
trpc.intake.startApplication.mutate({ email, fullName, dob, supportContact })
trpc.intake.completeStage1.mutate({ checklistAnswers })
trpc.intake.submitConsents.mutate({ consents })

// Intake SW
trpc.intake.sw.applicantsAtStage.query({ stage: 1 | 2 | 3 | 4 | 5 | 6 | 7 })
trpc.intake.sw.applicantDetail.query({ applicantEmail })
trpc.intake.sw.verifyFunding.mutate({ applicantEmail, ndisPlanFields })
trpc.intake.sw.recordReadinessConversation.mutate({ applicantEmail, summary, hardCriteria, softSignals })
trpc.intake.sw.recordTrialOutcome.mutate({ applicantEmail, trialOutcome, notes })

// Program coordinator
trpc.intake.coordinator.matchToCohort.mutate({ applicantEmail, cohortId })
trpc.intake.coordinator.formForCohort.mutate({ cohortName, intakeMonth, swEmail })

// Program manager
trpc.intake.manager.counterSignServiceAgreement.mutate({ applicantEmail, signature })
trpc.intake.manager.declineApplication.mutate({ applicantEmail, reason, signpostTo? })
trpc.intake.manager.intakeAnalytics.query({ periodStart, periodEnd })
  // Returns conversion funnel: Stage 1 → 7, with median time per stage
```

---

## Web client surfaces

### Public application page (`/apply`)
- Stage 1 eligibility checklist embedded as a friendly form
- Year 6 reading, voice input enabled, large text default
- On submit: applicant gets an email + Telegram invitation, intake SW assigned

### Applicant dashboard (`/intake/my-application`)
- Progress bar: 7 stages
- Each stage shows status: not started / in progress / waiting for us / completed
- Calls to action: "Book your readiness conversation" / "Watch the consent briefing video" / "Start your trial week"
- Help: chat with intake bot anytime, callback request button

### Intake SW dashboard (`/sw/intake`)
- Applicants at each stage (numbers + median wait time)
- Click an applicant → full intake_assessments record + edit form
- "Pending readiness conversations" sorted by wait time
- "Pending decisions" for edge cases needing manager review

### Program manager dashboard (`/manager/intake`)
- Intake funnel: 100 Stage 1 → X Stage 4 → Y Stage 5 → Z enrolled
- Median time per stage
- Decline reasons distribution (helps refine the gate)
- Cohort formation status

---

## Audit considerations

The intake gate produces important audit evidence:
- **Eligibility was verified before funding was claimed** — protects against later "you enrolled someone who shouldn't have been enrolled" challenges
- **Consent was obtained and versioned** — protects against later "we didn't agree to that" challenges
- **Readiness was assessed by a qualified SW** — protects against "you took on someone you knew wouldn't succeed" challenges
- **Trial week confirmed engagement** — protects against "they were enrolled but never actually participated" challenges
- **Service Agreement signed by both parties + counter-signed** — standard NDIS Practice Standards requirement

All intake_assessments records retained for 7 years via the existing audit-trail-ndis 7-year retention pattern.

---

## Acceptance criteria

- [ ] Public `/apply` page completes Stage 1 in under 5 min for a typical user
- [ ] Stage 1 declines (any mandatory NO) signpost gracefully and don't enrol
- [ ] Stage 2 funding verification accepts plan-manager and self-managed; flags agency-managed when AI Launchpad isn't NDIS-registered
- [ ] Stage 3 consent flow writes 4 rows to `participant_consents` with versioned text
- [ ] Stage 4 readiness conversation must record `readiness_summary >= 200 chars` and `hard_readiness_passed BOOL`
- [ ] Stage 5 trial outcome cannot be `passed` unless both `mod04b_passed` and `mod04c_passed` are TRUE
- [ ] Stage 6 cohort match cannot proceed without a matched_cohort_id
- [ ] Stage 7 formal enrolment sets `users.role = 'participant'` AND creates the unlock chain (04B done → 04C done → Module 05 unlocked) AND creates the cohort_members row AND seeds initial sles_goals
- [ ] Withdrawn-consent applicants disappear from any future processing; intake_assessment retained with `[WITHDRAWN]` redaction
- [ ] Median time from Stage 1 to Stage 7: ≤ 6 weeks for a typical applicant
- [ ] Intake conversion funnel visible to program manager dashboard
