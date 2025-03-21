import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';  // Optional, for handling static files

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/tesseract.js/dist/tesseract.min.js',  // Path to the Tesseract JS bundle
          dest: 'assets/tesseract.js',  // Copy location in your dist folder
        },
      ],
    }),
  ],
  define: {
    __dirname: '__dirname', // Polyfill for __dirname to work in the browser
  },
  build: {
    rollupOptions: {
      external: ['tesseract.js'],  // Exclude tesseract.js from SSR
    },
  },
});
