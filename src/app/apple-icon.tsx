import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #1F6FE5 0%, #0A3173 100%)",
          borderRadius: 36,
        }}
      >
        <svg width="120" height="120" viewBox="0 0 32 32">
          <path
            d="M16 2.5l11 3.6v9c0 7.5-4.9 12.7-11 14.4-6.1-1.7-11-6.9-11-14.4v-9l11-3.6z"
            fill="white"
            opacity="0.98"
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
      </div>
    ),
    { ...size },
  );
}
