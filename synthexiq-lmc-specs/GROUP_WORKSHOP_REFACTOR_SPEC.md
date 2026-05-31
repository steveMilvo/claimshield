# Group Workshop Refactor — Spec
## Re-engineering 10 LMC modules to support 4-person cohort delivery

**For:** the curriculum maintenance team
**Purpose:** Rewrite the activity and touchpoint structure of 10 Year 1 modules so they can be delivered in 4-person cohort workshops at the Group Skill Development NDIS line item (~$88/SW-hour vs $67/SW-hour 1:1). This is the single biggest margin lever in the program.

**Outcome:** Same curriculum content, restructured to make group delivery natural and effective for Modules 06, 07, 08, 11, 12, 17, 18, 22, 26, 29.

**Total economic impact:** at 12 participants × 3 cohorts × 2 group hours/wk × 40 weeks × $88/hr revenue uplift ≈ **+$84,480/yr per SW**.

---

## Why this matters

Group rate vs individual rate is the single mechanical difference in NDIS billing that produces the SLES margin. The math:

| Setting | NDIS rate per SW-hour | Margin impact (vs 1:1 base) |
|---|---|---|
| Individual touchpoint (1:1) | ~$67/hr | baseline |
| Group 1:2 | ~$80/hr | +19% |
| Group 1:4 | ~$88/hr | +31% |
| Group 1:5 | ~$95/hr | +42% |
| Group 1:8 | ~$105/hr | +57% |

But group dynamics break down past 4-5 for the audience (low literacy, attention/executive function challenges, varying capacity). **1:4 is the right ceiling.**

If 10 modules each deliver one weekly group workshop, that's 10-20 group billable hours per cohort per program year. At ~$88/hr rather than ~$67/hr, the differential adds $200-400 per participant per year × 12 participants = $2,400-4,800/year/SW. **Across the SLES Year 1 + Year 2 program for one SW caseload of 12, it's $48k-96k extra revenue at no additional cost.**

This refactor doesn't add modules. It restructures how existing modules are delivered.

---

## Group-compatible vs not group-compatible

### Compatible (refactor to group format)

| Module | Why group works | Current format | New format |
|---|---|---|---|
| **06** Product Photos | Shoot setup can be peer-coached; photo critique is richer with 4 perspectives | 1:1 async | Cohort workshop: 90 min shoot session + peer feedback |
| **07** Pricing | Competitor scans + AI prompts are more powerful when 4 share findings | 1:1 async | Cohort workshop: 90 min market scan + 30 min tier setting |
| **08** Social Media | Content plan generation works as group ideation | 1:1 async | Cohort workshop: 90 min platform choice + plan + first post drafted |
| **11** Growing My Business | Local growth ideas are stronger when group brainstorms | 1:1 async + Local SW visit | Cohort workshop: 90 min ideation + flyer co-design; Local SW remains 1:1 |
| **12** Business Review | Already structured as group workshop in v3 | Group workshop (60 min, 4 learners) | KEEP — but extend to 90 min |
| **17** Track and Grow | Performance analysis benefits from peer comparison | 1:1 async + voice note | Cohort workshop: 120 min cohort analysis + scale-up planning |
| **18** Customer Care | Reply template building works as group exercise | 1:1 async | Cohort workshop: 90 min template co-creation + role-play |
| **22** AI Health prep | Vulnerable content — group works ONLY for the educational steps | 1:1 + sync voice call | Cohort workshop ONLY for AI-as-prep-buddy education (60 min); the 1:1 touchpoints stay private |
| **26** Repeat Customers | Customer database setup + loyalty design = great group activity | 1:1 async | Cohort workshop: 90 min customer mapping + loyalty co-design |
| **29** Markets | Market planning + role-play sales scripts = strong group fit | 1:1 async + day-of | Cohort workshop: 90 min logistics + script practice; market day stays solo (or paired) |

### NOT compatible (keep 1:1)

