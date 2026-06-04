"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type {
  AdvisorySource,
  RiskFlag,
  SupportLevel,
  VerifiedClaim,
} from "@/lib/advisor/types";

type AnswerPayload = {
  summary: string;
  claims: VerifiedClaim[];
  droppedCount: number;
  nextSteps: { title: string; detail: string }[];
  riskFlags: RiskFlag[];
  asAtDate: string;
  sources: AdvisorySource[];
};

type Item =
  | { role: "user"; content: string }
  | { role: "assistant"; kind: "clarify"; reply: string; questions: string[] }
  | { role: "assistant"; kind: "advise"; reply: string; answer: AnswerPayload }
  | { role: "assistant"; kind: "error"; content: string };

const STARTERS = [
  "An employee has been late repeatedly. Can I dismiss them?",
  "We need to make a role redundant — what do I have to do?",
  "A staff member asked for flexible hours. Can I say no?",
  "How much notice do I owe someone after 4 years?",
];

/** Flatten the display items into the {role, content} transcript the API wants. */
function toApiMessages(items: Item[]): { role: "user" | "assistant"; content: string }[] {
  return items.map((it) => {
    if (it.role === "user") return { role: "user" as const, content: it.content };
    if (it.kind === "clarify")
      return {
        role: "assistant" as const,
        content: `${it.reply}\n${it.questions.join("\n")}`,
      };
    if (it.kind === "advise")
      return {
        role: "assistant" as const,
        content: `${it.reply}\n${it.answer.summary}`,
      };
    return { role: "assistant" as const, content: it.content };
  });
}

