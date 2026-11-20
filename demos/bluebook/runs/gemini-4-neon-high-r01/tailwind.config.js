export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#fe2c55",
        canvas: "#f5f5f5",
      },
      keyframes: {
        heartPop: {
          "0%": { transform: "scale(1)" },
          "45%": { transform: "scale(1.42)" },
          "100%": { transform: "scale(1)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "heart-pop": "heartPop 0.36s cubic-bezier(0.22, 1, 0.36, 1)",
        "fade-in": "fadeIn 0.32s ease-out both",
      },
    },
  },
  plugins: [],
};
