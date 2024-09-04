/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "app-white": "#FAF8F6",
        "app-green": "#B6EBDD",
      },
      fontFamily: {
        sans: ['"Bakbak One"'],
      },
    },
  },
  plugins: [],
};
