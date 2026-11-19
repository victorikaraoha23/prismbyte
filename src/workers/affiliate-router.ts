import { getActiveAffiliateLink } from '../data/affiliates.ts';

interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  BREVO_API_KEY?: string;
  BREVO_LIST_ID?: string;
}

const BREVO_API_URL = 'https://api.brevo.com/v3/contacts';

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function jsonResponse(
  data: unknown,
  status: number,
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handleNewsletter(
  request: Request,
  env: Env,
): Promise<Response> {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  if (!env.BREVO_API_KEY) {
    return jsonResponse(
      { error: 'Newsletter service not configured' },
      500,
    );
  }

  let bodyText: string;
  try {
    const buffer = await request.arrayBuffer();
    bodyText = new TextDecoder().decode(buffer);
  } catch {
    return jsonResponse({ error: 'Invalid request body' }, 400);
  }

  // Cloudflare Workers may re-serialize JSON bodies without quotes.
  // Handle both {"email":"..."} and {email:"..."} formats.
  let email: string | null = null;
  const jsonMatch = bodyText.match(/["']?email["']?\s*:\s*["']?([^"'\s,}]+)["']?/);
  if (jsonMatch) {
    email = jsonMatch[1];
  }
  if (typeof email !== 'string' || !isValidEmail(email)) {
    return jsonResponse({ error: 'A valid email address is required' }, 400);
  }

  const listIds = env.BREVO_LIST_ID ? [parseInt(env.BREVO_LIST_ID, 10)] : [];

  try {
    const brevoResponse = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'api-key': env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        listIds,
      }),
    });

    if (brevoResponse.ok) {
      return jsonResponse(
        { success: true, message: 'Subscribed successfully' },
        200,
      );
    }

    if (brevoResponse.status === 400) {
      return jsonResponse({ error: 'Email address is already subscribed' }, 409);
    }

    return jsonResponse(
      { error: 'Newsletter service temporarily unavailable' },
      502,
    );
  } catch {
    return jsonResponse(
      { error: 'Newsletter service temporarily unavailable' },
      502,
    );
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle newsletter signup requests
    if (url.pathname === '/api/newsletter') {
      if (request.method !== 'POST') {
        return jsonResponse({ error: 'Method not allowed' }, 405);
      }
      return handleNewsletter(request, env);
    }

    // Only handle /go/* paths for affiliate redirects
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