| Module | Why 1:1 only |
|---|---|
| **04B** AI Tools Tour | Foundation safety gate; SW must verify individual understanding |
| **04C** Money & Benefits | Highly personal (Centrelink situation differs per participant); confidential |
| **05** Selling Online | Individual platform choice + listing content; private |
| **09** First Sale | Sales practice is intimate; failure-tolerance space; 1:1 better |
| **10** Money Basics | Personal financial details; never group |
| **13-17** Affiliate Library | Each participant's app portfolio is personal; competitive concerns |
| **19** Reading Buddy | The letters being decoded are private (Centrelink, NDIS, medical) |
| **20** Online Home | Website is a personal expression; 1:1 keeps it authentic |
| **21** Hard Conversations | Personal, sensitive, often safeguarding-flagged content |
| **22** AI Health (1:1 portions) | Health information is private |
| **23** Telling Your Story | Story can include vulnerable content; not for group |
| **24** Graduation | Personal, planner-meeting work |
| **25** Annual Plan | Personal business plan; competitive concerns |
| **27** Money Goals | Personal financial details |
| **28** Hiring Helper | Personal decision; family dynamics |
| **30** Wholesale | B2B walk-ins are solo by nature |
| **31** Online Ads | Budget + targeting are personal/competitive |
| **32** Reviews | Negative review handling is private |
| **33** Tax & ABN | Highly personal; benefits/tax situation differs |
| **34** Mentoring | 1:1 with mentee (different relationship) |
| **35** Post-SLES | Personal transition planning |
| **36** Year 2 Graduation | Personal outcome moment |

**Refactor count: 10 modules become group-compatible. The remaining 27 modules stay 1:1.**

---

## Standard refactor pattern

Each refactored module shifts from this:

**Before (1:1):**
- Open Activity: 60-90 min participant solo + AI tool
- Touchpoint A: async plan review (10-15 min, SW templated reply)
- Touchpoint B: async AI critique (10-15 min, SW templated reply)
- Touchpoint C: async outcome review (10-15 min, SW templated reply)
- **Total billable: ~30-45 min × $67/hr = $33-50/participant/module**

To this:

**After (group + 1:1 hybrid):**
- Cohort Workshop (Monday, 90 min): the participant does the AI-tool steps in a group of 4 with SW facilitating
  - Live demo of the AI prompt
  - Each participant runs it on their own device
  - Group shares results, peer critiques, refines
  - SW circulates supporting individuals
  - **90 min × 4 participants × $22/participant-hour = $132 revenue for the workshop hour**
- Touchpoint A (PRE-workshop async): plan/topic submitted before workshop, SW pre-reads (10 min)
- Touchpoint B (POST-workshop async): individual application of group outcome, SW reviews (10 min)
- Touchpoint C (async outcome review): final artifact submitted, SW signs off (15 min)
- **Total billable: 90 min workshop @ group rate + 35 min 1:1 @ individual rate = ~$50-65/participant — higher revenue + DEEPER engagement.**

The refactor adds modest revenue per participant AND it delivers structurally better learning (peer effect, shared accountability, repeated exposure). And it transitions billable hours from labour-bound 1:1 to leverage-bound cohort time.

---

## Per-module refactor specifications

For each of the 10 modules, the refactor follows the standard pattern with module-specific adjustments. Below is the structural change spec for each. **Full module re-writes are out of scope for this spec doc** — the curriculum team applies the pattern.

### Module 06 — Product Photos & Descriptions

**Cohort Workshop (90 min):**
1. (10 min) Each participant brings 2-3 raw product photos to the workshop
2. (15 min) Group reviews the AI photo editing prompt (Step 2 of the existing v3 module)
3. (25 min) Each participant runs Gemini on one photo while in the workshop; SW circulates
4. (15 min) Group critiques: "Did Claude/Gemini change the product?" — honesty rule reinforcement
5. (15 min) Group writes captions in pairs; SW supports
6. (10 min) Each participant locks in their 3-photo pack

**Touchpoint changes:**
- A (PRE): "Send me your raw photos before the workshop" — 5 min review
- B (DURING workshop): SW circulates, no formal logging
- B (REPLACEMENT, POST): "Your final 3-photo pack" — 10 min critique
- C: "Pack live on listings" — 15 min sign-off

### Module 07 — Pricing My Stuff

**Cohort Workshop (90 min):**
1. (15 min) Each participant brings: materials cost + time estimate + target customer
2. (20 min) Group runs the ChatGPT competitor scan together — different products, but shared technique
3. (20 min) Pairs swap and critique each other's market scan output
4. (20 min) Group runs Claude tier prompt; each participant arrives at 3-tier sheet
5. (15 min) Group share-and-defend: each participant presents pricing to cohort for honest feedback

