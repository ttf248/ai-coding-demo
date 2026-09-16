/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { blush: "#fe2c55", ink: "#241f2a" },
      boxShadow: { card: "0 12px 34px rgba(55, 31, 39, .08)" },
    },
  },
  plugins: [],
};
