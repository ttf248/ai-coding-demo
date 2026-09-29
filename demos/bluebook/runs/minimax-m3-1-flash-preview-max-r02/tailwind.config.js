/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#fe2c55",
          dark: "#e01e45",
          soft: "#fff1f3",
        },
        canvas: "#f5f5f5",
      },
      borderRadius: {
        card: "8px",
      },
      boxShadow: {
        "card-rest": "0 1px 2px rgba(17, 17, 17, 0.06)",
        "card-hover": "0 10px 24px rgba(17, 17, 17, 0.14)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pop": {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.45)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.35s ease-out both",
        pop: "pop 0.42s ease-out",
        "spin-slow": "spin-slow 0.9s linear infinite",
      },
    },
  },
  plugins: [],
};
