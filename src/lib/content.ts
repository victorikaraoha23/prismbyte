import { getCollection } from 'astro:content';
import { categoryMeta } from '../data/site';

export async function getPublishedArticles() {
  const entries = await getCollection('articles', ({ data }) => !data.draft);
  return entries.sort(
    (a, b) => new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime(),
  );
}

export function getCategoryMeta(category: string) {
  return categoryMeta[category as keyof typeof categoryMeta] ?? {
    label: 'Article',
    description: 'Prismbyte editorial coverage.',
    href: '/blog/',
  };
}

export function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}
