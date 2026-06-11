import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Usage: className="font-sketch" or className="font-body"
        sketch: ["var(--font-caveat)", "cursive"],
        nunito: ["var(--font-nunito)", "sans-serif"],
        body:   ["var(--font-nunito)", "sans-serif"],
      },
      colors: {
        // Rehobbie palette — reference these with text-rehobbie-green etc.
        rehobbie: {
          green:          "#A8D8B0",
          "green-dark":   "#7EBC89",
          "green-hover":  "#93CFA0",
          cream:          "#FAF8F4",
          paper:          "#F0EDE7",
          border:         "#E5E1D8",
          "border-light": "#C8C4BC",
          "border-hover": "#BFBBB2",
          ink:            "#2D2D2D",
          muted:          "#888888",
          subtext:        "#666666",
          "subtext-dark": "#555555",
          faint:          "#AAAAAA",
          fainter:        "#CCCCCC",
          line:           "#E0DBD0",
        },
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;