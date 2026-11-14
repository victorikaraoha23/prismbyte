import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(['ai-saas', 'automation', 'troubleshooting']),
    tags: z.array(z.string()).default([]),
    author: z.string().default('Prismbyte Editorial'),
    featuredImage: z.string().optional(),
    featuredImageAlt: z.string().optional(),
    imageSource: z.string().optional(),
    draft: z.boolean().default(false),
    sources: z.array(z.string()).default([]),
    affiliateDisclosure: z.boolean().default(false),
  }),
});

export const collections = { articles };
