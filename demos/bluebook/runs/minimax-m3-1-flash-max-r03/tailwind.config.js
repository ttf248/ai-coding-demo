/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#fe2c55",
        canvas: "#f5f5f5",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 10px 24px rgba(0, 0, 0, 0.14)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "like-pop": {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.45)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in .28s ease-out both",
        "like-pop": "like-pop .38s ease-out",
        "spin-slow": "spin-slow .9s linear infinite",
      },
    },
  },
  plugins: [],
};
