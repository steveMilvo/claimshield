import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B1B2B",
          soft: "#1F2D3D",
          muted: "#5A6B7B",
        },
        blueprint: {
          50: "#EEF3FF",
          100: "#D8E4FF",
          200: "#B3C9FF",
          300: "#7EA5FF",
          400: "#4878F5",
          500: "#1455BF",
          600: "#0E4198",
          700: "#0A3173",
          800: "#072454",
          900: "#041638",
        },
        gold: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#D4940A",
          600: "#B07A08",
          700: "#8C6006",
          800: "#6B4904",
          900: "#4A3203",
        },
        accent: {
          DEFAULT: "#D4940A",
          light: "#FEF3C7",
          dark: "#8C6006",
        },
        warn: "#E2A03F",
        danger: "#E0413F",
        canvas: "#F6F9FC",
        shield: {
          50: "#EEF3FF",
          100: "#D8E4FF",
          200: "#B3C9FF",
          300: "#7EA5FF",
          400: "#4878F5",
          500: "#1455BF",
          600: "#0E4198",
          700: "#0A3173",
          800: "#072454",
          900: "#041638",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,27,43,0.04), 0 8px 24px rgba(11,27,43,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
