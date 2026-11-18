import { getActiveAffiliateLink } from '../data/affiliates.ts';

interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Only handle /go/* paths
    if (!url.pathname.startsWith('/go/')) {
      return env.ASSETS.fetch(request);
    }

    const slug = url.pathname.slice(4);
    const link = getActiveAffiliateLink(slug);

    if (!link) {
      return new Response(null, { status: 404 });
    }

    // Validate destination URL
    try {
      const parsed = new URL(link.destinationUrl);
      if (parsed.protocol !== 'https:') {
        return new Response(null, { status: 404 });
      }
    } catch {
      return new Response(null, { status: 404 });
    }

    return Response.redirect(link.destinationUrl, 302);
  },
};