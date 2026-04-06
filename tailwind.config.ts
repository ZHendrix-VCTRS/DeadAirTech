import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dead: {
          bg: "#0a0a0a",
          neon: "#39ff14",
          red: "#ff0040",
          cyan: "#00d4ff",
          text: "#e0e0e0",
          muted: "#808080",
          dim: "#555555",
          line: "rgba(57, 255, 20, 0.12)",
        },
      },
      fontFamily: {
        display: ["var(--font-press)", "monospace"],
        body: ["var(--font-ibm)", "ui-monospace", "monospace"],
        mono: ["var(--font-ibm)", "ui-monospace", "monospace"],
        sans: ["var(--font-ibm)", "ui-monospace", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 20px rgba(57, 255, 20, 0.3)",
        neonSoft: "0 0 30px rgba(57, 255, 20, 0.4)",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        hintPulse: {
          "0%, 100%": { opacity: "0.25" },
          "50%": { opacity: "0.65" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.6s ease forwards",
        pulse: "pulse 2s infinite",
        hintPulse: "hintPulse 3s ease infinite",
      },
    },
  },
  plugins: [],
};

export default config;
