/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#fe2c55",
      },
      borderRadius: {
        card: "8px",
      },
    },
  },
  plugins: [],
};
