/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta da marca (azul) — do claro ao escuro
        marca: {
          50: "#EAF4FB",
          100: "#D3E8F6",
          200: "#B9DAF0",
          300: "#7FB8DD",
          400: "#3F9AD0",
          500: "#0B7ABF",
          600: "#0B75B7",
          700: "#095F95",
          800: "#074973",
          900: "#053451",
        },
        // Acento (laranja)
        acento: {
          50: "#FDECE1",
          300: "#F6A877",
          500: "#F2762E",
          600: "#D45F1C",
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
