# Pip — The Content Studio (teacher-authored packs, generated & verified by Claude)

The Content Studio (`/teacher`) lets a teacher paste what their class is studying
and turn it into Pip practice — keeping most of it **true** and planting exactly
**one mistake** in the rest for children to catch. Every item is **verified by
Claude** and **approved by the teacher** before any child sees it.

This closes the loop in the build spec: the game measures a child's ability to
catch AI mistakes (d′ per skill, calibration, transfer). For that measurement to
mean anything in a real classroom, the *content* has to be the class's own
material — not a fixed demo bank. The Studio is how teachers supply it safely.

---

## 1. Design principles

- **Teacher content only.** For practice items, the model uses *only* the
  sentences the teacher pasted. It never invents curriculum facts. A planted
  mistake is a single controlled deviation *from the teacher's own text*, so the
  "correct" answer is always something the teacher vouched for.
- **One controlled change.** Each error item changes as little as possible — one
  fact, one fake source, one brag, one unfair generalisation — and everything
  else stays faithful. This is what makes the child's catch a clean signal.
- **Two AI passes, then a human.** Claude **generates**, Claude **verifies**, and
  the **teacher approves**. Nothing reaches a child on a single model's say-so.
- **Honest measurement.** Transfer (new-topic generalisation) is only claimed
  when it is real — see §4. The report never dresses up same-topic practice as
  transfer.
- **Always works.** No API key, network failure, or model hiccup leaves the
  teacher stuck — it falls back to the offline generator with a clear notice.

---

## 2. The pipeline

```
Teacher content ──▶ GENERATE (Claude) ──▶ VERIFY (Claude) ──▶ anchor + assemble ──▶ Teacher review ──▶ Publish
                     plant 1 controlled    confirm exactly one    deterministic        approve / remove    localStorage
                     deviation / item      change of right kind   tokenisation
```

Implemented in `src/app/api/generate/route.ts` (`POST /api/generate`):

1. **Generate** (`GEN_MODEL`, default `claude-sonnet-4-6`). The system prompt
   constrains the model to the teacher's text, the four error kinds, short
   sentences for ages 7–9, and a strict JSON shape. Each item returns its true
   sentence, the (possibly corrupted) `text`, its `type`, and the exact
   `errorPhrase`.
2. **Verify** (`VERIFY_MODEL`, default `claude-sonnet-4-6`). A second call checks
   every item: `none` items must be faithful with no mistake; error items must
   contain *exactly one* mistake of the stated kind at `errorPhrase`, with the
   rest matching the source. It returns `{ ok, reason }` per item. Failures are
   dropped. If the verify call itself fails, items are kept rather than hard
   blocked (the teacher is still the final gate).
3. **Anchor + assemble.** Tokenisation and error-index location happen
   **deterministically server-side** (`locate()`), not in the model — so the
   "tap the wrong words" interaction is always exact. If the error phrase can't
   be located in the text, the item is dropped as a safety net.

Both passes use **prompt caching** (`cache_control: ephemeral`) on the static
system prompts. Models are overridable via `PIP_GEN_MODEL` / `PIP_VERIFY_MODEL`.

---

## 3. Item shape produced

Each verified item is a standard `Item` (`src/lib/game.ts`) with two extra
fields the Studio relies on:

- `provenance: "ai"` — drives the **✨ Verified by Claude** badge in review.
- `verifyReason` — the verifier's one-line note, shown as *"Checker: …"* so a
  teacher can see *why* it passed.
- `topic` — the content domain, used by the transfer report (see §4).

Offline-fallback items carry neither badge nor reason — the distinction stays
honest: a teacher can always tell whether Claude vetted a given line.

---

## 4. Transfer: only claimed when real

Transfer is detection on a topic the child **never practised** — evidence the
skill generalises rather than memorising answers. A genuine transfer probe needs
content from a *different* topic, which a single pasted lesson cannot provide
without fabricating outside facts (forbidden by §1).

So the Studio makes it **opt-in and teacher-sourced**:

- The teacher can paste a few sentences from a **different** subject in the
  optional *"Add a different topic"* section.
- When present, the API runs a **second** generate→verify pass on that content
  (`buildItems(..., "tr")`, all-error probes) and tags those items with the
  second topic; main items are tagged with the practised topic.
- `transferReport` is **relative to the pack's practised topic**
  (`state.practisedTopic`), not a hardcoded constant — so the report's
  **New-topic test (transfer)** card lights up for custom packs, showing the two
  real topic names.
- If the teacher provides no second topic, the card stays **hidden**. The offline
  fallback is single-topic only, so a fallback pack shows no transfer card —
  accurate, not a regression.

This is the deliberate trade chosen for the Studio: transfer is shown only when
the teacher supplies a second, different body of content — never manufactured.

---

## 5. Publish & play

`Publish` writes the approved pack to `localStorage` under `pip-pack`:

```json
{ "name": "...", "items": [...], "practisedTopic": "...", "transferTopic": "..." }
```

`/play` loads the pack if present, shuffles the deck, and seeds the game state
with `practisedTopic` / `transferTopic` so scoring and the transfer card use the
teacher's topics. (Packs are browser-local in the prototype; per-class accounts
are the next infrastructure step.)

---

## 6. Setup

Copy `.env.example` to `.env.local` and set `ANTHROPIC_API_KEY` to enable Claude
generation. Without it the Studio falls back to the offline rule-based generator,
so it is always usable for demos.
