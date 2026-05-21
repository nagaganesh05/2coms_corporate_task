/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "Plus Jakarta Sans",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        // Brand
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        // Warm accent for celebration / recognition
        accent: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
        },
        // Semantic
        success: {
          50: "#ecfdf5",
          500: "#10b981",
          600: "#059669",
        },
        warning: {
          50: "#fffbeb",
          500: "#f59e0b",
          600: "#d97706",
        },
        danger: {
          50: "#fef2f2",
          500: "#ef4444",
          600: "#dc2626",
        },
        // Neutral surfaces (override slate to keep cohesive)
        ink: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        // Aliases used historically in the scaffold
        primary: "#4f46e5",
        secondary: "#64748b",
        background: "#f8fafc",
        dark: "#0f172a",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(15,23,42,0.04), 0 1px 3px 0 rgba(15,23,42,0.06)",
        "card-hover":
          "0 10px 25px -5px rgba(15,23,42,0.10), 0 8px 10px -6px rgba(15,23,42,0.06)",
        glow: "0 0 0 4px rgba(99,102,241,0.15)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0, transform: "translateY(4px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "pop-in": {
          "0%": { opacity: 0, transform: "scale(0.96)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.35s ease-out both",
        "pop-in": "pop-in 0.25s ease-out both",
        "shimmer": "shimmer 1.4s linear infinite",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #8b5cf6 100%)",
        "celebrate-gradient":
          "linear-gradient(135deg, #f97316 0%, #f43f5e 50%, #a855f7 100%)",
        "hero-gradient":
          "linear-gradient(135deg, #0f172a 0%, #312e81 50%, #4f46e5 100%)",
      },
    },
  },
  plugins: [],
};
