// tailwind.config.js
module.exports = {
  corePlugins: {
    preflight: true, // <-- disables Tailwind base reset globally
  },
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
