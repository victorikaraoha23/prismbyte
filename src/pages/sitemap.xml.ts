import type { APIRoute } from 'astro';
import { getPublishedArticles } from '../lib/content';
import { site } from '../data/site';

const staticRoutes = [
  '/',
  '/about/',
  '/affiliate-disclosure/',
  '/automation/',
  '/blog/',
  '/contact/',
  '/privacy-policy/',
  '/terms/',
  '/ai-saas/',
  '/troubleshooting/',
];

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const GET: APIRoute = async () => {
  const articles = await getPublishedArticles();
  const urls = [...staticRoutes, ...articles.map((article) => `/blog/${article.id}/`)].map(
    (path) => `  <url><loc>${escapeXml(`${site.url}${path}`)}</loc></url>`,
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
