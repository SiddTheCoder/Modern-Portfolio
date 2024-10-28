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
        'nightlook': "url('./asset/nightsode2.jpg')",
        'farewellImg': "url('./asset/farewll.jpg')",
        'selfie': "url('./asset/selfe1.jpg')",
        'nightfade': "url('./asset/nightffade.jpg')",
        'nightfade': "url('./asset/coat.jpg')",
      },
    },
  },
  plugins: [],
}

