/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Hijau zaitun ala template "Area"
        brand: {
          50: '#f4f7ec',
          100: '#e1eac8',
          200: '#cbd9a4',
          300: '#abc076',
          400: '#8aa34b',
          500: '#6b8530',
          600: '#536620',
          700: '#485c11',
          800: '#394913',
          900: '#2e3b12',
        },
        sage: '#8f9e78',
        sand: '#cdbb96',
        ink: '#0b0b0b',
        muted: '#6f6f6f',
        line: '#e7e7e4',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Crimson Text"', 'Georgia', 'serif'],
        mono: ['"Roboto Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 24, 40, 0.04)',
      },
    },
  },
  plugins: [],
};
