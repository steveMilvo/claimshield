# ER Advisor — Technical & Product Spec

> Working name: **ER Advisor** (a.k.a. "PolicyPilot"). A chat-based assistant that
> advises people-leaders on employee-relations, industrial-relations and policy
> questions, grounded in official government source material and **citing the
> exact provision** behind every piece of advice.
>
> Status: **design draft** for review. No application code yet — this document
> defines the architecture before we build.
>
> Home: a new module inside the ClaimShield repo, reusing its Claude / document
> plumbing. AU-first, architected for multi-jurisdiction (US/UK) the same way
> ClaimShield already is.

---

## 1. The problem

Line managers and junior P&C staff make high-stakes employment decisions
— performance management, termination, redundancy, leave, flexible-work
requests, disciplinary process — without reading the legislation, the award, or
the policy. Getting it wrong is expensive: unfair dismissal, general-protections
(adverse action) claims, underpayments, WHS breaches, discrimination complaints.

The information they need is **public and authoritative**:

- Fair Work Act 2009 (Cth) and the National Employment Standards (NES)
- Modern awards (122 of them) and enterprise agreements
- Fair Work Commission (FWC) decisions
- Fair Work Ombudsman (FWO) guidance
- WHS Acts / Regulations (model + state variants)
- Anti-discrimination statutes (federal + state)
- WGEA reporting obligations

The value of the tool is **not "the answer"** — it's **the defensible, cited
answer**: *"Per s.387 of the Fair Work Act, in considering whether a dismissal
was harsh, unjust or unreasonable the FWC must take into account whether there
was a valid reason relating to capacity or conduct… so before proceeding you
should ensure X, Y, Z."* A manager can act on, and stand behind, a cited answer.

## 2. Users & jobs-to-be-done

| User | Job |
|---|---|
| Line manager | "Can I performance-manage / dismiss / refuse this request, and how, without creating risk?" |
| P&C Advisor / BP | "Give me the grounded position fast, with the section reference, so I can advise the manager." |
| HR leader (buyer) | "Reduce ER risk and advisory load across the org; keep an auditable trail of advice given." |

Primary persona = **the senior People & Culture advisor / leader** (exactly the
role in the brief that prompted this): someone who needs to give fast,
defensible, evidence-backed guidance at scale and uplift the capability of the
managers around them.

## 3. Scope

**Phase 1 (this spec): Australia, Fair Work core.**
Fair Work Act + NES + unfair dismissal + general protections + a seed set of the
most common modern awards. Architected — like ClaimShield's `jurisdiction.ts` —
so US/UK and broader AU domains (WHS, WGEA, anti-discrimination, state systems)
slot in later without rework.

**Explicitly out of scope (for now):** representing anyone, lodging applications,
or anything that constitutes legal practice. This is an **information and
decision-support tool, not legal advice** — the same framing ClaimShield uses
("your policy says X", never "you must do X"). See §9.

## 4. Core UX — the conversation

The flow is deliberately **triage-first**, because employment outcomes are
extremely fact-dependent. The bot does not answer until it knows enough.

```
1. Manager states the issue in plain language
        │
        ▼
2. CLARIFYING TRIAGE  (structured questions, asked conversationally)
   - Employee type: permanent / casual / fixed-term / contractor?
   - Award or enterprise agreement coverage? (changes everything)
   - Tenure & business size? (min employment period, Small Business Fair
     Dismissal Code)
   - The actual issue: conduct / capacity / redundancy / leave / flexible work…
   - Jurisdiction: national system vs state (esp. WA, public sector)
   - What has happened / been said so far?
        │
        ▼
3. RETRIEVE  — pull the relevant provisions from the versioned KB
   (the right Act sections, award clauses, FWO guidance) for THIS fact pattern
        │
        ▼
4. GENERATE  — Claude drafts advice using ONLY the retrieved source text,
   emitting native Citations that point at the exact passage
        │
        ▼
5. VERIFY  — second pass checks every legal/factual claim against the
   retrieved source; unsupported claims are stripped or down-graded to
   "general guidance, not a cited provision"
        │
        ▼
6. PRESENT  — the answer, each claim tagged with its citation
   ("s.387 Fair Work Act 2009 (Cth), as at <date>"), plus:
   - a clear next-steps checklist
   - a risk flag (e.g. "minimum employment period not met → no unfair
     dismissal exposure, BUT general-protections still applies")
   - a standing "not legal advice / consider getting advice for high-risk
     matters" disclaimer
```

A guided intake like this already exists in spirit at `src/app/start/page.tsx`;
the triage step is the conversational evolution of it.

## 5. Architecture

### 5.1 The three hard parts (why most of these tools fail)

1. **Hallucinated citations.** Asked from memory, an LLM will confidently cite
   section numbers that are wrong or don't exist. The *only* robust fix is
   **retrieval-grounded generation**: the model quotes from source text we
   actually retrieved, never from parametric memory.
2. **Stale knowledge base.** Legislation is amended; awards are updated
   (annual wage review, etc.); FWC hands down new decisions. A silently-stale
   KB gives confidently-wrong advice. Every chunk must carry a source URL,
   retrieval date and version, so every answer is "as at <date>".
