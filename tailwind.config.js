/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: "#6B1B3D",
        "deep-rose": "#8B2E5C",
        blush: "#E8A5B8",
        "soft-blush": "#F5D7E0",
        cream: "#FFF9F5",
        parchment: "#FDF8F3",
        ink: "#2a1215",
        "soft-ink": "#5a4045",
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", "serif"],
        handwriting: ['"Dancing Script"', "cursive"],
        sans: ['"Karla"', "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
    },
  },
  plugins: [],
};
