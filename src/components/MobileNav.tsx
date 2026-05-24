"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 hover:border-black/30"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          {open ? (
            <>
              <path d="M6 6l12 12" />
              <path d="M18 6L6 18" />
            </>
          ) : (
            <>
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
          aria-hidden
        >
          <div
            className="absolute left-3 right-3 rounded-2xl bg-white border border-black/5 shadow-card p-3"
            style={{ top: "calc(4rem + env(safe-area-inset-top))" }}
            onClick={(e) => e.stopPropagation()}
            role="menu"
          >
            <MobileLink href="/#how" close={() => setOpen(false)}>
              How it works
            </MobileLink>
            <MobileLink href="/#pricing" close={() => setOpen(false)}>
              Pricing
            </MobileLink>
            <MobileLink href="/#faq" close={() => setOpen(false)}>
              FAQ
            </MobileLink>
            <MobileLink href="/cases" close={() => setOpen(false)}>
              My cases
            </MobileLink>
            <Link
              href="/start"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-shield-600 text-white text-sm font-medium px-4 py-2.5 hover:bg-shield-700"
            >
              Fight my claim
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileLink({
  href,
  close,
  children,
}: {
  href: string;
  close: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={close}
      role="menuitem"
      className="block rounded-xl px-3 py-2.5 text-sm hover:bg-canvas"
    >
      {children}
    </Link>
  );
}
