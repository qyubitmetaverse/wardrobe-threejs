/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/contexts/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        navbartop: "url('/images/gui/navbar/navbar-top.png')",
        categorybar: "url('/images/gui/inventory/category-bar.png')",
        inventoryinner0: "url('/images/gui/inventory/inventory-inner0.png')",
        inventoryinner1: "url('/images/gui/inventory/inventory-inner1.png')",
        inventory: "url('/images/gui/inventory/inventory-panel.png')",
        information: "url('/images/gui/information/Information-panel.png')",
        "information-button": "url('/images/gui/information/button.png')",
      },
      transitionProperty: {
        height: "height",
        width: "width",
        spacing: "margin, padding",
      },
      fontFamily: {
        sans: ['"Roboto"', "sans-serif"],
        titillium: ['"Titillium Web"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
