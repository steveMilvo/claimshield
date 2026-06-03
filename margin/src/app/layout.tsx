import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Margin — writing that actually gets better",
  description:
    "Margin builds a living, dimension-level model of how each student's writing is developing — and turns every draft into targeted practice that moves real skills.",
};

export const viewport: Viewport = {
  themeColor: "#FBFAF6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
