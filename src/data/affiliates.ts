export interface AffiliateLink {
  slug: string;
  name: string;
  destinationUrl: string;
  approved: boolean;
  active: boolean;
}

export const affiliateLinks: AffiliateLink[] = [
  {
    slug: 'murf-ai',
    name: 'Murf AI',
    destinationUrl: 'https://murf.ai/?via=prismbyte',
    approved: false,
    active: false,
  },
  {
    slug: 'nordvpn',
    name: 'NordVPN',
    destinationUrl: 'https://go.nordvpn.net/aff_c?offer_id=658&aff_id=95719',
    approved: true,
    active: true,
  },
  {
    slug: 'test-product',
    name: 'Test Product Example',
    destinationUrl: 'https://www.example.com/product',
    approved: false,
    active: false,
  },
];

function isValidHttpsUrl(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function getActiveAffiliateLink(slug: string): AffiliateLink | undefined {
  const link = affiliateLinks.find((l) => l.slug === slug);

  if (!link) {
    return undefined;
  }

  if (!link.approved) {
    return undefined;
  }

  if (!link.active) {
    return undefined;
  }

  if (!isValidHttpsUrl(link.destinationUrl)) {
    return undefined;
  }

  return link;
}
