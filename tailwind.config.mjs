/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          600: "#4CAF50",
          700: "#388E3C",
        },
        red: {
          600: "#FF5252",
          700: "#E53935",
        },
      },
    },
  },
  plugins: [],
};
