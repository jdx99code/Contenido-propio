// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://contenido-propio.vercel.app',
  adapter: vercel(),
  // Inline el CSS critico para eliminar el request bloqueante de render
  // y acelerar FCP/LCP (mejora el swap de la fuente del H1).
  build: {
    inlineStylesheets: 'always',
  },
  integrations: [
    react(),
    tailwind(),
    sitemap({
      filter: (page) => !page.endsWith('/styleguide/'),
    }),
  ],
});
