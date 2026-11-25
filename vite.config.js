import { defineConfig } from 'vite';
import vituum from 'vituum';
import pug from '@vituum/vite-plugin-pug';

export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/landing-keepsake-vite/' : '/',
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
}));
