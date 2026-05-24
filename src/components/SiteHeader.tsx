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
          <Link href="/#how" className="hover:text-ink transition-colors">How it works</Link>
          <Link href="/#report" className="hover:text-ink transition-colors">What&rsquo;s in the report</Link>
          <Link href="/#pricing" className="hover:text-ink transition-colors">Pricing</Link>
          <Link href="/#faq" className="hover:text-ink transition-colors">FAQ</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/start"
            className="inline-flex items-center rounded-full bg-blueprint-500 text-white text-sm font-medium px-4 py-2 hover:bg-blueprint-600 transition"
          >
            Start free Blueprint →
          </Link>
        </div>
      </div>
    </header>
  );
}
