import { cn } from "@/lib/cn";

export function Logo({ className, mark = false }: { className?: string; mark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold tracking-tight", className)}>
      <ShieldMark />
      {!mark && (
        <span>
          Claim<span className="text-shield-600">Shield</span>
        </span>
      )}
    </span>
  );
}

export function ShieldMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("h-7 w-7", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="csg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1F6FE5" />
          <stop offset="100%" stopColor="#0A3173" />
        </linearGradient>
      </defs>
      <path
        d="M16 2.5l11 3.6v9c0 7.5-4.9 12.7-11 14.4-6.1-1.7-11-6.9-11-14.4v-9l11-3.6z"
        fill="url(#csg)"
      />
      <path
        d="M10.5 16.2l3.6 3.6 7.4-7.4"
        fill="none"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
