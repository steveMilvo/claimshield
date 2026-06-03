import { cn } from "@/lib/cn";

/** The Margin mark: a page with a ruled margin line and a rising stroke. */
export function Logo({ className, withWord = true }: { className?: string; withWord?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
        <rect x="3" y="2.5" width="22" height="23" rx="4" className="fill-paper" stroke="currentColor" strokeWidth="1.6" />
        <line x1="9.5" y1="3.5" x2="9.5" y2="24.5" className="stroke-pencil-500" strokeWidth="1.4" />
        <path d="M12 19 L15.5 13 L18.5 16 L22 8.5" className="stroke-focus-500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      {withWord && (
        <span className="font-serif text-[1.35rem] leading-none tracking-tight text-ink">
          Margin
        </span>
      )}
    </span>
  );
}
