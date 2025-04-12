module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#ffe6f7",
          100: "#ffde59",
          200: "#39ff14",
          300: "#00ffe7",
          400: "#00aaff",
          500: "#be0aff",
          600: "#ff2058",
          700: "#ff00ff",
          800: "#5500ff",
          900: "#0d0d0d",
        },
      },
    },
  },
  plugins: [],
};
