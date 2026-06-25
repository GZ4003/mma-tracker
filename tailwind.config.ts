import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        goat: {
          bg: "#0A0A0F",
          surface: "#12121A",
          blue: "#3B82F6",
          orange: "#3B82F6",
          muted: "#6B7280",
          white: "#F5F5F5",
        },
      },
      fontFamily: {
        display: ["var(--font-bebas-neue)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      animation: {
        "level-up": "levelUp 0.6s ease-out",
        "xp-fill": "xpFill 1s ease-in-out",
        "streak-pulse": "streakPulse 2s ease-in-out infinite",
      },
      keyframes: {
        levelUp: {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "70%": { transform: "scale(1.1)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        xpFill: {
          "0%": { width: "0%" },
          "100%": { width: "var(--xp-width)" },
        },
        streakPulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