export default function AdvisorPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [items, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const nextItems: Item[] = [...items, { role: "user", content: trimmed }];
    setItems(nextItems);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: toApiMessages(nextItems) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Request failed (${res.status}).`);
      if (data.mode === "clarify") {
        setItems((prev) => [
          ...prev,
          { role: "assistant", kind: "clarify", reply: data.reply, questions: data.questions ?? [] },
        ]);
      } else {
        setItems((prev) => [
          ...prev,
          { role: "assistant", kind: "advise", reply: data.reply, answer: data.answer },
        ]);
      }
    } catch (e) {
      setItems((prev) => [
        ...prev,
        {
          role: "assistant",
          kind: "error",
          content: e instanceof Error ? e.message : "Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 md:py-12">
      <header className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-shield-50 border border-shield-100 px-3 py-1 text-xs font-medium text-shield-700">
          ER Advisor · Australia · Fair Work
        </div>
        <h1 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">
          Cited employee-relations guidance for managers
        </h1>
        <p className="mt-2 text-ink-muted text-sm">
          Ask about a real situation. ER Advisor asks a few clarifying questions,
          then gives guidance grounded in the Fair Work Act — every point checked
          against the provision it cites before you see it.
        </p>
      </header>

      <div className="rounded-2xl bg-white border border-black/5 shadow-card overflow-hidden flex flex-col">
        <div ref={scrollRef} className="max-h-[60vh] overflow-y-auto p-5 md:p-6 space-y-4">
          {items.length === 0 && !loading && (
            <div className="py-6">
              <p className="text-sm text-ink-muted">Try one of these:</p>
              <div className="mt-3 grid gap-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-left rounded-xl border border-black/10 bg-canvas px-4 py-3 text-sm hover:border-shield-400 hover:bg-shield-50/50 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {items.map((it, i) => (
            <MessageBlock key={i} item={it} onPick={(q) => setInput(q)} />
          ))}

          {loading && <ThinkingRow />}
        </div>

        <div className="border-t border-black/5 p-3 md:p-4 bg-canvas/40">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder="Describe the situation…"
              className="flex-1 resize-none rounded-xl border border-black/12 bg-white px-3 py-2.5 text-[15px] outline-none focus:border-shield-500 focus:ring-4 focus:ring-shield-500/12 max-h-40"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className={cn(
                "shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition",
                loading || !input.trim()
                  ? "bg-black/10 text-ink-muted cursor-not-allowed"
                  : "bg-shield-600 text-white hover:bg-shield-700",
              )}
            >
              Send
            </button>
          </form>
        </div>
      </div>

      <p className="mt-4 text-xs text-ink-muted text-center leading-relaxed">
        ER Advisor is an information and decision-support tool, not legal advice.
        For dismissals, redundancies and discrimination matters, consider
        professional advice before acting. Guidance is grounded in the Fair Work
        Act 2009 (Cth) as held in the knowledge base; always confirm against the
        current source.
      </p>
    </div>
  );
}

function MessageBlock({ item, onPick }: { item: Item; onPick: (q: string) => void }) {
  if (item.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-shield-600 text-white px-4 py-2.5 text-[15px]">
          {item.content}
        </div>
      </div>
    );
  }

  if (item.kind === "error") {
    return (
      <div className="rounded-xl bg-danger/10 border border-danger/20 px-4 py-3 text-sm text-danger">
        {item.content}
      </div>
    );
  }

  if (item.kind === "clarify") {
    return (
      <div className="max-w-[92%] space-y-3">
        <div className="rounded-2xl rounded-bl-sm bg-canvas border border-black/5 px-4 py-3 text-[15px]">
          {item.reply}
        </div>
        {item.questions.length > 0 && (
          <div className="space-y-1.5">
            {item.questions.map((q) => (
              <button
                key={q}
                onClick={() => onPick(q)}
                className="block w-full text-left rounded-lg border border-shield-200 bg-shield-50/60 px-3 py-2 text-sm text-shield-800 hover:bg-shield-50 transition"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // advise
  const { answer } = item;
  return (
    <div className="space-y-4">
      <div className="rounded-2xl rounded-bl-sm bg-canvas border border-black/5 px-4 py-3 text-[15px]">
        {item.reply}
      </div>

      <div className="rounded-2xl border border-black/8 bg-white p-4 md:p-5 space-y-5 shadow-card">
        {answer.summary && (
          <p className="text-[15px] leading-relaxed">{answer.summary}</p>
        )}

        {answer.claims.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              The position, with citations
            </h3>
            <ul className="mt-2.5 space-y-2.5">
              {answer.claims.map((c, i) => (
                <ClaimRow key={i} claim={c} />
              ))}
            </ul>
            {answer.droppedCount > 0 && (
              <p className="mt-2 text-xs text-ink-muted italic">
                {answer.droppedCount} statement
                {answer.droppedCount === 1 ? " was" : "s were"} withheld — they
                could not be grounded in a cited provision.
              </p>
            )}
          </section>
        )}

        {answer.riskFlags.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Risk flags
            </h3>
            <ul className="mt-2.5 space-y-2">
              {answer.riskFlags.map((r, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <RiskBadge level={r.level} />
                  <span className="text-sm leading-relaxed">{r.detail}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {answer.nextSteps.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Next steps
            </h3>
            <ol className="mt-2.5 space-y-2">
              {answer.nextSteps.map((s, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="shrink-0 inline-flex h-5 w-5 items-center justify-center rounded-full bg-shield-600 text-white text-[10px] font-semibold">
                    {i + 1}
                  </span>
                  <div className="text-sm leading-relaxed">
                    <span className="font-medium">{s.title}.</span> {s.detail}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {answer.sources.length > 0 && (
          <footer className="border-t border-black/5 pt-3">
            <p className="text-[11px] uppercase tracking-wider text-ink-muted">
              Sources · as at {answer.asAtDate}
            </p>
            <ul className="mt-1.5 space-y-1">
              {answer.sources.map((s) => (
                <li key={s.citationLabel} className="text-xs">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-shield-700 hover:underline font-medium"
                  >
                    {s.citationLabel}
                  </a>{" "}
                  <span className="text-ink-muted">— {s.title}</span>
                </li>
              ))}
            </ul>
          </footer>
        )}
      </div>
    </div>
  );
}

function ClaimRow({ claim }: { claim: VerifiedClaim }) {
  return (
    <li className="rounded-lg bg-canvas/70 border border-black/5 px-3.5 py-2.5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm leading-relaxed">{claim.claim}</p>
        <SupportBadge level={claim.supported} />
      </div>
      {claim.citationLabel && (
        <p className="mt-1.5 text-xs font-medium text-shield-700">{claim.citationLabel}</p>
      )}
      {claim.sourceQuote && (
        <blockquote className="mt-1.5 border-l-2 border-shield-200 pl-2.5 text-xs text-ink-muted italic">
          “{claim.sourceQuote}”
        </blockquote>
      )}
    </li>
  );
}

function SupportBadge({ level }: { level: SupportLevel }) {
  if (level === "supported") {
    return (
      <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-accent/12 text-accent-dark px-2 py-0.5 text-[11px] font-medium">
        ✓ Grounded
      </span>
    );
  }
  return (
    <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-warn/15 text-warn px-2 py-0.5 text-[11px] font-medium">
      General guidance
    </span>
  );
}

function RiskBadge({ level }: { level: RiskFlag["level"] }) {
  const map = {
    high: "bg-danger/12 text-danger",
    medium: "bg-warn/15 text-warn",
    low: "bg-shield-100 text-shield-700",
  } as const;
  return (
    <span
      className={cn(
        "shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        map[level],
      )}
    >
      {level}
    </span>
  );
}

function ThinkingRow() {
  return (
    <div className="flex items-center gap-2 text-sm text-ink-muted">
      <span className="inline-flex gap-1">
        <Dot /> <Dot delay="150ms" /> <Dot delay="300ms" />
      </span>
      Checking the Fair Work Act…
    </div>
  );
}

function Dot({ delay = "0ms" }: { delay?: string }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 rounded-full bg-shield-400 animate-bounce"
      style={{ animationDelay: delay }}
    />
  );
}
