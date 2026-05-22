import { cn } from "@/lib/cn";

export function BlueprintMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("h-8 w-8", className)}
      fill="none"
      aria-hidden
    >
      <rect width="32" height="32" rx="8" fill="#1455BF" />
      <path d="M8 10h10a4 4 0 0 1 0 8H8V10z" fill="white" opacity="0.9" />
      <rect x="8" y="22" width="16" height="2" rx="1" fill="#FBBF24" />
      <rect x="8" y="14" width="6" height="2" rx="1" fill="white" opacity="0.5" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <BlueprintMark className="h-8 w-8" />
      <div className="leading-tight">
        <div className="text-sm font-bold text-ink tracking-tight">
          Founder Tax Blueprint
        </div>
        <div className="text-[10px] text-ink-muted font-medium">
          A SynthexIQ product
        </div>
      </div>
    </div>
  );
}

export const ShieldMark = BlueprintMark;
