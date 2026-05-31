# Master Trigger Phrase Reference — AI Launchpad LMC
## Canonical registry of every billable trigger phrase across the program

**For:** the SynthexIQ bot command registry implementation + the SW dashboard template picker + the NDIA Audit Export
**Authority:** this document is the single source of truth for all trigger phrases. The LMC curriculum docs reference this; the trigger router regex matches this; the SW dashboard maps templates against this.
**Updates:** when any module is added, removed, or restructured, update this doc FIRST, then propagate to the curriculum and router code.

---

## Summary counts

| Category | Modules | Trigger phrases |
|---|---|---|
| Bridge — Year 1 entry | 2 (04B, 04C) | 6 |
| Year 1 official curriculum | 20 (05–24) | 60 |
| Year 2 official curriculum | 12 (25–36) | 36 |
| Year 1 cohort workshop variants | 10 modules × 1 each | 10 |
| Optional Affiliate Pathway (CA) | 6 sub-modules (CA-01 – CA-06) | 18 |
| **Total official** | 32 modules + 10 workshop variants + 6 CA | **130 phrases** |

NDIS line item assignment:
- Bridge + Year 1 + Year 2 official touchpoints: **Capacity Building — Skill Development**
- Cohort workshop variants: **Capacity Building — Group Skill Development (1:4 default)**
- CA pathway: **NOT NDIS-billable by default** (subject to plan-manager review)

---

## Trigger phrase format reference

```
/submit_modNN_[a|b|c]          ← individual touchpoint, Year 1 modules 05-24
/submit_mod04b_[a|b|c]         ← bridge module 04B (AI Tools Tour)
/submit_mod04c_[a|b|c]         ← bridge module 04C (Money & Benefits Rules)
/submit_modNN_[a|b|c]          ← Year 2 modules 25-36
/cohort_workshop_attended_<workshop_id>_<NN>[_b|c]   ← SW-only, group workshop
/submit_capath_NN_[a|b|c]      ← optional Affiliate (Compliance Agent) Pathway
```

Regex used in `triggerRouter.ts`:

```typescript
const BRIDGE_TRIGGER    = /^\/submit_mod04(b|c)_(a|b|c)$/i;
const OFFICIAL_TRIGGER  = /^\/submit_mod(\d{2})_(a|b|c)$/i;     // matches 05-36
const CA_TRIGGER        = /^\/submit_capath_(\d{2})_(a|b|c)$/i; // matches CA-01..CA-06
const WORKSHOP_TRIGGER  = /^\/cohort_workshop_attended_(\d+)_(\d{2})(?:_([bc]))?$/i;
```

Ranges:
- LMC_MODULE_RANGE: **{ min: 5, max: 36 }**  ← extended from 5-24 to include Year 2
- CA_MODULE_RANGE: { min: 1, max: 6 }
- BRIDGE: fixed at module_num=4, sub_key in {b, c}

---

## Year 1 Bridge + Official Course

| Module | Touchpoint A | Touchpoint B | Touchpoint C |
|---|---|---|---|
| **04B — AI Tools Tour (Bridge)** | `/submit_mod04b_a` | `/submit_mod04b_b` | `/submit_mod04b_c` |
| **04C — Money & Benefits Rules (Bridge — Hard Safety Gate)** | `/submit_mod04c_a` | `/submit_mod04c_b` | `/submit_mod04c_c` |
| 05 — Selling Online | `/submit_mod05_a` | `/submit_mod05_b` | `/submit_mod05_c` |
| 06 — Product Photos | `/submit_mod06_a` | `/submit_mod06_b` | `/submit_mod06_c` |
| 07 — Pricing My Stuff | `/submit_mod07_a` | `/submit_mod07_b` | `/submit_mod07_c` |
| 08 — Social Media 101 | `/submit_mod08_a` | `/submit_mod08_b` | `/submit_mod08_c` |
| 09 — My First Sale | `/submit_mod09_a` | `/submit_mod09_b` | `/submit_mod09_c` |
| 10 — Money Basics | `/submit_mod10_a` | `/submit_mod10_b` | `/submit_mod10_c` |
| 11 — Growing My Business | `/submit_mod11_a` | `/submit_mod11_b` | `/submit_mod11_c` |
| 12 — My Business Review | `/submit_mod12_a` | `/submit_mod12_b` | `/submit_mod12_c` |
| 13 — Affiliate Marketing Basics | `/submit_mod13_a` | `/submit_mod13_b` | `/submit_mod13_c` |
| 14 — Choose Your Products | `/submit_mod14_a` | `/submit_mod14_b` | `/submit_mod14_c` |
| 15 — Social Media for Affiliates | `/submit_mod15_a` | `/submit_mod15_b` | `/submit_mod15_c` |
| 16 — Community Networking | `/submit_mod16_a` | `/submit_mod16_b` | `/submit_mod16_c` |
| 17 — Track and Grow | `/submit_mod17_a` | `/submit_mod17_b` | `/submit_mod17_c` |
| 18 — Customer Care with AI | `/submit_mod18_a` | `/submit_mod18_b` | `/submit_mod18_c` |
| 19 — AI Reading Buddy | `/submit_mod19_a` | `/submit_mod19_b` | `/submit_mod19_c` |
| 20 — Your Online Home | `/submit_mod20_a` | `/submit_mod20_b` | `/submit_mod20_c` |
| 21 — Hard Conversations & Self-Advocacy | `/submit_mod21_a` | `/submit_mod21_b` | `/submit_mod21_c` |
| 22 — AI for Health & Wellbeing | `/submit_mod22_a` | `/submit_mod22_b` | `/submit_mod22_c` |
| 23 — Telling Your Story | `/submit_mod23_a` | `/submit_mod23_b` | `/submit_mod23_c` |
| 24 — Graduation: Your Next 12 Months | `/submit_mod24_a` | `/submit_mod24_b` | `/submit_mod24_c` |

