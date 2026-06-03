import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      colors: {
        cream: "#FFF7ED",
        ink: "#2B2540",
        grape: "#6D5BD0",
        grapeDark: "#5746B0",
        bubble: "#FF7BA9",
        sky: "#5BC8F5",
        mint: "#3FD3A7",
        sunny: "#FFC44D",
        coral: "#FF8A5B",
      },
      boxShadow: {
        soft: "0 10px 30px -8px rgba(80, 60, 160, 0.25)",
        pop: "0 6px 0 0 rgba(0,0,0,0.08)",
      },
      borderRadius: {
        xl2: "1.75rem",
      },
      keyframes: {
        bob: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pop: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "70%": { transform: "scale(1.06)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        sparkle: {
          "0%": { transform: "scale(0) rotate(0deg)", opacity: "0" },
          "40%": { transform: "scale(1.2) rotate(90deg)", opacity: "1" },
          "100%": { transform: "scale(0) rotate(180deg)", opacity: "0" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(6deg)" },
        },
        wiggle: {
          "0%,100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      animation: {
        bob: "bob 3.2s ease-in-out infinite",
        pop: "pop 0.45s cubic-bezier(.2,1.2,.4,1) both",
        sparkle: "sparkle 0.9s ease-in-out forwards",
        floaty: "floaty 7s ease-in-out infinite",
        wiggle: "wiggle 0.4s ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
