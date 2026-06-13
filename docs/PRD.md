# Madcap Tees — Product Requirements Document

**Version:** 3.0 Final | **Date:** June 9, 2026 | **Owner:** Faith (@madcaptees) | **Status:** Production-Ready

---

## 1. Vision & Business Context

Madcap Tees sells satirical, retro, Mad-Magazine-flavored graphic apparel through Instagram (@madcaptees). Every sale is currently a manual DM transaction — there is no catalog, no search, no checkout, and no way for customers to discover the full range. Growth is capped by the owner's messaging capacity.

The vision is a **self-owned storefront** where the owner adds a new shirt in the backend in under two minutes and it appears on a beautiful, fast front end immediately — the "displays mellifluously" requirement.

Two reference stores anchor the experience:
- **Threadless** — discovery-driven browsing, themes/collections, "new" and "popular" sorting, artist/community feel
- **Busted Tees** — pop-culture humor focus, best-sellers showcase, quick-view, made-to-order transparency, free-shipping thresholds

Madcap Tees carries its own distinct visual identity: vintage screen-print newsprint aesthetic with halftone dot textures, ink-black rules, a bold red accent (#C41E3A), gold and teal secondaries, heavy poster type paired with monospace labels.

---

## 2. Goals & Success Metrics

| Metric | Target |
|--------|--------|
| New shirt published → visible on storefront | < 10 seconds, 100% of the time |
| Page load (catalog and product pages) | < 2 seconds, Core Web Vitals "good" |
| Mobile experience | Fully responsive; primary design target |
| First online sale | Within 14 days of launch |
| Owner effort to list a product | < 2 minutes |
| Cart persistence | Survives page refresh, syncs across tabs |
| Checkout completion rate | > 60% from cart page |

---

## 3. Personas

**Faith (Owner/Operator)** — Non-developer. Wants to add designs quickly, see what's selling, fulfill orders without touching code. Needs an admin tool that feels like Notion, not cPanel.

**The Shopper** — 20–45, pop-culture and band-merch buyer, often impulse-buying from Instagram on a phone. Wants to browse, laugh, pick a size, and check out fast. Expects Threadless-level discovery and Busted Tees-level humor.

---

## 4. Scope

### MVP (Must-Have)
- Full storefront: homepage, shop with filters/search/sort, product detail, cart, checkout
- Admin product CRUD with instant publish
- Order capture and management
- Responsive design (mobile-first)
- Basic SEO (slugs, meta tags, structured data)
- Stripe payment integration
- Print-on-demand fulfillment hooks

### Phase 2
- Customer accounts & order history
- Wishlist
- Instagram feed embed
- Email receipts & marketing
- Discount codes

### Phase 3
- Analytics dashboard
- Abandoned-cart recovery
- Reviews
- AI mockup generation
- Multi-currency

---

## 5. Functional Requirements

### 5.1 Homepage (FR-1 – FR-5)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-1 | **Announcement Bar** | Green (#00C853) bar at top: "FREE DOMESTIC SHIPPING on orders over $125 | Each item is made to order. Please allow up to 7 days for production." Dismissible on mobile. |
| FR-2 | **Navigation** | Centered Madcap Tees logo. Left: Collections dropdown (NJ Flavor, Satirical, Retro, Band Merch, Best Sellers), Apparel dropdown (Tees, Hoodies, Longsleeve, Hats). Right: Stickers link, Best Sellers, New Arrivals. Far right: Search icon, Account, Cart with badge. |
| FR-3 | **Hero Carousel** | 3–5 slides. Slide 1: "Mad As Hell & Twice As Funny" CTA. Slide 2: "New Arrivals — Shop Now". Slide 3: Featured artist/collab. Auto-advance 5s. Manual dots/arrows. |
| FR-4 | **Collection Promo Cards** | Grid of 5 cards: New Arrivals, Best Sellers, Gift Cards, Featured Artist, Final Sale. Each card has background image, title, and "Shop Now" CTA. |
| FR-5 | **Best Selling Apparel** | Horizontal carousel of 8 products with "View All" link. Product cards show image, title, price (strikethrough + sale price if applicable), "Sale" badge, "Quick View" button on hover. |

### 5.2 Shop / Catalog Page (FR-6 – FR-11)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-6 | **Category Icon Filters** | Top row of circular icon buttons: Mens T, Womens T, Hats, Hoodie, Long Sleeve, Tanks, Youth. Each shows product count in parentheses. |
| FR-7 | **Left Sidebar Filters** | Accordion sections: Artists, Product Category, Style. Style shows checkbox list with counts: Classic Guys/Unisex Tee (count), Classic Ladies Tee (count), Hats (count), etc. |
| FR-8 | **Sort Dropdown** | Options: Featured, Best Selling, Price Low to High, Price High to Low, Date New to Old, Date Old to New. |
| FR-9 | **Product Grid** | Responsive grid: 4 cols desktop, 3 cols tablet, 2 cols mobile. Infinite scroll or pagination. Each card: primary image, title, regular price (strikethrough), sale price, "Save $X" text, "Sale" badge (if applicable), "Quick View" button on hover. |
| FR-10 | **Result Count & SEO Text** | "3,604 products" displayed. Below filters: collection description with keyword-rich SEO copy (like Busted Tees' "Discover why thousands of fans keep coming back..."). |
| FR-11 | **Quick View Modal** | On click from grid: modal with image carousel, title, price, size selector, color selector, add-to-cart. Does not navigate away from catalog. |

### 5.3 Product Detail Page (FR-12 – FR-17)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-12 | **Image Gallery** | Left side: main image with thumbnail strip below. Thumbnails clickable to swap main image. Zoom on hover (2x magnification). Swipe on mobile. |
| FR-13 | **Product Info** | Right side: title, price (regular + sale), "Made to Order — Ships in ~7 days" badge, short description. |
| FR-14 | **Variant Selectors** | Size buttons (S, M, L, XL, 2XL, 3XL) as pill/toggle group. Color swatches with 6 options (Black, White, Heather Grey, Navy, Red, Teal). |
| FR-15 | **Add to Cart** | Quantity stepper (+/-). "Add to Cart" button (prominent, Mad-red). After adding: toast notification, cart badge updates. |
| FR-16 | **Related Products** | "You May Also Like" section: 4 products sharing at least one theme, excluding current product. |
| FR-17 | **SEO Structured Data** | JSON-LD Product schema on page. Clean slug URL: /products/mad-as-hell-tee |

### 5.4 Cart (FR-18 – FR-21)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-18 | **Cart Drawer** | Slide-out drawer from right. Shows: product image, title, size, color, unit price, quantity stepper, remove button. Subtotal. |
| FR-19 | **Free Shipping Bar** | Progress bar showing "$XX away from free shipping" with $125 threshold. Green fill animation. |
| FR-20 | **Cart Persistence** | localStorage + Supabase sync. Survives page refresh. Syncs across browser tabs. |
| FR-21 | **Cart Actions** | "Continue Shopping" (closes drawer), "Checkout" (proceeds to Stripe), empty state with "Shop New Arrivals" CTA. |

### 5.5 Checkout (FR-22 – FR-25)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-22 | **Stripe Checkout** | Redirect to Stripe hosted checkout. Line items from cart. Shipping rules applied. |
| FR-23 | **Webhook Handling** | Stripe webhook confirms payment → order status flips to "paid" → cart clears → confirmation email triggered. |
| FR-24 | **Order Confirmation** | Success page with order number, total, email confirmation message. |
| FR-25 | **Guest Checkout** | No account required. Email captured at checkout for receipts. |

### 5.6 Admin Dashboard (FR-26 – FR-35)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-26 | **Protected Access** | Route /admin gated by Supabase Auth + admin role. Middleware redirects non-admin users. |
| FR-27 | **Dashboard Overview** | Cards: Total Designs, Live Designs, Orders Today, Revenue This Month. Quick "Add New Shirt" button. Recent orders table (last 5). |
| FR-28 | **Product List** | Table with: thumbnail, title, category, price, themes (badges), status pill (Published/Draft), actions (Edit, Publish/Unpublish, Delete with confirm). Sortable columns. |
| FR-29 | **Add/Edit Product Form** | Fields: Title (required, auto-generates slug), Price (USD, required), Category (dropdown: tees/hoodies/longsleeve/hats), Description (textarea), Tags (comma-separated), Themes (multi-select: nj-flavor, satirical, retro, band-merch, best-sellers), Sizes (multi-select: S–3XL, OS), Colors (multi-select from palette), Images (upload multiple + reorder via drag, first is primary), Toggles: Published, Best Seller, Featured, Made to Order. |
| FR-30 | **Instant Publish** | Saving a product with Published=true makes it live on storefront within 10 seconds. No rebuild. |
| FR-31 | **Auto-Generated Placeholder** | Product with no uploaded image gets a procedurally generated on-brand SVG placeholder so it never renders broken. |
| FR-32 | **Order Management** | Table: order number, date, customer email, items summary, total, status selector (pending → paid → shipped → delivered → cancelled). |
| FR-33 | **CSV Export** | "Export All Orders" button downloads CSV with one row per order. |
| FR-34 | **Image Upload** | Drag-and-drop or click to upload. Multiple files. Auto-resize to max 2000px. Stored in Supabase Storage bucket. |
| FR-35 | **Analytics (Basic)** | Bar chart of orders over last 30 days. Top 5 products table. Revenue summary. |

---

## 6. Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-1 | Performance | < 2s initial load; < 1s subsequent navigations; Lighthouse 90+ |
| NFR-2 | Responsiveness | Mobile-first (360px+); 4-col grid desktop; 2-col mobile |
| NFR-3 | Availability | 99.9% uptime; auto-scaling host |
| NFR-4 | Security | RLS on all tables; Stripe webhooks signature-verified; no secrets in client |
| NFR-5 | Accessibility | WCAG 2.1 AA; keyboard navigation; alt text; ARIA labels |
| NFR-6 | SEO | Slugged URLs; JSON-LD; sitemap.xml; Open Graph images |
| NFR-7 | Cost | Near-$0 at MVP traffic (free tiers); scales with usage |
| NFR-8 | Browser Support | Chrome, Safari, Firefox, Edge (last 2 versions) |

---

## 7. User Stories

**As Faith (Owner):**
- I can add a new shirt with title, price, description, images, sizes, colors, and themes, and publish it so it's live immediately.
- I can unpublish, edit, or delete any shirt, and mark shirts as "best seller" or "featured".
- I can see all orders, update their status, and export them to CSV.
- I can upload multiple images and reorder them by dragging.

**As a Shopper:**
- I can browse the catalog, filter by category and theme, search by keyword, and sort by new/popular/price.
- I can open a product, choose size and color, add to cart, and check out.
- I can view a quick preview of a product without leaving the catalog page.
- My cart survives a page refresh.
- I can check out as a guest without creating an account.

---

## 8. Open Questions

| Question | Status | Resolution |
|----------|--------|------------|
| Printful vs Printify for POD? | OPEN | Evaluate Printful (more products) vs Printify (better margins). Decision needed before Phase 3. |
| Sales tax handling? | DEFERRED | Stripe Tax integration recommended for post-MVP. |
| Custom domain? | PENDING | madcaptees.com or similar. Requires DNS setup. |
| Email provider? | RECOMMENDED | Resend (simple, good deliverability) or SendGrid. |
