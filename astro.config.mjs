// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://contenido-propio.vercel.app',
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.endsWith('/styleguide/'),
    }),
  ],
});
