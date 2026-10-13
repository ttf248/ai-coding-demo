/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#fe2c55",
          soft: "#ff5c7a",
          deep: "#d81b40",
        },
        canvas: "#f5f5f5",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "heart-pop": {
          "0%": { transform: "scale(1)" },
          "32%": { transform: "scale(1.45)" },
          "58%": { transform: "scale(0.86)" },
          "100%": { transform: "scale(1)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-460px 0" },
          "100%": { backgroundPosition: "460px 0" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        "toast-in": {
          from: { opacity: "0", transform: "translate(-50%, 10px)" },
          to: { opacity: "1", transform: "translate(-50%, 0)" },
        },
        "release": {
          from: { transform: "translateY(-24px)" },
          to: { transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.32s cubic-bezier(0.22, 1, 0.36, 1) both",
        "heart-pop": "heart-pop 0.42s cubic-bezier(0.22, 1, 0.36, 1)",
        shimmer: "shimmer 1.2s linear infinite",
        "spin-slow": "spin-slow 0.8s linear infinite",
        "toast-in": "toast-in 0.24s cubic-bezier(0.22, 1, 0.36, 1) both",
        release: "release 0.24s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};
