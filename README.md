# Prismbyte

**Clear choices. Smarter software. Better business.**

Prismbyte is an independent editorial website for solo founders and small online businesses. It publishes practical guidance on AI and SaaS tools, workflow automation, and software troubleshooting—with an emphasis on useful decisions rather than hype.

- **Website:** https://prismbyte.site
- **Status:** Live publication
- **Repository:** https://github.com/victorikaraoha23/prismbyte

## Editorial focus

- **AI & SaaS:** product discovery, practical workflows, and software decisions for small teams.
- **Automation:** playbooks for reducing repetitive work without adding unnecessary operational complexity.
- **Troubleshooting:** technical fixes, debugging guidance, and API integration help.

## Site capabilities

- Static, content-driven pages and article routes
- Astro Content Collections for typed article metadata
- Category pages, article listings, and individual article pages
- Canonical metadata, Open Graph and X metadata, sitemap, robots.txt, and structured data
- Affiliate disclosure and a small redirect worker for configured affiliate destinations
- Responsive layouts and accessible navigation patterns
- Cloudflare deployment configuration

Article content lives in `src/content/articles/`. Site identity, navigation, and category metadata are defined in `src/data/site.ts`.

## Technology

- Astro 7
- TypeScript
- Cloudflare Workers with static assets
- Astro Content Collections
- Node.js test runner and Miniflare for worker-focused tests

## Local development

Requirements: Node.js version compatible with the `engines` field in `package.json`, npm.

```bash
git clone https://github.com/victorikaraoha23/prismbyte.git
cd prismbyte
npm install
npm run dev
```

Astro serves the local site at http://localhost:4321 by default.

## Build and checks

```bash
npm test
npm run build
npx astro check
```

## Deployment

The repository includes `wrangler.jsonc` for Cloudflare Workers. Review the configured account and deployment settings before publishing:

```bash
npm run wrangler:status
npm run wrangler:deploy
```

## Project boundaries

Prismbyte is an editorial publication, not a SaaS product. Affiliate components and routing are infrastructure for disclosed links; their presence does not imply an active commercial partnership. Newsletter UI and integrations should only be described as operational when a real provider integration has been configured and tested.
