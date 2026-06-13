# Madcap Tees — SEO, Accessibility & Performance Guide

**Version:** 1.0 | **Date:** June 9, 2026

---

## 1. SEO Strategy

### 1.1 URL Structure
```
/                          → Homepage
/shop                      → Catalog (with filters in query params)
/shop?category=tees        → Filtered by category
/shop?theme=nj-flavor      → Filtered by theme
/shop?search=ween          → Search results
/products/[slug]           → Product detail
/cart                      → Cart page
/checkout                  → Checkout (Stripe redirect)
/admin                     → Dashboard (noindex)
/admin/products            → Product list (noindex)
/admin/orders              → Order management (noindex)
```

### 1.2 Meta Tags (Per Page)

| Page | Title | Description |
|------|-------|-------------|
| Homepage | Madcap Tees | Funny Graphic Tees, Hoodies & Hats | Mad as hell and twice as funny. Shop original satirical, retro, and pop-culture graphic apparel designed in New Jersey. Free shipping over $125. |
| Shop | Shop All Graphic Tees & Apparel | Madcap Tees | Browse our full collection of funny graphic t-shirts, hoodies, hats, and more. Filter by theme, category, or search for your favorite designs. |
| Product | [Product Title] | Madcap Tees | [Product description] — Made to order. Ships in 7 days. Free shipping over $125. |
| Category | [Category] Graphic Tees | Madcap Tees | Shop [category] — funny, satirical designs made to order in the USA. |

### 1.3 Open Graph Tags
```html
<meta property="og:title" content="Mad As Hell Tee | Madcap Tees" />
<meta property="og:description" content="Mad as hell and twice as funny. Made to order." />
<meta property="og:image" content="https://cdn.supabase.io/product-images/mad-as-hell-og.jpg" />
<meta property="og:type" content="product" />
<meta property="og:price:amount" content="25.00" />
<meta property="og:price:currency" content="USD" />
```

### 1.4 JSON-LD Structured Data (Product Pages)
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Mad As Hell Tee",
  "image": "https://cdn.supabase.io/product-images/mad-as-hell-front.jpg",
  "description": "Mad as hell and twice as funny. Original satirical graphic tee.",
  "brand": {
    "@type": "Brand",
    "name": "Madcap Tees"
  },
  "offers": {
    "@type": "Offer",
    "price": "25.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": {
        "@type": "MonetaryAmount",
        "value": "0",
        "currency": "USD"
      }
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "124"
  }
}
```

### 1.5 Sitemap
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://madcaptees.com/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://madcaptees.com/shop</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
  <!-- Dynamic: all published products -->
  <url><loc>https://madcaptees.com/products/mad-as-hell-tee</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <!-- Collections -->
  <url><loc>https://madcaptees.com/shop?theme=best-sellers</loc><changefreq>daily</changefreq><priority>0.7</priority></url>
</urlset>
```

### 1.6 Robots.txt
```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /cart
Disallow: /checkout

Sitemap: https://madcaptees.com/sitemap.xml
```

---

## 2. Accessibility (WCAG 2.1 AA)

### 2.1 Keyboard Navigation
- All interactive elements reachable via Tab
- Focus visible: 2px solid #C41E3A outline, 2px offset
- Enter/Space activates buttons, links
- Escape closes modals, drawers, dropdowns
- Trap focus in modals (Tab cycles within)

### 2.2 Screen Reader Support
```html
<!-- Product cards -->
<article aria-label="Mad As Hell Tee, $25.00">
  <img alt="Black t-shirt with 'Mad As Hell' graphic print" />
  <h3>Mad As Hell Tee</h3>
  <p aria-label="Price: 25 dollars">$25.00</p>
</article>

<!-- Size selector -->
<fieldset>
  <legend>Select size</legend>
  <button aria-pressed="false" aria-label="Size Small">S</button>
  <button aria-pressed="true" aria-label="Size Medium, selected">M</button>
</fieldset>

<!-- Color swatches -->
<fieldset>
  <legend>Select color</legend>
  <button aria-label="Color: Black, selected" aria-pressed="true">
    <span style="background-color: #0A0A0A"></span>
  </button>
</fieldset>

<!-- Cart -->
<button aria-label="Shopping cart, 3 items">
  <span aria-hidden="true">🛒</span>
  <span class="sr-only">3 items</span>
</button>
```

