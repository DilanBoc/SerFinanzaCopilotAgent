import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17202a",
        muted: "#5b6673",
        line: "#d9dee5",
        surface: "#f7f8fa",
        brand: "#005eb8",
        accent: "#1f9d68",
        warn: "#b7791f",
        danger: "#b42318",
      },
    },
  },
  plugins: [],
};

export default config;
