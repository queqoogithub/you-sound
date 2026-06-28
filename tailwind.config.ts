import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // White / cream palette
        cream: {
          50: "#fffdf9",
          100: "#fdf8ef",
          200: "#f9f1e2",
          300: "#f2e6cf",
          400: "#e7d4b0",
          500: "#d8bd88",
        },
        sand: {
          400: "#c9b48f",
          500: "#b59a6c",
          600: "#9c7f50",
        },
        ink: {
          500: "#7a6f63",
          700: "#5b5248",
          900: "#3a342d",
        },
      },
      fontFamily: {
        sans: ["var(--font-noto-thai)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(120, 100, 70, 0.25)",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
