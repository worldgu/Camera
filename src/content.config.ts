import { defineConfig } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro:schema';

export default defineConfig({
  collections: {
    learn: {
      loader: glob({ pattern: '**/*.md', base: './src/content/learn' }),
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        category: z.string(),
        order: z.number().optional(),
        date: z.string().optional(),
        tags: z.array(z.string()).optional(),
      }),
    },
  },
});
