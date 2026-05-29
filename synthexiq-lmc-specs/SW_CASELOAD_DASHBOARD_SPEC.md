# Support Worker Caseload Dashboard — Spec
## AI Launchpad LMC support-worker-facing front-end

**For:** the team building the SW dashboard (any framework — this spec is framework-neutral)
**Reads from:** SynthexIQ tRPC API (`trpc.lmc.sw.*` endpoints — Cowork will build)
**Audience:** support workers handling 50 participants × 2.5 events/week = 125 events/week. They need speed and clarity, not features.

**Hard time budget:** 8–12 minutes per async touchpoint reply. Anything that adds friction kills the program economics.

---

## Design principles

1. **Speed over polish.** A loud, plain button beats a subtle, designed one.
2. **One screen = one decision.** Don't make the SW remember which tab to be on.
3. **The right template at the right moment, every time.** SW should never search for which template applies.
4. **Crisis takes precedence.** Always. Even mid-reply.
5. **Keyboard shortcuts for everything.** The SWs who will love this dashboard live in the keyboard.
6. **Mobile-acceptable, desktop-first.** Most SWs work from a laptop. Mobile is for triage on the move.
7. **No animations on critical paths.** They cost time when the SW is in flow.
8. **Honest counters.** "12 pending, oldest 23h" beats "Lots to do!"

---

## Information architecture

```
/sw                      Caseload home (the queue)
/sw/participant/:email   Participant detail
/sw/touchpoint/:id       Review and reply
/sw/crisis               Crisis events (red banner on every page until resolved)
/sw/field-visits         Local SW field visit bookings
/sw/reports              Weekly performance + billing reconciliation
/sw/admin/manual-log     Manually log a free-text SW intervention as billable
```

---

## Page 1 — Caseload Home (the queue)

This is the page the SW lives on. Optimise relentlessly.

### Data (tRPC)
```
trpc.lmc.sw.caseloadOverview.query()
→ {
    participantCount: number,
    pendingTouchpoints: number,
    overdueCount: number,        // > 24h open
    crisisOpen: number,           // unresolved crisis_events
    weekToDate: { closedCount, avgResponseMins, billableHrs }
  }

trpc.lmc.sw.queue.query({ filter: "all" | "overdue" | "today" })
→ Array<{
    eventId: number,
    participantEmail: string,
    participantFirstName: string,
    moduleNum: number | "04b" | "CAxx",
    moduleTitle: string,
    touchpoint: "a" | "b" | "c",
    triggeredAt: ISO8601,
    minutesOpen: number,
    triggerPhrase: string,
    isSyncTouchpoint: boolean,     // sync calls don't get a template
    crisisFlag: boolean             // participant has unresolved crisis_event
  }>
```

### Layout

#### Top bar (sticky)
- Caseload counters as plain text: **`50 participants · 12 pending · 3 overdue · 0 crises`**
- Each is a tap target → filters the queue.
- Right side: SW first name + a "switch SW" picker (for managers covering staff leave).

#### Crisis banner (only visible when `crisisOpen > 0`)
- Full-width red. Tap → `/sw/crisis`. Not dismissable until resolved.

#### Queue
A tight list of rows. Each row = one open touchpoint:

```
🟡 Sarah K. · Mod 07 TP-B · Pricing My Stuff · 4h ago · TWEAK template ready · [REVIEW]
🟡 Tom M.   · Mod 19 TP-A · Reading Buddy   · 23h ago · ⚠️ OVERDUE · [REVIEW]
🔴 Aisha O. · Mod 21 TP-A · Hard Conversation · 1h ago · ⚠️ SAFETY FLAG · [REVIEW]
🟣 Ben P.   · Mod 09 TP-A · Sales Practice · — · SYNC voice call · [BOOK]
```

- Tap any row → opens `/sw/touchpoint/:id`
- Sort: crisis first, then overdue, then oldest first
- Filter chips: All / Overdue / Today / Mod 04B-12 / Mod 13-17 / Mod 18-24 / Sync only

#### Quick actions footer
- Big buttons:
  - **"Next in queue"** (J shortcut) → jumps to oldest non-sync open touchpoint
  - **"Manually log billable"** → admin form for free-text interventions > 5 min
  - **"My week"** → reports page

