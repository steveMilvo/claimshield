# Pip — "Catch Pip's Mistake" — Build Spec v0.1

**Scope:** ages 8–9 (AU Yr 3–4 / NZ Yr 4–5) · R3 critical-judgement rung ·
pilot-ready by **31 Aug 2026** (~13 weeks from 3 Jun 2026)

**Upfront engineering opinion that shapes the whole spec:** *cut speech-to-text
from the proving MVP.* Young-child ASR is the second-biggest risk and is **not**
required to test the thesis. The child *directs* Pip via choice-chips and *judges*
via tap; Pip *speaks* via TTS (so pre/emerging readers aren't blocked). Voice input
becomes Phase 1.5 — after the core is proven. This removes a whole risk axis from
the August deadline.

---

## 1. The one thing this build must prove

> **A child gets measurably better at detecting AI errors, and that skill transfers
> to content they never practised — and we can plant errors reliably enough to
> measure it.**

**Two kill-switch questions the build answers:**
- **Engineering:** can the pipeline plant *exactly one*, difficulty-calibrated
  error ≥95% of the time? (verifier reliability)
- **Pedagogical:** do 8–9yos catch planted errors above chance, and does practice
  raise **transfer-item d′**?

---

## 2. The error-spec schema (the heart of the system)

Pip's outputs are **generated to realise a known error spec**, never trusted to
hallucinate on their own. Every turn is built from this object:

```jsonc
// ErrorSpec — the ground truth for one Pip output
{
  "item_id": "frog-diet-007",
  "topic_pack": "life-cycles-yr3",
  "curriculum_tag": "AC9S3U01",          // ACARA v9 content descriptor
  "prompt_to_child": "Ask Pip what frogs eat.",
  "ground_truth": ["Frogs eat insects, worms, snails and slugs."],
  "error": {
    "type": "FACTUAL_HALLUCINATION",     // see taxonomy below; or "NONE"
    "band": 2,                            // 1=blatant … 4=subtle/plausible
    "planted_claim": "Frogs eat small rocks to help digest food.",
    "why_wrong": "Frogs don't eat rocks; this is invented.",
    "catch_cue": "rocks"                  // the token(s) a correct child taps
  },
  "truth_decoys": ["Frogs catch food with a sticky tongue."]  // correct facts present, to test false alarms
}
```

**Error taxonomy (v1 — exactly these 5 + NONE):**

| Type | What it trains | Example (band 1 → band 4) |
|---|---|---|
| `FACTUAL_HALLUCINATION` | spotting invented facts | "frogs eat rocks" → "frogs can hold their breath for 3 hours" |
| `OVERCONFIDENCE` | distrusting false certainty / fake precision | "definitely 1,000,000 frogs" → "exactly 7 days to hatch" |
| `FABRICATED_SOURCE` | source skepticism | "the book *Frogs Are Cool*" → a real-sounding but invented author |
| `BIAS_STEREOTYPE` | spotting unfair generalisation | "only boys like frogs" → subtler gendered/cultural framing |
| `NONE` | **catching truths** (anti-cynicism control) | a fully correct output |

**Design rule:** ~**40% of items are `NONE`.** Without truth items you can't
measure false alarms, and you'd train kids to reject everything. This ratio is
non-negotiable and is what makes the measurement honest.

**Difficulty bands (1–4)** are an explicit field, not an emergent property — that's
what lets the adaptation engine (§6) turn one knob.

---

## 3. Generation + verification pipeline

Two LLM passes + a deterministic gate. **Recommended models: Claude Haiku**
(generator, cheap, high volume) **→ Claude Sonnet** (verifier). Content is
**curriculum-bounded** — the generator only sees the curated fact bank for the
topic pack, never the open web.

```
ErrorSpec ──▶ [GEN: Haiku] ──▶ candidate Pip output (kid-friendly, ~2–3 sentences)
                                   │
                                   ▼
                         [VERIFY: Sonnet]  checks 5 gates:
                           1. contains exactly ONE error (or zero if NONE)
                           2. the error matches type + planted_claim
                           3. catch_cue token is literally present
                           4. truth_decoys are factually correct
                           5. reading level ≤ Yr3 (word-length heuristic)
                                   │
                          pass ◀───┴───▶ fail → regenerate (max 3) → else drop item
                                   │
                                   ▼
                       [SAFETY GATE: deterministic + moderation API]
                       blocklist, PII scan, banned-topic filter
                                   │
                                   ▼
                          approved → cache to item bank (pre-generate offline!)
```

**Key engineering decision: pre-generate the item bank offline, don't generate
live.** You generate + verify items in batch, human-spot-check a sample, and serve
from a vetted bank at runtime. This (a) makes verifier reliability a *measurable,
fixable* number before any child sees it, (b) removes latency/cost/safety risk from
the live path, (c) makes the live app a simple content server. Live generation is a
Phase-2 luxury.

**Generator prompt (sketch):**
> You are writing a short answer *as Pip, a friendly robot apprentice*, for an
> 8-year-old. Use the FACTS provided. You MUST include exactly one mistake of type
> `{error.type}` at difficulty band `{band}`: specifically, claim that
> "{planted_claim}". Also include this correct fact: "{truth_decoys}". 2–3 short
> sentences. Cheerful, simple words. Do not hedge or signal that anything is wrong.

**Verifier prompt (sketch):**
> Here is the intended error spec and Pip's output. Answer strictly as JSON:
> `{exactly_one_error, error_type_matches, catch_cue_present, decoys_correct,
> reading_ok, notes}`. Be conservative — if unsure whether a second unintended
> error slipped in, return false.

**Verifier reliability is itself measured** against a human-labelled gold set (§11).
Target ≥95% on "exactly one error." If we can't hit it → kill-switch #1.

---

## 4. Content / mission model

- **v1 = ONE topic domain:** **"Living things & life cycles" (Yr 3 Science)** + a
  thin literacy layer (retell/comprehension). Rich in checkable facts, age-engaging,
  maps cleanly to ACARA `AC9S3U01` and NZ Science.
- **~80–120 vetted items** in the bank (enough for repeated play + spacing + a
  held-out transfer set).
- **Mission = a themed wrapper** around 6–8 items ("Help Pip make a Frog Facts
  poster"). Narrative gives purpose (protégé framing) without changing measurement.
- **Held-out transfer pack:** a *second* domain (e.g., "Weather" or "Materials")
  used **only** in pre/post probes — never practised. Catching errors here = proof
  of transfer, not memorisation.

---

## 5. Child-facing loop (UX spec)

**On-rails, voice-out / tap-in. No free text, ever.**

```
[1 MISSION]      Pip: "Let's make a Frog Facts poster! Ask me about frogs."
                  → child picks a direction chip:  [What do frogs eat?] [How do frogs grow?] …

[2 PIP RESPONDS]  Pip speaks (TTS) + text appears word-highlighted as read.
                  e.g. "Frogs eat insects and worms. They also eat small rocks to help digest food!"

[3 JUDGE]         Big buttons:  [👍 Pip's right!]   [🤔 Something's wrong]
                  If "wrong" → "Tap the bit that's wrong." (child taps a word/phrase = catch_cue test)

[4 CORRECT PIP]   If they caught it: choice of corrections → child "teaches" Pip.
                  Pip: "Ohh! Thank you, teacher — frogs don't eat rocks. I'll remember!"  (protégé payoff)

[5 FEEDBACK]      Lightweight: a "good catch!" streak, Pip levels up. NO grades shown to child.
                  Score event emitted → student model (§6).
```

**Interaction = a 2AFC + localisation task** → clean signal-detection data falls
out for free.

**Accessibility (WCAG 2.2 AA from day 1):** everything read aloud (TTS), word-level
highlight for tracking, OpenDyslexic option, large hit targets, no time pressure,
colourblind-safe, keyboard/switch navigable. These also *broaden the pilot* (EAL/D,
support needs).

---

## 6. Student model + scoring (the measurement engine)

**Per child, per error-type (5 skills) — Bayesian Knowledge Tracing:**

```
params per skill:  pL0=0.25 (prior known)  pT=0.15 (learn rate)
                   pSlip=0.10               pGuess=0.20
update after each item:
   if correct:  pL' = pL(1-pSlip) / [pL(1-pSlip)+(1-pL)pGuess]
   else:        pL' = pL·pSlip   / [pL·pSlip + (1-pL)(1-pGuess)]
   then:        pL_next = pL' + (1-pL')·pT
```
(Params are seeds; recalibrated from pilot data.)

**Discernment, not compliance — the d′ layer.** Per child (and per error-type),
over a rolling window:
```
H  = hits/(hits+misses)         FA = false_alarms/(FA+correct_rejections)
loglinear correction: add 0.5 to each cell (small-n stability for kids)
d' = z(H) − z(FA)               criterion c = −0.5·(z(H)+z(FA))
```
- **d′** = can the child tell error from truth? (the real outcome)
- **c** = bias: very negative c = "rejects everything" (cynic); very positive =
  "trusts everything" (credulous). **We surface both** — a high hit rate alone is
  meaningless if FA is also high.

**Mastery rule (per error-type):** `pL ≥ 0.85` **AND** `d′ ≥ 1.5` sustained across
**spaced** re-tests **and** at least one **novel-topic** item. Streaks alone never
confer mastery.

**Adaptation policy (one knob + one selector):**
- **Difficulty:** rolling detection high on current band → band+1; struggling →
  band−1 + scaffolding on (hint: "Pip looks unsure 🤔 — check the part about food").
- **Error-type selector:** weight next item toward the **lowest-mastery**
  error-type (softmax over `1−pL`), holding the **40% NONE** ratio.
- **Scaffolding fade:** hints auto-disable as mastery rises (ZPD).
- **Spacing:** mastered types re-surface on an expanding schedule (spaced retrieval).

---

## 7. Teacher dashboard

Teacher-led B2B2C → the **teacher is the buyer and the evidence consumer.** Minimum
viable dashboard:
- **Class heatmap:** mastery × error-type, per child.
- **"Watch" flags:** persistent credulous (high FA) or cynical (low c) children —
  *these are teachable moments, and they're the demo that sells the product.*
- **Growth view:** d′ over time, baseline → now.
- **Mission assignment + a 1-page "what this maps to" curriculum sheet**
  (ACARA/NZ tags) so it slots into planning.
- No child-facing grades; teacher-facing only.

---

## 8. Safety, privacy & integrity (implementation specifics)

- **No open chat. Ever.** Input is choice-chips/taps; output is from the pre-vetted
  bank. This single architectural choice removes most under-13 generative-AI risk.
- **Only planted errors reach children** — verifier + pre-generation guarantee no
  *unplanned* falsehood is presented as truth. ("The only wrong things Pip says are
  ones we chose for your child to catch.")
- **Privacy:** avatar only, **no real name / no PII from the child**; **school is
  the consent intermediary** (AU Privacy Act/APPs, incoming Children's Online
  Privacy Code; NZ Privacy Act 2020; pre-wired COPPA/FERPA/UK-AADC/PIPEDA).
  Telemetry keyed to opaque pseudonymous IDs.
- **No voice input in v1** → no biometric/voice data to govern (another reason the
  STT cut is right now).
- **Anti-dependence by design:** protégé framing puts authority with the child;
  mastery scored on **no-assist transfer items.**
- **Moderation:** deterministic blocklist + moderation API on every banked item;
  human spot-check of a sample before pilot.

---

## 9. Technical architecture (lean, matches the team's stack)

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind. TTS via Azure Speech
  or Cartesia.
- **Content pipeline (offline batch):** Node script → Anthropic SDK (Haiku gen,
  Sonnet verify) → JSON item bank in repo/DB + gold-set eval harness.
- **Backend:** lightweight API (Next route handlers) + **Postgres (Supabase)** for
  student model, item bank, telemetry. BKT/d′ as a small pure-TS service
  (deterministic, unit-testable).
- **Auth:** teacher accounts (email); children via class join-code + avatar (no PII).
- **No live LLM on the child path** in v1 → cheap, fast, safe, offline-capable.

```
[Offline]  ErrorSpecs ─▶ Haiku gen ─▶ Sonnet verify ─▶ safety gate ─▶ ITEM BANK (Postgres)
[Live]     Child(web) ─▶ Next API ─▶ serve item ─▶ judge event ─▶ BKT/d′ service ─▶ Postgres
                                                                       └─▶ Teacher dashboard
```

---

## 10. Measurement & pilot protocol

- **Design:** cluster-randomised by classroom, **3–5 Yr 3–4 classes**, ~75–120
  children. Control = a strong static AI-literacy lesson (e.g., Common Sense).
  (Underpowered for publication — adequate for a go/no-go signal; pre-register the
  analysis anyway.)
- **Primary endpoint:** gain in **transfer-pack d′** (novel domain, no practice).
- **Secondary:** criterion `c` (calibration), direction-quality, durability at a
  2-week spaced delay, teacher-reported usability.
- **Instruments:** identical pre/post built from the **held-out transfer pack**,
  scored by signal-detection. ~15–20 items, mixed error-types + NONE.
- **Ethics:** seek university partner + low-risk ethics clearance; school + parent
  information/consent via the school.

---

## 11. Week-by-week to 31 Aug (~13 weeks from 3 Jun)

| Wk | Dates | Deliverable | Gate |
|---|---|---|---|
| 1–2 | Jun 3–16 | ErrorSpec schema; topic pack #1 fact bank; **gen+verify pipeline + gold-set eval** | **Verifier ≥95% "exactly one error" → KILL-SWITCH #1** |
| 3 | Jun 17–23 | Pre-generate + human spot-check item bank (~100 items) + held-out transfer pack | ≥90% items pass human review |
| 4–5 | Jun 24–Jul 7 | BKT + d′/criterion service (unit-tested); adaptation policy | Deterministic tests green |
| 6–7 | Jul 8–21 | Child loop UI (choice-chip + TTS, on-rails) + accessibility | Internal walkthrough |
| 8 | Jul 22–28 | Teacher dashboard + telemetry; class join-code/avatar auth | End-to-end demo |
| 9 | Jul 29–Aug 4 | **Internal playtest (5–8 kids)**, difficulty-band calibration, bug-fix | Kids complete a mission unaided |
| 10 | Aug 5–11 | Safety/privacy review; consent flow; ethics + school sign-off | Clearance to run |
| 11–12 | Aug 12–25 | **Classroom pilot** (pre-test → ~2 weeks play → post-test) | Data collected |
| 13 | Aug 26–31 | Analyse d′ gain + transfer + calibration; **go/no-go writeup** | **KILL-SWITCH #2: transfer d′ gain > control** |

**Lean-team note (2–4 people):** Wk1–3 is the riskiest and most senior-eng-heavy
(pipeline + eval). If staffing is tight, the learning-scientist drafts fact
banks/error specs in parallel while the engineer builds the pipeline. The UI
(Wk6–8) is deliberately simple precisely so it isn't the bottleneck.

---

## 12. Riskiest assumption & kill criteria (honest)

- **#1 (Wk2):** can't reliably plant a single calibrated error → the whole
  measurement collapses. *Mitigation:* pre-generation + verifier + human gold set;
  if <95%, narrow error types or simplify bands before proceeding.
- **#2 (Wk13):** kids don't catch above chance, or catch but **don't transfer** →
  thesis fails. *Mitigation:* if detection is fine but transfer weak, add explicit
  reflection prompts ("how did you know?") — design that escape hatch in now.
- **Cynicism artifact:** kids learn "say wrong to everything." *Mitigation:* the
  40% NONE ratio + reporting criterion `c`; this is why d′ (not hit rate) is the
  endpoint.
- **ASR was never built** — by design; flagged so no one expects voice in the pilot.

---

## 13. Out of scope for this build (deliberately cut)

Speech-to-text input · live LLM generation on child path · creation/"co-make" tools
· vision/OCR · ages 5–7 and 10–11 · middle/senior tiers · multi-subject · parent app
· native mobile (web only) · Stripe/billing · te reo/multilingual (Phase 2).

---

## The two sacred rules

1. **Pre-generate + verify the item bank offline** — what makes it safe, cheap,
   measurable.
2. **Score with d′ + criterion, not hit rate** — what makes the outcome claim
   defensible.
