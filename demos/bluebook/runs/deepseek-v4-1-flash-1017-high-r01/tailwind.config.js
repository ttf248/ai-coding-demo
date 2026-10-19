/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        xhs: {
          DEFAULT: "#fe2c55",
          dark: "#e11d48",
          soft: "#fff1f4"
        }
      },
      boxShadow: {
        card: "0 2px 12px rgba(29, 33, 41, .06)",
        float: "0 10px 28px rgba(29, 33, 41, .14)"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        heartPop: {
          "0%": { transform: "scale(1)" },
          "45%": { transform: "scale(1.45)" },
          "100%": { transform: "scale(1)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" }
        }
      },
      animation: {
        fadeIn: "fadeIn .38s ease both",
        heartPop: "heartPop .32s ease",
        shimmer: "shimmer 1.4s linear infinite"
      }
    }
  },
  plugins: []
};