3. **No verification.** The differentiator the user explicitly asked for: a
   second pass that checks each claim against its source before the user ever
   sees it.

### 5.2 Knowledge base & ingestion pipeline

```
official source (legislation.gov.au, fairwork.gov.au, fwc.gov.au)
   │  scheduled fetch (dated)
   ▼
raw store (immutable, versioned)  ──► {sourceId, url, fetchedAt, version, sha256}
   │  parse + structure-aware chunk (by section / clause, NOT fixed tokens)
   ▼
chunks: { id, sourceId, citationLabel ("s.387"), text, heading,
          effectiveFrom, supersededBy?, embedding }
   ▼
vector + keyword index (hybrid retrieval)
```

Key decisions:

- **Structure-aware chunking.** Legislation has natural units (sections,
  subsections, award clauses). Chunk on those, not arbitrary token windows, so a
  citation maps to a real, whole provision.
- **Hybrid retrieval** (semantic + keyword/BM25). Legal queries lean heavily on
  exact terms ("redundancy", "casual conversion", "s.119") — pure vector search
  under-performs here.
- **Versioning is first-class.** A chunk is never overwritten; new versions are
  added with `effectiveFrom` / `supersededBy`. Answers always state the
  as-at date.
- **Awards are large and numerous** — Phase 1 seeds only the few highest-traffic
  awards; the schema supports the full set.

For the MVP/demo we can seed a **small, hand-picked KB** (NES summary, the
unfair-dismissal and general-protections provisions, 1–2 awards) to prove the
end-to-end loop before investing in the full ingestion pipeline.

### 5.3 Generation with native Citations

ClaimShield already calls Claude via `@anthropic-ai/sdk` with structured outputs
(`src/app/api/analyze/route.ts`). ER Advisor uses the same SDK but adds the
**native Citations** feature: retrieved chunks are passed as `document` content
blocks with `citations: { enabled: true }`, so Claude returns answer text with
citation spans pointing back at the exact source passage. This is the mechanism
that makes "according to s.387…" *true* rather than plausible.

The system prompt enforces the rules:
- Answer **only** from supplied sources; if the sources don't cover it, say so
  and recommend escalation — never fill the gap from memory.
- Every legal proposition must carry a citation.
- Information tool, not legal advice; "the Act says X" framing.

### 5.4 The verification pass (the differentiator)

After generation, a second Claude call (or a structured-output grader) receives
the draft answer **and** the retrieved sources, and for each claim returns:

```ts
type ClaimCheck = {
  claim: string;
  citation: string | null;       // e.g. "s.387 FW Act"
  supported: "supported" | "partial" | "unsupported";
  sourceQuote: string | null;    // the exact text that backs it
  note: string | null;
};
```

Rendering rule:
- `supported` → show with its citation.
- `partial` → show, flagged "general guidance".
- `unsupported` → **strip** from the answer (or hold behind a "model says, not
  grounded" disclosure). Never present an unsupported legal claim as fact.

This mirrors ClaimShield's `FindingSchema` (which already pairs a claim with a
nullable `citation`) but adds the grounding check ClaimShield doesn't do today.

### 5.5 Data model (sketch)

```ts
// Reuses the JURISDICTIONS pattern from src/lib/jurisdiction.ts
type Conversation = {
  id: string;
  jurisdiction: Jurisdiction;          // "AU" first
  facts: TriageFacts;                  // employee type, award, tenure, issue…
  turns: Turn[];
};

type AdvisoryAnswer = {
  summary: string;
  claims: VerifiedClaim[];             // each with citation + support level
  nextSteps: { title: string; detail: string }[];
  riskFlags: { level: "low"|"medium"|"high"; detail: string }[];
  asAtDate: string;                    // KB version date
  sources: { citationLabel: string; url: string; version: string }[];
};
```

### 5.6 Citation grounding — worked example

> Manager: *"An employee has been here 4 months, casual, and I want to let
> them go for lateness."*
>
> Triage establishes: casual, 4 months, small business (<15), no award issue.
> Retrieval pulls s.382–384 (who is protected), s.383 (minimum employment
> period), Small Business Fair Dismissal Code, and s.340/342 (general
> protections).
>
> Verified answer: *"On these facts the employee has **not** completed the
> minimum employment period for a small business (12 months — s.383(b) Fair Work
> Act 2009 (Cth), as at 2026-06-01), so they cannot bring an unfair dismissal
> claim. **However**, a general-protections claim (s.340) does **not** require a
> minimum period — if the lateness is connected to a protected attribute or the
> exercise of a workplace right, dismissal could still expose you to a claim.
> Recommended steps: …"*
>
> Every bolded proposition carries a citation that survived the verification
> pass; the "however" is exactly the kind of trap a generic chatbot misses.

## 6. Reuse from ClaimShield

