# SynthexIQ Capability Audit — AI Launchpad LMS

**Purpose:** Confirm what SynthexIQ can and cannot do before the Replit team builds modules 05–23 around it.
**How to use:** Hand to whoever owns SynthexIQ. Ask them to fill the **Can SynthexIQ Do This?** column with **YES / NO / PARTIAL / NEEDS BUILD**. Anything not YES becomes a design problem to solve before launch.
**Prepared:** May 2026 — Steve Milverton

---

## How to Read the Difficulty Column

- **🟢 Easy** — any modern bot framework handles this out of the box
- **🟡 Medium** — needs custom code but well-understood
- **🔴 Hard** — needs significant engineering, third-party integration, or regulatory work
- **⚫ Unknown** — depends entirely on SynthexIQ's architecture; I cannot estimate

---

## A. Core Bot Infrastructure

| # | Capability | Used in Modules | Difficulty | Can SynthexIQ Do This? | Fallback if NO |
|---|---|---|---|---|---|
| A1 | Run a Telegram bot account 24/7 in production | All | 🟢 | | Build separate bot using python-telegram-bot |
| A2 | Parse exact-match slash commands (`/submit_modNN_[a\|b\|c]`) | All 19 modules × 3 = 57 commands | 🟢 | | — |
| A3 | Differentiate free-text messages from slash commands | All | 🟢 | | — |
| A4 | Store events in a persistent database (not in-memory) | All | 🟢 | | Replit Postgres |
| A5 | Send pre-written text + media to a user on demand | All | 🟢 | | — |
| A6 | Push notifications to a specific support worker's Telegram | All | 🟢 | | — |
| A7 | Handle 50+ concurrent active learners per support worker | All | 🟡 | | Rate-limiting + queue |

---

## B. NDIS Billing Audit Trail (CRITICAL — program won't be compliant without this)

| # | Capability | Used in Modules | Difficulty | Can SynthexIQ Do This? | Fallback if NO |
|---|---|---|---|---|---|
| B1 | Log event start timestamp (when trigger phrase received) | All 57 touchpoints | 🟢 | | — |
| B2 | Log event end timestamp (when SW replies) | All 57 touchpoints | 🟡 | | — |
| B3 | Tag each event with NDIS line item ("Capacity Building — Skill Development") | All | 🟢 | | — |
| B4 | Tamper-proof audit log (append-only, signed) | All | 🔴 | | Use external append-only log service |
| B5 | Export billing data in format the NDIA accepts on audit | All | 🔴 | | Manual export to provider's billing system |
| B6 | Reconcile bot-logged events with provider's claim submissions | All | 🔴 | | Manual cross-check weekly |
| B7 | Flag events where SW never replied (no end timestamp) | All | 🟡 | | SLA dashboard |
| B8 | Separate line-item logging for Local Field Visits (Modules 11, 16, 22) | 11, 16, 22 | 🟡 | | — |
| B9 | Group workshop billing (4 learners × 15 min each) | 12, plus 02B carry-forward | 🟡 | | — |
| B10 | Recurring weekly billable event (Money Tracker) | 10 onward | 🟡 | | Cron job |

---

## C. Support Worker Workflow

| # | Capability | Used in Modules | Difficulty | Can SynthexIQ Do This? | Fallback if NO |
|---|---|---|---|---|---|
| C1 | Caseload view: all 50 participants and their state | All | 🟡 | | Replit-built dashboard |
| C2 | Queue of pending touchpoints awaiting SW reply, sorted by age | All | 🟡 | | — |
| C3 | Templated reply library (one click → send) | All | 🟢 | | — |
| C4 | SLA timer: alert if SW hasn't replied within X hours | All | 🟡 | | — |
| C5 | SW can manually log a free-text conversation as billable when needed (>5 min intervention) | All | 🟡 | | Admin form |
| C6 | Reassign a touchpoint to a different SW (when on leave) | All | 🟡 | | — |
| C7 | On-call roster for after-hours urgent issues | All | 🔴 | | Manual rota + duty phone |

---

## D. Module Progression & State

