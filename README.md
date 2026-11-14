# Prismbyte

Prismbyte is a static Astro publication foundation for AI, SaaS, automation, and troubleshooting guidance for solo founders and small online businesses.

## Overview

This milestone sets up the site architecture, editorial content model, SEO foundation, and static pages required for a production-minded content publication. It intentionally avoids automation workflows, affiliate tracking infrastructure, or newsletter integrations beyond a clearly marked placeholder.

## Local setup

```bash
npm install
npm run dev -- --host
```

The site runs at `http://localhost:4321` by default.

## Production build

```bash
npm run build
npm run preview -- --host
```

## Cloudflare Pages deployment

1. Push the repository to GitHub.
2. In Cloudflare Pages, create a new project and connect the repository.
3. Set the build command to `npm run build`.
4. Set the build output directory to `dist`.
5. Deploy the project.

## Project structure

```text
.
├── public/
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── components/
│   ├── content/
│   │   └── articles/
│   ├── data/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   └── styles/
├── astro.config.mjs
├── package.json
├── README.md
├── tsconfig.json
└── dist/ (generated on build)
```

## Content model

Articles use Astro Content Collections and live under `src/content/articles`. Each article includes fields for title, description, publish date, category, tags, author, optional featured image, draft status, sources, and affiliate disclosure flags.

## SEO and metadata

The site includes:

- canonical URLs
- Open Graph metadata and X/Twitter metadata
- XML sitemap
- robots.txt
- structured organization metadata
- article schema for blog pages
- clean static routes with trailing slashes

## Production notes

- Static output is used for Cloudflare Pages compatibility.
- The newsletter signup preview is intentionally non-functional until Brevo integration is implemented.
- Affiliate links are prepared structurally but no fake product partnerships have been added.
- No analytics or automation backend is included in this milestone.
