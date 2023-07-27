/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-raleway)'],
        paragraph: ['var(--font-lato)'],
      },
      colors: {
        background: '#f5f5f5',
        maincontent: '#ffffff',
        'primary': {
          DEFAULT: '#FFA500',
          50: '#FFE6B8',
          100: '#FFDFA3',
          200: '#FFD07A',
          300: '#FFC252',
          400: '#FFB329',
          500: '#FFA500',
          600: '#C78100',
          700: '#8F5C00',
          800: '#573800',
          900: '#1F1400',
          950: '#030200'
        },
        secondary: {
          DEFAULT: '#4CAF50',
          50: '#CAE8CC',
          100: '#BCE2BE',
          200: '#A0D6A2',
          300: '#83C986',
          400: '#67BD6A',
          500: '#4CAF50',
          600: '#3B883E',
          700: '#2A612C',
          800: '#193A1A',
          900: '#081308',
          950: '#000000'
        },
        text: '#333333',
      },
    },
  },
  plugins: [],
}