| # | Capability | Used in Modules | Difficulty | Can SynthexIQ Do This? | Fallback if NO |
|---|---|---|---|---|---|
| D1 | Per-learner state: which module, which touchpoints completed | All | 🟢 | | — |
| D2 | Unlock next module only when all 3 touchpoints are REPLIED to (not just submitted) | All | 🟡 | | — |
| D3 | Cohort-level progress view for program coordinators | All | 🟡 | | — |
| D4 | Send reminder to learners stuck >48 hours | All | 🟢 | | — |
| D5 | Send reminder to SWs with overdue replies | All | 🟢 | | — |

---

## E. AI-Powered User Assistance (Free-Text Bot Replies)

| # | Capability | Used in Modules | Difficulty | Can SynthexIQ Do This? | Fallback if NO |
|---|---|---|---|---|---|
| E1 | LLM-powered Q&A in plain English (Year 6 reading level) | All | 🟢 | | Claude API wrapper |
| E2 | Send the right copy-paste AI prompt for the current module | All | 🟢 | | Hard-coded prompt library |
| E3 | Resend a prompt the learner has lost | All | 🟢 | | — |
| E4 | Explain "why was my listing rejected" type questions | 05, 06, 08 | 🟢 | | — |
| E5 | Image analysis: "is this photo too dark / well-lit?" | 06 | 🟡 | | Claude vision API |
| E6 | Image comparison: "did AI change the product?" (before vs after) | 06 | 🔴 | | SW reviews manually in Touchpoint B |

---

## F. Reading Buddy & Accessibility (NEW — proposed Module 19)

| # | Capability | Used in Modules | Difficulty | Can SynthexIQ Do This? | Fallback if NO |
|---|---|---|---|---|---|
| F1 | Accept a PDF or photo of a letter and translate to Year 3 plain English | Proposed 19 | 🟡 | | Claude vision + Claude text |
| F2 | Voice-mode: learner sends voice message, bot replies with voice | Proposed 19, daily life | 🔴 | | Whisper STT + ElevenLabs TTS bolt-on; OR direct OpenAI Realtime API |
| F3 | Live image description (for low-vision learners) | Accessibility | 🟡 | | Claude vision |
| F4 | Live caption transcription (for hearing-impaired learners on voice calls) | Accessibility | 🔴 | | Use Zoom/Teams built-in captions for sync calls |
| F5 | Scam detection on suspicious texts/emails learner forwards | Proposed 19, daily life | 🟡 | | Claude classifier |

---

## G. Self-Advocacy Tools (NEW — proposed Module 21)

| # | Capability | Used in Modules | Difficulty | Can SynthexIQ Do This? | Fallback if NO |
|---|---|---|---|---|---|
| G1 | Draft a formal email from a rough voice/text input | Proposed 21 | 🟢 | | — |
| G2 | "Rehearsal mode" — role-play a hard conversation (landlord, GP, planner) | Proposed 21 | 🟢 | | Claude with persona prompt |
| G3 | Store the learner's drafts so they can revisit before sending | Proposed 21 | 🟢 | | — |

---

## H. Website & E-commerce Integration (NEW — proposed Module 20)

| # | Capability | Used in Modules | Difficulty | Can SynthexIQ Do This? | Fallback if NO |
|---|---|---|---|---|---|
| H1 | Surface "Build my website" link to Carrd / Wix AI / Framer | Proposed 20 | 🟢 | | Just a link, not bot work |
| H2 | Help learner choose a website tool based on their business | Proposed 20 | 🟢 | | LLM Q&A |

---

## I. Safety, Escalation & Duty of Care (REGULATORY)

| # | Capability | Used in Modules | Difficulty | Can SynthexIQ Do This? | Fallback if NO |
|---|---|---|---|---|---|
| I1 | Detect mental-health / suicide / self-harm keywords | All | 🟡 | | Claude classifier |
| I2 | Escalate detected crises to on-call SW within 5 minutes | All | 🔴 | | Manual SMS rota |
| I3 | Link to Lifeline / 13YARN / 1800RESPECT when crisis detected | All | 🟢 | | Hard-coded reply template |
| I4 | Detect abuse disclosure and trigger NDIS Quality & Safeguards Commission report | All | 🔴 | | Manual SW review + program manager review |
| I5 | Log every interaction for duty-of-care audit | All | 🟡 | | — |
| I6 | Do NOT diagnose, medicate, or provide therapy via bot (guardrail) | All | 🟡 | | System prompt constraint |