**Touchpoint changes:**
- A (PRE): "Send your cost worksheet" — 10 min review
- B (DURING): SW circulates
- B (REPLACEMENT, POST): "Your 3-tier sheet" — 10 min critique
- C (POST + voice note): "Pricing live, you ready to charge it?" — 15 min sign-off

### Module 08 — Social Media 101

**Cohort Workshop (90 min):**
1. (15 min) Each participant brings their platform choice + customer profile
2. (20 min) Group critiques each other's platform choice
3. (30 min) Each participant generates 4-week content plan via Claude; share with cohort
4. (15 min) Pairs design the first post together; peer feedback before publishing
5. (10 min) Group commits to a "first post by Friday" target

### Module 11 — Growing My Business

**Cohort Workshop (90 min):**
1. (15 min) Each participant shares one local growth idea they're considering
2. (30 min) Group brainstorm — cohort suggests refinements to each idea
3. (30 min) AI flyer design session in pairs; SW supports
4. (15 min) Cohort commits: who's booking a Local SW visit, when

**Note:** the Local SW field visit (Touchpoint C) remains 1:1 — group field visits would change the line item.

### Module 12 — My Business Review

Already structured as group workshop in v3 (60 min). **Extend to 90 min** to match the standard pattern; add 30 min peer presentations + commitments for next quarter.

### Module 17 — Track and Grow

**Cohort Workshop (120 min — longer):**
1. (20 min) Each participant shares 4-week data
2. (30 min) Group runs Claude analysis on each participant's data sequentially; cohort comments
3. (30 min) "Hero post" identification across cohort — sometimes the pattern is clearer when seen across multiple businesses
4. (30 min) Each participant builds scale-up plan; pairs present to each other
5. (10 min) Commitments + scheduled check-ins

Longer because Track and Grow benefits from comparison across businesses.

### Module 18 — Customer Care with AI

**Cohort Workshop (90 min):**
1. (15 min) Each participant shares a real (anonymised) customer message they got
2. (30 min) Group builds template library together — each generates their 5 templates with Claude
3. (30 min) Role-play in pairs: one plays customer, one uses their template
4. (15 min) Group debrief on what works

Role-play is much richer in group format than alone with AI.

### Module 22 — AI for Health & Wellbeing (PARTIAL group only)

**Cohort Workshop (60 min — educational portion only):**
- AI-as-prep-buddy technique demonstrated and practised in group
- Sample anonymous health vocabulary translation
- Group practice on a sample (anonymised) pre-visit checklist

**1:1 touchpoints stay private:**
- A: Actual upcoming visit plan (personal — private)
- B: Personal health words glossary (private)
- C: Post-visit debrief (sync voice call — private)

This module is partial-refactor only because health is too personal for full group exposure.

### Module 26 — Repeat Customers (Year 2)

**Cohort Workshop (90 min):**
1. (20 min) Each participant brings customer list from Year 1
2. (30 min) Group runs Claude categorisation; cohort discusses patterns
3. (25 min) Loyalty reward co-design — peers critique each other's rewards for economic viability
4. (15 min) "We miss you" message drafting in pairs

### Module 29 — Markets, Pop-ups & Stalls (Year 2)

**Cohort Workshop (90 min):**
1. (15 min) Each participant shares their target market choice
2. (30 min) Group role-plays market greetings — cohort acts as customers
3. (30 min) Stall logistics plan share; cohort spots gaps
4. (15 min) "Market buddy" pairing — two participants attend each other's first market

Group role-play massively improves the sales script practice.

---

## Cohort workshop facilitation guide

### Pre-workshop (15 min SW prep, NOT billable per participant — overhead)
- Read each participant's pre-workshop async submission
- Identify any participant in current Pattern D (reduced capacity) — adapt workshop pace
- Prepare a workshop run-sheet
- Test video/in-person tech

### During workshop (the billable hour)
- Greet each participant by name within the first 2 minutes
- Set the workshop goal: "By end of today, each of you will have [SPECIFIC ARTIFACT]"
- Run the structured agenda (per the per-module specs above)
- Circulate during AI prompt time — every participant should be checked on once
- Manage group dynamics: pull in the quiet one, gently slow the dominant one
- End with explicit "what each person committed to this week"
- Close on time (workshops that run over erode trust)

