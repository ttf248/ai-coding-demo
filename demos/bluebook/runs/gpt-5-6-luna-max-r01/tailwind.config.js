/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: { card: "0 8px 26px rgba(35, 28, 32, .08)" },
      keyframes: { heartPop: { "0%": { transform: "scale(1)" }, "45%": { transform: "scale(1.38)" }, "100%": { transform: "scale(1)" } } },
      animation: { "heart-pop": "heartPop .38s ease-out" }
    }
  },
  plugins: []
};