### 2.3 Color Contrast
| Element | Foreground | Background | Ratio | Pass |
|---------|-----------|------------|-------|------|
| Body text | #0A0A0A | #F5F0E8 | 16.8:1 | AAA |
| Primary button | #FFFFFF | #C41E3A | 5.2:1 | AA |
| Muted text | #64748B | #F5F0E8 | 5.4:1 | AA |
| Success text | #FFFFFF | #00C853 | 3.0:1 | AA (large text) |
| Links | #1B7A7A | #F5F0E8 | 4.6:1 | AA |

### 2.4 Motion & Animation
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 2.5 Alt Text Guidelines
- Every product image has descriptive alt text (admin field)
- Decorative images: `alt=""`
- Functional icons: `aria-label` instead of alt
- Complex graphics: aria-describedby pointing to detailed description

---

## 3. Performance Targets

### 3.1 Core Web Vitals
| Metric | Target | Current |
|--------|--------|---------|
| LCP (Largest Contentful Paint) | < 2.5s | — |
| INP (Interaction to Next Paint) | < 200ms | — |
| CLS (Cumulative Layout Shift) | < 0.1 | — |
| FCP (First Contentful Paint) | < 1.8s | — |
| TTFB (Time to First Byte) | < 600ms | — |
| Lighthouse Score | > 90 | — |

### 3.2 Optimization Strategies

**Images:**
```typescript
// Next.js Image component with optimization
<Image
  src={productImage}
  alt={product.title}
  width={600}
  height={800}
  quality={85}
  placeholder="blur"
  blurDataURL={placeholderBase64}
  loading="lazy" // Below-fold images
  priority // Above-fold hero images
/>
```

**Code Splitting:**
```typescript
// Dynamic imports for heavy components
const AdminDashboard = dynamic(() => import('./AdminDashboard'), {
  loading: () => <Skeleton />
});
```

**Font Loading:**
```html
<!-- Preload critical fonts -->
<link rel="preload" href="/fonts/anton-v23-latin-regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/dm-sans-v15-latin-regular.woff2" as="font" type="font/woff2" crossorigin>

<!-- Font display swap for fast render -->
<style>
  @font-face {
    font-family: 'Anton';
    src: url('/fonts/anton-v23-latin-regular.woff2') format('woff2');
    font-display: swap;
  }
</style>
```

**Caching:**
```typescript
// Vercel Edge caching for product pages
export const revalidate = 60; // ISR: regenerate every 60s

// Supabase query caching
const { data } = await supabase
  .from('products')
  .select('*')
  .eq('published', true)
  .cache('1 minute');
```

### 3.3 Bundle Size Budget
| Chunk | Target | Strategy |
|-------|--------|----------|
| Initial JS | < 200KB | Tree-shake, dynamic imports |
| CSS | < 50KB | Purge unused Tailwind classes |
| Images | < 500KB per page | WebP/AVIF, responsive srcset |
| Fonts | < 100KB | Subset Latin only, woff2 |

---

## 4. Testing Checklist

### 4.1 SEO Testing
- [ ] Google Search Console verified
- [ ] Sitemap submitted
- [ ] robots.txt valid
- [ ] Meta tags render correctly (Facebook Debugger, Twitter Card Validator)
- [ ] JSON-LD validates (Google Rich Results Test)
- [ ] Slug URLs work and redirect old URLs
- [ ] Canonical tags set correctly

### 4.2 Accessibility Testing
- [ ] Keyboard-only navigation works end-to-end
- [ ] Screen reader (NVDA/VoiceOver) announces all content
- [ ] Color contrast passes WCAG AA (use axe DevTools)
- [ ] Focus indicators visible on all interactive elements
- [ ] No auto-playing media
- [ ] Form labels associated with inputs
- [ ] Error messages announced to screen readers

### 4.3 Performance Testing
- [ ] Lighthouse score 90+ on mobile and desktop
- [ ] Core Web Vitals pass on PageSpeed Insights
- [ ] Images optimized (WebP, proper sizing)
- [ ] No render-blocking resources
- [ ] Fonts load fast (font-display: swap)
- [ ] Bundle size under budget
