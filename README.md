# Madcap Tees — E-Commerce Platform

> **Mad as hell and twice as funny.** A full-stack e-commerce storefront + admin dashboard for original satirical graphic apparel. Built for Faith (@madcaptees).

---

## What Is This?

Madcap Tees is a production-ready e-commerce website that replaces manual Instagram DM sales with a self-hosted store. The killer feature: **add a shirt in the admin in under 2 minutes, and it appears on the storefront instantly** — no developer needed.

### Live Demo
**[View the deployed site](https://madcap-tees-demo.vercel.app)** *(deploy link will be provided after deployment)*

---

## Features

### Storefront (Customer-Facing)
- **Homepage** with hero carousel, collection promo cards, best sellers carousel, new arrivals grid
- **Shop/Catalog** with category filters, theme filters, price range, search, and sort
- **Product Detail** pages with size/color selectors, image gallery, related products
- **Quick View** modal for rapid browsing without page navigation
- **Cart Drawer** with free shipping progress bar, persistent across sessions
- **Checkout Flow** with shipping info, demo payment, and order confirmation
- **Responsive Design** — mobile-first, works from 360px to widescreen

### Admin Dashboard
- **Dashboard** with stats cards (total designs, live designs, orders, revenue)
- **Product CRUD** — add, edit, delete, publish/unpublish products
- **Product Form** with title, price, sale price, category, description, tags, themes, toggles
- **Orders Management** with status updates and CSV export
- **Instant Publish** — products go live on the storefront immediately

### Design System
- **Vintage screen-print newsprint aesthetic** — halftone dots, ink-black rules, Mad-red accent
- **Typography**: Anton (display), Space Mono (labels/UI), DM Sans (body)
- **Color Palette**: Paper cream, ink black, Mad-red, gold, teal
- **Hard offset shadows** — no soft shadows, everything is crisp and print-like

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS 3.4 |
| UI Components | shadcn/ui |
| State | React Hooks (useState, useCallback, useMemo) |
| Icons | Lucide React |
| Fonts | Google Fonts (Anton, Space Mono, DM Sans) |

### Production Stack (specified in docs)
- **Frontend**: Next.js 15 (App Router) on Vercel
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Payments**: Stripe Checkout + Webhooks
- **Fulfillment**: Printful/Printify (POD)
- **Email**: Resend
- **Hosting**: Vercel + Google Cloud Run

---

## Documentation Suite

All documentation lives in `/docs/`:

| Document | Purpose |
|----------|---------|
| `PRD.md` | Full product requirements, functional specs, acceptance criteria |
| `ARCHITECTURE.md` | System architecture, data flows, caching strategy |
| `API_SPEC.md` | Data models, TypeScript interfaces, API endpoints, RLS policies |
| `DEPLOYMENT.md` | Step-by-step deployment runbook for Vercel + Supabase + Stripe |
| `DESIGN_SYSTEM.md` | Color palette, typography, component specs, animations |
| `SECURITY.md` | Authentication, RLS policies, Stripe security, incident response |
| `SEO_ACCESSIBILITY.md` | SEO strategy, WCAG 2.1 AA compliance, performance targets |

### Database Schema
Full Supabase migration SQL is in `/supabase/migrations/001_initial_schema.sql`.

---

## Project Structure

```
├── src/
│   ├── sections/           # Page sections (Navbar, Hero, ShopPage, AdminDashboard, etc.)
│   ├── hooks/              # Custom React hooks (useCart)
│   ├── lib/                # Data layer, utilities
│   ├── types/              # TypeScript type definitions
│   ├── assets/             # Generated images (logo, hero, products, collections)
│   ├── App.tsx             # Main app with routing
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles, design tokens, fonts
├── docs/                   # Full documentation suite (7 files)
├── supabase/
│   └── migrations/         # SQL schema migrations
├── dist/                   # Production build output
└── package.json
```

---

## Quick Start

```bash
# Install dependencies
cd app && npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

---

## Seeded Products

The store comes pre-loaded with 8 original Madcap-style designs:

| Product | Category | Theme | Price |
|---------|----------|-------|-------|
| Mad As Hell Tee | Tees | Satirical, Best Sellers | $25.00 |
| Bennies Go Home Tee | Tees | NJ Flavor, Best Sellers | $22.00 (sale) |
| Doom Scroll Champion Hoodie | Hoodies | Retro, Satirical | $42.00 (sale) |
| Exit 82 No Regrets Tee | Tees | NJ Flavor | $25.00 |
| Pork Roll Supremacy Tee | Tees | NJ Flavor, Best Sellers | $20.00 (sale) |
| Conspiracy Theories & Chill Tee | Tees | Satirical | $25.00 |
| Radical Retro Tee | Tees | Retro | $24.00 (sale) |
| I Woke Up Like This Tee | Tees | Satirical | $25.00 |

---

## Deploying to Production

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for the complete step-by-step runbook.

Quick summary:
1. Create GitHub repo and push code
2. Create Supabase project, run the schema migration
3. Create Stripe account, get API keys
4. Connect Vercel to GitHub repo
5. Add all environment variables
6. Deploy!

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
PRINTFUL_API_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=
```

---

## Roadmap

| Phase | Timeline | Features |
|-------|----------|----------|
| **MVP** | Week 1-2 | Storefront, admin CRUD, cart, demo checkout |
| **Phase 2** | Week 3-4 | Real Stripe payments, customer accounts, email receipts |
| **Phase 3** | Month 2 | POD integration, analytics dashboard, discount codes |
| **Phase 4** | Month 3+ | Reviews, AI mockups, multi-currency, subscriptions |

---

## Credits

- **Owner**: Faith (@madcaptees on Instagram)
- **Design Inspiration**: Threadless (discovery), Busted Tees (humor/best-sellers)
- **Brand Aesthetic**: Mad Magazine × punk zine × modern DTC

---

Built with precision. Every atom accounted for.
