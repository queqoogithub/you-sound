import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dreamy pastel palette
        dream: {
          lavender: "#cdbdf2",
          periwinkle: "#b8c0ff",
          babyblue: "#bde0fe",
          blush: "#ffc8dd",
          peach: "#ffd8be",
          purple: "#d3c4f9",
          mist: "#f3eefe",
        },
        ink: {
          400: "#8b83a8",
          500: "#6f6790",
          700: "#4c4569",
          900: "#332d4d",
        },
      },
      fontFamily: {
        sans: ["var(--font-noto-thai)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 50px -16px rgba(120, 100, 180, 0.35)",
        glass: "0 8px 32px rgba(120, 110, 190, 0.18)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.2", transform: "scale(0.85)" },
          "50%": { opacity: "1", transform: "scale(1)" },
        },
        "wave-shift": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "drift": {
          "0%": { transform: "translateY(0) translateX(0)", opacity: "0" },
          "20%": { opacity: "0.8" },
          "100%": { transform: "translateY(-120px) translateX(20px)", opacity: "0" },
        },
      },
      animation: {
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
        float: "float 7s ease-in-out infinite",
        twinkle: "twinkle 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
