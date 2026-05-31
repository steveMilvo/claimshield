# Weekly Delivery Rhythm — Spec
## The structured 8–12 hour SLES week for AI Launchpad participants

**For:** AI Launchpad SLES delivery operations + scheduling system
**Purpose:** Define what a typical week looks like for a SLES participant — across cohort time, 1:1 SW touchpoints, self-paced learning, customer-facing activity, and community engagement. Audit-defensible. Billable per the NDIA framework. Sustainable for SWs at the 12-participant ratio.

---

## Why this matters

SLES funding pays for **outcomes via structured engagement over 2 years**, not for ad-hoc hourly touchpoints. The current LMC delivers ~45 minutes/week of SW touch — that's enough for hourly Capacity Building but FAR short of the 8–12 hours/week SLES expects.

A documented weekly rhythm:
- Lets the participant know what their week looks like (predictability is itself a SLES outcome)
- Justifies the SLES funding intensity at NDIA audit
- Distributes SW workload predictably (cohort time + async + sync, not just async)
- Substitutes for conventional job-search activity when DES Job Plan amendment is in place
- Creates the cohort effect that makes group workshops (margin lever) work

---

## The standard SLES week

8 structured hours minimum + 4 optional hours = the range NDIA expects for SLES at standard intensity. The exact mix flexes for individual capacity.

### The five activity types

| # | Activity Type | Hours/wk | Format | Billable line item | Capture |
|---|---|---|---|---|---|
| 1 | **Cohort workshop** | 2 | Group of 4 in-person OR video | Group Skill Development (1:4) | Attendance log + billing_events group entry |
| 2 | **Self-paced module activity** | 2-3 | Solo, web client + bot | Structured activity (auto-logged) | `activity_hours_structured` |
| 3 | **1:1 SW touchpoints** | 0.5-1 | Async Telegram OR sync voice | Capacity Building — Skill Development | `billing_events` per touchpoint |
| 4 | **Cohort co-working** | 1-2 | Group of 4 video — "do business work together" | Group Skill Development (1:4) | Attendance log + billing_events |
| 5 | **Customer-facing / community time** | 2-4 | Markets, customer interactions, community engagement | Capacity Building — Skill Development OR Community Access (line item depends) | `activity_hours_customer_facing` (auto-logged + receipts/photos) |

**Total: 7.5–12 hours of structured weekly activity.**

---

## The typical week template

Designed for a young person with disability balancing capacity, energy levels, and business growth. NOT prescriptive — actual scheduling flexes for the participant.

```
┌─────────────┬──────────────┬──────────────────────────────────────┬──────────┐
│ Day         │ Time         │ Activity                             │ Hours    │
├─────────────┼──────────────┼──────────────────────────────────────┼──────────┤
│ Monday      │ 10:00–12:00  │ COHORT WORKSHOP (group of 4)         │ 2.0      │
│             │              │ Module activity for this week, led   │          │
│             │              │ by SW + co-learners                  │          │
├─────────────┼──────────────┼──────────────────────────────────────┼──────────┤
│ Tuesday     │ Flexible     │ SELF-PACED MODULE ACTIVITY (solo)    │ 2.0–3.0  │
│             │              │ Web client steps, AI prompts, save   │          │
│             │              │ work in Telegram                     │          │
├─────────────┼──────────────┼──────────────────────────────────────┼──────────┤
│ Wednesday   │ Async + 11am │ 1:1 SW TOUCHPOINT (async morning,    │ 0.5      │
│             │              │ SW reviews + replies by 1pm)         │          │
│             │ 2:00–5:00    │ CUSTOMER-FACING TIME (markets,       │ 2.0–3.0  │
│             │              │ customer DMs, follow-ups)            │          │
├─────────────┼──────────────┼──────────────────────────────────────┼──────────┤
│ Thursday    │ 10:00–12:00  │ COHORT CO-WORKING (group of 4)       │ 1.0–2.0  │
│             │              │ Each works on their own business,    │          │
│             │              │ chat enabled, low SW touch           │          │
├─────────────┼──────────────┼──────────────────────────────────────┼──────────┤
│ Friday      │ Flexible     │ COMMUNITY ENGAGEMENT (variable)      │ 0.5–2.0  │
│             │              │ Community group visit, supplier      │          │
│             │              │ visit, networking, OR rest if needed │          │
└─────────────┴──────────────┴──────────────────────────────────────┴──────────┘

WEEKLY TOTAL: 8.0 – 12.5 hours
```

