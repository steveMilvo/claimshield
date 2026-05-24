import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://claimshield.local",
  ),
  title: {
    default: "ClaimShield — Fighting back, automatically.",
    template: "%s · ClaimShield",
  },
  description:
    "ClaimShield is your AI-powered insurance claim negotiator. Upload your policy and denial letter; get an expert appeal, a regulator-ready complaint, and the dollars you're owed.",
  applicationName: "ClaimShield",
  authors: [{ name: "MilvoTech Pty Ltd" }],
  openGraph: {
    type: "website",
    siteName: "ClaimShield",
    title: "ClaimShield — Fighting back, automatically.",
    description:
      "AI-powered insurance claim negotiator. Reads your policy, picks apart the denial, drafts your appeal in 60 seconds.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClaimShield — Fighting back, automatically.",
    description:
      "AI-powered insurance claim negotiator. Reads your policy, picks apart the denial, drafts your appeal in 60 seconds.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
