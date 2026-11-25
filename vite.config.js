import { defineConfig } from 'vite';
import vituum from 'vituum';
import pug from '@vituum/vite-plugin-pug';

export default defineConfig({
  plugins: [
    vituum({
      input: [],
      imports: { paths: [] },
    }),
    pug({
      root: './src',
    }),
  ],
  build: {
    assetsInlineLimit: 0,
  },
});
