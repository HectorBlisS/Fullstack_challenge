/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["app/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        brand: {
          700: "#232e36",
          800: "#121b22",
          500: "#52f8d3",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
