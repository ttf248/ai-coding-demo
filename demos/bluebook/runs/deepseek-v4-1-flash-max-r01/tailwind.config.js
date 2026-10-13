/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        xhs: "#fe2c55",
        page: "#f5f5f5",
      },
      keyframes: {
        heartPop: {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.45)" },
          "100%": { transform: "scale(1)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        bounceIn: {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "heart-pop": "heartPop 0.45s ease-in-out",
        "fade-in": "fadeIn 0.5s ease-out both",
        "bounce-in": "bounceIn 0.35s ease-out both",
      },
    },
  },
  plugins: [],
};
