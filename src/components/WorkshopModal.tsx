"use client";

import Pip, { type Pattern } from "@/components/Pip";
import type { PipTiers } from "@/lib/game";

export interface Look {
  eyes: number | null; // null = "auto" (follow progress)
  mouth: number | null;
  body: number | null;
  source: number | null;
  pattern: Pattern;
}

type SlotKey = "eyes" | "mouth" | "body" | "source";

const SLOTS: { key: SlotKey; label: string; emoji: string; unlockedBy: string }[] = [
  { key: "eyes", label: "Eyes", emoji: "🔎", unlockedBy: "spotting made-up facts" },
  { key: "mouth", label: "Smile", emoji: "⚖️", unlockedBy: "being fair & kind" },
  { key: "body", label: "Body & arms", emoji: "🎯", unlockedBy: "no bragging" },
  { key: "source", label: "Book & antenna", emoji: "📚", unlockedBy: "checking sources" },
];

export const WORKSHOP_COLORS = [
  "#7C6BE0", "#5BC8F5", "#3FD3A7", "#FF8A5B", "#FF7BA9", "#FFC44D", "#9B7BFF", "#56C271",
];

const PATTERNS: { key: Pattern; label: string }[] = [
  { key: "none", label: "Plain" },
  { key: "spots", label: "Spots" },
  { key: "stripes", label: "Stripes" },
  { key: "star", label: "Star" },
];

export default function WorkshopModal({
  ceiling,
  look,
  color,
  onLook,
  onColor,
  onClose,
}: {
  ceiling: PipTiers;
  look: Look;
  color: string;
  onLook: (patch: Partial<Look>) => void;
  onColor: (c: string) => void;
  onClose: () => void;
}) {
  // what Pip currently shows (choice, capped by what's unlocked)
  const display = (k: SlotKey) => Math.min(look[k] ?? ceiling[k], ceiling[k]);
  const displayTiers: PipTiers = {
    eyes: display("eyes"),
    mouth: display("mouth"),
    body: display("body"),
    source: display("source"),
    glow: ceiling.glow,
  };

  function preview(slot: SlotKey, value: number): PipTiers {
    return { ...displayTiers, [slot]: value };
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Pip Workshop"
      onClick={onClose}
    >
      <div
        className="my-6 w-full max-w-3xl animate-pop rounded-xl2 bg-cream p-6 shadow-soft sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-ink">Pip Workshop 🎨</h2>
            <p className="text-ink/60">
              Choose how Pip looks. Fancier options unlock as you teach Pip well!
            </p>
          </div>
          <button onClick={onClose} className="rounded-full bg-white px-3 py-1.5 text-lg shadow-soft" aria-label="Close workshop">
            ✕
          </button>
        </div>

        <div className="mt-5 grid gap-6 sm:grid-cols-[200px_1fr]">
          {/* live Pip */}
          <div className="flex flex-col items-center self-start rounded-2xl bg-white p-4 shadow-soft sm:sticky sm:top-6">
            <Pip tiers={displayTiers} color={color} pattern={look.pattern} size={170} />
            <p className="mt-2 text-center text-sm font-semibold text-grapeDark">Your Pip</p>
          </div>

          <div className="space-y-5">
            {/* colour — always free */}
            <section>
              <SectionTitle>Colour <Free /></SectionTitle>
              <div className="flex flex-wrap gap-2">
                {WORKSHOP_COLORS.map((c) => (
                  <button
                    key={c}
                    aria-label={`Colour ${c}`}
                    onClick={() => onColor(c)}
                    className={`h-9 w-9 rounded-full ring-2 transition ${color === c ? "scale-110 ring-ink" : "ring-white"}`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </section>

            {/* pattern — always free */}
            <section>
              <SectionTitle>Pattern <Free /></SectionTitle>
              <div className="flex flex-wrap gap-2">
                {PATTERNS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => onLook({ pattern: p.key })}
                    className={`flex flex-col items-center rounded-xl border-2 p-1 transition ${
                      look.pattern === p.key ? "border-grape bg-grape/10" : "border-transparent bg-white"
                    }`}
                  >
                    <Pip tiers={displayTiers} color={color} pattern={p.key} size={52} />
                    <span className="text-xs font-semibold">{p.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* earned slots */}
            {SLOTS.map((slot) => {
              const cap = ceiling[slot.key];
              const chosen = look[slot.key];
              return (
                <section key={slot.key}>
                  <SectionTitle>
                    <span aria-hidden>{slot.emoji}</span> {slot.label}
                    <span className="ml-1 text-xs font-medium text-ink/45">· unlock by {slot.unlockedBy}</span>
                  </SectionTitle>
                  <div className="flex flex-wrap gap-2">
                    {/* auto */}
                    <button
                      onClick={() => onLook({ [slot.key]: null } as Partial<Look>)}
                      className={`flex h-[78px] w-16 flex-col items-center justify-center rounded-xl border-2 transition ${
                        chosen === null ? "border-grape bg-grape/10" : "border-transparent bg-white"
                      }`}
                    >
                      <span className="text-lg">✨</span>
                      <span className="text-[10px] font-semibold leading-tight">Auto</span>
                    </button>
                    {[0, 1, 2, 3, 4].map((t) => {
                      const locked = t > cap;
                      const selected = chosen === t;
                      return (
                        <button
                          key={t}
                          disabled={locked}
                          onClick={() => onLook({ [slot.key]: t } as Partial<Look>)}
                          className={`relative flex flex-col items-center rounded-xl border-2 p-0.5 transition ${
                            selected ? "border-grape bg-grape/10" : "border-transparent bg-white"
                          } ${locked ? "opacity-50" : "hover:bg-grape/5"}`}
                          aria-label={`${slot.label} level ${t}${locked ? " (locked)" : ""}`}
                        >
                          <Pip tiers={preview(slot.key, t)} color={color} pattern={look.pattern} size={52} />
                          {locked && (
                            <span className="absolute inset-0 grid place-items-center text-xl">🔒</span>
                          )}
                          <span className="text-[10px] font-semibold">Lv {t}</span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}

            <p className="rounded-xl bg-sunny/15 px-4 py-2 text-sm text-ink/70">
              🔒 Locked looks unlock when you get better at that skill — teach Pip to grow them!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-2 font-display text-lg font-bold">{children}</h3>;
}

function Free() {
  return (
    <span className="ml-1 rounded-full bg-mint/25 px-2 py-0.5 text-xs font-semibold text-ink/70">
      always free
    </span>
  );
}
