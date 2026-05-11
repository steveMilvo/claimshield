"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { mockAnalysis, type Analysis } from "@/lib/mockAnalysis";
import { getCase } from "@/lib/cases";
import { downloadDocx } from "@/lib/downloadDocx";
import { ShieldMark } from "@/components/Logo";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; analysis: Analysis; demo: boolean }
  | { status: "missing" };

export default function AnalysisPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    if (id === "demo") {
      setState({ status: "ready", analysis: mockAnalysis, demo: true });
      return;
    }
    const c = getCase(id ?? "");
    if (c) {
      setState({ status: "ready", analysis: c, demo: false });
      return;
    }
    setState({ status: "missing" });
  }, [id]);

  if (state.status === "loading") {
    return (
      <div className="mx-auto max-w-6xl px-5 py-20 text-center text-ink-muted">
        Loading analysis…
      </div>
    );
  }

  if (state.status === "missing") {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <ShieldMark className="mx-auto h-10 w-10" />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">No analysis found</h1>
        <p className="mt-2 text-ink-muted">
          We couldn&apos;t find this case in your browser storage — it may have been opened on another device or cleared. Try your saved cases, or run a fresh analysis.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link href="/start" className="rounded-full bg-shield-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-shield-700">
            Start an analysis
          </Link>
          <Link href="/cases" className="rounded-full bg-white border border-black/10 px-5 py-2.5 text-sm font-medium hover:border-black/30">
            My cases
          </Link>
          <Link href="/analysis/demo" className="rounded-full bg-white border border-black/10 px-5 py-2.5 text-sm font-medium hover:border-black/30">
            View a sample
          </Link>
        </div>
      </div>
    );
  }

  return <AnalysisView a={state.analysis} demo={state.demo} />;
}

function AnalysisView({ a, demo }: { a: Analysis; demo: boolean }) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      {demo && (
        <div className="mb-6 rounded-xl bg-shield-50 border border-shield-100 px-4 py-3 text-sm text-shield-700">
          This is a sample analysis. <Link href="/start" className="underline font-medium">Run your own</Link> to analyse a real policy and denial letter.
        </div>
      )}
      <ResultHeader a={a} />

      <div className="mt-8 grid lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 space-y-6">
          <UpsideCard offer={a.insurerOffer} fair={a.estimatedFairValue} upside={a.upside} />
          <FindingsCard findings={a.findings} />
          {a.comparables.length > 0 && <ComparablesCard rows={a.comparables} />}
          <NextStepsCard steps={a.nextSteps} />
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <ScoreCard score={a.score} label={a.scoreLabel} />
          <DocumentsCard a={a} />
          <AppealLetterCard letter={a.appealLetter} />
          <DisclaimerCard />
        </aside>
      </div>
    </div>
  );
}

function ResultHeader({ a }: { a: Analysis }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div className="text-xs uppercase tracking-[0.18em] text-shield-600 font-semibold">
          ClaimShield analysis
        </div>
        <h1 className="mt-1 text-3xl md:text-4xl font-semibold tracking-tight">
          {a.insurer} · {a.policyType}
        </h1>
        <p className="mt-1 text-ink-muted text-sm">
          Policy {a.policyNumber} · analysed {new Date().toLocaleDateString()}
        </p>
      </div>
      <div className="flex gap-2">
        <Link
          href="/cases"
          className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm hover:border-black/30"
        >
          My cases
        </Link>
        <Link
          href="/start"
          className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm hover:border-black/30"
        >
          New analysis
        </Link>
        <button className="rounded-full bg-shield-600 text-white px-4 py-2 text-sm font-medium hover:bg-shield-700">
          Send appeal →
        </button>
      </div>
    </div>
  );
}

