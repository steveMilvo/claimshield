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
        shield: {
          50: "#EEF6FF",
          100: "#D7EAFF",
          200: "#AFD3FF",
          300: "#7CB6FF",
          400: "#4791F5",
          500: "#1F6FE5",
          600: "#1455BF",
          700: "#0E4198",
          800: "#0A3173",
          900: "#072454",
        },
        accent: {
          DEFAULT: "#13C296",
          dark: "#0E9A77",
        },
        warn: "#E2A03F",
        danger: "#E0413F",
        canvas: "#F6F9FC",
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
