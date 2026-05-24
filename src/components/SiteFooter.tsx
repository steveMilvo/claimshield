import Link from "next/link";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer data-no-print="true" className="mt-16 border-t border-black/5 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-10 flex flex-col md:flex-row gap-6 md:items-center md:justify-between text-sm text-ink-muted">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-ink-muted">Fighting back, automatically.</span>
        </div>
        <div className="flex gap-6">
          <Link href="/#how">How it works</Link>
          <Link href="/#pricing">Pricing</Link>
          <Link href="/cases">My cases</Link>
          <Link href="/legal">Legal</Link>
          <a href="mailto:info@milvotech.com">Contact</a>
        </div>
        <div>© {new Date().getFullYear()} MilvoTech Pty Ltd</div>
      </div>
    </footer>
  );
}
