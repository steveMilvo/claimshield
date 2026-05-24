import { cn } from "@/lib/cn";

// Brand mark — the F-wing icon. Used standalone in tight spaces or alongside text.
export function BlueprintMark({ className }: { className?: string }) {
  return (
    <img
      src="/branding/mark.png"
      alt=""
      aria-hidden
      className={cn("h-8 w-8 object-contain", className)}
    />
  );
}

// Full lockup for use on light backgrounds (header, white cards).
export function Logo({ className }: { className?: string }) {
  return (
    <img
      src="/branding/logo-light.png"
      alt="Founder Tax Blueprint — a SynthexIQ product"
      className={cn("h-9 w-auto object-contain", className)}
    />
  );
}

// Lockup for use on the navy/dark backgrounds.
export function LogoDark({ className }: { className?: string }) {
  return (
    <img
      src="/branding/logo-dark.png"
      alt="Founder Tax Blueprint — a SynthexIQ product"
      className={cn("h-9 w-auto object-contain", className)}
    />
  );
}

export const ShieldMark = BlueprintMark;
