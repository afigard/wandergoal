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
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        wiggle: {
          "0%, 96%": { transform: "rotate(0deg)" },
          "97%": { transform: "rotate(2deg)" },
          "98%": { transform: "rotate(-2deg)" },
          "99%": { transform: "rotate(2deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        wiggle: "wiggle 7s ease-in-out infinite",
      },
      opacity: {
        15: "0.15",
      },
    },
  },
  plugins: [],
};
