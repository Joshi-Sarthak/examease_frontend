/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{html,ts}", // Scan all Angular component files
      "./src/app/components/**/*.{html,ts}", // Scan all component files
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  