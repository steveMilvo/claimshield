# Pip — Product Design (all tiers)

*Working title; the apprentice the child trains is "Pip." Naming TBD.*

**Strategic context:** Australia + NZ first (pre-wired US/UK/Canada) · teacher-led
B2B2C · lean team (2–4, <A$500k) · Primary-first, middle/senior on roadmap.

---

## 1. One-line pitch & core insight

**Pip is the first adaptive, individually-measured AI-literacy product for ages
5–11, where children don't *use* an AI — they *train a deliberately-fallible AI
apprentice*, learning to direct it, catch its mistakes, and correct it.**

**Core insight (what makes it revolutionary):** every other AI-in-education
product puts the child *below* the AI — the AI is the smart tutor, the child is
the recipient. That structurally breeds dependence and is impossible to assess
(you can't measure a skill the AI is doing *for* the child). **Pip inverts the
power relationship.** The child is the boss/teacher; the AI is the eager,
error-prone apprentice. This single inversion solves three problems at once:

- **Pedagogy:** it weaponises the *protégé effect / learning-by-teaching* (one of
  the most robust effects in the literature) — children learn more deeply when
  responsible for teaching another agent.
- **The dependence/cheating tension:** you cannot offload your thinking to an
  apprentice you are responsible for supervising and correcting. Authority sits
  with the child by design.
- **Measurement:** because the apprentice makes *controlled, planted* errors,
  "did the child catch it?" is a clean, scorable signal of critical-AI skill —
  not engagement theatre.

---

## 2. The AI-skills framework (competency ladder)

Anchored to **AI4K12's Five Big Ideas** (Perception, Representation/Reasoning,
Learning, Natural Interaction, Societal Impact) and the **UNESCO AI competency
framework**, collapsed into a **4-rung ladder** that's teachable and measurable:

| Rung | Skill | Plain-language "I can…" |
|---|---|---|
| **R1 Foundational literacy** | What AI is/isn't; it learns from data; it is confidently wrong | "I know Pip can make mistakes and isn't a person." |
| **R2 Direction & collaboration** | Instructing, decomposing, iterating | "I can tell Pip clearly what to do and fix my instructions when it goes wrong." |
| **R3 Critical judgement & ethics** | Catching errors, hallucination, bias, privacy | "I can spot when Pip is wrong, biased, or making things up — and prove it." |
| **R4 Creation & agency** | Building/solving *with* AI as a tool | "I can use Pip to make something I couldn't make alone, and I'm in charge." |

**How each rung deepens across tiers (same spine, rising sophistication):**

| Rung | Primary (5–11) | Middle (11–14) | Senior (14–18) |
|---|---|---|---|
| R1 | "Pip is fallible & not alive" via play | How models learn from data; training-bias intuitions | Tokenisation, probability, why hallucination is structural |
| R2 | Voice/choice-chip directions; "say it clearer" | Prompt design, task decomposition, iteration | Prompt engineering, tool/agent orchestration |
| R3 | Catch planted factual/bias errors ("Catch Pip's Mistake") | Verify AI claims **against real sources** | Evaluate model limits, detect deepfakes, data ethics |
| R4 | Co-make a story/poster, child directs | Build a small artifact with AI | Build + **orally defend** an AI-assisted project |

**Specialist vs generalist per tier:**
- **Primary → generalist.** Young children need transferable AI dispositions
  (skepticism, clear direction) across contexts. Practice ground = literacy +
  numeracy + "wonder" facts.
- **Middle & Senior → specialist.** Anchor in **Digital Technologies +
  source-based subjects (HASS/Science/English)** where "evaluate AI output against
  evidence" maps directly onto curriculum standards and there's white space.

---

## 3. Competitive landscape & white space

| Tool | What it does | What it does **not** do |
|---|---|---|
| **Khanmigo** | AI tutor that teaches subjects, ~11+, US | Doesn't teach *AI skills*; child below the AI; not primary; not AU/NZ |
| **MagicSchool / SchoolAI** | Teacher productivity + student chatbots | Teacher tools; no AI-literacy curriculum; no individual skill measurement |
| **Common Sense Education – AI Literacy** | Free static lessons/videos | Not a product, not adaptive, no personalisation, no measurement |
| **Day of AI / MIT RAISE** | Curriculum units, teacher-led | Episodic, not adaptive, not individually measured |
| **Experience AI (Google DeepMind + Raspberry Pi Foundation)** | Excellent free curriculum | Lesson plans, **11–14**, not adaptive software, no per-child measurement, not primary |
| **Synthesis Tutor** | Adaptive tutor for kids (math) | Teaches *math*, not AI skills |