### Why this distribution

| Activity | Why this slot | Margin economics |
|---|---|---|
| Monday Cohort Workshop | Sets up the week's module activity. Group format = $88/hr to provider vs $67/hr individual | **Highest margin density** |
| Tuesday Self-Paced | Participant deep work, low SW load. Auto-logs hours via bot interaction | Zero SW labor cost while billable hours accrue |
| Wednesday Async + Customer-Facing | Async touchpoint is the SW efficiency play (templated reply, 8–12 min) | 18-min budget achievable |
| Thursday Cohort Co-Working | Light SW touch (1 SW supervises 4); creates peer support (independence ratio improvement) | Group rate again |
| Friday Community / Rest | Field activity OR rest. Mental health protective. | Customer-facing time auto-logs |

The pattern repeats weekly with variations for module specifics (e.g. Module 29 Markets Week shifts Friday community time to Saturday market day; Module 11 Local Field Visit replaces Wednesday afternoon).

---

## Variation patterns

### Pattern A: Standard (most participants, most weeks)
Default template above. Used Modules 05-08, 13-15, 18, 20-21, 25-28, 32.

### Pattern B: Market Week
Used when a participant runs a market (Modules 09, 29).
- Mon cohort: market day prep
- Tue self-paced: stock, signage, pricing
- Wed 1:1: market plan critique
- Thu co-working: shorter; prep continues
- **Sat/Sun market day** (4-6 hours, billable as customer-facing)
- Mon following week: debrief touchpoint

### Pattern C: Field Visit Week
Used for Local SW visits (Modules 11, 16, 22, plus on-request).
- Mon cohort: visit prep
- Tue self-paced: visit planning
- Wed 1:1: pre-visit briefing
- **Thu/Fri Local SW field visit** (1-3 hours, billable as Field Support)
- Following week Mon: post-visit debrief

### Pattern D: Crisis / Reduced Capacity Week
For participants with mental health, illness, or burnout signal.
- Mon cohort: optional (no penalty for absence)
- Tue self-paced: skipped
- Wed 1:1: voice call SW check-in (10-15 min)
- Thu cohort: optional
- Fri: rest
- **Weekly minimum: 1.5 hours billable (the Wed check-in + Tue self-paced if attempted)**

Pattern D is critical: a participant in reduced capacity is NOT removed from SLES. They flex to a lower-intensity week. The annual outcome report explains the dip with the SW narrative. NDIA accepts this — what they don't accept is silent disengagement.

