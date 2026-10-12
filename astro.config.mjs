// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // The live address. Astro uses it to build full URLs for the
  // sitemap and social share images.
  site: 'https://thornfell.co.uk',
  // Every page URL ends in a slash (/about/), matching how Netlify serves them.
  trailingSlash: 'ignore',
});
