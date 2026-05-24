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
        onyx: "#050505",
        midnight: "#0D0D0D",
        ink: "#FFFFFF",
        muted: "#94A3B8",
        line: "#1E293B",
        surface: "#111827",
        brand: "#0070FF",
        "electric-blue": "#0070FF",
        "electric-violet": "#8A2BE2",
        "neon-cyan": "#00FFFF",
        accent: "#10B981",
        warn: "#F59E0B",
        danger: "#EF4444",
      },
    },
  },
  plugins: [],
};

export default config;