### Pattern E: Year 2 High-Autonomy Week
For Year 2 participants who've earned high independence ratio (>0.75).
- Mon cohort: optional attendance (often skipped — they're past it)
- Tue self-paced: 3-4 hours (deeper work, less scaffolding)
- Wed 1:1: less frequent — bi-weekly instead of weekly
- Thu co-working: optional (often used as peer mentoring time)
- Fri community / business: 4-6 hours (running the actual business)
- **Total: 8-10 hours, more independent in distribution**

### Pattern F: Final Quarter Year 2 (Modules 35-36)
- Mon cohort: replaced by 1:1 transition planning sessions
- Tue self-paced: post-SLES planning + outcomes report compilation
- Wed: Centrelink + planner conversations
- Thu cohort: optional — alumni-bridging conversations
- Fri: business sustainability work
- **Includes: 1 booked NDIS Planner Meeting (the SLES outcome moment)**

---

## Scheduling logic

### Cohort composition

Cohorts of 4 are NOT randomly assembled. The coordinator matches based on:
- **Same program year (Y1 cohort separate from Y2 cohort)**
- **Same intake month (4-month rolling cohorts work well)**
- **Compatible scheduling availability**
- **Similar business interests (not identical — diversity creates richer peer learning)**
- **Communication styles (avoid pairing very-quiet with very-loud unless intentional)**
- **No active interpersonal conflicts** (rare but checked)

A cohort of 4 stays together for at least 12 weeks (one quarter). Then participants can request a switch or stay.

### Time slot allocation

Per SW (12 participants = 3 cohorts of 4):

| Day | SW activity | Hours |
|---|---|---|
| Mon | Cohort Workshop A (10-12) + Cohort Workshop B (1-3) + Cohort Workshop C (3-5) | 6 |
| Tue | Async touchpoints + admin (rolling through 12 participants) | 6 |
| Wed | Async touchpoints + 1:1 voice calls (sync touchpoints booked here) | 7 |
| Thu | Cohort Co-Working A (10-12) + B (1-3) + C (3-5) | 6 |
| Fri | Field visits / community activity / planning / catch-up | 5-7 |

**Total SW week: ~30-32 hours direct delivery + 6-8 hours admin + supervision = 38hr FTE.** Matches the SW workweek with realistic non-billable load (training, supervision, documentation, debrief).

### Cohort time billing

A 2-hour workshop with 4 participants = 8 participant-hours of billable activity. At Group Skill Development line item (~$88/participant/hr) = **$176 revenue per workshop hour**.

A SW running 3 cohorts × 4 hours of cohort time/week = 12 cohort hours/week = ~$2,112 revenue/week from cohort time alone. That's $109k/year just from the cohort layer.

Plus async touchpoints, sync calls, and field visits stack on top. The 12-participant SW caseload comfortably generates the $264k/year SLES revenue projected in the SLES Pivot Strategy.

---

## Billing line item mapping

| Activity | NDIS line item (legacy structure — verify against current Pricing Arrangements) | Rate / hour |
|---|---|---|
| Cohort workshop | Capacity Building — Group Skill Development (1:4) | ~$22/participant ≈ $88/hr SW revenue |
| 1:1 SW async touchpoint | Capacity Building — Individual Skill Development | ~$67/hr |
| 1:1 SW sync voice call | Capacity Building — Individual Skill Development | ~$67/hr |
| Local SW field visit | Capacity Building — Field-based Support (Individual) | ~$67/hr + travel claim |
| Self-paced auto-logged activity | NOT directly billable (counts toward SLES outcome evidence, not hourly billing) | $0 direct |
| Customer-facing community time | NOT directly billable (outcome evidence, not hourly) | $0 direct |

**Key insight:** The self-paced and customer-facing hours don't add direct billing revenue — they add **outcome evidence** that secures the SLES funding renewal at plan review. They cost nothing to deliver (the participant does the work) and they protect future revenue.

---

## Reporting hours to Centrelink (mutual obligation)

For participants with a Centrelink mutual obligation requirement (typical YA/JS with PCW):

| Activity | Reportable to Centrelink? | How |
|---|---|---|
| Cohort workshop | Yes — counted as "approved training activity" | DES provider reports via ESS Web OR participant logs via myGov |
| Self-paced module activity | Yes — counted as "approved training activity" | Same |
| 1:1 SW touchpoint | Yes — counted as "approved training activity" | Same |
| Customer-facing time | Yes — counted as "self-employment activity" | Reported as business hours; income reported separately |
| Community engagement | Sometimes — depends on Centrelink classification | Participant-specific; SW + benefits adviser to confirm |

For full job-search substitution, the participant's Job Plan should classify AI Launchpad participation broadly as approved activity (per the DES Registration & Partnership Strategy doc). Then ALL the hours count.

---

## Audit defence — what makes this rhythm defensible

When an NDIA auditor reviews a SLES claim:

1. **There's a written weekly rhythm document** (this spec) showing the standard structure
2. **Each participant has a personalised version** in their Service Agreement
3. **Actual hours delivered each week are logged in `sles_monthly_snapshots`** (per the Outcomes Dashboard spec)
4. **Variation patterns (Pattern D — reduced capacity) are documented and explainable** in the SW narrative section of the monthly snapshot
5. **Cohort attendance and 1:1 touchpoints have time-stamped audit evidence** via billing_events
6. **Self-paced and customer-facing hours are auto-logged** by the bot (not self-reported, which would be weak evidence)

The auditor sees: predictable structure × adapted to individual capacity × evidenced by data × delivering outcomes documented elsewhere. SLES funding defended.

---

## Implementation requirements

### Synthexiq side

1. **Cohort calendar generator** — assigns participants to cohorts and produces a 12-week calendar per cohort
2. **Scheduler entries** — calendar bot integration so participants see "Monday 10am: Cohort Workshop" in their app
3. **Activity hours auto-logger** — extends the existing module page activity tracker:
   - When participant opens module page → start timer
   - Page idle 5 minutes → pause
   - Page close → record hours into `activity_hours_structured`
4. **Customer-facing time logger** — bot command `/log_business_time [DURATION]` for market days, customer meetings (with optional photo evidence)
5. **Pattern D detection** — if a participant logs <2 hours one week, the bot proactively pings their SW to check in (not punitive — supportive)
6. **Cohort billing batch creation** — when a cohort workshop is completed, create 4 simultaneous billing_events rows (one per participant) with the Group Skill Development line item

### Web client side

1. **Calendar view on `/learn`** showing the participant's typical week
2. **"This week" rhythm visible at the top of the module page** — green dots showing completed activities
3. **Cohort workshop join link** — calendar reminder + 1-tap join button (video link or in-person address)
4. **Co-working room** — group video chat with all 4 cohort members (bot mediates)

### Admin / SW side

1. **Cohort manager** in the SW dashboard — see your 3 cohorts, their schedule, attendance
2. **Pattern D flag** in the SW caseload — participants on reduced rhythm are visible with the reason
3. **Weekly capacity utilisation gauge** for the SW (already specced in the SW Caseload Dashboard) extended to show cohort vs 1:1 vs admin split

---

## Acceptance criteria

- [ ] Cohort generator can produce 3 cohorts of 4 from a pool of 12 participants matching the composition rules
- [ ] Each participant sees their personalised weekly schedule in the web client
- [ ] Cohort workshops produce 4 simultaneous billing_events rows with Group Skill Development line item
- [ ] Self-paced activity auto-logs into `activity_hours_structured` with the 5-minute idle cutoff
- [ ] Customer-facing time logger accepts `/log_business_time` with optional photo
- [ ] Pattern D participants trigger SW notification without being penalised
- [ ] Weekly hour totals match across: web client display, SW dashboard, sles_monthly_snapshots row at month end
- [ ] Cohort rate ($88/participant-hour) renders correctly in the NDIA Audit Export
- [ ] A SW handling 12 participants doesn't exceed 38 hours/week of direct + admin time
- [ ] Annual outcomes report cites weekly rhythm adherence as evidence

---

## Open questions for the program operator

1. **Cohort size flex.** 4 is the standard NDIA group ratio for Group Skill Development. Would 6-person cohorts work better operationally (more peer learning, lower per-participant SW cost) at the cost of slightly lower NDIA billing rate per participant? Worth modelling.
2. **Cohort delivery medium.** All video, all in-person, or hybrid? In-person creates deeper relationships but constrains catchment. Hybrid (in-person quarterly + video weekly) is a likely sweet spot.
3. **Self-paced ratio.** This spec suggests ~2-3 hours/week. For participants with intellectual disability, this might need to be lower (more SW scaffolding). For autism participants who deep-work well, this might need to be higher.
4. **Pattern D thresholds.** When does "reduced capacity" become "disengagement"? The current proposal is "ping SW at <2 hours one week, flag for review at <2 hours three weeks running, manager review at <2 hours for 4 weeks." Adjust based on operational learning.

---

*This rhythm is what makes the SLES funding model coherent. Without it, AI Launchpad delivers ad-hoc activity that doesn't justify $22k/participant/year. With it, AI Launchpad delivers structured weekly engagement at SLES-level intensity.*
