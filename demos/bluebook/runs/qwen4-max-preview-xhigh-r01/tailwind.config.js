/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#fe2c55",
        surface: "#f5f5f5",
      },
      borderRadius: { card: "8px" },
      keyframes: {
        "heart-pop": {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.45)" },
          "100%": { transform: "scale(1)" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "heart-pop": "heart-pop 0.35s ease-in-out",
        "fade-in": "fade-in 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};