/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#CFAF6E",     // Doré
        cream: "#F8F5F0",    // Blanc cassé
        blueDark: "#0A2342", // Bleu nuit
        dark: "#333333",     // Gris anthracite
      },
    },
  },
  plugins: [],
}
