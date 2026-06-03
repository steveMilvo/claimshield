"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/cn";

interface Roster {
  class: { id: string; name: string; teacherName: string } | null;
  students: { id: string; name: string }[];
  teacher: { id: string; name: string };
  googleConfigured: boolean;
}

export default function SignIn() {
  const router = useRouter();
  const [roster, setRoster] = useState<Roster | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/demo")
      .then((r) => r.json())
      .then(setRoster)
      .catch(() => {});
  }, []);

  async function signIn(role: "student" | "teacher", id: string, name: string, to: string) {
    setBusy(id);
    await fetch("/api/auth/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, id, name }),
    });
    router.push(to);
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-line/70">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3.5">
          <Link href="/"><Logo /></Link>
          <Link href="/" className="text-sm text-ink-muted hover:text-ink">Back</Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-12">
        <h1 className="font-serif text-3xl text-ink">Sign in</h1>
        <p className="mt-1 text-ink-muted">
          Pilot sign-in for class <span className="font-medium text-ink-soft">{roster?.class?.name ?? "8E English"}</span>.
        </p>

        {/* Google (real OAuth, enabled when configured) */}
        <div className="mt-6 rounded-2xl border border-line bg-card p-5 shadow-card">
          <p className="text-xs uppercase tracking-wide text-ink-muted">Single sign-on</p>
          <a
            href={roster?.googleConfigured ? "/api/auth/google" : undefined}
            aria-disabled={!roster?.googleConfigured}
            className={cn(
              "mt-3 inline-flex items-center gap-2.5 rounded-xl border px-4 py-2.5 font-medium transition",
              roster?.googleConfigured
                ? "border-line bg-paper text-ink hover:bg-canvas"
                : "cursor-not-allowed border-line bg-paper text-ink-faint"
            )}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
              <path d="M17.6 9.2c0-.6-.1-1.2-.2-1.7H9v3.3h4.8a4.1 4.1 0 0 1-1.8 2.7v2.2h2.9c1.7-1.6 2.7-3.9 2.7-6.5z" fill="#4285F4" />
              <path d="M9 18c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.5-1.8.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H.9v2.3A9 9 0 0 0 9 18z" fill="#34A853" />
              <path d="M3.9 10.7a5.4 5.4 0 0 1 0-3.4V5H.9a9 9 0 0 0 0 8l3-2.3z" fill="#FBBC05" />
              <path d="M9 3.6c1.3 0 2.5.5 3.4 1.3l2.6-2.6A9 9 0 0 0 .9 5l3 2.3C4.6 5.2 6.6 3.6 9 3.6z" fill="#EA4335" />
            </svg>
            Continue with Google
          </a>
          {!roster?.googleConfigured && (
            <p className="mt-2 text-xs text-ink-faint">
              Google sign-in is wired and ready — set <code className="rounded bg-paper px-1">GOOGLE_CLIENT_ID</code> and{" "}
              <code className="rounded bg-paper px-1">GOOGLE_CLIENT_SECRET</code> in <code className="rounded bg-paper px-1">.env.local</code> to enable it.
            </p>
          )}
        </div>

        {/* Roster picker */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-card p-5 shadow-card">
            <p className="text-xs uppercase tracking-wide text-ink-muted">Students</p>
            <div className="mt-3 space-y-2">
              {(roster?.students ?? []).map((s) => (
                <button
                  key={s.id}
                  disabled={busy !== null}
                  onClick={() => signIn("student", s.id, s.name, "/")}
                  className="flex w-full items-center justify-between rounded-xl border border-line bg-paper px-4 py-2.5 text-left transition hover:border-focus-300 hover:bg-focus-50"
                >
                  <span className="font-medium text-ink">{s.name}</span>
                  <span className="text-sm text-focus-600">{busy === s.id ? "…" : "Write →"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-card p-5 shadow-card">
            <p className="text-xs uppercase tracking-wide text-ink-muted">Teacher</p>
            <div className="mt-3">
              {roster?.teacher && (
                <button
                  disabled={busy !== null}
                  onClick={() => signIn("teacher", roster.teacher.id, roster.teacher.name, "/teacher")}
                  className="flex w-full items-center justify-between rounded-xl border border-line bg-paper px-4 py-2.5 text-left transition hover:border-growth-300 hover:bg-growth-50"
                >
                  <span className="font-medium text-ink">{roster.teacher.name}</span>
                  <span className="text-sm text-growth-600">{busy === roster.teacher.id ? "…" : "Open dashboard →"}</span>
                </button>
              )}
            </div>
            <p className="mt-3 text-xs text-ink-faint">
              The teacher sees every student&apos;s live writing model for the class.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
