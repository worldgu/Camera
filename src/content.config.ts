import { defineCollection, z } from 'astro:content';

const learn = defineCollection({
  type: 'content',
  pattern: '**/*.md',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    order: z.number(),
    date: z.string(),
    tags: z.array(z.string()),
  }),
});


export const collections = {
  learn,
};
