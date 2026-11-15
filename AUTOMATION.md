# Automation Readiness

## n8n Content Publishing Workflow

The website is structured for automated content publishing via n8n hosted on your own server.

### Content Structure

Articles follow a consistent frontmatter schema for programmatic creation:

```yaml
title: "Article Title"
description: "A practical framework for evaluating software tools"
publishDate: 2026-11-01
updatedDate: 2026-11-05 (optional)
category: "ai-saas"
tags: ["AI tools", "SaaS"]
author: "Prismbyte Editorial"
draft: false
featuredImage: "optional-image-path.jpg"
featuredImageAlt: "Alternative text for image"
imageSource: "source-of-image"
sources:
  - "https://example.com/reference"
affiliateDisclosure: false
```

### Slug Convention

Slugs are derived from the article ID (the file path without extension). Example:

- File: `src/content/articles/ai-saas-practical-shortlist.md`
- Generated route: `/blog/ai-saas-practical-shortlist/`
- Article ID used in URLs: `ai-saas-practical-shortlist`

### Draft/Published Distinction

- `draft: false` — article is published and appears on the blog
- `draft: true` — article is hidden from public listings (`getPublishedArticles()` filters by `!data.draft`)
- Only published articles generate static routes via `getStaticPaths()` in `[slug].astro`

### Programmatic Publishing via n8n

n8n can automate the following workflow:

1. **Create article file** — Write Markdown frontmatter to `src/content/articles/`
2. **Commit to Git** — `git add`, `git commit -m "Add new article: <title>"`
3. **Push to GitHub** — `git push origin main`
4. **Cloudflare Pages/Workers Builds trigger** — Automatic rebuild on push
5. **Generate static site** — `npm run build` produces updated `dist/`
6. **Deploy** — Cloudflare automatically redeploys

### SEO Metadata Supply

Each article supports programmatic supply of:

- `title` — H1 and SEO title
- `description` — Meta description and Open Graph description
- `publishDate` — Date published and schema.org datePublished
- `updatedDate` — Date modified and schema.org dateModified
- `category` — Category classification and category page routing
- `tags` — Tag pages and internal linking
- `author` — Author attribution and JSON-LD author field
- `featuredImage` — Featured image for social sharing
- `featuredImageAlt` — Alt text for accessibility and SEO
- `imageSource` — Image credit/source attribution
- `sources` — Reference links for schema.org `sources` field
- `affiliateDisclosure` — Transparency flag for JSON-LD and disclaimer

### Future n8n Node Recommendations

- **File System node** — Write Markdown files to `src/content/articles/`
- **Git node** — Commit and push changes to GitHub
- **HTTP Request node** — Trigger Cloudflare API or webhook on push
- **Schedule node** — Regular content review and publication pipeline

### Secure Publishing Considerations

- Do not commit API keys or secrets to the GitHub repository
- Use `.gitignore` to exclude `node_modules/`, `dist/`, `.env*`
- Consider using GitHub Secrets for any backend credentials
- The frontend (Astro) does not expose backend credentials to browsers