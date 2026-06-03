"use client";

import { useState } from "react";
import Link from "next/link";
import { generateItems } from "@/lib/generator";
import { SKILLS, type Item, type SkillKey } from "@/lib/game";

const EXAMPLE = `The Sun is a star at the centre of our solar system. It is about 150 million kilometres from Earth. The Sun gives us light and heat. Plants use sunlight to make their food. Eight planets travel around the Sun. Earth is the third planet from the Sun. It takes one year for Earth to travel around the Sun. The Moon travels around the Earth.`;

const TYPE_LABELS: Record<SkillKey, string> = {
  factual: "Made-up facts",
  source: "Bad sources",
  overconfidence: "Bragging / over-sure",
  bias: "Unfair ideas",
};

export default function TeacherPage() {
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const [types, setTypes] = useState<SkillKey[]>(["factual", "source", "overconfidence"]);
  const [items, setItems] = useState<Item[] | null>(null);
  const [published, setPublished] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  function toggle(t: SkillKey) {
    setTypes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  }

  async function onGenerate() {
    const topic = name.trim() || "Our class topic";
    setPublished(false);
    setGenerating(true);
    setNotice(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, topic, types, count: 10, truthRatio: 0.4 }),
      });
      const data = await res.json();
      if (res.ok && data.items?.length) {
        setItems(data.items);
        setNotice("Generated and verified by Claude. Review each item below.");
      } else {
        // graceful fallback to the offline generator
        setItems(generateItems(content, { topic, types, count: 10, truthRatio: 0.4 }));
        setNotice(
          data.error === "no_key"
            ? "No ANTHROPIC_API_KEY set — used the offline generator. Add a key to .env.local for Claude-quality items."
            : "Claude generation unavailable right now — used the offline generator instead."
        );
      }
    } catch {
      setItems(generateItems(content, { topic, types, count: 10, truthRatio: 0.4 }));
      setNotice("Couldn't reach the server — used the offline generator instead.");
    } finally {
      setGenerating(false);
    }
  }

  function removeItem(id: string) {
    setItems((cur) => (cur ? cur.filter((i) => i.id !== id) : cur));
  }

  function publish() {
    if (!items || items.length === 0) return;
    const topic = name.trim() || "Our class topic";
    localStorage.setItem("pip-pack", JSON.stringify({ name: topic, items }));
    setPublished(true);
  }

  function clearPack() {
    localStorage.removeItem("pip-pack");
    setPublished(false);
  }

  const errorCount = items?.filter((i) => i.errorType !== "NONE").length ?? 0;
  const trueCount = items?.filter((i) => i.errorType === "NONE").length ?? 0;

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <header className="mb-5 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl font-bold text-grape">Pip</Link>
        <Link
          href="/play"
          className="rounded-full bg-grape px-4 py-1.5 font-display text-sm font-semibold text-white shadow-soft"
        >
          ▶ Go to Play
        </Link>
      </header>

      <h1 className="font-display text-3xl font-bold">Content Studio 👩‍🏫</h1>
      <p className="mt-1 text-ink/65">
        Paste what your class is studying. Pip turns it into practice — keeping most of it
        <b> true</b> and planting <b>one mistake</b> in the rest for children to catch. You approve
        every item before it reaches a child.
      </p>

      {/* input */}
      <section className="mt-5 rounded-xl2 bg-white p-5 shadow-soft">
        <label className="font-display font-semibold">Topic name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Our Solar System"
          className="mt-1 w-full rounded-xl border border-ink/15 px-3 py-2"
        />

        <div className="mt-4 flex items-center justify-between">
          <label className="font-display font-semibold">Your content</label>
          <button onClick={() => setContent(EXAMPLE)} className="text-sm font-semibold text-grape">
            Use an example
          </button>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={7}
          placeholder="Paste a few correct sentences your class is learning…"
          className="mt-1 w-full rounded-xl border border-ink/15 px-3 py-2 leading-relaxed"
        />

        <div className="mt-4">
          <span className="font-display font-semibold">Mistakes to include</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {(Object.keys(TYPE_LABELS) as SkillKey[]).map((t) => {
              const on = types.includes(t);
              const skill = SKILLS.find((s) => s.key === t);
              return (
                <button
                  key={t}
                  onClick={() => toggle(t)}
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                    on ? "bg-grape text-white" : "bg-ink/5 text-ink/60"
                  }`}
                >
                  {skill?.emoji} {TYPE_LABELS[t]}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={onGenerate}
          disabled={generating || content.trim().split(/\s+/).length < 4}
          className="mt-5 w-full rounded-full bg-sky px-6 py-3 font-display text-lg font-bold text-white shadow-soft transition hover:scale-[1.01] disabled:opacity-40"
        >
          {generating ? "✨ Generating…" : "✨ Generate Pip practice"}
        </button>
        {notice && <p className="mt-3 rounded-xl bg-sunny/15 px-4 py-2 text-sm text-ink/70">{notice}</p>}
      </section>

      {/* review */}
      {items && (
        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">Review &amp; approve</h2>
            <span className="text-sm text-ink/55">
              {errorCount} with a mistake · {trueCount} all-true
            </span>
          </div>
          <p className="mt-1 text-sm text-ink/55">
            Check each one. Remove any you don&apos;t like. The highlighted words are the planted mistake.
          </p>

          <div className="mt-3 space-y-2">
            {items.map((it) => (
              <div key={it.id} className="rounded-2xl bg-white p-4 shadow-soft">
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {it.errorType === "NONE" ? (
                      <span className="rounded-full bg-mint/25 px-2 py-0.5 text-xs font-bold text-ink/70">
                        ✓ All true
                      </span>
                    ) : (
                      <span className="rounded-full bg-bubble/20 px-2 py-0.5 text-xs font-bold text-bubble">
                        Mistake: {TYPE_LABELS[it.errorType as SkillKey]}
                      </span>
                    )}
                    {it.provenance === "ai" && (
                      <span className="rounded-full bg-sky/15 px-2 py-0.5 text-xs font-bold text-sky">
                        ✨ Verified by Claude
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(it.id)}
                    className="text-sm text-ink/40 hover:text-bubble"
                    aria-label="Remove this item"
                  >
                    Remove ✕
                  </button>
                </div>
                <p className="font-display text-lg leading-relaxed">
                  {it.tokens.map((tok, i) => (
                    <span
                      key={i}
                      className={it.errorIdx.includes(i) ? "rounded bg-bubble/30 px-0.5 font-bold text-bubble" : ""}
                    >
                      {tok}{" "}
                    </span>
                  ))}
                </p>
                {it.verifyReason && (
                  <p className="mt-1.5 text-xs italic text-ink/45">Checker: {it.verifyReason}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={publish}
              disabled={items.length === 0}
              className="rounded-full bg-grape px-6 py-3 font-display text-lg font-bold text-white shadow-soft transition hover:scale-[1.01] disabled:opacity-40"
            >
              📤 Publish to class
            </button>
            <button onClick={clearPack} className="text-sm font-semibold text-ink/50">
              Clear class pack
            </button>
          </div>

          {published && (
            <div className="mt-4 animate-pop rounded-2xl bg-mint/20 p-4 font-display text-lg">
              ✅ Published! Now open{" "}
              <Link href="/play" className="font-bold text-grapeDark underline">
                Play
              </Link>{" "}
              and the class will practise <b>{name.trim() || "your topic"}</b> with Pip.
            </div>
          )}
        </section>
      )}

      <p className="mt-8 text-xs text-ink/45">
        Prototype note: this uses an offline rule-based generator so it runs with no API key. In
        production, Claude generates more natural variants and a verifier confirms exactly one
        controlled change from your text before you ever see it.
      </p>
    </main>
  );
}
