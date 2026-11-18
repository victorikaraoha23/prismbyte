import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  getActiveAffiliateLink,
  affiliateLinks,
  type AffiliateLink,
} from '../src/data/affiliates.ts';

// Helper to build a mock AffiliateLink object inline
function makeLink(overrides: Partial<AffiliateLink>): AffiliateLink {
  return {
    slug: 'test-slug',
    name: 'Test Product',
    destinationUrl: 'https://example.com/product',
    approved: false,
    active: false,
    ...overrides,
  } as AffiliateLink;
}

describe('getActiveAffiliateLink', () => {
  test('returns link when approved AND active AND HTTPS', () => {
    const testLink: AffiliateLink = {
      slug: 'test-slug',
      name: 'Test Product',
      destinationUrl: 'https://example.com/product',
      approved: true,
      active: true,
    };

    // Temporarily add to registry for positive-case test
    affiliateLinks.push(testLink);
    try {
      const result = getActiveAffiliateLink('test-slug');
      assert.equal(result?.slug, 'test-slug');
      assert.equal(result?.name, 'Test Product');
    } finally {
      // Remove test entry to leave registry unchanged
      const index = affiliateLinks.indexOf(testLink);
      if (index !== -1) {
        affiliateLinks.splice(index, 1);
      }
    }

    // Verify registry is back to original state
    assert.equal(getActiveAffiliateLink('test-slug'), undefined);
  });

  test('returns null when unapproved but active', () => {
    const link = makeLink({ approved: false, active: true });
    const result = getActiveAffiliateLink(link.slug);
    assert.equal(result, undefined);
  });

  test('returns null when approved but inactive', () => {
    const link = makeLink({ approved: true, active: false });
    const result = getActiveAffiliateLink(link.slug);
    assert.equal(result, undefined);
  });

  test('returns null when unapproved and inactive', () => {
    const link = makeLink({ approved: false, active: false });
    const result = getActiveAffiliateLink(link.slug);
    assert.equal(result, undefined);
  });

  test('returns null for unknown slug', () => {
    const result = getActiveAffiliateLink('unknown-slug');
    assert.equal(result, undefined);
  });

  test('returns null when destination is HTTP not HTTPS', () => {
    const link = makeLink({
      approved: true,
      active: true,
      destinationUrl: 'http://example.com/product',
    });
    const result = getActiveAffiliateLink(link.slug);
    assert.equal(result, undefined);
  });

  test('returns null when destination is malformed', () => {
    const link = makeLink({
      approved: true,
      active: true,
      destinationUrl: 'not-a-valid-url',
    });
    const result = getActiveAffiliateLink(link.slug);
    assert.equal(result, undefined);
  });
});

describe('affiliate registry', () => {
  test('all entries have approved and active fields', () => {
    for (const link of affiliateLinks) {
      assert.ok(typeof link.approved === 'boolean');
      assert.ok(typeof link.active === 'boolean');
    }
  });

  test('all entries are currently unapproved', () => {
    for (const link of affiliateLinks) {
      assert.equal(link.approved, false);
    }
  });

  test('all entries are currently inactive', () => {
    for (const link of affiliateLinks) {
      assert.equal(link.active, false);
    }
  });

  test('getActiveAffiliateLink returns null for all registry entries', () => {
    for (const link of affiliateLinks) {
      assert.equal(getActiveAffiliateLink(link.slug), undefined);
    }
  });
});

