"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldMark } from "@/components/Logo";
import { cn } from "@/lib/cn";
import { listCases, saveCase } from "@/lib/cases";
import type { Analysis } from "@/lib/mockAnalysis";

type Step = 0 | 1 | 2 | 3;

const steps = [
  { label: "Policy", helper: "Upload your insurance policy" },
  { label: "Loss", helper: "Tell us what happened" },
  { label: "Insurer letter", helper: "Add the denial or offer" },
  { label: "Analyse", helper: "We do the rest" },
];

export default function StartPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [policyFile, setPolicyFile] = useState<File | null>(null);
  const [letterFile, setLetterFile] = useState<File | null>(null);
  const [category, setCategory] = useState("auto");
  const [insurer, setInsurer] = useState("");
  const [description, setDescription] = useState("");
  const [offerAmount, setOfferAmount] = useState("");
  const [estimateAmount, setEstimateAmount] = useState("");
  const [analysing, setAnalysing] = useState(false);
  const [phase, setPhase] = useState<"upload" | "analyse">("upload");
  const [uploadPct, setUploadPct] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    setSavedCount(listCases().length);
  }, []);

  function next() {
    setStep((s) => (Math.min(3, s + 1) as Step));
  }
  function back() {
    setStep((s) => (Math.max(0, s - 1) as Step));
  }

  async function runAnalysis() {
    setAnalysing(true);
    setPhase("upload");
    setUploadPct(0);
    setError(null);
    try {
      const fd = new FormData();
      if (policyFile) fd.append("policy", policyFile);
      if (letterFile) fd.append("letter", letterFile);
      fd.append("category", category);
      fd.append("insurer", insurer);
      fd.append("description", description);
      fd.append("offerAmount", offerAmount);
      fd.append("estimateAmount", estimateAmount);

      const data = await uploadAnalysis(fd, {
        onProgress: (p) => setUploadPct(p),
        onUploadComplete: () => {
          setUploadPct(1);
          setPhase("analyse");
        },
      });

      const id = saveCase(data.analysis);
      router.push(`/analysis/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setAnalysing(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 md:py-14">
      {step === 0 && savedCount > 0 && (
        <div className="mb-5 rounded-xl bg-shield-50 border border-shield-100 px-4 py-2.5 text-sm text-shield-700 flex items-center justify-between gap-3">
          <span>
            You have {savedCount} saved {savedCount === 1 ? "case" : "cases"} on this device.
          </span>
          <Link href="/cases" className="font-medium hover:underline shrink-0">
            View →
          </Link>
        </div>
      )}
      <Stepper current={step} />

      <div className="mt-8 rounded-2xl bg-white border border-black/5 shadow-card p-6 md:p-8">
        {step === 0 && (
          <StepShell
            title="Upload your insurance policy"
            sub="PDF, photo of the booklet, or insurer portal export. We'll parse it in plain English — even the 80-page ones."
          >
            <FileDrop
              file={policyFile}
              onFile={setPolicyFile}
              accept=".pdf,image/*"
              hint="Drop your policy PDF here, or click to choose"
            />
            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              <Field label="Insurance category">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input"
                >
                  <option value="auto">Auto / Motor</option>
                  <option value="home">Home / Property</option>
                  <option value="renters">Renters</option>
                  <option value="travel">Travel</option>
                  <option value="health">Health / Medical</option>
                </select>
              </Field>
              <Field label="Insurer">
                <input
                  value={insurer}
                  onChange={(e) => setInsurer(e.target.value)}
                  placeholder="e.g. Auric Mutual"
                  className="input"
                />
              </Field>
            </div>
          </StepShell>
        )}

        {step === 1 && (
          <StepShell
            title="Tell us what happened"
            sub="A few lines is fine. Add any incident reference, photos or repair quotes you have."
          >
            <Field label="Describe the loss">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="e.g. Rear-quarter collision on 12 April; third party at fault…"
                className="input"
              />
            </Field>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <Field label="Independent estimate / actual cost (AUD)">
                <input
                  inputMode="decimal"
                  value={estimateAmount}
                  onChange={(e) => setEstimateAmount(e.target.value)}
                  placeholder="7400"
                  className="input"
                />
              </Field>
              <Field label="Supporting docs (optional)">
                <FileDrop
                  compact
                  hint="Add photos, quotes, receipts"
                  accept="image/*,.pdf"
                />
              </Field>
            </div>
          </StepShell>
        )}

        {step === 2 && (
          <StepShell
            title="Add the denial or offer letter"
            sub="The letter from your insurer. We'll cross-reference it line-by-line against your policy and the regulations they have to follow."
          >
            <FileDrop
              file={letterFile}
              onFile={setLetterFile}
              accept=".pdf,image/*"
              hint="Drop the denial letter / offer here"
            />
            <Field label="Settlement offered (AUD)" className="mt-5">
              <input
                inputMode="decimal"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                placeholder="2100"
                className="input"
              />
            </Field>
          </StepShell>
        )}

        {step === 3 && (
          <StepShell
            title={analysing ? "Working on it" : "Ready to analyse"}
            sub={
              analysing
                ? "Hang tight while ClaimShield reads your documents, cross-references the regulations, and drafts your response."
                : "ClaimShield will parse your policy, audit the insurer's reasoning, value your loss against comparable claims, and draft your response."
            }
          >
            {analysing ? (
              phase === "upload" ? (
                <UploadingCard pct={uploadPct} />
              ) : (
                <AnalysingCard />
              )
            ) : (
              <>
                <Summary
                  items={[
                    ["Category", labelForCategory(category)],
                    ["Insurer", insurer || "—"],
                    ["Policy file", policyFile?.name || "—"],
                    ["Letter file", letterFile?.name || "—"],
                    ["Offered", offerAmount ? `$${offerAmount}` : "—"],
                    ["Your estimate", estimateAmount ? `$${estimateAmount}` : "—"],
                  ]}
                />
                <button
                  onClick={runAnalysis}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-medium transition bg-shield-600 text-white hover:bg-shield-700"
                >
                  <ShieldMark className="h-5 w-5" />
                  Run ClaimShield analysis
                </button>
                {error && (
                  <div className="mt-3 rounded-lg bg-danger/10 border border-danger/20 px-4 py-3 text-sm text-danger">
                    {error}
                  </div>
                )}
                <p className="mt-3 text-xs text-ink-muted text-center">
                  Free preview. You&apos;ll see the recoverable upside before any payment.
                </p>
              </>
            )}
          </StepShell>
        )}

        {step < 3 && (
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={back}
              disabled={step === 0}
              className={cn(
                "text-sm font-medium px-4 py-2 rounded-full",
                step === 0
                  ? "text-ink-muted/40 cursor-not-allowed"
                  : "text-ink hover:bg-canvas"
              )}
            >
              ← Back
            </button>
            <button
              onClick={next}
              className="inline-flex items-center gap-2 rounded-full bg-shield-600 text-white text-sm font-medium px-5 py-2.5 hover:bg-shield-700 transition"
            >
              Continue →
            </button>
          </div>
        )}
      </div>

      <p className="mt-6 text-xs text-ink-muted text-center">
        Your documents are processed in memory. We do not store raw policies or
        claim letters on our servers.
      </p>
    </div>
  );
}

function labelForCategory(c: string) {
  return (
    {
      auto: "Auto / Motor",
      home: "Home / Property",
      renters: "Renters",
      travel: "Travel",
      health: "Health / Medical",
    }[c] || c
  );
}

function StepShell({
  title,
  sub,
  children,
}: {
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-1.5 text-ink-muted text-sm">{sub}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s.label} className="flex-1 flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium w-full",
                active && "bg-shield-50 text-shield-700",
                done && "bg-accent/10 text-accent-dark",
                !active && !done && "text-ink-muted"
              )}
            >
              <span
                className={cn(
                  "inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px]",
                  active && "bg-shield-600 text-white",
                  done && "bg-accent text-white",
                  !active && !done && "bg-black/5 text-ink-muted"
                )}
              >
                {done ? "✓" : i + 1}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-xs font-medium text-ink-soft">{label}</span>
      <div className="mt-1.5">{children}</div>
      <style jsx>{`
        :global(.input) {
          width: 100%;
          border-radius: 10px;
          border: 1px solid rgba(11, 27, 43, 0.12);
          background: white;
          padding: 10px 12px;
          font-size: 16px;
          outline: none;
          transition: border-color 120ms, box-shadow 120ms;
        }
        :global(.input:focus) {
          border-color: #1f6fe5;
          box-shadow: 0 0 0 4px rgba(31, 111, 229, 0.12);
        }
      `}</style>
    </label>
  );
}

function FileDrop({
  file,
  onFile,
  hint,
  accept,
  compact,
}: {
  file?: File | null;
  onFile?: (f: File | null) => void;
  hint: string;
  accept?: string;
  compact?: boolean;
}) {
  return (
    <label
      className={cn(
        "block cursor-pointer rounded-xl border-2 border-dashed border-black/15 hover:border-shield-500 hover:bg-shield-50/40 transition",
        compact ? "p-4" : "p-8 text-center"
      )}
    >
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onFile?.(e.target.files?.[0] ?? null)}
      />
      {file ? (
        <div className="flex items-center gap-3">
          <FileIcon />
          <div className="text-sm">
            <div className="font-medium">{file.name}</div>
            <div className="text-ink-muted text-xs">
              {(file.size / 1024).toFixed(0)} KB · click to replace
            </div>
          </div>
        </div>
      ) : (
        <div className={cn(compact && "flex items-center gap-3")}>
          <CloudUpIcon />
          <div className={cn(compact ? "text-sm text-ink-muted" : "mt-3 text-sm text-ink-muted")}>
            {hint}
          </div>
        </div>
      )}
    </label>
  );
}

function Summary({ items }: { items: [string, string][] }) {
  return (
    <dl className="grid sm:grid-cols-2 gap-3">
      {items.map(([k, v]) => (
        <div key={k} className="rounded-lg bg-canvas px-4 py-3">
          <dt className="text-[11px] uppercase tracking-wider text-ink-muted">{k}</dt>
          <dd className="mt-0.5 text-sm font-medium truncate">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function uploadAnalysis(
  fd: FormData,
  opts: { onProgress: (p: number) => void; onUploadComplete: () => void },
): Promise<{ analysis: Analysis }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/analyze");
    xhr.responseType = "json";
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && e.total > 0) opts.onProgress(e.loaded / e.total);
    };
    xhr.upload.onload = () => opts.onUploadComplete();
    xhr.onload = () => {
      const body = xhr.response as { analysis?: Analysis; error?: string } | null;
      if (xhr.status >= 200 && xhr.status < 300) {
        if (body && body.analysis) resolve({ analysis: body.analysis });
        else reject(new Error("Server returned no analysis."));
      } else {
        reject(new Error(body?.error || `Request failed (${xhr.status}).`));
      }
    };
    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.send(fd);
  });
}

function UploadingCard({ pct }: { pct: number }) {
  const clamped = Math.max(0, Math.min(1, pct));
  return (
    <div className="rounded-2xl bg-canvas/60 border border-black/5 p-6 text-center">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-shield-600 text-white">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight">Uploading your documents</h3>
      <p className="mt-1 text-sm text-ink-muted">
        Sending {Math.round(clamped * 100)}% — analysis starts the moment it lands.
      </p>
      <div className="mt-5 mx-auto max-w-sm h-2 rounded-full bg-black/5 overflow-hidden">
        <div
          className="h-full bg-shield-600 transition-[width] duration-200 ease-out"
          style={{ width: `${clamped * 100}%` }}
          role="progressbar"
          aria-valuenow={Math.round(clamped * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

const ANALYSING_STEPS = [
  "Reading your policy document",
  "Auditing the insurer's reasoning",
  "Cross-referencing the regulations",
  "Valuing the loss against comparables",
  "Drafting your appeal, demand & complaint",
];

function AnalysingCard() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setIdx((i) => Math.min(ANALYSING_STEPS.length - 1, i + 1)),
      4500,
    );
    return () => clearInterval(t);
  }, []);
  return (
    <div className="rounded-2xl bg-canvas/60 border border-black/5 p-6 text-center">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-shield-600 text-white">
        <Spinner />
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight">Analysing your claim</h3>
      <p className="mt-1 text-sm text-ink-muted">This usually takes 30–90 seconds.</p>
      <ul className="mt-5 mx-auto max-w-sm space-y-2 text-left text-sm">
        {ANALYSING_STEPS.map((m, i) => (
          <li key={m} className="flex items-center gap-3">
            <span
              className={cn(
                "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                i < idx && "bg-accent text-white",
                i === idx && "bg-shield-600 text-white",
                i > idx && "bg-black/5 text-ink-muted",
              )}
              aria-hidden
            >
              {i < idx ? "✓" : i + 1}
            </span>
            <span className={i <= idx ? "text-ink" : "text-ink-muted"}>{m}</span>
          </li>
        ))}
      </ul>
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

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 text-shield-600">
      <path
        fill="currentColor"
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z"
      />
    </svg>
  );
}

function CloudUpIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-10 w-10 text-shield-600 mx-auto">
      <path
        fill="currentColor"
        d="M19.35 10.04A7.49 7.49 0 0 0 12 4a7.5 7.5 0 0 0-6.96 4.78A5.5 5.5 0 0 0 6 19.5h13a4.5 4.5 0 0 0 .35-9.46zM13 13v4h-2v-4H8l4-4 4 4h-3z"
      />
    </svg>
  );
}
