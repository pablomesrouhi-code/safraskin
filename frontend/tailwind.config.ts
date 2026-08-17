import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: "#D4AF37",
        "saffron-dark": "#9A7B24",
        rose: "#B23A4B",
        "rose-dark": "#8C2D3B",
        cream: "#FBF7F1",
        ink: "#1C1612",
        muted: "#6A5C4D",
        scarcity: "#C45C4A",
        border: "#E6DCCE",
        "gold-light": "#F0E2C4",
      },
      fontFamily: {
        arabic: ["var(--font-arabic)", "sans-serif"],
        english: ["var(--font-english)", "sans-serif"],
      },
      maxWidth: {
        container: "1120px",
      },
    },
  },
  plugins: [],
};

export default config;
