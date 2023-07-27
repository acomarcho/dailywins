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
        background: '#ffffff',
        header: '#f5f5f5',
        maincontent: '#f0ede5',
        primary: '#c4beb6',
        text: '#333333',
      },
    },
  },
  plugins: [],
}
