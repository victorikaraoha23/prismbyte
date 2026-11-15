# Cloudflare Workers

## Configuration

### wrangler.jsonc

The project includes a `wrangler.jsonc` configuration file:

```jsonc
{
  "name": "prismbyte",
  "compatibility_date": "2024-01-01",
  "compatibility_flags": []
}
```

- `name`: The Workers script name (`prismbyte`)
- `compatibility_date`: Minimum Node.js compatibility date
- `compatibility_flags`: Flags for experimental features

### Package.json Scripts

```json
{
  "scripts": {
    "wrangler": "wrangler dev",
    "wrangler:deploy": "wrangler publish",
    "wrangler:status": "wrangler status"
  }
}
```

### Worker Compatibility

The Worker uses static asset serving from the `dist/` directory. No Cloudflare Adapter or SSR is configured — the project generates pure static output via `npm run build`.

### Observability

Cloudflare Workers Builds provides automatic logging and metrics. No additional configuration is required for basic observability.

### Local Preview with Wrangler

```bash
npm run wrangler
```

This starts a local development server that simulates the Cloudflare Workers environment.

### Depployment Workflow

1. Push code to GitHub
2. Cloudflare detects the new commit
3. Cloudflare Runs `npm run build` to generate `dist/`
4. Cloudflare Deploys the static assets to the Worker
5. The Worker becomes available at the assigned URL