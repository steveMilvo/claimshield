# Pip — Avatar Evolution & the Pip Workshop (customisation)

How Pip looks is a **living readout of the child's own AI-skill mastery** — not a
reward for time spent. Pip refines because the child *taught it well* (caught its
mistakes, corrected it, directed it clearly). The avatar is the `student model`
(the d′ / mastery vector from the build spec) dressed as a creature.

This keeps the mechanic honest: visual growth is **mathematically bound to mastery**
— it cannot move unless d′ moves. There are no time, streak, coin, or purchase
levers to game.

---

## 1. Core principle: choose *which*, earn *how detailed*

A normal "character creator" mashes two different things together. We split them:

- **Choice is free, always.** Pick eyes, mouth, hair, colour anytime, no gate. Pure
  ownership — *your* Pip. (Ownership powers the protégé effect.)
- **Fidelity is earned.** Each slot starts with simple, blocky options. As the child
  masters the competency that slot represents, that slot **unlocks a richer tier**
  with more detailed, expressive options. The *menu itself levels up.*

This is how "students choose their own eyes/mouth/hair" and "upgraded with more
detailed options throughout the game" both come true without growth becoming a
play-for-time grind.

---

## 2. Multi-axis growth (not one XP bar)

The real student model is *per competency*, so the avatar grows *per part* — making
Pip an at-a-glance diagnostic for child, teacher, and parent.

| Slot | Free choice from day 1? | Detail tier gated by… | T0 → T4 feel |
|---|---|---|---|
| **Eyes** | choose style/shape freely | mastery of **hallucination-spotting** | dot → sharp, expressive, animated eyes |
| **Mouth** | choose freely | mastery of **bias-spotting** | line → warm, expressive range |
| **Hair / top** | choose freely | mastery of **source-checking** | nub → detailed styles + a "tool" Pip holds |
| **Body / stance** | choose freely | mastery of **overconfidence-spotting** | blob → defined, grounded posture |
| **Calibration glow** | — | **criterion** `c` (not cynical, not credulous) | overall balance / steadiness of Pip's "spark" |
| **Colour & pattern** | ✅ fully free, huge range, never gated | — (pure expression) | always rich, from minute one |
| **Accessory / sticker** | ✅ free | — (pure expression) | always available |

A child sharp on facts but weak on bias has a sharp-eyed, blank-mouthed Pip —
legible to everyone, and it nudges practice toward the weak axis (which is exactly
what the adaptation engine's lowest-mastery selector already targets).

---

## 3. Evolution stages (blob → fully detailed)

Authored as a handful of tiers per axis, gated by real mastery thresholds:

- **Stage 0 — Blob.** Friendly, complete-feeling, cute-on-day-one. Pip already
  speaks and emotes. *Gate: none.*
- **Stage 1 — Features emerge.** First eyes, a hint of form. *Gate: first mastery
  signal (early, near-guaranteed win).*
- **Stage 2 — Differentiated.** Defined body, limbs; axis-specific traits refine
  independently.
- **Stage 3 — Expressive & equipped.** Detailed face; "tools" that represent earned
  competencies (the book, steady stance, etc.).
- **Stage 4 — Fully realised Pip.** The detailed character — reached only when
  mastery is **sustained across spaced + novel-context items** (same bar as
  `mastery` in the build spec). Pip "graduates" when the skill is proven durable,
  not crammed. This is the *visual certificate* that the child can genuinely direct
  and critique an AI.

---

## 4. The equity guarantee (do not skip)

A struggling child must **never** end up with a sad grey blob while classmates have
detailed Pips — that punishes the kids who most need to keep trying.

- **Free cosmetic channel is deliberately rich** (colours, patterns, stickers) so
  *anyone* makes a Pip they love regardless of mastery.
- **Front-load the first detail unlocks** so early, near-guaranteed wins deliver
  visible upgrades fast.
- **Unlocks are permanent** — once a tier opens, its options stay, even if a skill
  later needs a refresh (no taking things away).
- **No leaderboards.** The only comparison is your Pip today vs your Pip last week.

---

## 5. Decay handling (honest, not punitive)

Two layers:
- **Permanent structure** — earned detail/tiers, never lost.
- **Transient "spark/shine"** — brightens with recent strong practice, gently dims
  when a skill needs a refresh. Informational, a soft nudge back — never a
  demoralising regression of the creature itself.

---

## 6. Keep it clean — no shop, no grind

- **No coins, no purchases, no loot boxes, no randomised unlocks.** The only
  "currency" is mastery. Critical for an under-13 product and the values
  positioning.
- **Cosmetic ≠ smart.** The free choice channel and the earned-detail channel stay
  visually and narratively distinct, so picking a cool sticker never *looks* like
  becoming capable.

---

## 7. Buildability (and lean v1 scope)

Drops onto the **layered, parameterised vector rig** (Rive / Lottie / SVG):
- **slot = a swappable layer group**, **tier = a richer asset variant**,
  **option = one item in that group**.
- Code drives "which option + which tier" from the child's choices + the mastery
  vector. Deterministic (same inputs → same Pip), composable, cheap, offline.
- **Not** an image model per child — same reason we pre-generate the item bank:
  identity consistency, cost, and safety/moderation.

**Scope discipline for the August build:** art scales as `slots × tiers × options`
and can explode. For v1 keep it small and honest — e.g. **3 earned slots × 3 tiers
× 3 options + 1 free colour/pattern channel** (~30 assets). Plenty of expressive
range, buildable lean, fully proves the mechanic. Expand the catalogue post-pilot.

**Suggested rig parameters (engineering):**
```
eyes_tier:     0–4   (gated by hallucination mastery)
eyes_option:   enum  (free choice within unlocked tier)
mouth_tier:    0–4   (gated by bias mastery)
mouth_option:  enum
hair_tier:     0–4   (gated by source-check mastery)
hair_option:   enum
body_tier:     0–4   (gated by overconfidence mastery)
body_option:   enum
spark:         0–1   (continuous; from calibration/criterion + recency)
colour:        enum  (free)
pattern:       enum  (free)
accessory:     enum  (free)
```

---

## 8. UX (ages 8–9) & accessibility

- Visual, **tap-only** picker: tap a part → options as thumbnails → live-preview on
  Pip → confirm. No reading required.
- Locked tiers show a friendly **"teach Pip more to unlock!"** (informational — not
  a nagging "almost there!" dark pattern).
- Every option has a **spoken name** (TTS) for accessibility / EAL-D; palettes are
  **colourblind-safe**; large hit targets; no time pressure.
- The Workshop is a short **between-mission reward room**, not an always-open time
  sink.

---

## 9. Tier fit (roadmap note)

Creature-growth + workshop is perfect for **primary (5–11)**. For **middle/senior**,
pets feel babyish — the metaphor should mature into a **capability profile /
configurable companion** (Pip as an instrument you tune, not a Tamagotchi).

---

## The one risk to hold the line on

Customisation can quietly become *the game*, with learning as the chore. Mitigation
is structural, not willpower: richer options **only ever flow from mastery**, there
is **no time/coin/streak lever** to game, and the Workshop is a short between-mission
room. Keep that binding sacred and the Workshop pulls kids *toward* the learning.
