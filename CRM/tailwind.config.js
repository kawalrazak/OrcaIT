/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    { pattern: /^(bg|text|border|shadow)-orca-/ },
  ],
  theme: {
    extend: {
      colors: {
        orca: {
          red: '#E31E24',
          'red-dark': '#C4191F',
          yellow: '#E6B800',
          'yellow-dark': '#C9A000',
          royal: '#4169E1',
          'royal-dark': '#1e3a8a',
          'royal-darker': '#002366',
          'royal-light': '#6B8FE8',
          blue: '#6DCFF6',
          'blue-light': '#A8E4FA',
          navy: '#1e3a8a',
          'navy-dark': '#002366',
          black: '#000000',
          // legacy aliases
          teal: '#6DCFF6',
          'teal-light': '#A8E4FA',
          aqua: '#6DCFF6',
        },
        brand: {
          50: '#eef3ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#6B8FE8',
          500: '#4169E1',
          600: '#3451b2',
          700: '#1e3a8a',
          800: '#1e3a8a',
          900: '#002366',
          950: '#001a4d',
        },
        sidebar: {
          DEFAULT: '#1e3a8a',
          hover: '#4169E1',
          active: '#E6B800',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        orca: '0 8px 30px -4px rgb(65 105 225 / 0.35)',
      },
      backgroundImage: {
        'orca-gradient': 'linear-gradient(135deg, #002366 0%, #1e3a8a 45%, #4169E1 100%)',
        'orca-login': 'linear-gradient(145deg, #002366 0%, #1e3a8a 50%, #4169E1 100%)',
      },
    },
  },
  plugins: [],
};
