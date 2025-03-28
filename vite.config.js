import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/tesseract.js/dist/tesseract.min.js',
          dest: 'assets/tesseract.js',
        },
      ],
    }),
  ],
  define: {
    __dirname: '__dirname',
  },
  build: {
    rollupOptions: {
      external: ['tesseract.js'],
    },
  },
});