**The unoccupied gap Pip owns:** an **adaptive, individually-personalised,
*measured*** AI-literacy product **for primary (5–11)** that builds the child as
**director/critic of a fallible AI**. On axes *(adaptive & measured ↔ static
curriculum)* × *(teaches AI skills ↔ teaches a subject)*, the **"adaptive +
teaches AI skills + primary"** cell is empty.

**Why competition is genuinely thin (not just unbuilt):**
1. **Primary is hard:** under-13 safety + pre/emerging readers force a voice-first,
   no-open-chat design most teams avoid.
2. **Measuring an *AI skill* (not subject knowledge) is unsolved** — incumbents
   measure neither. Our controlled-error design is the unlock.
3. **Incumbents are structurally the wrong shape:** AI-literacy players are
   curriculum nonprofits (no adaptive engine, aimed older); adaptive players are
   subject tutors (wrong goal, child-below-AI). Neither pivots cheaply.
4. **AU/NZ first** is itself white space — most activity is US/UK, aimed secondary.

---

## 4. Per-tier product design

### PRIMARY (5–11) — v1, go deep
- **Target user:** Year 3–4 (ages 8–9) at launch. Expand down (5–7, fully
  voice/icon) and up (10–11) later.
- **Scope:** **Generalist.** Practice ground = literacy comprehension + simple
  science/numeracy facts + "wonder" topics.
- **Curriculum anchor (AU/NZ):** ACARA v9 general capabilities **Critical &
  Creative Thinking** and **Digital Literacy** (+ English/Science content
  descriptors as the vehicle); NZ **Te Mātaiaho** Digital Technologies & "thinking"
  key competency. Pre-wired field-mapping for CCSS/ISTE+AI4K12 (US), England
  Computing PoS (UK), Canadian provincial.
- **Core learning loop — "Teach Pip":** mission tied to curriculum content →
  child directs Pip → Pip produces output that *sometimes* contains a **planted
  error** → child judges, catches, and teaches the correction → Pip "learns" and
  celebrates the child as a great teacher → system scores hit/miss/false-alarm +
  direction quality, updates the student model, adjusts next error subtlety.
- **Standout feature: "Catch Pip's Mistake."** Critical evaluation of AI turned
  into a voice-first game with clean signal-detection measurement.

### MIDDLE (11–14) — roadmap
- **User/anchor:** Years 7–8; **specialist** in **Digital Technologies + HASS/
  Science source analysis.**
- **Loop:** child *arms Pip with real sources* (retrieval) and must catch where
  Pip's claims aren't supported by the evidence; designs and iterates prompts.
- **Standout: "Source Showdown."** Practices ACARA "analyse & evaluate sources"
  *through* AI verification — a curriculum standard and an AI skill in one task.

### SENIOR (14–18) — roadmap
- **User/anchor:** **specialist**, exam-relevant subjects (English/Science extended
  response, Data/Digital Tech).
- **Loop:** student builds an AI-assisted artifact, then the system runs an
  **oral/process defence.**
- **Standout: "Defend Your Build."** An *integrity-positive*, AI-proof assessment:
  you may use AI heavily, but you must defend your process, choices, and the
  model's limitations — which is itself the assessed skill.

---

## 5. The personalization engine (the moat)

**Per-learner student model tracks:**
- **Detection mastery per error-type** (factual hallucination, over-confidence,
  bias/stereotype, fabricated source) — lightweight **Bayesian Knowledge Tracing**.
- **Direction quality:** clarity/specificity of instructions and *iteration*.
- **Calibration / trust posture:** discerning vs rejects-everything vs
  accepts-everything (the critical one).
- **Modality & load:** reading vs voice reliance, persistence, frustration signals.

**Adaptation logic (what changes):** error subtlety rises with mastery; error-type
mix targets the weakest rung; scaffolding fades (ZPD / scaffolding-fade);
previously-mastered types reappear on a spaced schedule (spaced retrieval).

**The measurement / mastery loop:** every interaction is a micro-assessment
because errors are *planted* (ground truth known) → score **hits, misses, false
alarms** → compute **d′ (signal-detection sensitivity)** to separate a genuinely
discerning child from one who just says "wrong" to everything. **Mastery =
sustained high d′ across error-types on *spaced* and *novel-context* items**
(transfer), not a streak. **Transfer probes** periodically run Pip in an
unpractised domain — catching errors there proves a transferable skill.

