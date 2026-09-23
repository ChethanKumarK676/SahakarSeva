import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Cooperative palette — lifted directly from the HTML prototype
        // (--green-900, --green-700, --orange-500, etc.)
        "green-900": "#06382d",
        "green-800": "#0a4a3b",
        "green-700": "#0a5d47",
        "green-600": "#137654",
        "green-500": "#1c8a64",
        "green-100": "#dff1ea",
        "green-50": "#effaf4",
        "orange-600": "#b34923",
        "orange-500": "#d85a30",
        "orange-400": "#e87a55",
        "orange-100": "#fde7df",
        "sand": "#f6f1e7",
        "ink-900": "#101714",
        "ink-700": "#3a4540",
        "ink-500": "#6c7771",
        "ink-300": "#a9b2ad",
        "ink-200": "#cfd5d1",
        "ink-100": "#e6eae7",
        "ink-50": "#f3f5f4",
        "danger-500": "#c0392b",
        "warn-500": "#c08a1a"
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif"
        ]
      },
      boxShadow: {
        card: "0 1px 2px rgba(6,56,45,0.06), 0 4px 12px rgba(6,56,45,0.05)",
        phone: "0 30px 60px -10px rgba(6,56,45,0.35), 0 0 0 12px #0a1110"
      },
      borderRadius: {
        "2xl": "1.1rem",
        "3xl": "1.4rem"
      }
    }
  },
  plugins: []
};

export default config;
