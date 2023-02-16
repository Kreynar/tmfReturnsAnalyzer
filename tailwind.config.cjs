/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        level1: "#a84432",
        level2: "#a87d32",
        level3: "#ffef12",
        level4: "#d4ff12",
        level5: "#4dff12",
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /level/,
    },
  ],
};
