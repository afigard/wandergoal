/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", "system-ui", "sans-serif"],
      },
      colors: {
        green: {
          100: "#E8F5E9",
          200: "#C8E6C9",
          300: "#A5D6A7",
          400: "#81C784",
          500: "#66BB6A",
          600: "#4CAF50",
          700: "#388E3C",
          800: "#2E7D32",
          900: "#1B5E20",
        },
        red: {
          100: "#FFEBEE",
          200: "#FFCDD2",
          300: "#EF9A9A",
          400: "#E57373",
          500: "#EF5350",
          600: "#FF5252",
          700: "#E53935",
          800: "#C62828",
          900: "#B71C1C",
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
