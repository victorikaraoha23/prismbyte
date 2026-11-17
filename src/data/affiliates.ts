export interface AffiliateLink {
  slug: string;
  name: string;
  destinationUrl: string;
  active: boolean;
}

export const affiliateLinks: AffiliateLink[] = [
  {
    slug: 'murf-ai',
    name: 'Murf AI',
    destinationUrl: 'https://murf.ai/?via=prismbyte',
    active: true,
  },
  {
    slug: 'test-product',
    name: 'Test Product Example',
    destinationUrl: 'https://www.example.com/product',
    active: true,
  },
];

export function getActiveAffiliateLink(slug: string): AffiliateLink | undefined {
  return affiliateLinks.find((link) => link.slug === slug && link.active);
}