export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1C2B25",
        paper: "#F2F1EA",
        moss: { DEFAULT: "#4B6B4E", light: "#E3E9E0", dark: "#334935" },
        clay: { DEFAULT: "#C1652F", light: "#F5E3D6" },
        sand: "#EAE7DC",
        line: "#D8D4C7",
        muted: "#6B6B60",
        danger: { DEFAULT: "#A83B32", light: "#F3DEDB" },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["IBM Plex Sans", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
