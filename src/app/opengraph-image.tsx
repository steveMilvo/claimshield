import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ClaimShield — Your AI-powered insurance claim negotiator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background:
            "linear-gradient(135deg, #0A3173 0%, #1455BF 55%, #1F6FE5 100%)",
          color: "white",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="56" height="56" viewBox="0 0 32 32">
            <path
              d="M16 2.5l11 3.6v9c0 7.5-4.9 12.7-11 14.4-6.1-1.7-11-6.9-11-14.4v-9l11-3.6z"
              fill="white"
              opacity="0.95"
            />
            <path
              d="M10.5 16.2l3.6 3.6 7.4-7.4"
              fill="none"
              stroke="#0A3173"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: -0.5 }}>
            ClaimShield
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 88,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 1000,
            }}
          >
            Your insurer just said no.
            <br />
            <span style={{ color: "#AFD3FF" }}>We say try again.</span>
          </div>
          <div
            style={{
              fontSize: 28,
              color: "rgba(255,255,255,0.85)",
              maxWidth: 900,
            }}
          >
            AI-powered insurance claim negotiator. Reads your policy, picks
            apart the denial, drafts your appeal — in 60 seconds.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "rgba(255,255,255,0.7)",
            fontSize: 22,
          }}
        >
          <div>claimshield.com</div>
          <div>MilvoTech Pty Ltd</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