function UpsideCard({ offer, fair, upside }: { offer: number; fair: number; upside: number }) {
  const pct = fair > 0 ? Math.min(100, Math.round((offer / fair) * 100)) : 0;
  return (
    <div className="rounded-2xl shield-gradient text-white p-6 md:p-8 relative overflow-hidden">
      <div className="absolute -right-10 -top-12 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
      <div className="relative grid sm:grid-cols-2 gap-6">
        <div>
          <div className="text-shield-100 text-sm">Estimated recoverable upside</div>
          <div className="mt-1 text-5xl font-semibold tracking-tight">+{money(upside)}</div>
          <div className="mt-2 text-shield-100 text-sm">
            The insurer offered {money(offer)} — fair value is {money(fair)}.
          </div>
        </div>
        <div>
          <div className="text-shield-100 text-sm">Current offer vs fair value</div>
          <div className="mt-3 h-3 rounded-full bg-white/15 overflow-hidden">
            <div className="h-full bg-white" style={{ width: `${pct}%` }} aria-label={`Offer is ${pct}% of fair value`} />
          </div>
          <div className="mt-2 text-xs text-shield-100">
            Current offer is <span className="font-semibold text-white">{pct}%</span> of independently estimated value.
          </div>
        </div>
      </div>
    </div>
  );
}

