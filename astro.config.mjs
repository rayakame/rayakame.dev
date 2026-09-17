// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://rayakame.dev',
  integrations: [sitemap()],
  build: {
    // Keep every script and stylesheet in its own file so the Content-Security-Policy
    // can stay at 'self' without inline allowances.
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
      // Keep classic media-query syntax and the 100vh fallbacks in the built CSS
      // (without targets the minifier emits range syntax and drops the fallbacks).
      cssTarget: ['safari15', 'ios15', 'chrome100', 'firefox100'],
    },
  },
});
