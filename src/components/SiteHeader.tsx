import Link from "next/link";
import { Logo } from "./Logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-canvas/80 border-b border-black/5">
      <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-ink-muted">
          <Link href="/#how" className="hover:text-ink">How it works</Link>
          <Link href="/#pricing" className="hover:text-ink">Pricing</Link>
          <Link href="/#faq" className="hover:text-ink">FAQ</Link>
          <Link href="/cases" className="hover:text-ink">My cases</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/start"
            className="inline-flex items-center rounded-full bg-shield-600 text-white text-sm font-medium px-4 py-2 hover:bg-shield-700 transition"
          >
            Fight my claim
          </Link>
        </div>
      </div>
    </header>
  );
}
