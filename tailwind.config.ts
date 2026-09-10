import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        secondary: "#1e1b4b",
        accent: "#818cf8",
        dark: "#0f0d1e",
        darker: "#0a0918",
        card: "#1a1730",
      },
    },
  },
  plugins: [],
};
export default config;
