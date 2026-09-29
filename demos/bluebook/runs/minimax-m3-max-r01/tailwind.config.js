/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#fe2c55",
          50: "#fff1f4",
          100: "#ffe1e8",
          500: "#fe2c55",
          600: "#e0244a",
        },
        canvas: "#f5f5f5",
      },
      boxShadow: {
        card: "0 4px 14px rgba(15, 23, 42, 0.06)",
        cardHover: "0 14px 30px rgba(15, 23, 42, 0.12)",
      },
      keyframes: {
        heartPop: {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.4)" },
          "100%": { transform: "scale(1)" },
        },
        fadeIn: {
          from: { opacity: 0, transform: "translateY(6px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        "heart-pop": "heartPop 0.35s ease-out",
        "fade-in": "fadeIn 0.3s ease-out both",
      },
    },
  },
  plugins: [],
};