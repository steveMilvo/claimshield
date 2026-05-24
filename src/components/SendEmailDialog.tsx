"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export type SendDraft = {
  recipient: string;
  subject: string;
  body: string;
};

export function SendEmailDialog({
  open,
  onClose,
  initial,
  title = "Send via your email",
  helper = "ClaimShield opens this in your email app — it does not send mail on your behalf.",
}: {
  open: boolean;
  onClose: () => void;
  initial: SendDraft;
  title?: string;
  helper?: string;
}) {
  const [draft, setDraft] = useState<SendDraft>(initial);
  const [copied, setCopied] = useState(false);
  const recipientRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setDraft(initial);
      setCopied(false);
      // Focus the recipient field once the modal mounts.
      setTimeout(() => recipientRef.current?.focus(), 50);
    }
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const mailto =
    `mailto:${encodeURIComponent(draft.recipient || "")}` +
    `?subject=${encodeURIComponent(draft.subject)}` +
    `&body=${encodeURIComponent(draft.body)}`;
  const bodyTooLong = mailto.length > 1900;

  async function copy() {
    const text = `To: ${draft.recipient}\nSubject: ${draft.subject}\n\n${draft.body}`;
    try {
      await navigator.clipboard?.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  function open_() {
    if (typeof window !== "undefined") window.location.href = mailto;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/40 backdrop-blur-sm p-4"
      style={{
        paddingTop: "max(1rem, env(safe-area-inset-top))",
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
      }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl bg-white shadow-card border border-black/5 max-h-[90dvh] flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-shield-600 font-semibold">
              Send
            </div>
            <div className="font-semibold tracking-tight">{title}</div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full h-8 w-8 inline-flex items-center justify-center text-ink-muted hover:bg-canvas"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-4 overflow-auto">
          <Field label="To">
            <input
              ref={recipientRef}
              type="email"
              autoComplete="email"
              value={draft.recipient}
              onChange={(e) => setDraft({ ...draft, recipient: e.target.value })}
              placeholder="claims@your-insurer.com.au"
              className="input"
            />
          </Field>
          <Field label="Subject">
            <input
              type="text"
              value={draft.subject}
              onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Message">
            <textarea
              value={draft.body}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })}
              rows={12}
              className="input font-mono text-[12.5px] leading-relaxed"
            />
          </Field>
          <p className="text-xs text-ink-muted">{helper}</p>
          {bodyTooLong && (
            <p className="text-xs text-warn">
              This message is long — some mail clients truncate `mailto:` links. If the body
              looks cut off, use <span className="font-medium">Copy email</span> and paste it instead.
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-black/5 bg-canvas/40">
          <button
            onClick={copy}
            className={cn(
              "rounded-full bg-white border border-black/10 text-sm font-medium px-4 py-2 hover:border-black/30",
              copied && "text-accent-dark border-accent/40",
            )}
          >
            {copied ? "Copied ✓" : "Copy email"}
          </button>
          <button
            onClick={open_}
            className="rounded-full bg-shield-600 text-white text-sm font-medium px-4 py-2 hover:bg-shield-700"
          >
            Open in mail app →
          </button>
        </div>
      </div>

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
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink-soft">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