**Year 1 subtotal: 22 modules × 3 = 66 phrases.**

---

## Year 2 Mastery & Sustain

| Module | Touchpoint A | Touchpoint B | Touchpoint C |
|---|---|---|---|
| 25 — Annual Business Plan | `/submit_mod25_a` | `/submit_mod25_b` | `/submit_mod25_c` |
| 26 — Repeat Customers | `/submit_mod26_a` | `/submit_mod26_b` | `/submit_mod26_c` |
| 27 — Your Money Goals | `/submit_mod27_a` | `/submit_mod27_b` | `/submit_mod27_c` |
| 28 — Hiring Your First Helper | `/submit_mod28_a` | `/submit_mod28_b` | `/submit_mod28_c` |
| 29 — Markets, Pop-ups & Stalls | `/submit_mod29_a` | `/submit_mod29_b` | `/submit_mod29_c` |
| 30 — Going Wholesale or B2B | `/submit_mod30_a` | `/submit_mod30_b` | `/submit_mod30_c` |
| 31 — Online Advertising 101 | `/submit_mod31_a` | `/submit_mod31_b` | `/submit_mod31_c` |
| 32 — Customer Reviews & Reputation | `/submit_mod32_a` | `/submit_mod32_b` | `/submit_mod32_c` |
| 33 — Tax & ABN Compliance | `/submit_mod33_a` | `/submit_mod33_b` | `/submit_mod33_c` |
| 34 — Mentoring a New Participant | `/submit_mod34_a` | `/submit_mod34_b` | `/submit_mod34_c` |
| 35 — Post-SLES Transition | `/submit_mod35_a` | `/submit_mod35_b` | `/submit_mod35_c` |
| 36 — Year 2 Graduation | `/submit_mod36_a` | `/submit_mod36_b` | `/submit_mod36_c` |

**Year 2 subtotal: 12 modules × 3 = 36 phrases.**

---

## Cohort Workshop Variants

Used by the SW to log a cohort workshop conducted, producing 4 simultaneous billing_events rows (one per attendee) at the Group Skill Development line item.

| Module | Workshop Variant | Used at |
|---|---|---|
| 06 — Photo workshop | `/cohort_workshop_attended_<id>_06` | 90 min, includes shooting + editing |
| 07 — Pricing workshop | `/cohort_workshop_attended_<id>_07` | 90 min, includes competitor scan |
| 08 — Social Media workshop | `/cohort_workshop_attended_<id>_08` | 90 min, content plan generation |
| 11 — Growth workshop | `/cohort_workshop_attended_<id>_11` | 90 min, ideation + flyer co-design |
| 12 — Business Review workshop | `/cohort_workshop_attended_<id>_12` | 90 min, quarterly review |
| 17 — Track & Grow workshop | `/cohort_workshop_attended_<id>_17` | 120 min (longer) |
| 18 — Customer Care workshop | `/cohort_workshop_attended_<id>_18` | 90 min, template + role-play |
| 22 — Health prep (partial) workshop | `/cohort_workshop_attended_<id>_22` | 60 min, educational only |
| 26 — Repeat Customers workshop (Y2) | `/cohort_workshop_attended_<id>_26` | 90 min, customer mapping |
| 29 — Market workshop (Y2) | `/cohort_workshop_attended_<id>_29` | 90 min, logistics + role-play |

**Workshop subtotal: 10 phrases (one per refactored module).**

The `<id>` is the `workshops.id` from migration 0019. The SW issues the command after the workshop is conducted; the trigger router fans out to create the billing_events rows for each cohort_member attending.

---

## Optional Affiliate Pathway (CA-01 to CA-06)

> ⚠️ NOT NDIS-billable by default. Opt-in only. Conflict-of-interest disclosure required (per Module 24 TP-B + Pathway opt-in flow).

