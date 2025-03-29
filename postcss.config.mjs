/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {}, // Fix the missing PostCSS plugin
    autoprefixer: {},
  },
};

export default config;
