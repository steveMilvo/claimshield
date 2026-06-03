import type { Config } from "tailwindcss";

/**
 * Margin design system — "the writing studio".
 * Warm paper canvas, deep ink, a single confident editorial accent (violet),
 * a growth-green reserved exclusively for mastery, and an ochre "pencil" used
 * only for margin feedback. Colour is meaning here: green = mastered,
 * violet = the trait we're working on, ochre = a margin note.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Surfaces
        paper: "#FBFAF6", // warm writing canvas
        card: "#FFFFFF",
        canvas: "#F4F1EA", // app background (aged paper)

        // Ink (text + structure)
        ink: {
          DEFAULT: "#1B1B22",
          soft: "#3A3A45",
          muted: "#6E6E7A",
          faint: "#9A9AA6",
        },
        line: "#E7E2D6", // hairline borders on paper

        // Violet — the working accent (the trait in focus, primary actions)
        focus: {
          50: "#F2EFFE",
          100: "#E6E0FD",
          200: "#Ccc0fb",
          300: "#A99AF6",
          400: "#8A77F0",
          500: "#6B5CF0",
          600: "#5A45E0",
          700: "#4A36BD",
          800: "#3C2D97",
          900: "#2F2476",
        },

        // Growth-green — reserved for mastery / positive delta only
        growth: {
          50: "#EAF6F0",
          100: "#CFEbe0",
          300: "#7FCCAA",
          500: "#2E9E6E",
          600: "#23805A",
          700: "#1B6447",
        },

        // Ochre — the margin pencil (formative notes), used sparingly
        pencil: {
          100: "#F8ECDF",
          300: "#E7B98C",
          500: "#C2683B",
          600: "#A4542E",
        },

        warn: "#D9962F",
        danger: "#D14B45",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["var(--font-serif)", "Iowan Old Style", "Palatino Linotype", "Georgia", "Cambria", "serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(27,27,34,0.04), 0 12px 32px rgba(27,27,34,0.06)",
        lift: "0 2px 4px rgba(27,27,34,0.06), 0 24px 48px rgba(27,27,34,0.10)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.6)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "draw": {
          "0%": { strokeDashoffset: "1" },
          "100%": { strokeDashoffset: "0" },
        },
        "pulse-soft": {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both",
        "pulse-soft": "pulse-soft 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