| Sub-Module | Touchpoint A | Touchpoint B | Touchpoint C |
|---|---|---|---|
| CA-01 — NDIS Compliance | `/submit_capath_01_a` | `/submit_capath_01_b` | `/submit_capath_01_c` |
| CA-02 — AI Audit Scan | `/submit_capath_02_a` | `/submit_capath_02_b` | `/submit_capath_02_c` |
| CA-03 — Pricing & Closing | `/submit_capath_03_a` | `/submit_capath_03_b` | `/submit_capath_03_c` |
| CA-04 — Managing Clients | `/submit_capath_04_a` | `/submit_capath_04_b` | `/submit_capath_04_c` |
| CA-05 — Field Compliance Tools | `/submit_capath_05_a` | `/submit_capath_05_b` | `/submit_capath_05_c` |
| CA-06 — Selling the Full Stack | `/submit_capath_06_a` | `/submit_capath_06_b` | `/submit_capath_06_c` |

**CA subtotal: 6 sub-modules × 3 = 18 phrases.**

---

## Free-text firewall

Anything that does NOT begin with `/submit_` or `/cohort_workshop_attended_` is treated as **unbillable** by the bot. Free chat is always available.

A SW can manually log a free-text intervention as billable via the admin form (`trpc.lmc.sw.manualBillable.mutate(...)`) — but the firewall enforces a deliberate action, not automatic.

---

## Bot response on trigger receipt

```
"Got it! I've started the clock on your Touchpoint [A/B/C] for [MODULE LABEL].
Now send your work (screenshot, photo, or message) and your support worker will
reply soon. Free chat is always open — just don't use a trigger phrase unless
you're starting a touchpoint."
```

For cohort workshop trigger (sent to the SW only):
```
"Logged: cohort workshop conducted for Module [N], [X] participants attending.
Billing rows created at Group Skill Development (1:4) line item."
```

For CA pathway:
```
"Got it — Touchpoint [A/B/C] for Affiliate Pathway CA-[NN] started.
⚠️ Reminder: this pathway is not NDIS-billable by default. Pathway-only logging."
```

---

## Bot help commands (Unbillable, 24/7)

These are NOT trigger phrases; they're support commands the bot recognises:

| Command | What it does |
|---|---|
| `/help` | Lists this menu |
| `/start_module [N]` | Bot sends the current module's intro message |
| `/get_prompt mod[NN]_step[X]` | Bot sends the copy-paste AI prompt for that step |
| `/my_journey` | Shows participant's milestones across the program |
| `/my_progress` | Shows current SLES outcomes summary (the participant view) |
| `/book_local_visit` | Books a local SW field visit (Modules 11, 16, 22) |
| `/find_benefits_adviser [postcode]` | Returns local Welfare Rights Centre + free adviser numbers |
| `/income_test_calc [payment] [earning]` | Estimates Centrelink payment reduction |
| `/des_provider_lookup [postcode]` | Lists local DES providers |
| `/set_medication_reminder` | Module 22 — daily med reminder setup |
| `/decode this` (with photo attached) | Module 19 — Reading Buddy on a letter |
| `/log_business_time [duration]` | Self-employment hours logged (auto-counts toward Centrelink) |
| `/opt_in_peer_mentor` | Module 34 — joins mentor pool |
| `/log_mentor_checkin [name] [topic]` | Mentor activity logged |
| `/start_story` | Module 23 — voice-recorded story prompt |
| `/peer_support_info` | Sends paid peer support pathway info |
| `/cancel_local_visit` | Cancels a booked local visit |
| `/pause_affiliate_pathway` | Pauses CA pathway activity |
| `/exit_affiliate_pathway` | Withdraws from CA pathway |
| `/sles_end_date` | Reports days remaining in SLES funding |
| `/sustainability_check` | Runs sustainability math against current data |

---

## Implementation checklist for SynthexIQ

When this reference doc is consumed by the bot platform:

- [ ] Trigger router regex matches all four patterns above
- [ ] LMC_MODULE_RANGE updated to { min: 5, max: 36 } to include Year 2
- [ ] Bridge module handling extends to both 04B and 04C (per migration 0015)
- [ ] Workshop trigger routes to `handleCohortWorkshopTrigger` and produces fan-out
- [ ] Bot help command registry matches table above
- [ ] Free-text firewall: any message not matching trigger or help command is treated as unbillable AI Q&A
- [ ] Each trigger increments the billable event counter; admin dashboard shows total count per SW per week
- [ ] NDIS Audit Export includes the trigger phrase for every closed billing_events row

---

## Versioning

| Version | Date | Change |
|---|---|---|
| 1.0 | 2025-05 | Initial — Year 1 (Modules 05-24) only |
| 1.1 | 2026-04 | Added 04B bridge module |
| 1.2 | 2026-05 | Added CA pathway (CA-01 to CA-06) and renamed legacy 18-24 to optional pathway |
| 2.0 | 2026-05 | Added Year 2 (Modules 25-36) and 04C bridge + cohort workshop variants |

**Current version: 2.0.**

Future-proofing: trigger phrase namespace `/submit_mod[NN]_[a|b|c]` is exhausted at module 99. The next program expansion (Year 3?) would need a new prefix (e.g. `/submit_y3_mod[NN]_*`) to avoid collision.
