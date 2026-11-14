export const site = {
  name: 'Prismbyte',
  title: 'Prismbyte',
  description: 'Clear choices. Smarter software. Better business.',
  url: 'https://prismbyte.site',
  tagline: 'Clear choices. Smarter software. Better business.',
  email: 'hello@prismbyte.site',
};

export const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'AI & SaaS', href: '/ai-saas/' },
  { label: 'Automation', href: '/automation/' },
  { label: 'Troubleshooting', href: '/troubleshooting/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
];

export const categoryMeta = {
  'ai-saas': {
    label: 'AI & SaaS',
    description:
      'Product discovery, practical workflows, and real-world AI and SaaS decision-making for small businesses and founders.',
    href: '/ai-saas/',
  },
  automation: {
    label: 'Automation',
    description:
      'Automation playbooks, business process guidance, and lightweight systems that save time without adding complexity.',
    href: '/automation/',
  },
  troubleshooting: {
    label: 'Troubleshooting',
    description:
      'Technical fixes, debugging steps, and implementation guidance for software issues that stall work.',
    href: '/troubleshooting/',
  },
} as const;

export const legalLinks = [
  { label: 'Affiliate disclosure', href: '/affiliate-disclosure/' },
  { label: 'Privacy policy', href: '/privacy-policy/' },
  { label: 'Terms', href: '/terms/' },
];
