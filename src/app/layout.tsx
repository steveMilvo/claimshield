import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ConsentBanner } from "@/components/ConsentBanner";
import { RegisterServiceWorker } from "@/components/RegisterServiceWorker";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F9FC" },
    { media: "(prefers-color-scheme: dark)", color: "#0A3173" },
  ],
};

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
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "ClaimShield",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
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
        <ConsentBanner />
        <RegisterServiceWorker />
      </body>
    </html>
  );
}