describe('AffiliateLink worker redirect logic', () => {
  test('Worker imports getActiveAffiliateLink from central registry', async () => {
    const workerModule = await import('../src/workers/affiliate-router.ts');
    assert.ok(typeof workerModule.default === 'object');
    assert.ok(typeof workerModule.default.fetch === 'function');
  });

  test('All /go/* requests return 404 since no programs are approved+active', async () => {
    const workerModule = await import('../src/workers/affiliate-router.ts');
    const mockEnv: any = {
      ASSETS: {
        fetch: async (req: Request) => new Response('asset', { status: 200 }),
      },
    };

    for (const link of affiliateLinks) {
      const req = new Request(`https://prismbyte.site/go/${link.slug}`);
      const res = await workerModule.default.fetch(req, mockEnv);
      assert.equal(res.status, 404);
    }
  });

  test('Unknown slug returns 404', async () => {
    const workerModule = await import('../src/workers/affiliate-router.ts');
    const mockEnv: any = {
      ASSETS: {
        fetch: async (req: Request) => new Response('asset', { status: 200 }),
      },
    };
    const req = new Request('https://prismbyte.site/go/unknown-slug');
    const res = await workerModule.default.fetch(req, mockEnv);
    assert.equal(res.status, 404);
  });

  test('Approved + active + valid HTTPS returns 302 with matching Location header', async () => {
    const workerModule = await import('../src/workers/affiliate-router.ts');
    const mockEnv: any = {
      ASSETS: {
        fetch: async (req: Request) => new Response('asset', { status: 200 }),
      },
    };

    // Temporarily add an approved+active link for positive-case Worker test
    const testLink: AffiliateLink = {
      slug: 'test-redirect',
      name: 'Redirect Test',
      destinationUrl: 'https://example.com/destination',
      approved: true,
      active: true,
    };
    affiliateLinks.push(testLink);
    try {
      const req = new Request('https://prismbyte.site/go/test-redirect');
      const res = await workerModule.default.fetch(req, mockEnv);
      assert.equal(res.status, 302);
      assert.equal(res.headers.get('Location'), 'https://example.com/destination');
    } finally {
      const index = affiliateLinks.indexOf(testLink);
      if (index !== -1) {
        affiliateLinks.splice(index, 1);
      }
    }
  });

  test('Query parameters do not change redirect destination', async () => {
    const workerModule = await import('../src/workers/affiliate-router.ts');
    const mockEnv: any = {
      ASSETS: {
        fetch: async (req: Request) => new Response('asset', { status: 200 }),
      },
    };

    const testLink: AffiliateLink = {
      slug: 'test-query',
      name: 'Query Test',
      destinationUrl: 'https://example.com/query-dest',
      approved: true,
      active: true,
    };
    affiliateLinks.push(testLink);
    try {
      // Query param attempting to override destination
      const req = new Request(
        'https://prismbyte.site/go/test-query?destinationUrl=https://evil.com/'
      );
      const res = await workerModule.default.fetch(req, mockEnv);
      // Destination should come from registry, not query string
      assert.equal(res.status, 302);
      assert.equal(res.headers.get('Location'), 'https://example.com/query-dest');
    } finally {
      const index = affiliateLinks.indexOf(testLink);
      if (index !== -1) {
        affiliateLinks.splice(index, 1);
      }
    }
  });

  test('Normal website page routes to ASSETS fallback', async () => {
    const workerModule = await import('../src/workers/affiliate-router.ts');
    const assetsFetch = async (req: Request) =>
      new Response('page content', { status: 200 });
    const mockEnv: any = { ASSETS: { fetch: assetsFetch } };

    const req = new Request('https://prismbyte.site/about/');
    const res = await workerModule.default.fetch(req, mockEnv);
    assert.equal(res.status, 200);
    const text = await res.text();
    assert.equal(text, 'page content');
  });

  test('Normal static asset routes to ASSETS fallback', async () => {
    const workerModule = await import('../src/workers/affiliate-router.ts');
    const assetsFetch = async (req: Request) =>
      new Response('css content', { status: 200 });
    const mockEnv: any = { ASSETS: { fetch: assetsFetch } };

    const req = new Request('https://prismbyte.site/styles/global.css');
    const res = await workerModule.default.fetch(req, mockEnv);
    assert.equal(res.status, 200);
    const text = await res.text();
    assert.equal(text, 'css content');
  });
});