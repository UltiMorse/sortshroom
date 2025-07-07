/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          primary: '#8B4513',
          secondary: '#228B22',
        },
        mushroom: {
          red: '#DC143C',
          yellow: '#FFD700',
        },
        earth: '#DEB887',
        leaf: '#9ACD32',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
