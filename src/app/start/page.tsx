"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { SECTIONS, EMPTY_ANSWERS, Answers, Question } from "@/lib/questions";
import { saveReport, GeneratedReport } from "@/lib/reportStore";
import { BlueprintMark } from "@/components/Logo";

export default function StartPage() {
  const router = useRouter();
  const [sectionIndex, setSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ ...EMPTY_ANSWERS });
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const section = SECTIONS[sectionIndex];
  const isLast = sectionIndex === SECTIONS.length - 1;
  const isFirst = sectionIndex === 0;

  function setAnswer(id: string, value: string | string[]) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function toggleCheckbox(id: string, value: string) {
    const current = (answers[id as keyof Answers] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setAnswer(id, updated);
  }

  function visibleQuestions(q: Question[]): Question[] {
    return q.filter((q) => !q.showIf || q.showIf(answers));
  }

  function sectionComplete(): boolean {
    const visible = visibleQuestions(section.questions);
    return visible
      .filter((q) => q.required)
      .every((q) => {
        const val = answers[q.id as keyof Answers];
        if (Array.isArray(val)) return val.length > 0;
        return !!val;
      });
  }

  async function generateReport() {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
      const id = saveReport(answers, data.report as GeneratedReport);
      router.push(`/report/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setGenerating(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 md:py-14">
      <SectionProgress current={sectionIndex} total={SECTIONS.length} />

      <div className="mt-8 rounded-2xl bg-white border border-black/5 shadow-card p-6 md:p-8">
        <div className="mb-6">
          <div className="text-xs font-mono text-blueprint-600">
            Section {sectionIndex + 1} of {SECTIONS.length}
          </div>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">{section.title}</h2>
          <p className="mt-1.5 text-sm text-ink-muted">{section.subtitle}</p>
        </div>

        <div className="space-y-8">
          {visibleQuestions(section.questions).map((q) => (
            <QuestionField
              key={q.id}
              question={q}
              value={answers[q.id as keyof Answers]}
              onChange={(val) => {
                if (q.type === "checkbox") {
                  toggleCheckbox(q.id, val as string);
                } else {
                  setAnswer(q.id, val);
                }
              }}
            />
          ))}
        </div>

        {error && (
          <div className="mt-6 rounded-lg bg-danger/10 border border-danger/20 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setSectionIndex((i) => Math.max(0, i - 1))}
            disabled={isFirst}
            className={cn(
              "text-sm font-medium px-4 py-2 rounded-full transition",
              isFirst ? "text-ink-muted/40 cursor-not-allowed" : "text-ink hover:bg-canvas"
            )}
          >
            ← Back
          </button>

          {isLast ? (
            <button
              onClick={generateReport}
              disabled={generating || !sectionComplete()}
              className={cn(
                "inline-flex items-center gap-2 rounded-full text-sm font-medium px-5 py-2.5 transition",
                generating || !sectionComplete()
                  ? "bg-blueprint-300 text-white cursor-not-allowed"
                  : "bg-blueprint-600 text-white hover:bg-blueprint-700"
              )}
            >
              {generating ? (
                <>
                  <Spinner />
                  Generating your Blueprint…
                </>
              ) : (
                <>
                  <BlueprintMark className="h-4 w-4" />
                  Generate my Blueprint
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setSectionIndex((i) => Math.min(SECTIONS.length - 1, i + 1))}
              disabled={!sectionComplete()}
              className={cn(
                "inline-flex items-center gap-2 rounded-full text-sm font-medium px-5 py-2.5 transition",
                !sectionComplete()
                  ? "bg-blueprint-300 text-white cursor-not-allowed"
                  : "bg-blueprint-600 text-white hover:bg-blueprint-700"
              )}
            >
              Continue →
            </button>
          )}
        </div>

        {generating && (
          <p className="mt-3 text-xs text-ink-muted text-center">
            Modelling your structures and running tax calculations — this takes 2–4 minutes. Keep this tab open.
          </p>
        )}
      </div>

      <p className="mt-4 text-xs text-ink-muted text-center">
        General information only. Your report is for use with a registered tax agent — not a substitute for professional advice.
      </p>
    </div>
  );
}

function SectionProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-ink-muted">
        <span>{SECTIONS[current].title}</span>
        <span>{current + 1} / {total}</span>
      </div>
      <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-blueprint-500 rounded-full transition-all duration-500"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>
      <div className="flex gap-1">
        {SECTIONS.map((s, i) => (
          <div
            key={s.id}
            className={cn(
              "flex-1 h-0.5 rounded-full transition",
              i <= current ? "bg-blueprint-500" : "bg-black/10"
            )}
          />
        ))}
      </div>
    </div>
  );
}

function QuestionField({
  question: q,
  value,
  onChange,
}: {
  question: Question;
  value: string | string[];
  onChange: (val: string | string[]) => void;
}) {
  return (
    <div>
      <div className="text-sm font-medium text-ink leading-snug">{q.label}</div>
      {q.hint && <div className="mt-0.5 text-xs text-ink-muted">{q.hint}</div>}

      {(q.type === "radio" || q.type === "select") && q.options && (
        <div className="mt-3 flex flex-col gap-2">
          {q.options.map((opt) => {
            const selected = value === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange(opt.value)}
                className={cn(
                  "text-left rounded-xl border px-4 py-3 text-sm transition",
                  selected
                    ? "border-blueprint-500 bg-blueprint-50 text-blueprint-800 font-medium"
                    : "border-black/10 bg-white text-ink-soft hover:border-blueprint-300 hover:bg-blueprint-50/40"
                )}
              >
                <span className={cn(
                  "inline-flex h-4 w-4 rounded-full border mr-2.5 items-center justify-center shrink-0 transition",
                  selected ? "border-blueprint-500 bg-blueprint-500" : "border-black/20"
                )}>
                  {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </span>
                {opt.label}
                {opt.hint && <span className="ml-2 text-xs text-ink-muted">— {opt.hint}</span>}
              </button>
            );
          })}
        </div>
      )}

      {q.type === "checkbox" && q.options && (
        <div className="mt-3 flex flex-col gap-2">
          {q.options.map((opt) => {
            const arr = (value as string[]) || [];
            const checked = arr.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange(opt.value)}
                className={cn(
                  "text-left rounded-xl border px-4 py-3 text-sm transition",
                  checked
                    ? "border-blueprint-500 bg-blueprint-50 text-blueprint-800 font-medium"
                    : "border-black/10 bg-white text-ink-soft hover:border-blueprint-300 hover:bg-blueprint-50/40"
                )}
              >
                <span className={cn(
                  "inline-flex h-4 w-4 rounded border mr-2.5 items-center justify-center shrink-0 transition",
                  checked ? "border-blueprint-500 bg-blueprint-500" : "border-black/20"
                )}>
                  {checked && (
                    <svg viewBox="0 0 10 10" className="h-2.5 w-2.5 text-white fill-current">
                      <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                {opt.label}
              </button>
            );
          })}
        </div>
      )}

      {q.type === "text" && (
        <input
          type="text"
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          className="mt-3 w-full rounded-xl border border-black/12 bg-white px-4 py-2.5 text-sm outline-none focus:border-blueprint-500 focus:ring-4 focus:ring-blueprint-500/10"
        />
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}