| Capability | Already in repo | Action |
|---|---|---|
| Claude SDK + structured output | `src/app/api/analyze/route.ts` | Reuse pattern |
| Document → content blocks | `fileToBlocks()` (analyze route) | Reuse for ingesting source docs & user-uploaded policies |
| Jurisdiction config / multi-jurisdiction | `src/lib/jurisdiction.ts` | Reuse + extend with employment-law notes |
| Claim + nullable citation shape | `FindingSchema` | Evolve into `VerifiedClaim` |
| "Information, not legal advice" framing | `SYSTEM_PROMPT_BASE`, `/legal` | Reuse, tighten for ER/IR |
| Prompt caching | `cache_control` in analyze route | Reuse — cache the system prompt & static KB context |
| Document generation engine | `src/lib/legispro.ts` (LegisPro) | Reuse later for warning letters, PIP templates, show-cause letters |
| Local case store | `src/lib/cases.ts` | Pattern for storing conversations (move server-side + auth for B2B) |
| **Retrieval-grounded KB + native Citations** | — | **Build (foundation)** |
| **Verification pass** | — | **Build (differentiator)** |
| **Conversational triage** | partial (`/start`) | **Build** |

## 7. Proposed module layout

```
src/
  app/
    advisor/
      page.tsx                # chat UI
    api/
      advisor/
        route.ts              # triage + generate + verify orchestration
      kb/
        search/route.ts       # retrieval endpoint
  lib/
    advisor/
      kb.ts                   # KB types, retrieval client
      ingest.ts               # ingestion / chunking pipeline
      triage.ts               # clarifying-question logic + TriageFacts
      verify.ts               # the verification pass
      prompts.ts              # system prompts (grounding rules)
      employmentJurisdiction.ts  # extends jurisdiction.ts with ER/IR notes
data/
  kb/                         # seed source documents (versioned)
docs/
  er-advisor-spec.md          # this file
```

This keeps ER Advisor cleanly separable should it later graduate to its own app
(the consumer-claims vs B2B-HR audiences are quite different), while reusing the
shared plumbing today.

## 8. Quality & evaluation

A legal-advisory tool must be measured, not vibes-checked.

- **Citation accuracy** — sampled answers manually checked: does the cited
  section say what the answer claims? Target: ~100% of *shown* claims supported
  (the verification pass exists to guarantee this).
- **Eval set** — a fixed bank of realistic scenarios (the "casual, 4 months,
  lateness" case above is one) with expert-reviewed model answers; run on every
  prompt/KB change.
- **Refusal/escalation rate** — the tool should say "this is outside what I can
  ground / get professional advice" on genuinely hard or novel matters. A 0%
  refusal rate is a red flag, not a win.
- **Freshness check** — alert if any cited source is older than its review
  cadence.

## 9. Risk, liability, privacy

- **Not legal advice.** Persistent, prominent framing; high-risk topics
  (dismissal, redundancy, discrimination) carry a "consider professional advice"
  prompt. Extend the existing `/legal` page.
- **Human in the loop.** The tool advises; the manager/advisor decides. Outputs
  are drafts and information, never instructions.
- **Auditability.** Every answer logs the KB version, the retrieved sources and
  the verification result — both a quality tool and a defence if advice is ever
  questioned.
- **Privacy.** Managers will paste sensitive employee info. Need: clear data
  handling, no training on customer data, retention controls, and (for the B2B
  buyer) likely SSO + per-org isolation. Move the conversation store
  **server-side behind auth** from day one (ClaimShield's `localStorage` case
  store is fine for a consumer demo, not for employee PII).
- **Scope discipline.** No representation, no lodging applications — stay on the
  information side of the unauthorised-legal-practice line.

## 10. Roadmap

- **Phase 0 — Prototype (1 module, seed KB).** Hand-picked AU KB (NES, unfair
  dismissal, general protections, 1–2 awards). Chat triage → grounded answer →
  verification → cited output. Proves the loop end-to-end. *Reuses ~60% of
  ClaimShield's Claude plumbing.*
- **Phase 1 — Real ingestion.** Automated, dated, versioned ingestion of the
  Fair Work Act + NES + top ~20 awards + FWO guidance. Hybrid retrieval. Eval
  set + citation-accuracy harness.
- **Phase 2 — Breadth.** Full award set, FWC decisions, WHS, anti-discrimination,
  WGEA. Document generation (warning/PIP/show-cause letters) via LegisPro.
- **Phase 3 — Multi-jurisdiction.** US/UK employment law, reusing the
  `jurisdiction.ts` pattern. Org accounts, SSO, audit dashboard for the P&C
  leader.

## 11. Open questions

1. **Product boundary** — does this ship under the ClaimShield brand, as a new
   SynthexIQ product, or white-labelled for HR teams? (Affects auth/billing.)
2. **KB sourcing** — are we comfortable scraping legislation.gov.au / FWC, or do
   we want a licensed legal-data feed for awards/decisions?
3. **Liability appetite** — how conservative should the refusal/escalation
   threshold be for high-risk matters?
4. **Buyer** — is this sold to P&C leaders as a team tool, or embedded as
   self-serve guidance for all managers? Changes the UX and the auth model.

---

*Next step after sign-off: build the Phase 0 prototype against a small seed KB
so the triage → grounded-answer → verification loop can be demonstrated
end-to-end.*
