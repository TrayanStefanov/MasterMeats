import daisyui from "daisyui"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#230506",
          "primary-content": "#E9D8A6",
          "secondary": "#E9D8A6",
          "secondary-content": "#13110a",
          "accent": "#9B2226",
          "accent-content": "#D4AF37",
          "neutral": "#F8F5EF",
          "neutral-content": "#2E4631",
          "base-100": "#FFFFFF",
          "base-200": "#dedede",
          "base-300": "#bebebe",
          "base-content": "#1C1C1C",
          "info": "#c2f0ff",
          "info-content": "#0e1416",
          "success": "#00ff00",
          "success-content": "#001600",
          "warning": "#00ff00",
          "warning-content": "#001600",
          "error": "#dc0b0b",
          "error-content": "#ffd8d1",
        },
      },
    ],
  },
  darkTheme: "dark", // name of one of the included themes for dark mode
  base: true, // applies background color and foreground color for root element by default
  styled: true, // include daisyUI colors and design decisions for all components
  utils: true, // adds responsive and modifier utility classes
  prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
  logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
  themeRoot: ":root", // The element that receives theme color CSS variables
}