---

## Page 2 — Touchpoint Review and Reply

This is where the 8–12 minutes happens. The whole UX should support the SW finishing in that time.

### Data (tRPC)
```
trpc.lmc.sw.touchpointDetail.query({ eventId })
→ {
    eventId, participantEmail, participantFirstName,
    moduleNum, moduleTitle, touchpoint, touchpointTitle,
    triggerPhrase, triggeredAt, minutesOpen,
    isSyncTouchpoint, syncRequiredKind,  // "voice_call" | "video_call" | "in_person" | "group_workshop"
    learnerSubmissions: Array<{
      kind: "text" | "photo" | "voice_note" | "screenshot",
      url: string,
      sentAt: ISO8601,
      transcript?: string   // for voice notes
    }>,
    matchingTemplate: {
      id: string,                    // e.g. "TP-07-B"
      pattern: "approve_and_go" | "approve_with_tweak" | "reroute" | "celebrate" | "post_sync_wrap",
      body: string,                  // with [BRACKET] fields
      variants: Array<{ label, body }>
    },
    safetyFlags: Array<{ kind, message }>,   // e.g. crisis_events row, oversharing flag
    participantContext: {
      pastMilestones: string[],
      currentModule: number,
      streakDays: number,
      lastInteraction: ISO8601
    }
  }

trpc.lmc.sw.sendReply.mutate({
  eventId, finalBody, variantUsed, templateId
})
→ { ok, billingEventClosedAt, nextModuleUnlocked: number | null }
```

### Layout (left → right on desktop, stacked on mobile)

#### Left column: the learner's work
- Header: Participant first name + a small "Open profile" link
- The submission(s) rendered in order:
  - Photos: full-size, tap to expand
  - Screenshots: same
  - Voice notes: audio player + transcript below
  - Text: monospace block (it's often a paste from ChatGPT)
- Below: a "Notes from past touchpoints" expandable strip (last 3 only — context, not history)

#### Right column: the reply composer

**At the top — a one-line summary the SW reads first:**
```
Module 07 · Touchpoint B (15 min, async)
This learner sent: Claude's 3-tier price sheet
You are checking: tier prices match floor cost; tone is honest; reasoning is sound
```

**Template picker:**
- Big radio buttons for the variant:
  - ✅ APPROVE (default if pattern = `approve_and_go`)
  - ✏️ TWEAK
  - ↩️ REROUTE
  - ⚠️ SAFETY — drop template, escalate
- Below: the template body in an editable text area, pre-filled.
- `[BRACKET]` fields highlighted in yellow. The Send button is disabled until at least
  `[NAME]` is replaced. (If the SW edits the body manually, the validator looks for
  any `[…]` remaining.)

**Voice-note attach (for templates that require one):**
- A "Record voice note" button. 60s max. Visual countdown.
- Optional for templates with no voice note required; visible greyed out.

**Send block:**
- Big primary "Send reply" button (Cmd/Ctrl+Enter)
- Below: "What this does" — small text explaining: "Closes Touchpoint B for Module 7.
  If touchpoints A and C are also done, Module 8 unlocks for the learner."
- Secondary: "Reroute to voice call" → opens calendar booking

#### Sync-touchpoint variant
When `isSyncTouchpoint = true`, the right column changes:
- The template block is replaced with: **"This touchpoint requires a [voice / video / in-person] call. Book it, conduct it, then come back and log it."**
- Buttons: "📅 Book the call" / "✅ I conducted the call — log it"
- Logging: opens the post-call wrap-up template (same template picker, no `Send to bot`
  needed — just an internal note + billing event close).

#### Safety flags
Any item in `safetyFlags` renders as a full-width red box ABOVE the composer, with text
like: *"⚠️ This participant has an unresolved crisis_events row. Do NOT use a template.
Call them within 1 hour."* The Send button is disabled until the SW confirms acknowledgement.

### Keyboard shortcuts
| Key | Action |
|---|---|
| `J` | Jump to next item in queue |
| `K` | Jump to previous |
| `A` | Select APPROVE variant |
| `T` | Select TWEAK variant |
| `R` | Select REROUTE variant |
| `S` | Select SAFETY (disables template, escalates) |
| `Cmd/Ctrl + Enter` | Send reply |
| `Esc` | Back to queue (saves draft) |

### What the SW must NOT see
- Other SWs' caseload (unless they're a manager)
- Other participants' personal details
- Raw `crisis_events` rows for participants outside their caseload
- Stripe / billing-subscription data

