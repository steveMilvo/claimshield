# Local Support Worker Activation Spec
## AI Launchpad LMC — booking, conducting, billing field visits

**Purpose:** Define how participants get matched with a Local Support Worker for in-person field visits in Modules 11, 16, and 22. Includes the booking flow, travel claim line items, geographic matching, and reimbursement format.

**Modules that activate this flow:**
- **Module 11 — Growing My Business** → Touchpoint C: Local Field Visit (flyer drops, cafe visits)
- **Module 16 — Community Networking** → Touchpoint B: Local Field Visit (community group intro)
- **Module 22 — AI for Health & Wellbeing** → Optional: GP visit accompaniment (no scheduled touchpoint, on-request)

Plus on-request activations for: First market stall (Module 06/09), graduation events (Module 24).

**Capacity model:** Local SWs are a separate workforce from the regular caseload SWs. One regular SW manages 50 participants for async work. A pool of local SWs handles the in-person events as they're booked.

---

## Why this is separate from the regular SW caseload

- **Different qualifications.** Local SWs need community-mobility certifications, working-with-vulnerable-people clearances valid in the participant's state, and current first aid.
- **Different billing.** Travel is reimbursable on top of the billable hour. NDIS price guide treats this as a different line item.
- **Different scheduling.** Async touchpoints happen any time within 24h. Field visits need calendar slots, traffic time, weather contingency.
- **Different liability.** In-person interactions carry duty-of-care obligations that don't apply to text-based reviews.

---

## Database additions

### Migration 0017 — local SW workforce + visit records

