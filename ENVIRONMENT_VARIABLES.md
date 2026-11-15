# Environment Variables

## Required Environment Variables

No environment variables are required for the static site build. All configuration is committed to the repository.

## Optional Environment Variables (for future integrations)

### Brevo (Newsletter)

If integrating Brevo newsletter signup:

```
BREVO_API_KEY=your_brevo_api_key_here
```

**Never commit this to the repository.** Add to `.env` and add `.env` to `.gitignore`.

### Cloudflare Workers (if needed)

```
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
```

### Affiliate Tracking (if implementing tracking)

```
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### AI Search Optimization

No environment variables required for llms.txt generation.

## .gitignore

The following are already excluded from version control (verified in `.gitignore`):

- `dist/` — Build output, generated locally
- `node_modules/` — Dependencies
- `.astro/` — Astro internal cache
- `.env*` — Local environment files
- `.wrangler/` — Wrangler local state
- `package-lock.json` — (generated, recreated on install)

## Usage

No environment variable configuration is needed for the current Phase 1 implementation. All settings are defined in code and `wrangler.jsonc`.

To add new integrations later, create a `.env` file at the project root and add the variable name to `.gitignore`.