"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "claimshield:consent-v1";

export function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (window.localStorage.getItem(STORAGE_KEY) !== "1") {
        setShow(true);
      }
    } catch {
      /* private mode / storage unavailable — show by default but don't crash */
      setShow(true);
    }
  }, []);

  function dismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      data-no-print="true"
      role="region"
      aria-label="Privacy notice"
      className="fixed inset-x-3 z-40 sm:bottom-4 sm:right-4 sm:left-auto sm:max-w-sm"
      style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="rounded-2xl bg-ink text-white shadow-card border border-white/10 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span aria-hidden className="text-xl">🛡️</span>
          <div className="text-sm leading-relaxed">
            <p className="font-medium">Your documents stay yours.</p>
            <p className="mt-1 text-white/80">
              ClaimShield processes uploaded policies and letters in memory only.
              Saved cases live in this browser&apos;s local storage. We don&apos;t set
              tracking cookies.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={dismiss}
                className="rounded-full bg-white text-ink text-xs font-medium px-3 py-1.5 hover:bg-shield-50"
              >
                Got it
              </button>
              <Link
                href="/legal"
                className="rounded-full bg-white/10 text-white text-xs font-medium px-3 py-1.5 hover:bg-white/15"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
