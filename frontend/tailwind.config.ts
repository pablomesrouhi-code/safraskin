import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: "#C4A35A",
        "saffron-dark": "#8F6E32",
        rose: "#9B4D5A",
        "rose-dark": "#7A3C47",
        cream: "#F8F3EB",
        ink: "#2A2218",
        muted: "#6B5E4E",
        scarcity: "#B85C4A",
        border: "#E8DFD2",
        "gold-light": "#E8D5B0",
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
