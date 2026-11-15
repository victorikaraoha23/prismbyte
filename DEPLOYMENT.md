# Deployment

## Cloudflare Workers Builds

This project is configured for deployment via Cloudflare Workers Builds connected to GitHub.

### Prerequisites

- Node.js >= 22.23.4
- npm or yarn
- Cloudflare account
- GitHub repository connected to Cloudflare

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# The site runs at http://localhost:4321 by default
```

### Production Build

```bash
# Build the static site
npm run build

# Output is in the dist/ directory
```

### Local Preview

```bash
# Preview the production build
npm run preview

# Runs at http://localhost:4321 by default
```

### Cloudflare Deployment

```bash
# Ensure Wrangler is installed
npm install -D wrangler

# Deploy to Cloudflare
npm run wrangler:deploy

# Check deployment status
npm run wrangler:status
```

### GitHub Integration

1. Push this repository to GitHub
2. In Cloudflare dashboard, create a new Workers Builds project
3. Connect the GitHub repository
4. Set the build command: `npm run build`
5. Set the build output directory: `dist`
6. Enable auto-deploy on push

### Custom Domain Configuration

1. In Cloudflare dashboard, go to your Workers Builds project
2. Add a custom domain under "Settings" -> "Custom domains"
3. Configure DNS records in Cloudflare for your domain
4. Update your domain's nameservers to point to Cloudflare if not already

## Static Asset Output

The Astro build generates static output in `dist/`. This directory contains:

- HTML files for all routes
- CSS and JavaScript bundles
- Assets (favicon, robots.txt, sitemap.xml)
- No server-side rendering is required — purely static deployment