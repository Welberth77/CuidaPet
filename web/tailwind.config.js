/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        marca: {
          50: "#EAF4FB",
          100: "#D3E8F6",
          500: "#0B7ABF",
          700: "#074973",
          900: "#053451",
        },
        acento: {
          50: "#FFF1EC",
          300: "#FFB59A",
          500: "#FF7A59",
          600: "#F2623D",
        },
      },
      fontFamily: {
        sans: ["Roboto", "Helvetica", "Arial", "sans-serif"],
      },
      boxShadow: {
        suave: "0 10px 30px -12px rgba(5, 52, 81, 0.25)",
      },
    },
  },
  plugins: [],
};
