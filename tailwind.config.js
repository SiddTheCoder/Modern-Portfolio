/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {
      fontFamily: {
        happyMonkey: ['"Happy Monkey"','cursive'],
        silkscreen: ['"Silkscreen"', 'cursive'],
        caveat: ['Caveat', 'cursive'],
        exo: ['Exo', 'sans-serif'], // Add the new font family
      },
      backgroundImage: {
        'hero-pattern': "url('./asset/mmbg (1).png')",
        'footer-texture': "url('/img/footer-texture.png')",
      },
    },
  },
  plugins: [],
}

