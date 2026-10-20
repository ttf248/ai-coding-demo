/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#fe2c55",
          soft: "#ff5c7c",
          deep: "#e01e46"
        },
        canvas: "#f5f5f5"
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "heart-pop": {
          "0%": { transform: "scale(1)" },
          "45%": { transform: "scale(1.45)" },
          "100%": { transform: "scale(1)" }
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      },
      animation: {
        "fade-in": "fade-in .45s ease-out both",
        "heart-pop": "heart-pop .42s ease-out",
        "spin-slow": "spin-slow .9s linear infinite",
        shimmer: "shimmer 1.4s linear infinite"
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, .06)",
        "card-hover": "0 12px 28px rgba(15, 23, 42, .16)"
      }
    }
  },
  plugins: []
};
