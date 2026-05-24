import type { Config } from "tailwindcss";

// Brand palette (Founder Tax Blueprint branding kit):
//   Deep Navy:   #0A2540
//   Gold/Amber:  #D4AF37
//   Teal Accent: #00BFA5

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0A2540",
          soft: "#1A3A5C",
          muted: "#5A6B7B",
        },
        blueprint: {
          50: "#E8EEF5",
          100: "#C5D2E0",
          200: "#8FA5BD",
          300: "#5E7896",
          400: "#2E4D72",
          500: "#0A2540",
          600: "#081E33",
          700: "#061826",
          800: "#04121A",
          900: "#020C12",
        },
        gold: {
          50: "#FBF6E3",
          100: "#F5EBC0",
          200: "#EDD888",
          300: "#E5C24E",
          400: "#DEAD1F",
          500: "#D4AF37",
          600: "#B59228",
          700: "#947520",
          800: "#705818",
          900: "#4D3C10",
        },
        teal: {
          50: "#E0F7F3",
          100: "#B3EBE0",
          200: "#80DFCC",
          300: "#4DD3B8",
          400: "#1ACBA8",
          500: "#00BFA5",
          600: "#00A78F",
          700: "#008E7A",
          800: "#007665",
          900: "#005D50",
        },
        accent: {
          DEFAULT: "#D4AF37",
          light: "#F5EBC0",
          dark: "#947520",
        },
        warn: "#E2A03F",
        danger: "#E0413F",
        canvas: "#F6F9FC",
        // Aliases for any legacy references
        shield: {
          50: "#E8EEF5",
          100: "#C5D2E0",
          200: "#8FA5BD",
          300: "#5E7896",
          400: "#2E4D72",
          500: "#0A2540",
          600: "#081E33",
          700: "#061826",
          800: "#04121A",
          900: "#020C12",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(10,37,64,0.04), 0 8px 24px rgba(10,37,64,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
