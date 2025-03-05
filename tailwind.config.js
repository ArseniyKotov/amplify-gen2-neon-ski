/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: '#00FFFF',
          pink: '#FF00FF',
          green: '#39FF14',
          purple: '#9D00FF',
          yellow: '#FFFF00',
        },
        dark: {
          base: '#0A0A1F',
          light: '#141432',
          medium: '#1E1E46',
        }
      },
      fontFamily: {
        cyber: ['Orbitron', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 5px theme(colors.neon.blue), 0 0 20px theme(colors.neon.blue)',
        'neon-pink': '0 0 5px theme(colors.neon.pink), 0 0 20px theme(colors.neon.pink)',
        'neon-green': '0 0 5px theme(colors.neon.green), 0 0 20px theme(colors.neon.green)',
      },
    },
  },
  plugins: [],
}
