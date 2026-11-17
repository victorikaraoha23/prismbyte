# Phase 2.2 — Initial Inspection Report

**Date:** 2026-11-17  
**Project:** Prismbyte  
**Website:** https://prismbyte.site  
**Framework:** Astro 7.x  
**Hosting:** Cloudflare Workers with static assets  
**GTM Container:** GTM-PBTM9VBW  

---

## 1. Files Inspected

| File | Status | Notes |
|------|--------|-------|
| `src/layouts/BaseLayout.astro` | ✅ Exists | Contains GTM script reference and affiliate click listener |
| `src/components/AffiliateLink.astro` | ✅ Exists | Generates proper affiliate links with tracking attributes |
| `src/components/ArticleCard.astro` | ✅ Exists | Standard article cards, no affiliate logic |
| `src/data/affiliates.ts` | ⚠️ Exists but empty | Should contain affiliate link definitions |
| `src/workers/affiliate-router.ts` | ✅ Exists | Handles `/go/*` redirect logic |
| `public/gtm.js` | ❌ Missing | Referenced in BaseLayout but not present |
| `package.json` | ✅ Exists | Standard Astro + Cloudflare setup |
| `wrangler.jsonc` | ✅ Exists | Cloudflare Workers configuration |

---

## 2. GTM Installation Analysis

### Current Implementation in `BaseLayout.astro`:

**Head (line 54):**
```html
<script async src="/gtm.js"></script>
```

**Body noscript (lines 70-77):**
```html
<noscript>
  <iframe
    src="https://www.googletagmanager.com/ns.html?id=GTM-PBTM9VBW"
    height="0"
    width="0"
    style="display:none;visibility:hidden"
  ></iframe>
</noscript>
```

### Issues Found:

1. **`/gtm.js` does not exist** in `public/` directory — the script will 404
2. Standard GTM installation should use the official GTM script from `googletagmanager.com`, not a local file
3. The GTM container ID `GTM-PBTM9VBW` is correctly referenced in the noscript iframe

---

## 3. Affiliate Click Listener Analysis

### Current Implementation (lines 89-109):

```javascript
document.addEventListener('click', function (event) {
  const target = event.target;
  const link = target instanceof Element
    ? target.closest('a[data-affiliate-link="true"]')
    : null;

  if (!link) return;

  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({
    event: 'affiliate_click',
    product_name: link.dataset.productName || '',
    link_url: link.href,
    link_text: link.textContent.trim(),
    page_location: window.location.href,
    page_title: document.title
  });
});
```

### Assessment:

| Requirement | Status | Notes |
|-------------|--------|-------|
| Event delegation | ✅ | Uses `document.addEventListener('click', ...)` |
| Identifies `data-affiliate-link="true"` | ✅ | Uses `closest()` correctly |
| Ignores non-affiliate clicks | ✅ | Returns early if no link found |
| Handles nested elements | ✅ | `closest()` traverses up the DOM |
| Pushes required parameters | ✅ | All 5 parameters included |
| Initializes dataLayer safely | ✅ | `window.dataLayer = window.dataLayer || []` |
| No fixed navigation delay | ✅ | No artificial delay added |
| Preserves keyboard/modifier behavior | ✅ | No `preventDefault()` or navigation interference |

### Minor Issues:

1. **Case sensitivity**: `link.dataset.productName` expects `data-product-name` (kebab-case in HTML → camelCase in dataset). This is correct.
2. **Empty product_name fallback**: Uses `|| ''` which is acceptable.
3. **Listener placement**: Script is at end of `<body>` — works but could be in `<head>` with `defer`.

---

## 4. Affiliate Link Component Analysis

### `AffiliateLink.astro` (lines 18-26):

```astro
<a
  href={`/go/${slug}`}
  data-affiliate-link="true"
  data-product-name={link.name}
  rel="nofollow sponsored"
  class={className}
>
  {children}
</a>
```

### Assessment:

| Requirement | Status |
|-------------|--------|
| `data-affiliate-link="true"` | ✅ |
| `data-product-name` attribute | ✅ |
| `rel="nofollow sponsored"` | ✅ |
| Uses `/go/` redirect pattern | ✅ |

---

## 5. Affiliate Data & Router Analysis

### `affiliates.ts`:
- **File exists but is empty** — no affiliate link definitions
- `getActiveAffiliateLink()` and `affiliateLinks` are imported by router and component but not defined

### `affiliate-router.ts`:
- Handles `/go/*` paths correctly
- Validates destination URLs (HTTPS only)
- Returns 302 redirect to affiliate destination
- Falls back to static assets for non-/go/ paths

---

## 6. Test Article Analysis

### `src/content/articles/test-affiliate-link.md`:

Contains a manual affiliate link:
```html
<a href="https://www.example.com/product" data-affiliate-link="true" data-product-name="Test Product Example">Test Product Example</a>
```

**Note:** This link bypasses the `/go/` redirect system and points directly to an external URL. The AffiliateLink component uses `/go/{slug}` pattern.

---

## 7. Summary of Required Changes

### Critical (Must Fix):

1. **Create `public/gtm.js`** with proper GTM installation script, OR update BaseLayout to use standard GTM script from `googletagmanager.com`
2. **Populate `src/data/affiliates.ts`** with affiliate link definitions and `getActiveAffiliateLink` export

### Recommended (Should Fix):

3. **Verify GTM container configuration** in GTM interface (Data Layer Variables, Custom Event Trigger, GA4 Event Tag)
4. **Verify GA4 configuration** (custom dimensions, key event)

### Optional (Nice to Have):

5. **Move affiliate click listener to `<head>` with `defer`** for earlier initialization
6. **Add test affiliate links** using the AffiliateLink component in a test article

---

## 8. Compliance with Phase 2.2 Specification

| Spec Requirement | Current Status |
|------------------|----------------|
| GTM container ID correct | ✅ `GTM-PBTM9VBW` |
| GTM script loads successfully | ❌ `/gtm.js` missing |
| GTM noscript iframe present | ✅ |
| `window.dataLayer` initialized correctly | ✅ |
| Affiliate click listener exists | ✅ |
| Listener correctly identifies affiliate links | ✅ |
| Listener pushes required event parameters | ✅ |
| Normal internal navigation unaffected | ✅ |
| Duplicate events prevented | ✅ (single listener) |
| Event configured in GTM | ❓ Unknown (requires GTM access) |
| Event reaches GA4 | ❓ Unknown (requires GA4 access) |

---

## 9. Next Steps

1. Fix the missing `gtm.js` file with proper GTM installation code
2. Populate `affiliates.ts` with at least one test affiliate definition
3. Verify the implementation works locally
4. Document GTM/GA4 configuration steps for manual setup
5. Run build and astro check