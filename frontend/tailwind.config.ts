import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: "#2D6A5A",
        "sage-dark": "#1E4D42",
        gold: "#C4A265",
        "gold-light": "#E8D5B0",
        cream: "#FAF7F2",
        scarcity: "#B85C4A",
        border: "#E8E4DD",
      },
      fontFamily: {
        arabic: ["var(--font-arabic)", "sans-serif"],
        english: ["var(--font-english)", "sans-serif"],
      },
      maxWidth: {
        container: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
