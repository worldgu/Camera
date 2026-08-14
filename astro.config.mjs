import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://worldgu.github.io',
  base: '/Camera',
  integrations: [react()],
  legacy: {
    collectionsBackwardsCompat: true,
  },
});
