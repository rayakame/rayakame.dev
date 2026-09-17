// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // site: 'https://<custom domain>',
  vite: {
    build: {
      // Keep classic media-query syntax and the 100vh fallbacks in the built CSS
      // (without targets the minifier emits range syntax and drops the fallbacks).
      cssTarget: ['safari15', 'ios15', 'chrome100', 'firefox100'],
    },
  },
});
