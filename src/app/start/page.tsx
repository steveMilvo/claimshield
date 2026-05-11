"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldMark } from "@/components/Logo";
import { cn } from "@/lib/cn";

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

  function next() {
    setStep((s) => (Math.min(3, s + 1) as Step));
  }
  function back() {
    setStep((s) => (Math.max(0, s - 1) as Step));
  }
  function runAnalysis() {
    setAnalysing(true);
    setTimeout(() => router.push("/analysis/demo"), 1800);
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 md:py-14">
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
            title="Ready to analyse"
            sub="ClaimShield will parse your policy, audit the insurer's reasoning, value your loss against comparable claims, and draft your response."
          >
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
              disabled={analysing}
              className={cn(
                "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-medium transition",
                analysing
                  ? "bg-shield-300 text-white cursor-wait"
                  : "bg-shield-600 text-white hover:bg-shield-700"
              )}
            >
              {analysing ? (
                <>
                  <Spinner />
                  Analysing your claim…
                </>
              ) : (
                <>
                  <ShieldMark className="h-5 w-5" />
                  Run ClaimShield analysis
                </>
              )}
            </button>
            <p className="mt-3 text-xs text-ink-muted text-center">
              Free preview. You&apos;ll see the recoverable upside before any
              payment.
            </p>
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
          font-size: 14px;
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