---

## Page 3 — Crisis Events

Read this section twice. This is the page where the program either works or fails.

### Data (tRPC)
```
trpc.lmc.sw.openCrises.query()
→ Array<{
    crisisEventId, participantEmail, participantFirstName,
    telegramId, keywordMatched, messageSnippet, detectedAt,
    minutesSinceDetection, onCallNotifiedAt, resolved
  }>

trpc.lmc.sw.resolveCrisis.mutate({
  crisisEventId, resolutionNote: string,
  outcomeKind: "spoke_directly" | "referred_lifeline" | "referred_000" |
               "referred_internal_safeguarding" | "false_positive"
})
→ { ok }
```

### Layout
- Full red header: *"Crisis Events — Unresolved"*
- Count.
- One large card per crisis. Each card:
  - Participant first name + last 4 of email (for identification without exposing full)
  - Keyword matched (e.g. *"want to die"*)
  - First 200 chars of triggering message
  - Detected at + minutes elapsed (highlight if > 5 min)
  - Big buttons:
    - **"📞 Call them now"** → click-to-dial via the participant's stored phone
    - **"💬 Open Telegram"** → deep link to their chat
    - **"✅ Mark resolved"** → form: outcome kind + resolution note (mandatory, ≥50 chars)
- Footer: "Need help? Call your supervisor at [NUMBER]"

### Hard rule baked into the UI
A crisis cannot be marked resolved without a `resolutionNote ≥ 50 chars` AND an `outcomeKind` selected.
The "false_positive" option must be a deliberate click (it triggers a separate audit log).

---

## Page 4 — Participant Detail

Used when the SW needs context beyond a single touchpoint — e.g. before a sync call.

### Data (tRPC)
```
trpc.lmc.sw.participantProfile.query({ email })
→ {
    firstName, fullName, telegramHandle, phone,
    enrolledAt, currentModule, modulesCompleted, streakDays,
    consentStates: { dataProcessing, telegramMessaging, billingAudit, ndisDataSharing },
    accessibilityFlags: Array<string>,   // e.g. "low_literacy", "low_vision", "easy_read"
    nextActions: Array<{ moduleNum, touchpoint, dueDate }>,
    recentMilestones: Array<{ kind, achievedAt }>,
    crisisHistory: { totalEvents, lastResolvedAt }
  }
```

### Layout
- Header: name + first three accessibility flags as pill badges
- Three-column grid:
  - **Progress** — completed modules, current module, streak
  - **Consent** — 4 statuses; missing consents in red; tap to send re-request
  - **Past 30 days** — milestone timeline + crisis history (count + last resolved)
- A "Send a message" button → opens Telegram deep link

---

## Page 5 — Field Visits (Local SW)

Modules 11, 16, and 22 have local-SW touchpoints. Booking is separate from the regular SW workflow.

### Data (tRPC)
```
trpc.lmc.sw.localVisitRequests.query()
→ Array<{ eventId, participantEmail, moduleNum, suburb, postcode, requestedAt }>

trpc.lmc.sw.assignLocalVisit.mutate({
  eventId, localSwEmail, scheduledFor: ISO8601, durationMins
})
→ { ok }
```

### Layout
- List of unassigned local visit requests
- Each row: participant + module + suburb + how long it's been waiting
- Tap → assign to a local SW from a geographically-matched dropdown
- Calendar view of all assigned local visits this week

This page only handles assignment. The visit itself happens IRL and is closed by the regular SW
after debrief (as per the SW Reply Templates for TP-11-C and TP-16-B).

---

## Page 6 — Reports

### Data (tRPC)
```
trpc.lmc.sw.weekReport.query({ weekStarting: ISO8601 })
→ {
    closedEvents: number,
    avgResponseMins: number,
    overdueResolved: number,
    crisesHandled: number,
    billableHrs: number,           // sum of (closed - opened) for closed events
    capacityUtilisation: number,   // billableHrs / 38
    learnersMovedToNextModule: number
  }

trpc.lmc.sw.billingExport.query({ weekStarting, format: "csv" | "json" })
→ { downloadUrl }
```

