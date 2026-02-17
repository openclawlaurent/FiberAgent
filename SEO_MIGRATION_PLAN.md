# FiberAgent SEO Migration Plan

## Current State
- **Framework:** React 18.2.0 (Create React App)
- **Routing:** React Router v7
- **Backend:** Express API
- **Build Tool:** react-scripts
- **Pages:** 5 routes (/, /about, /demo, /agent, /user, /stats)
- **Issue:** SPA-only, not crawlable by search engines

## Strategy: react-snap (NOT Next.js)

### Why react-snap vs Next.js migration?
| Aspect | react-snap | Next.js Migration |
|--------|-----------|------------------|
| **Risk** | Low (post-build step) | High (full refactor) |
| **Time** | 2-3 hours | 8+ hours |
| **Breaking Changes** | None | Major structure changes |
| **Testing** | Easy to verify | Requires full rebuild |
| **Revert** | `npm uninstall react-snap` | Undo git commits |
| **SEO Result** | ✅ Pre-rendered HTML | ✅ Pre-rendered HTML |

**Recommendation:** Start with react-snap to validate SEO improvements, then decide if full Next.js migration needed.

---

## Implementation Plan (7 Phases)

### Phase 1: Pre-rendering (react-snap)
**Files to change:**
- `package.json` - Add dependencies + postbuild script
- `public/index.html` - Add noscript fallback

**Actions:**
1. Install: `npm install --save-dev react-snap`
2. Configure: Add `"postbuild": "react-snap"` to scripts
3. Add noscript fallback with description
4. Test: `npm run build` should generate static HTML in `/build`
5. Verify: `curl file:///path/to/build/index.html` shows content

**Why it works:**
- Runs Headless Chrome after build
- Pre-renders every page by following links
- Generates static HTML for each route
- Search engines see real HTML, not just JavaScript

---

### Phase 2: Meta Tags & SEO (react-helmet-async)
**Files to change:**
- `package.json` - Add react-helmet-async
- `src/index.js` - Wrap app with HelmetProvider
- Create `src/components/SEO.js` - Reusable SEO component
- Update all page components (5 pages)

**Structure:**
```javascript
// src/components/SEO.js
export default function SEO({ 
  title, 
  description, 
  ogImage, 
  ogUrl,
  type = 'website'
}) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={ogUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:type" content={type} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
```

**Per-page metadata:**
- Homepage: Brand + platform overview
- About: Company info
- Demo: Feature showcase
- For Agents: Agent registration
- User: End-user perspective
- Stats: Analytics dashboard

---

### Phase 3: Technical SEO Files
**New files:**
- `public/robots.txt` - Crawl instructions
- `public/sitemap.xml` - Route listing
- `public/humans.txt` - Team info (optional)
- `public/.well-known/ai-plugin.json` - AI agent discovery

**robots.txt content:**
```
User-agent: *
Allow: /
Disallow: /user
Sitemap: https://fiberagent.shop/sitemap.xml
```

**sitemap.xml content:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://fiberagent.shop/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://fiberagent.shop/about</loc>
    <priority>0.8</priority>
  </url>
  ...
</urlset>
```

---

### Phase 4: Structured Data (JSON-LD)
**New files:**
- `src/components/StructuredData.js` - Organization schema
- `src/pages/LandingPage.js` - Add Organization + SoftwareApplication
- `src/pages/AboutPage.js` - Add Organization
- Other pages as needed

**Schema to implement:**
- Organization (homepage)
- SoftwareApplication (product info)
- BreadcrumbList (navigation)
- FAQPage (if/when FAQ added)

**Testing:** Google Rich Results Test, Schema.org validator

---

### Phase 5: Accessibility & Semantic HTML
**Audit checklist:**
- [ ] Single `<h1>` per page
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Semantic tags: `<nav>`, `<main>`, `<article>`, `<section>`
- [ ] Alt text on ALL images
- [ ] ARIA labels on icon buttons
- [ ] Lazy loading on images: `loading="lazy"`
- [ ] Color contrast meets WCAG AA

**Changes:**
1. Wrap page content in `<main>`
2. Add `<header>` and `<footer>` structural tags
3. Add alt text to: hero images, card icons, logos
4. Add aria-label to navigation links
5. Audit with axe DevTools browser extension

---

### Phase 6: Performance Optimization
**Bundle analysis:**
- Install: `npm install --save-dev webpack-bundle-analyzer`
- Run: `npm run build -- --analyze`
- Identify large dependencies

**Optimizations:**
1. Code split routes with React.lazy()
2. Minify unused CSS (already done by CRA)
3. Optimize images (convert to WebP, add width/height)
4. Add caching headers in vercel.json or nginx config

---

### Phase 7: Testing & Validation
**Local testing (before push):**
```bash
# Build and pre-render
npm run build

# Test crawlability
curl -s file://$(pwd)/build/index.html | grep -i "fiber agent"
curl -s file://$(pwd)/build/about/index.html | grep -i "about"

# Run Lighthouse (requires Chrome)
npm run build && lighthouse build/index.html

# Validate SEO
curl -s https://localhost:3000/robots.txt
curl -s https://localhost:3000/sitemap.xml
```

**Google tools:**
1. Mobile-Friendly Test → https://search.google.com/test/mobile-friendly
2. Rich Results Test → https://search.google.com/test/rich-results
3. PageSpeed Insights → https://pagespeed.web.dev

---

## Rollback Plan
If anything breaks:
```bash
# Revert all changes
git reset --hard HEAD

# Or just remove react-snap
npm uninstall react-snap
git checkout package.json
npm install
```

---

## Timeline
| Phase | Complexity | Estimated Time |
|-------|-----------|-----------------|
| 1. react-snap | Low | 30 min |
| 2. Meta tags | Medium | 45 min |
| 3. Tech SEO files | Low | 20 min |
| 4. Structured data | Medium | 40 min |
| 5. A11y audit | Medium | 45 min |
| 6. Performance | Medium | 30 min |
| 7. Testing | Low | 30 min |
| **Total** | — | **4 hours** |

---

## Next Steps
1. Review this plan
2. Confirm proceeding with react-snap approach
3. Approve phase-by-phase implementation
4. Test locally before final GitHub push

**DO NOT PUSH TO GITHUB** until all phases tested locally.
