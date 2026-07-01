// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://contenido-propio.vercel.app',
  integrations: [
    react(),
    tailwind(),
    sitemap({
      filter: (page) => !page.endsWith('/styleguide/'),
    }),
  ],
});
