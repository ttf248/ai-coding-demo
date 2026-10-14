/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { brand: "#fe2c55", canvas: "#f5f5f5" },
      keyframes: {
        pop: { "0%": { transform: "scale(1)" }, "45%": { transform: "scale(1.45)" }, "100%": { transform: "scale(1)" } },
        "fade-in": { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "none" } },
        spin360: { to: { transform: "rotate(360deg)" } },
      },
      animation: {
        pop: "pop .42s ease",
        "fade-in": "fade-in .32s ease both",
        spin360: "spin360 .8s linear infinite",
      },
    },
  },
  plugins: [],
};