This is the difference from a GPT wrapper: **the task design itself generates the
assessment data.**

---

## 6. Technical architecture

**Components & which model does what:**
- **LLM (apprentice dialogue + *controlled* error generation):** Claude Haiku-class
  for cost. **We do NOT rely on the model's real hallucinations** — we **inject
  known errors** via a structured error spec, then a **verifier pass** confirms
  exactly one planted error is present. This de-risks the single hardest problem.
- **STT (essential for 5–9 in later phases):** Whisper / Deepgram with constrained
  intent grammar + choice-chip fallback (young-child ASR is a known weak point).
- **TTS (Pip's voice):** Azure / Cartesia / ElevenLabs.
- **Retrieval:** v1 = curated, curriculum-bounded content store (no open web for
  under-13 safety). Middle tier adds real-source retrieval.
- **Knowledge tracing:** in-house BKT + d′ scoring service.
- **Safety layer:** input on-rails (intents/choice chips, never open free-text to a
  raw LLM); output moderation + curriculum-bounds filter.
- **Vision/OCR (Phase 2):** child drawings/handwriting into the co-make loop.

```
        CHILD (voice / choice-chips, icon UI)
              │  intent + direction
              ▼
   ┌─────────────────────────┐     ┌──────────────────────┐
   │  ON-RAILS INPUT LAYER    │────▶│  STUDENT MODEL (BKT)  │
   │  STT + intent grammar    │     │  per-skill mastery,   │
   └─────────────────────────┘     │  d′, calibration      │
              │                     └──────────┬───────────┘
              ▼                                │ targets weak rung,
   ┌─────────────────────────┐                │ sets error difficulty
   │  TASK ORCHESTRATOR       │◀───────────────┘
   │  picks mission + ERROR   │
   │  SPEC (type, subtlety)   │
   └──────────┬──────────────┘
              ▼
   ┌─────────────────────────┐     ┌──────────────────────┐
   │  LLM (apprentice)        │────▶│  VERIFIER PASS        │
   │  generates Pip's output  │     │  confirms exactly one │
   │  realising the error spec│     │  planted error present│
   └──────────┬──────────────┘     └──────────┬───────────┘
              ▼ (passes safety/moderation + curriculum-bounds filter)
   ┌─────────────────────────┐
   │  TTS → Pip speaks/acts   │  child judges → catches/corrects
   └──────────┬──────────────┘
              ▼ hit/miss/false-alarm + direction quality
        SCORING ──▶ STUDENT MODEL update ──▶ TEACHER DASHBOARD
```

**v1 vs later:** v1 = "Catch Pip's Mistake" loop, choice-chips + TTS, one age band,
curated content, BKT+d′, teacher dashboard (no open chat, no retrieval, no vision).
Phase 2 = co-creation, vision/OCR, extend 5–7 and 10–11. Phase 3 = middle-tier
"Source Showdown" (retrieval), then senior "Defend Your Build."

**Hardest problems & de-risking:** (1) calibrated error injection → error-spec
templates + verifier pass + difficulty bands; (2) under-13 safety → on-rails input,
no free chat, moderation sandbox; (3) young-child ASR → constrained grammars +
choice-chip fallback; (4) pre-reader UX → voice-first, icon-driven.

---

## 7. Evidence & outcomes

**Claims:** measurable gains in (a) **AI-error detection sensitivity (d′)**,
(b) **calibrated trust**, (c) **direction/instruction quality.**

**Validation:** embedded pre/post using **novel transfer items** (proves skill, not
memorisation); **signal-detection scoring (d′ + criterion)** to rule out the
"says wrong to everything" artifact; **cluster-randomised trial by classroom**
(Pip vs a strong static-lesson control); independent efficacy study with an AU/NZ
university education faculty (marketing asset + procurement unlock).

**Teacher dashboard metrics:** per-child mastery by error-type, class heatmap,
"ready to level up" flags, durability/transfer indicators. No vanity engagement
metrics surfaced as outcomes.

---

## 8. Child safety, privacy, integrity & trust

- **Regulatory:** AU **Privacy Act / Australian Privacy Principles** + incoming
  **Children's Online Privacy Code**; NZ **Privacy Act 2020**; pre-wired for
  **COPPA, FERPA (US), UK-GDPR + Age-Appropriate Design Code, PIPEDA (Canada)**.
  Teacher-led B2B2C → the **school is the consent intermediary** (cleanest legal
  path for under-13).
- **Data minimisation:** avatar, **no real name required**; voice processed
  **ephemerally** by default, stored only with explicit school opt-in.
- **Content guardrails:** **no open chat**; input on-rails; output moderated +
  curriculum-bounded; Pip never volunteers open-world facts.
- **Hallucination control:** errors are controlled and labelled internally; the
  verifier ensures the child is never exposed to an *unplanned* falsehood — the
  only "wrong" things Pip says are ones we deliberately planted.
- **Anti-cheating / anti-dependence:** protégé framing puts authority with the
  child; mastery is measured on **transfer items with no AI assistance.** Senior
  tier's "Defend Your Build" makes AI use integrity-positive.
- **Oversight:** full transparency dashboard; teacher sets missions and sees every
  interaction; parent summary reports.
- **Accessibility:** voice-first supports pre-readers and dyslexia; WCAG 2.2 AA;
  multilingual incl. **te reo Māori** and community languages (AU/NZ differentiator).

---

## 9. MVP scope & 90-day build plan (lean: 2–4 people, <A$500k)

**Smallest version that proves the thesis:** *one* loop ("Catch Pip's Mistake"),
*one* age band (8–9), *one* capability rung (R3 critical judgement) over curated
literacy/science content, choice-chips + TTS, BKT+d′, a teacher dashboard.

**Deliberately cut from v1:** creation/co-make tools, vision/OCR, real-source
retrieval, the full 5–11 range, parent app, middle/senior tiers, native mobile,
open-ended chat (forever).

See [`docs/02-build-spec-catch-pips-mistake.md`](02-build-spec-catch-pips-mistake.md)
for the week-by-week plan.

**Riskiest assumption (kill-switch):** can 8–9-year-olds reliably catch
deliberately-planted AI errors, and does practice measurably raise transfer-item
d′? If not, the thesis is dead — find out cheaply in a 2-week classroom pilot.
Secondary risk: that controlled error-injection is reliable enough to measure.

---

## 10. Go-to-market wedge

- **Beachhead:** the **Year 3–4 teacher in AU/NZ** who feels pressure to "do
  something about AI" and has **no safe primary tool** that fits planning.
- **Distribution:** **free single-classroom teacher tier** (loop + dashboard),
  mapped to **ACARA Digital Literacy / Critical & Creative Thinking**; grow via
  teacher communities → school site licences; seed through a flagship partner (an
  AU state education innovation unit or an NZ **Kāhui Ako**).
- **AU adoption hook:** bundle **accredited teacher professional learning (PD/PLD)**
  — "earn PD by running Pip" is a powerful, low-cost wedge.
- **Pricing:** free for one class; school site licence ~**A$8–12/student/year** (or
  flat per-class), PD included. Direct-to-parent deferred.

---

## 11. Honest risks & failure modes

| Type | Risk | Mitigation |
|---|---|---|
| Pedagogical | Kids learn "everything AI says is wrong" (over-cynicism) | Mix true + false outputs; score **d′ + criterion**; reward catching truths |
| Pedagogical | No transfer — kids pattern-match practised content | Novel-context transfer probes built in from day one |
| Technical | Error injection mis-calibrated, or *unplanned* errors leak | Error-spec templates + verifier pass + difficulty bands (de-risk first) |
| Technical | Young-child ASR fails → frustration | Choice-chip fallback always available; push-to-talk; voice optional |
| Safety | Generative model says something inappropriate to a child | On-rails input, no open chat, output moderation + curriculum sandbox |
| Commercial | Primary hard to monetise; free→paid slow | Teacher-led free wedge + PD hook + site licences; lean burn extends runway |
| Commercial | An incumbent moves down into primary AI-literacy | Adaptive measurement engine + protégé mechanic is the defensible IP |
| Market | "AI for little kids" backlash | Lead with the inversion: "your child teaches and corrects a robot," not a chatbot |

---

## Central trade-off (stated plainly)

**Traded breadth and easy monetisation for white space and outcome integrity, and
traded "let kids freely use a powerful AI" for "kids direct a deliberately-fallible
apprentice on rails."** Primary is the hardest tier to monetise and most
safety-constrained — but it's the only cell with no real competitor, and the
protégé/controlled-error design is the only approach that produces a clean,
defensible measurement of an AI *skill* (d′ on planted errors). The on-rails
constraint that makes it *safe* for under-13s is the *same* constraint that makes
it *buildable by a lean team* and makes the *assessment fall out of the task for
free.* Safe, measurable, buildable — that triple coincidence is why this is the
version worth building.