### Layout
- Plain table at the top with the week's KPIs
- A weekly billing-reconciliation export button (CSV or JSON) → for the program manager
  to cross-check against NDIS claim submissions
- A "Capacity utilisation" gauge: green if 70–90%, yellow if 90–100%, red if >100% or <50%

---

## Cross-cutting features

### Notifications
- Browser push for: new crisis event in caseload, overdue touchpoint > 12h
- Email digest at 9am daily: queue summary + capacity utilisation
- SW can disable browser push but not crisis push

### Offline behaviour
- The dashboard requires connectivity. If offline, show a full-page banner:
  *"Offline — opening the bot in Telegram instead?"* with a deep link.
- Do NOT cache participant data locally (privacy + APP compliance).

### Auth
- SSO via the existing SynthexIQ JWT auth (already hardened — see AUDIT_NOTES Round 1).
- Role check: `users.role === "support_worker" OR users.role === "manager"`.
- Managers can switch into any SW's view (audit-logged).

### Audit trail
Every action is logged via `audit-trail-ndis`:
- Touchpoint reply sent (template + variant + final body)
- Crisis marked resolved (outcome + note)
- Field visit assigned (local SW + datetime)
- Participant viewed (for privacy audits)
- Caseload SW-switch (for management coverage tracking)

### Performance budget
- Caseload home loads in ≤1.5s on a 50 Mbps connection
- Touchpoint review page loads in ≤1.0s
- Template send round-trip ≤500ms
- Crisis resolve round-trip ≤500ms
- Total JS bundle ≤300 KB gzipped

---

## tRPC endpoints Cowork will need to build

```ts
// All scoped to logged-in SW via ctx.user; managers can pass a swEmail param

trpc.lmc.sw.caseloadOverview.query()
trpc.lmc.sw.queue.query({ filter })
trpc.lmc.sw.touchpointDetail.query({ eventId })
trpc.lmc.sw.sendReply.mutate({ eventId, finalBody, variantUsed, templateId })
trpc.lmc.sw.logSyncTouchpoint.mutate({ eventId, conductedAt, durationMins, note })
trpc.lmc.sw.openCrises.query()
trpc.lmc.sw.resolveCrisis.mutate({ crisisEventId, resolutionNote, outcomeKind })
trpc.lmc.sw.participantProfile.query({ email })
trpc.lmc.sw.localVisitRequests.query()
trpc.lmc.sw.assignLocalVisit.mutate({ eventId, localSwEmail, scheduledFor, durationMins })
trpc.lmc.sw.weekReport.query({ weekStarting })
trpc.lmc.sw.billingExport.query({ weekStarting, format })
trpc.lmc.sw.manualBillable.mutate({ participantEmail, durationMins, ndisLineItem, note })
```

---

## Out of scope (first release)

- SW chat / DM between SWs
- Multi-org tenancy (one program = one tenant for now)
- Custom report builder (CSV export covers it)
- In-app video calls (use external — Zoom, Google Meet, plain phone)
- Document upload from the dashboard (work comes in via Telegram only)
- AI-assisted reply suggestions (templates suffice — adding AI here adds cost and review burden)

---

## Acceptance criteria

- [ ] Caseload home renders 50 rows in ≤1.5s
- [ ] J/K keyboard navigation works on every browser tested
- [ ] Send-reply round-trip closes the `billing_events` row within 500ms
- [ ] Crisis banner appears on every page until the unresolved count reaches zero
- [ ] Resolve-crisis form refuses submission with <50-char note
- [ ] Capacity utilisation gauge matches manually-computed billing total
- [ ] CSV export contains: event_id, participant_email, module_num, touchpoint, ndis_line_item, opened_at, closed_at, duration_seconds — one row per closed event
- [ ] Lighthouse desktop score: Performance ≥90, Accessibility ≥95
- [ ] No PII in logs (participant emails redacted to first letter + last 4)
- [ ] All SW actions visible in the existing `audit-trail-ndis` 7-year retention log
