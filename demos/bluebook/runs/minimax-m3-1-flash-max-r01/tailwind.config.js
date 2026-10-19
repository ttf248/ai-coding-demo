/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#fe2c55",
          soft: "#ff5c7c",
          deep: "#e01f45",
        },
        canvas: "#f5f5f5",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.06)",
        "card-hover": "0 12px 24px rgba(15, 23, 42, 0.14)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "heart-pop": {
          "0%": { transform: "scale(1)" },
          "35%": { transform: "scale(1.45)" },
          "60%": { transform: "scale(0.92)" },
          "100%": { transform: "scale(1)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.32s ease-out both",
        "heart-pop": "heart-pop 0.42s ease-out",
        "spin-slow": "spin-slow 0.9s linear infinite",
      },
    },
  },
  plugins: [],
};