### Post-workshop (10 min SW admin, NOT billable per participant — overhead)
- Update each participant's billing_events row (4 rows, one per attendee, marked closed at workshop end)
- Note in `sw_narrative_note` for the upcoming monthly snapshot anything specific about this participant's engagement
- Flag any participant who needs follow-up (Pattern D, missing pre-work, expressed stress)

### Billing record per workshop

```typescript
// Single cohort workshop produces 4 billing_events rows
for (const participant of cohort.attendees) {
  await createBillingEvent({
    participantEmail: participant.email,
    moduleNum: workshop.moduleNum,
    touchpoint: 'workshop',     // new touchpoint type — or 'b' depending on schema choice
    triggerPhrase: '/cohort_workshop_attended',
    openedByTelegramId: sw.telegramId,  // SW opens it
    ndisLineItem: 'Capacity Building — Group Skill Development (1:4)',
  });
}
```

A schema note: the existing `billing_events.touchpoint` ENUM is `('a','b','c')`. The cohort workshop is conceptually "Touchpoint B" (the AI critique step, which is where the workshop happens). Use `touchpoint = 'b'` with a new column `delivery_mode = 'group_workshop'` to disambiguate. This requires a small migration (see Implementation Notes below).

---

## Schema additions (Migration 0017)

```sql
-- File: drizzle/0019_group_delivery.sql
-- Allows billing_events to record group vs individual delivery modes
-- and links a single workshop to multiple participant billing_events rows.

ALTER TABLE billing_events
  ADD COLUMN delivery_mode ENUM(
    'async_telegram',
    'sync_voice_call',
    'sync_video_call',
    'in_person_field_visit',
    'group_workshop',
    'group_co_working'
  ) NOT NULL DEFAULT 'async_telegram'
  AFTER ndis_line_item;

ALTER TABLE billing_events
  ADD COLUMN workshop_id INT UNSIGNED NULL
  AFTER delivery_mode
  COMMENT 'FK to workshops table for group sessions; NULL for 1:1 events';

CREATE TABLE workshops (
  id                INT UNSIGNED NOT NULL AUTO_INCREMENT,
  module_num        TINYINT UNSIGNED NOT NULL,
  module_sub_key    CHAR(1) NULL,
  sw_email          VARCHAR(255) NOT NULL,
  cohort_id         INT UNSIGNED NOT NULL,
  scheduled_for     DATETIME NOT NULL,
  conducted_at      DATETIME NULL,
  duration_minutes  SMALLINT UNSIGNED NULL,
  delivery_mode     ENUM('group_workshop','group_co_working') NOT NULL,
  facilitator_notes TEXT NULL,
  status            ENUM('scheduled','conducted','cancelled') NOT NULL DEFAULT 'scheduled',

  PRIMARY KEY (id),
  INDEX idx_wk_sw (sw_email),
  INDEX idx_wk_cohort (cohort_id),
  INDEX idx_wk_status (status, scheduled_for)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE billing_events
  ADD CONSTRAINT fk_be_workshop FOREIGN KEY (workshop_id) REFERENCES workshops(id);

CREATE TABLE cohorts (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  cohort_name     VARCHAR(100) NOT NULL,
  intake_month    DATE NOT NULL,
  program_year    TINYINT UNSIGNED NOT NULL,
  sw_email        VARCHAR(255) NOT NULL,
  current_module  TINYINT UNSIGNED NOT NULL DEFAULT 5,
  status          ENUM('forming','active','completed','disbanded') NOT NULL DEFAULT 'forming',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_cohort_name (cohort_name),
  INDEX idx_cohort_sw (sw_email),
  INDEX idx_cohort_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cohort_members (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  cohort_id       INT UNSIGNED NOT NULL,
  participant_email VARCHAR(255) NOT NULL,
  joined_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  left_at         DATETIME NULL,
  left_reason     ENUM('completed','transferred','withdrew','exited') NULL,

  PRIMARY KEY (id),
  UNIQUE KEY uq_cm (cohort_id, participant_email),
  INDEX idx_cm_participant (participant_email),
  CONSTRAINT fk_cm_cohort FOREIGN KEY (cohort_id) REFERENCES cohorts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Trigger router changes

A new bot command `/cohort_workshop_attended` is added to the trigger router. SW types this to log a workshop:

```typescript
const WORKSHOP_TRIGGER = /^\/cohort_workshop_attended_(\d+)_(\d{2})(?:_([bc]))?$/i;
// e.g. /cohort_workshop_attended_42_07 → workshop ID 42 for Module 07
// e.g. /cohort_workshop_attended_42_04_b → for Module 04B workshop

