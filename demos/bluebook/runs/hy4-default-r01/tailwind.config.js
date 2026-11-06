/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#fe2c55",
        canvas: "#f5f5f5",
      },
      borderRadius: {
        card: "8px",
      },
      boxShadow: {
        card: "0 1px 4px rgba(0,0,0,.06)",
        "card-hover": "0 12px 26px rgba(0,0,0,.14)",
      },
    },
  },
  plugins: [],
};
