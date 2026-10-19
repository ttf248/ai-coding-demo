/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        xhs: {
          DEFAULT: "#fe2c55",
          light: "#ff6b8a",
          dark: "#d81e42",
        },
        page: "#f5f5f5",
      },
      borderRadius: {
        card: "8px",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "heart-pop": {
          "0%": { transform: "scale(1)" },
          "45%": { transform: "scale(1.45)" },
          "100%": { transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-320px 0" },
          "100%": { backgroundPosition: "320px 0" },
        },
        spin: {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.42s ease-out both",
        "heart-pop": "heart-pop 0.36s ease-out",
        shimmer: "shimmer 1.2s linear infinite",
      },
    },
  },
  plugins: [],
};