---

## J. Privacy, Data & Hosting (REGULATORY)

| # | Capability | Used in Modules | Difficulty | Can SynthexIQ Do This? | Fallback if NO |
|---|---|---|---|---|---|
| J1 | NDIS participant data stored in Australia (data residency) | All | 🔴 | | **Telegram itself stores messages on overseas servers — this may be a blocker for NDIS data sovereignty requirements. Get legal advice.** |
| J2 | Documented consent and data-sharing agreement per learner | All | 🟡 | | Onboarding flow |
| J3 | Right to erasure: delete all of a learner's data on request | All | 🟡 | | — |
| J4 | Encryption at rest and in transit | All | 🟢 | | Standard practice |
| J5 | Telegram bot complies with Australian Privacy Principles | All | ⚫ | | Legal review required |

---

## K. Local Support Worker Field Visits

| # | Capability | Used in Modules | Difficulty | Can SynthexIQ Do This? | Fallback if NO |
|---|---|---|---|---|---|
| K1 | "Book Local Visit" button surfaces in modules 11, 16, 22 | 11, 16, 22 | 🟢 | | — |
| K2 | Match learner to nearest available local SW (geographic) | 11, 16, 22 | 🟡 | | Manual matching |
| K3 | Calendar booking with confirmations | 11, 16, 22 | 🟡 | | Calendly link |
| K4 | Travel-claim logging for local SW (separate from billable hour) | 11, 16, 22 | 🟡 | | — |

---

## L. UI / Front-End Integration

| # | Capability | Used in Modules | Difficulty | Can SynthexIQ Do This? | Fallback if NO |
|---|---|---|---|---|---|
| L1 | "Send to Support Worker" button in module page pre-fills trigger phrase in Telegram compose box | All | 🟡 | | **Test on iOS, Android, desktop separately — Telegram deep-linking behaves differently per platform.** |
| L2 | Copy-to-clipboard button on every AI prompt block | All | 🟢 | | — |
| L3 | Module page reflects live touchpoint state (tick when SW replies) | All | 🟡 | | Webhook from bot to Replit |
| L4 | Voice-input button for low-literacy learners on every text field | All (accessibility) | 🟡 | | Browser native Web Speech API |

---

## Cross-Cutting Questions for the SynthexIQ Team

If the answer to any of these is unclear, do not build the modules yet:

1. **What is SynthexIQ, exactly?** Is it (a) a bot framework, (b) an LLM agent platform, (c) a custom-built product, (d) something else? What's the underlying tech stack?
2. **Who runs it and where is the data hosted?** This is the J1 question — non-negotiable for NDIS billing.
3. **What's the SLA / uptime guarantee?** If the bot goes down for a day during business hours, what happens to the 50 active learners?
4. **Can the SynthexIQ team build new features for us, and at what cost / timeline?** Or is it a "what you see is what you get" product?
5. **Is there a sandbox / test environment** we can wire Module 05 into before committing to the full 19?
6. **Per-message cost** if it's LLM-backed — at 50 learners × multiple daily messages, what does this cost monthly?
7. **Logs export format** — what does the audit log look like, and will an NDIS auditor accept it?

---

## Recommended Next Steps

1. **Send this audit to the SynthexIQ owner.** Get every row filled in.
2. **Triage:** sort capabilities into:
   - ✅ SynthexIQ does it → build per module spec
   - 🔧 SynthexIQ can build it → scope and price
   - 🟥 Cannot do, must replace → either build in Replit, use a different tool, or remove from modules
3. **Build a thin slice first.** Wire up Module 05's three touchpoints end-to-end (trigger phrase → log → SW notify → reply → log close → unlock Module 06). Test with one real SW and one real participant. Validate the billing log is acceptable. **Only then** roll out modules 06–23.
4. **Get legal sign-off** on Section J (data residency, privacy, consent) before any real participant data hits Telegram.
5. **Get duty-of-care sign-off** on Section I before launch — this is the section that will be examined if something goes wrong.

---

*Anything marked 🔴 Hard or ⚫ Unknown is a meaningful project risk. Treat each as a small project of its own before building the LMS around it.*
