"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listCases, deleteCase, type CaseSummary } from "@/lib/cases";
import { formatMoney } from "@/lib/jurisdiction";
import { ShieldMark } from "@/components/Logo";

export default function CasesPage() {
  const [cases, setCases] = useState<CaseSummary[] | null>(null);

  useEffect(() => {
    setCases(listCases());
  }, []);

  function remove(id: string) {
    deleteCase(id);
    setCases(listCases());
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 md:py-14">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-shield-600 font-semibold">
            Your cases
          </div>
          <h1 className="mt-1 text-3xl md:text-4xl font-semibold tracking-tight">My cases</h1>
          <p className="mt-1 text-ink-muted text-sm">
            Saved on this device. Nothing leaves your browser until you choose to send a document.
          </p>
        </div>
        <Link
          href="/start"
          className="inline-flex items-center rounded-full bg-shield-600 text-white text-sm font-medium px-5 py-2.5 hover:bg-shield-700"
        >
          New analysis
        </Link>
      </div>

      <div className="mt-8">
        {cases === null ? (
          <div className="text-ink-muted text-sm">Loading…</div>
        ) : cases.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="space-y-3">
            {cases.map((c) => (
              <li key={c.id}>
                <CaseRow c={c} onDelete={() => remove(c.id)} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function CaseRow({ c, onDelete }: { c: CaseSummary; onDelete: () => void }) {
  return (
    <div className="rounded-2xl bg-white border border-black/5 shadow-card px-4 py-4 sm:px-5">
      <div className="flex items-start gap-4">
        <ScoreBadge score={c.score} label={c.scoreLabel} />
        <Link href={`/analysis/${c.id}`} className="flex-1 min-w-0">
          <div className="font-medium truncate">
            {c.insurer || "Unknown insurer"} · {c.policyType || "Policy"}
          </div>
          <div className="text-xs text-ink-muted mt-0.5 truncate">
            {new Date(c.createdAt).toLocaleString()} · case {c.id}
          </div>
        </Link>
        <div className="text-right shrink-0">
          <div className="text-sm font-semibold text-accent-dark whitespace-nowrap">
            +{formatMoney(c.upside, c.jurisdiction)}
          </div>
          <div className="text-[11px] text-ink-muted">recoverable</div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          onClick={onDelete}
          className="rounded-full border border-black/10 text-ink-muted text-xs px-3 py-2 hover:border-danger hover:text-danger"
        >
          Delete
        </button>
        <Link
          href={`/analysis/${c.id}`}
          className="rounded-full bg-shield-600 text-white text-xs font-medium px-4 py-2 hover:bg-shield-700"
        >
          Open
        </Link>
      </div>
    </div>
  );
}

function ScoreBadge({ score, label }: { score: number; label: string }) {
  const tone =
    label === "Strong"
      ? "bg-accent/10 text-accent-dark"
      : label === "Moderate"
        ? "bg-amber-50 text-warn"
        : "bg-danger/10 text-danger";
  return (
    <div className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl ${tone}`}>
      <span className="text-base font-semibold leading-none">{Math.max(0, Math.min(100, score))}</span>
      <span className="text-[9px] uppercase tracking-wide mt-0.5">{label}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-black/15 bg-white/60 px-6 py-12 text-center">
      <ShieldMark className="mx-auto h-10 w-10" />
      <h2 className="mt-4 text-xl font-semibold tracking-tight">No cases yet</h2>
      <p className="mt-2 text-ink-muted text-sm max-w-md mx-auto">
        Run an analysis on a denial letter or settlement offer and it&apos;ll show up here so you can pick it back up later.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link href="/start" className="rounded-full bg-shield-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-shield-700">
          Start an analysis
        </Link>
        <Link href="/analysis/demo" className="rounded-full bg-white border border-black/10 px-5 py-2.5 text-sm font-medium hover:border-black/30">
          View a sample
        </Link>
      </div>
    </div>
  );
}