function FindingsCard({ findings }: { findings: Analysis["findings"] }) {
  return (
    <Card title="What we found" eyebrow="Findings">
      <ul className="divide-y divide-black/5">
        {findings.map((f, i) => (
          <li key={i} className="py-4 first:pt-0 last:pb-0 flex gap-4">
            <FindingIcon kind={f.kind} />
            <div className="flex-1">
              <div className="font-medium">{f.title}</div>
              <p className="text-sm text-ink-muted mt-1 leading-relaxed">{f.detail}</p>
              {f.citation && (
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-canvas px-2.5 py-0.5 text-[11px] font-medium text-ink-soft">
                  {f.citation}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function FindingIcon({ kind }: { kind: string }) {
  const map: Record<string, { bg: string; fg: string; path: string }> = {
    exclusion: { bg: "bg-shield-50", fg: "text-shield-700", path: "M4 6h16M4 12h16M4 18h10" },
    regulation: { bg: "bg-accent/10", fg: "text-accent-dark", path: "M12 2l9 4v6c0 5-3.5 8.5-9 10-5.5-1.5-9-5-9-10V6l9-4z" },
    valuation: { bg: "bg-amber-50", fg: "text-warn", path: "M3 17l6-6 4 4 8-8M21 7h-5M21 7v5" },
    procedure: { bg: "bg-shield-50", fg: "text-shield-700", path: "M12 8v4l3 2M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z" },
  };
  const m = map[kind] || map.exclusion;
  return (
    <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${m.bg} ${m.fg}`}>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d={m.path} />
      </svg>
    </span>
  );
}

function ComparablesCard({ rows }: { rows: Analysis["comparables"] }) {
  return (
    <Card eyebrow="Comparables" title="Similar claims, similar outcomes">
      <div className="-mx-6 -mb-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-canvas text-ink-muted">
            <tr>
              <th className="text-left font-medium px-6 py-2.5">Reference</th>
              <th className="text-left font-medium px-6 py-2.5">Insurer</th>
              <th className="text-left font-medium px-6 py-2.5">Settlement</th>
              <th className="text-left font-medium px-6 py-2.5">Note</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.reference} className="border-t border-black/5">
                <td className="px-6 py-3 font-mono text-xs text-ink-soft">{r.reference}</td>
                <td className="px-6 py-3">{r.insurer}</td>
                <td className="px-6 py-3 font-medium">{r.settlement}</td>
                <td className="px-6 py-3 text-ink-muted">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function NextStepsCard({ steps }: { steps: Analysis["nextSteps"] }) {
  return (
    <Card eyebrow="Play-by-play" title="Your next moves">
      <ol className="space-y-4">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-4">
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-shield-50 text-shield-700 text-xs font-semibold">
              {i + 1}
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <div className="font-medium">{s.title}</div>
                <span className="text-[11px] rounded-full bg-canvas px-2 py-0.5 text-ink-muted">{s.due}</span>
              </div>
              <p className="text-sm text-ink-muted mt-1">{s.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}

function ScoreCard({ score, label }: { score: number; label: string }) {
  const clamped = Math.max(0, Math.min(100, score));
  const full = 2 * Math.PI * 42;
  const dash = (clamped / 100) * full;
  return (
    <Card eyebrow="Strength" title="ClaimShield Score">
      <div className="flex items-center gap-5">
        <div className="relative h-28 w-28">
          <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90">
            <circle cx="50" cy="50" r="42" stroke="#E2E8F0" strokeWidth="10" fill="none" />
            <circle cx="50" cy="50" r="42" stroke="#1F6FE5" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={`${dash} ${full - dash}`} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-semibold tracking-tight">{clamped}</div>
            <div className="text-[10px] uppercase tracking-wider text-ink-muted">/ 100</div>
          </div>
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 text-accent-dark px-2.5 py-0.5 text-xs font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {label} case
          </div>
          <p className="mt-2 text-sm text-ink-muted leading-relaxed">
            Based on policy fit, regulatory leverage, the valuation gap, and outcomes of comparable claims.
          </p>
        </div>
      </div>
    </Card>
  );
}

function bodyForKind(a: Analysis, kind: string): string {
  if (kind === "demand") return a.demandLetter;
  if (kind === "complaint") return a.complaintText;
  return a.appealLetter;
}

function DocumentsCard({ a }: { a: Analysis }) {
  const icons: Record<string, string> = { appeal: "📩", demand: "💰", complaint: "🏛️" };
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function download(name: string, body: string, kind: "appeal" | "demand" | "complaint") {
    setBusy(name);
    setError(null);
    try {
      await downloadDocx(name, body, kind);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <Card eyebrow="Ready to send" title="Generated documents">
      <ul className="space-y-2">
        {a.generatedDocs.map((d) => (
          <li key={d.name} className="flex items-center justify-between gap-3 rounded-xl border border-black/5 bg-canvas/60 px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-lg shrink-0" aria-hidden>{icons[d.kind] ?? "📄"}</span>
              <div className="min-w-0">
                <div className="font-medium text-sm truncate">{d.name}</div>
                <div className="text-xs text-ink-muted capitalize">{d.kind}</div>
              </div>
            </div>
            <button
              onClick={() => download(d.name, bodyForKind(a, d.kind), d.kind)}
              disabled={busy === d.name}
              className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-full bg-shield-600 text-white hover:bg-shield-700 disabled:opacity-60"
            >
              {busy === d.name ? "Preparing…" : "Download .docx"}
            </button>
          </li>
        ))}
      </ul>
      {error && <div className="mt-3 text-xs text-danger">{error}</div>}
    </Card>
  );
}

function AppealLetterCard({ letter }: { letter: string }) {
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function copy() {
    try {
      await navigator.clipboard?.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  async function download() {
    setBusy(true);
    setError(null);
    try {
      await downloadDocx("ClaimShield Appeal Letter", letter, "appeal");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card eyebrow="Preview" title="Your appeal letter">
      <pre className="whitespace-pre-wrap text-[13px] leading-relaxed font-sans text-ink-soft bg-canvas/60 rounded-xl border border-black/5 p-4 max-h-80 overflow-auto">
        {letter}
      </pre>
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="rounded-full bg-shield-600 text-white text-sm font-medium px-4 py-2 hover:bg-shield-700">Send via ClaimShield</button>
        <button
          className="rounded-full bg-white border border-black/10 text-sm font-medium px-4 py-2 hover:border-black/30"
          onClick={copy}
        >
          {copied ? "Copied ✓" : "Copy text"}
        </button>
        <button
          className="rounded-full bg-white border border-black/10 text-sm font-medium px-4 py-2 hover:border-black/30 disabled:opacity-60"
          onClick={download}
          disabled={busy}
        >
          {busy ? "Preparing…" : "Download .docx"}
        </button>
      </div>
      {error && <div className="mt-2 text-xs text-danger">{error}</div>}
    </Card>
  );
}

function DisclaimerCard() {
  return (
    <div className="rounded-2xl border border-black/5 bg-white/60 p-5 text-xs text-ink-muted leading-relaxed">
      <div className="flex items-center gap-2 text-ink-soft font-medium">
        <ShieldMark className="h-4 w-4" />
        Information, not legal advice
      </div>
      <p className="mt-2">
        ClaimShield helps you understand your policy and prepare documents. It does not provide legal advice and is not a law firm. For complex matters we&apos;ll flag when a licensed professional makes sense.
      </p>
    </div>
  );
}

function Card({ eyebrow, title, children }: { eyebrow?: string; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white border border-black/5 shadow-card p-6">
      {eyebrow && (
        <div className="text-[11px] uppercase tracking-[0.18em] text-shield-600 font-semibold">{eyebrow}</div>
      )}
      <h3 className="mt-1 text-lg font-semibold tracking-tight">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function money(n: number) {
  return (Number.isFinite(n) ? n : 0).toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  });
}
