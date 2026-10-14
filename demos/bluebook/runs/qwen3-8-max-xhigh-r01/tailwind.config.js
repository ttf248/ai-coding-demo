/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#fe2c55",
        page: "#f5f5f5",
      },
      borderRadius: {
        card: "8px",
      },
      keyframes: {
        fadein: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        heartpop: {
          "0%": { transform: "scale(1)" },
          "35%": { transform: "scale(1.45)" },
          "70%": { transform: "scale(0.85)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        fadein: "fadein 0.45s ease both",
        heartpop: "heartpop 0.45s ease",
      },
    },
  },
  plugins: [],
};
