"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { overallRating, masteredCount, totalGrowth } from "@/lib/studentModel";
import { traitsFor } from "@/lib/rubric";
import type { StudentModel, TextType } from "@/lib/types";
import { cn } from "@/lib/cn";

function cellColor(rating: number, seen: boolean, mastered: boolean) {
  if (!seen) return "bg-paper text-ink-faint";
  if (mastered) return "bg-growth-500 text-white";
  if (rating >= 70) return "bg-growth-100 text-growth-700";
  if (rating >= 45) return "bg-pencil-100 text-pencil-600";
  return "bg-focus-50 text-focus-700";
}

export default function TeacherPage() {
  const router = useRouter();
  const [students, setStudents] = useState<StudentModel[]>([]);
  const [className, setClassName] = useState("8E English");
  const [type, setType] = useState<TextType>("persuasive");
  const [loading, setLoading] = useState(true);

  function refresh() {
    fetch("/api/class")
      .then((r) => r.json())
      .then((d) => {
        setStudents(d.students ?? []);
        if (d.class?.name) setClassName(d.class.name);
      })
      .finally(() => setLoading(false));
  }
  useEffect(() => {
    refresh();
  }, []);

  async function writeAs(s: StudentModel) {
    await fetch("/api/auth/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "student", id: s.studentId, name: s.displayName }),
    });
    router.push("/");
  }

  const traits = traitsFor(type).slice().sort((a, b) => b.leverage - a.leverage);
  const active = students.filter((s) => s.pieces.some((p) => p.textType === type));

  const classAvg = traits.map((d) => {
    const vals = students
      .map((s) => s.traits[d.id])
      .filter((t) => t && t.history.length > 0)
      .map((t) => t.rating);
    const avg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
    return { def: d, avg, n: vals.length };
  });
  const cohortFocus = classAvg
    .filter((c) => c.n > 0)
    .sort((a, b) => a.avg * (1 / a.def.leverage) - b.avg * (1 / b.def.leverage))[0];

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-line/70 bg-canvas/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link href="/"><Logo /></Link>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-line bg-card p-0.5 text-sm">
              {(["persuasive", "narrative"] as TextType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={cn(
                    "rounded-md px-3 py-1 capitalize transition",
                    type === t ? "bg-ink text-paper" : "text-ink-muted hover:text-ink"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            <button onClick={refresh} className="rounded-lg px-3 py-1.5 text-sm text-ink-muted hover:text-ink" title="Refresh">
              Refresh
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-7">
        <h1 className="font-serif text-3xl text-ink">Class writing model</h1>
        <p className="mt-1 text-ink-muted">
          {className} · {type} writing. Each cell is a live, trait-level competency estimate —
          green means mastered (proven on a transfer prompt).
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-line bg-card p-4 shadow-card">
            <p className="text-xs uppercase tracking-wide text-ink-muted">Students with work</p>
            <p className="mt-1 font-serif text-3xl text-ink">
              {active.length}<span className="text-lg text-ink-faint">/{students.length}</span>
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-card p-4 shadow-card">
            <p className="text-xs uppercase tracking-wide text-ink-muted">Cohort&apos;s weakest high-leverage trait</p>
            <p className="mt-1 font-serif text-2xl text-ink">{cohortFocus ? cohortFocus.def.label : "—"}</p>
            {cohortFocus && (
              <p className="text-sm text-ink-muted">class avg {cohortFocus.avg}/100 · whole-class mini-lesson opportunity</p>
            )}
          </div>
          <div className="rounded-2xl border border-line bg-card p-4 shadow-card">
            <p className="text-xs uppercase tracking-wide text-ink-muted">Avg growth (rating pts)</p>
            <p className="mt-1 font-serif text-3xl text-growth-600">
              {active.length
                ? "+" + Math.round(active.reduce((a, s) => a + totalGrowth(s, type), 0) / active.length)
                : "—"}
            </p>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-card shadow-card thin-scroll">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="sticky left-0 bg-card px-4 py-3 text-left font-medium text-ink-muted">Student</th>
                {traits.map((d) => (
                  <th key={d.id} className="px-2 py-3 text-center align-bottom">
                    <span className="block text-[11px] font-medium leading-tight text-ink-muted" title={d.blurb}>
                      {d.label}
                    </span>
                  </th>
                ))}
                <th className="px-3 py-3 text-center font-medium text-ink-muted">Overall</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td className="px-4 py-6 text-ink-faint" colSpan={traits.length + 2}>Loading class…</td></tr>
              )}
              {!loading && students.map((s) => {
                const seenAny = s.pieces.some((p) => p.textType === type);
                return (
                  <tr key={s.studentId} className="border-b border-line/60 last:border-0">
                    <td className="sticky left-0 bg-card px-4 py-2.5">
                      <button onClick={() => writeAs(s)} className="font-medium text-ink hover:text-focus-600" title="Write as this student">
                        {s.displayName}
                      </button>
                      {!seenAny && <span className="ml-2 text-xs text-ink-faint">no work yet</span>}
                    </td>
                    {traits.map((d) => {
                      const t = s.traits[d.id];
                      const seen = t && t.history.length > 0;
                      return (
                        <td key={d.id} className="px-2 py-2 text-center">
                          <span
                            className={cn(
                              "inline-flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold tabular-nums",
                              cellColor(t?.rating ?? 0, !!seen, !!t?.mastered)
                            )}
                            title={seen ? `${d.label}: ${t.rating}/100${t.mastered ? " · mastered" : ""}` : "no evidence yet"}
                          >
                            {seen ? t.rating : "·"}
                          </span>
                        </td>
                      );
                    })}
                    <td className="px-3 py-2 text-center font-serif text-lg text-ink tabular-nums">
                      {seenAny ? overallRating(s, type) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-ink-faint">
          Data is stored server-side for the whole class. Click a student to write as them, run the
          loop, then come back and hit Refresh to watch their model move. Low-confidence diagnoses
          are flagged before they change a student&apos;s mastery — the teacher is always the final marker.
        </p>
      </div>
    </main>
  );
}