export async function handleCohortWorkshopTrigger(...) {
  // Parse workshopId, moduleNum, optionally moduleSubKey
  // Look up workshop attendees from cohort_members
  // Create one billing_events row per attendee with:
  //   touchpoint = 'b',
  //   delivery_mode = 'group_workshop',
  //   workshop_id = <id>,
  //   ndis_line_item = 'Capacity Building — Group Skill Development (1:4)'
  // Close all 4 events at the same closed_at timestamp
  // Mark the workshop conducted_at
}
```

Implementation goes in `triggerRouter.ts` next to `handleLmcTrigger`.

---

## SW dashboard changes

The SW Caseload Dashboard spec needs a new section:

**My Cohorts (`/sw/cohorts`)**
- 3 cohorts (one row each)
- Cohort name, intake month, program year, member count, current module
- "Next workshop" countdown
- "Last workshop conducted" date + duration
- "Members" → list of 4 participants (click each → participant detail)
- Schedule workshop button → opens calendar slot booking
- "Log workshop conducted" → fires the `/cohort_workshop_attended` trigger

---

## Migration roadmap

Refactor sequence — these don't all need to happen at once.

| Phase | Modules to refactor | When |
|---|---|---|
| **Phase 1** (immediate) | 12 (already group), 06, 08 | Before first cohort runs Mod 06 |
| **Phase 2** (Q1) | 07, 11, 17, 18 | As cohort progresses through Year 1 |
| **Phase 3** (Q2) | 22 (partial), 26, 29 (Year 2) | When first cohort enters Year 2 |

Phasing means the platform can adopt cohorts gradually rather than needing the full refactor live before Day 1.

---

## Acceptance criteria

- [ ] Cohort table populated; 3 cohorts assignable per SW
- [ ] Workshop scheduling produces calendar entries visible to all 4 cohort members
- [ ] `/cohort_workshop_attended_<id>_<mod>` trigger creates 4 simultaneous billing_events rows
- [ ] All 4 rows carry `delivery_mode = 'group_workshop'` and the Group Skill Development line item
- [ ] NDIA Audit Export includes `delivery_mode` column; group_workshop rows render with the Group rate
- [ ] Cohort workshop billing reconciles: 4 participants × workshop duration × group rate = total claim
- [ ] SW dashboard shows the cohort view + "next workshop" countdown
- [ ] Participant web client shows the upcoming workshop on the module page
- [ ] At least 3 module pages refactored with the new "Cohort Workshop (90 min)" section visible

---

## What this refactor does NOT do

- **Does not change content.** The AI prompts, the activity steps, the artifacts produced — all identical to the existing v3.
- **Does not affect Year 1 1:1-only modules.** Modules 04B, 04C, 05, 09, 10, 13-15, 16, 19, 20, 21 stay exactly as written.
- **Does not change the trigger phrase syntax for existing modules.** `/submit_modNN_a/b/c` still works for the 1:1 touchpoints around each workshop.
- **Does not require a complete cohort to operate.** If a cohort drops to 3 members (one withdrew), the workshop runs anyway. NDIS billing happens at the actual ratio (1:3 instead of 1:4 — different rate but still group).
- **Does not change the program duration.** Same 12 + 12 = 24-module structure across 2 years.

---

## Open question for the operator

Should cohort workshops be:

**(a) "Strict 4"** — workshops cancel if fewer than 4 confirmed (4-participant min for the Group 1:4 rate). Operationally tight.

**(b) "Adaptive ratio"** — workshop runs with 2-4 confirmed. Billing rate adjusts to actual ratio (1:2 vs 1:3 vs 1:4 — different NDIS line items). Operationally flexible.

Recommend **(b) Adaptive**. Cancelling workshops costs trust with participants. The rate uplift over 1:1 is still significant at 1:2 and 1:3.

---

*This refactor is what makes SLES economics work. Without it, AI Launchpad bills hourly at individual rates and operates at thin margin. With it, cohort delivery becomes the default and the margin opens enough to sustain the program at scale.*