```sql
-- File: drizzle/0017_local_sw_visits.sql

CREATE TABLE local_support_workers (
  id                INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  email             VARCHAR(255)   NOT NULL,
  full_name         VARCHAR(255)   NOT NULL,
  phone             VARCHAR(20)    NOT NULL,
  service_postcodes JSON           NOT NULL COMMENT 'Array of postcodes this SW services',
  state             ENUM('NSW','VIC','QLD','WA','SA','TAS','NT','ACT') NOT NULL,
  qualification_ref VARCHAR(64)    NOT NULL,
  wwvp_check_ref    VARCHAR(64)    NOT NULL COMMENT 'Working with vulnerable people clearance',
  wwvp_check_expiry DATE           NOT NULL,
  first_aid_expiry  DATE           NOT NULL,
  max_travel_km     INT UNSIGNED   NOT NULL DEFAULT 25,
  active            BOOLEAN        NOT NULL DEFAULT TRUE,
  created_at        DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_lsw_email (email),
  INDEX idx_lsw_state_active (state, active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE local_sw_visits (
  id                  INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  billing_event_id    INT UNSIGNED  NULL COMMENT 'FK to billing_events when applicable (Mod 11 TP-C, Mod 16 TP-B)',
  participant_email   VARCHAR(255)  NOT NULL,
  local_sw_email      VARCHAR(255)  NOT NULL,
  visit_kind          ENUM(
                        'mod11_growth_campaign',
                        'mod16_community_intro',
                        'mod22_health_accompaniment',
                        'mod06_first_market_stall',
                        'mod09_first_sale_standby',
                        'mod24_graduation',
                        'on_request_other'
                      ) NOT NULL,
  status              ENUM('requested','assigned','confirmed','conducted','cancelled','no_show') NOT NULL DEFAULT 'requested',
  requested_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  assigned_at         DATETIME      NULL,
  scheduled_for       DATETIME      NULL,
  conducted_at        DATETIME      NULL,
  duration_minutes    INT UNSIGNED  NULL,
  travel_distance_km  DECIMAL(6,2)  NULL COMMENT 'Round trip from SW base to visit location',
  participant_suburb  VARCHAR(100)  NOT NULL,
  participant_postcode VARCHAR(4)   NOT NULL,
  visit_address_obscured VARCHAR(255) NULL COMMENT 'Suburb + nearest cross street; never full street address in logs',
  outcome_notes       TEXT          NULL,
  cancellation_reason VARCHAR(255)  NULL,

  PRIMARY KEY (id),
  INDEX idx_lsv_participant (participant_email),
  INDEX idx_lsv_local_sw    (local_sw_email),
  INDEX idx_lsv_status_age  (status, requested_at),
  CONSTRAINT fk_lsv_billing FOREIGN KEY (billing_event_id) REFERENCES billing_events(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Why `visit_address_obscured`?** Full street addresses don't belong in the application database. The local SW knows the address (sent via secure channel at the time of visit), but the audit log stores suburb + nearest cross street only. This is a meaningful privacy reduction with minimal operational cost.

---

## Booking flow

### Step 1 — Participant initiates from the module page or Telegram

**Web client:** the Module 11/16/22 touchpoint card shows a "Book Local Visit" button when the touchpoint is reached. Tap → calls `trpc.lmc.bookLocalVisit.mutate({ moduleNum, touchpoint })`.

**Telegram:** alternatively `/book_local_visit` typed in chat. Bot replies: *"For which module? Reply with 11, 16, or 22."*

Either path creates a `local_sw_visits` row with `status = 'requested'`, `visit_kind` matching the module, and `participant_suburb`/`participant_postcode` pulled from the participant profile.

### Step 2 — System matches to a local SW

Server logic in `server/services/lmc/localSwMatching.ts`:

```typescript
async function findLocalSwCandidates(participantPostcode: string, state: string) {
  // 1. Get all active local SWs in the same state
  // 2. Filter to those whose service_postcodes JSON array includes
  //    the participant's postcode OR a postcode within their max_travel_km radius
  //    (use a simple postcode-distance lookup — Australia Post publishes free data)
  // 3. Filter out any SW whose qualification has expired
  //    (wwvp_check_expiry, first_aid_expiry both > today)
  // 4. Rank by: in-postcode > in-radius, then by current week's workload (ascending)
  // 5. Return top 3 candidates
}
```

### Step 3 — Regular SW assigns from the candidates

Caseload SW receives a notification: *"Local visit requested for [PARTICIPANT] — Module [N]."* Opens `/sw/field-visits`, sees 3 candidate local SWs, picks one, sets a scheduled datetime → `trpc.lmc.sw.assignLocalVisit.mutate(...)` (already in the dashboard spec).

The system:
- Sets `status = 'assigned'`, `assigned_at = NOW()`, `local_sw_email = chosen`
- Sends the local SW a Telegram + email notification with the participant first name, scheduled datetime, suburb + cross street, and a 1-paragraph briefing pulled from the module's touchpoint description
- Sends the participant a Telegram message: *"[Local SW first name] will visit you [DATETIME]. They'll bring [whatever the module needs — flyers / clipboard / etc.]."*

### Step 4 — Local SW confirms

Local SW receives the notification, taps "Confirm" or "Reschedule" in their own light dashboard. Confirmation sets `status = 'confirmed'`.

If reschedule: opens a 3-message negotiation thread with the regular SW.

### Step 5 — Day of visit

Bot sends both the participant and the local SW a 2-hour-before reminder.

Local SW arrives. Conducts the visit per the module's touchpoint description.

### Step 6 — Local SW logs the visit

Within 4 hours of the visit ending, local SW opens their dashboard and submits:

```ts
trpc.lmc.localSw.logVisit.mutate({
  visitId,
  conductedAt: ISO8601,
  durationMinutes: number,
  travelDistanceKm: number,    // round trip
  outcomeNotes: string,         // ≥100 chars; what was done, how it went
  participantPresent: boolean,
  followUpRequired: boolean
})
```

System:
- Sets `status = 'conducted'`, `conducted_at`, `duration_minutes`, `travel_distance_km`
- **If linked to a billing_event** (Mod 11 TP-C, Mod 16 TP-B): closes that billing event using the `handleSwReplyIfBillingOpen` flow from the trigger router. The matching SW Reply Template (TP-11-C, TP-16-B) is auto-populated in the regular SW's queue for a final summary message to the participant.
- Generates a separate **travel reimbursement claim record** (see next section).

### Step 7 — Regular SW closes the loop with the participant

Regular SW gets the notification: *"Local visit conducted for [PARTICIPANT]. Send the TP-11-C / TP-16-B follow-up template."* They pick the matching template (auto-suggested), customise, send. Module progresses normally.

---

## Travel claim line items

Travel is billed **separately** from the participant-facing service. It uses a different NDIS price guide line item.

### NDIS line item codes for travel

Verify exact codes against the current NDIS Pricing Arrangements and Price Limits.

| Travel kind | Indicative code shape | Notes |
|---|---|---|
| Provider travel (worker-only, no client) | `09_790_0117_6_3` *(structural)* | Travel TO the participant. Not all travel is claimable — depends on plan rules. |
| Non-labour-cost (kilometres at NDIA-set rate) | `09_795_0117_6_3` *(structural)* | Per-km rate set by NDIA (changes annually). Generally caps at ~30 minutes one-way provider travel. |

**Hard rule:** travel reimbursement is **only claimable if the participant's plan specifically allows for provider travel and non-labour costs**. Some plans don't.

### Travel reimbursement record

```sql
-- Part of migration 0017 above, separate table
CREATE TABLE travel_reimbursement_claims (
  id                    INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  local_sw_visit_id     INT UNSIGNED   NOT NULL,
  participant_email     VARCHAR(255)   NOT NULL,
  local_sw_email        VARCHAR(255)   NOT NULL,
  travel_distance_km    DECIMAL(6,2)   NOT NULL,
  travel_time_minutes   INT UNSIGNED   NOT NULL,
  km_rate_cents         INT UNSIGNED   NOT NULL COMMENT 'Frozen at time of claim; NDIA-set rate',
  total_claim_cents     INT UNSIGNED   NOT NULL COMMENT 'travel_distance_km * km_rate_cents (rounded)',
  ndis_line_item_code   VARCHAR(20)    NOT NULL,
  plan_allows_travel    BOOLEAN        NOT NULL COMMENT 'Pre-checked against participant plan; FALSE = do not lodge',
  status                ENUM('draft','submitted','approved','rejected','paid') NOT NULL DEFAULT 'draft',
  submitted_at          DATETIME       NULL,
  paid_at               DATETIME       NULL,

  PRIMARY KEY (id),
  INDEX idx_trc_visit (local_sw_visit_id),
  INDEX idx_trc_status (status),
  CONSTRAINT fk_trc_visit FOREIGN KEY (local_sw_visit_id) REFERENCES local_sw_visits(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

When a local SW logs a visit:
1. System checks `participant.plan_allows_travel` (a flag on the user record set during enrolment from the participant's plan)
2. If TRUE: generates a `travel_reimbursement_claims` row in `status='draft'`, calculates `total_claim_cents`
3. If FALSE: skips the row, surfaces a warning to the local SW: *"This participant's plan doesn't cover provider travel. Your km will not be reimbursed by NDIA — check with your manager about alternative reimbursement."*

The provider's billing officer reviews draft claims weekly, submits to the NDIA portal, and marks `submitted_at`. Payment receipt updates `paid_at`.

---

## Geographic matching specifics

### Postcode-to-postcode distance

Use the **Australia Post postcode geographic centroid data** (free download from data.gov.au). Calculate Haversine distance between two centroids.

```typescript
function postcodeDistanceKm(postcode1: string, postcode2: string): number {
  const c1 = POSTCODE_CENTROIDS[postcode1];
  const c2 = POSTCODE_CENTROIDS[postcode2];
  if (!c1 || !c2) return Infinity;  // unknown postcode = unmatchable
  return haversineKm(c1.lat, c1.lng, c2.lat, c2.lng);
}
```

This is a coarse but sufficient approximation. For door-to-door distance the local SW logs the actual travel_distance_km at visit completion.

### State boundaries

Never match a local SW to a participant in a different state — qualification credentials (especially the working-with-vulnerable-people check) are state-issued and don't carry over.

### Max travel distance default

25 km round-trip is the default `max_travel_km`. Local SWs in rural/regional areas can opt up to 75 km in their profile.

---

## Cancellation and no-show handling

### Cancellation by participant
Participant cancels via Telegram (`/cancel_local_visit`) or in the module page.

- More than 24h before scheduled time: `status = 'cancelled'`, no travel claim, no billing event opens. Local SW notified with apology.
- Less than 24h: `status = 'cancelled'`, `cancellation_reason = 'late_notice'`. A short-notice cancellation fee may apply per NDIS rules (verify with current price guide); separate line item.

### No-show
Local SW arrives, participant not present. After 15 min wait:
- Local SW logs visit with `participantPresent: false`
- `status = 'no_show'`
- Travel claim still generated (worker did travel)
- A safety check fires: bot messages the participant, regular SW called if no response in 30 min, escalates to a duty-of-care check if no response in 2 hours

### Cancellation by local SW
Local SW cancels (sickness, etc.). System re-runs matching with the previously-chosen SW excluded. Regular SW reassigns or reschedules.

---

## Honest scope notes

1. **The matching algorithm above is intentionally simple.** Postcode-centroid distance is fine for an MVP; a fancy route-API ride-sharing-style match is over-engineered for ~50 local SWs and ~125 visits/week.
2. **Travel pricing changes annually.** The `km_rate_cents` must be re-loaded from the NDIA price guide each July. Don't hardcode.
3. **Some participants live in plans that prohibit provider travel.** This is common and not a bug. Handle the "no travel claim possible" case gracefully — the visit still happens, the worker just doesn't get reimbursed by NDIA (the provider's operating budget covers it).
4. **Liability insurance for in-person visits** is a separate provider-level concern. Confirm coverage with the insurer before activating Local SW workflows for the first time.

---

## tRPC endpoints Cowork needs to build

```ts
// Participant-facing
trpc.lmc.bookLocalVisit.mutate({ moduleNum, touchpoint }) → { visitId }
trpc.lmc.cancelLocalVisit.mutate({ visitId, reason })

// Regular SW dashboard
trpc.lmc.sw.assignLocalVisit.mutate({ visitId, localSwEmail, scheduledFor })
trpc.lmc.sw.rescheduleLocalVisit.mutate({ visitId, newScheduledFor })

// Local SW dashboard
trpc.lmc.localSw.todaySchedule.query()
trpc.lmc.localSw.confirmVisit.mutate({ visitId })
trpc.lmc.localSw.logVisit.mutate({ visitId, conductedAt, durationMinutes, travelDistanceKm, outcomeNotes, participantPresent, followUpRequired })

// Billing officer
trpc.lmc.travel.draftClaims.query({ weekStarting })
trpc.lmc.travel.submitClaim.mutate({ claimId })
trpc.lmc.travel.markPaid.mutate({ claimId, paidAt })
```

---

## Acceptance criteria

- [ ] Participant in Module 11 can book a visit; system matches to ≥1 local SW in their postcode
- [ ] Local SW outside the participant's state never appears in matches
- [ ] Local SW with expired WWVP check never appears in matches
- [ ] Local SW with current week's workload over 20 hours ranked lower than less-loaded peers
- [ ] Linked billing_events row closes when local SW logs the visit (handleSwReplyIfBillingOpen fires)
- [ ] Travel claim row generates when participant plan allows; skips when it doesn't
- [ ] Travel rate per km matches the current NDIA price guide value
- [ ] No-show triggers a safety check (bot ping + SW call) on the right schedule
- [ ] Cancellation > 24h before generates zero charge; < 24h flags `late_notice`
- [ ] `visit_address_obscured` never contains a full street number
- [ ] All visit records appear in the 7-year audit retention via audit-trail-ndis
