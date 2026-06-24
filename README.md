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

### Current (MVP)
| Layer | Technology |
|-------|------------|
| **Frontend** | React 19 + TypeScript + Vite 7 (SPA) |
| **Styling** | Tailwind CSS 3.4 |
| **UI Components** | shadcn/ui + Radix |
| **State Management** | React Hooks (useState, useCallback, useContext) |
| **Icons** | Lucide React |
| **Fonts** | Google Fonts (Anton, Space Mono, DM Sans) |
| **Cart** | localStorage + useCart hook |
| **Routing** | Manual useState (upgrading to React Router v7 Phase 2) |

### Production Stack
| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend hosting, CDN, auto-deploy from git |
| **Supabase** | PostgreSQL database, Auth, Storage buckets |
| **Cloudflare** | Domain DNS, DDoS protection, caching |
| **Stripe** | Payment processing (Phase 2) |
| **Resend** | Transactional email (Phase 2) |
| **Printful/Printify** | Print-on-demand fulfillment (Phase 2) |

---

## Status: MVP Ready ✅

**What works now:**
- ✅ Storefront (hero, collections, shop, product pages)
- ✅ Admin CRUD (add/edit/delete products)
- ✅ Cart with free shipping threshold
- ✅ Demo checkout (orders stored in Supabase)
- ✅ Responsive design (mobile-first)
- ✅ Seeded products (8 original Madcap designs)

**Phase 2 (soon):**
- 🚧 Real Stripe payments
- 🚧 Customer accounts + order history
- 🚧 Email confirmations (Resend)
- 🚧 React Router for real URLs
- 🚧 Print-on-demand integration

---

## Documentation Suite

All documentation lives in `/docs/`:

| Document | Purpose |
|----------|---------|
| `SETUP.md` | **START HERE** — Local dev setup in 5 minutes |
| `DEPLOYMENT.md` | Production deployment: Supabase → Vercel → Cloudflare |
| `PRD.md` | Full product requirements, functional specs, acceptance criteria |
| `ARCHITECTURE.md` | System architecture, data flows, caching strategy |
| `API_SPEC.md` | Data models, TypeScript interfaces, API endpoints, RLS policies |
| `DESIGN_SYSTEM.md` | Color palette, typography, component specs, animations |
| `SECURITY.md` | Authentication, RLS policies, Stripe security, incident response |

### Database & Infrastructure
- **Database Schema**: `/supabase/migrations/001_initial_schema.sql`
- **Vercel Config**: `/vercel.json`
- **Environment Template**: `/.env.example`

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
# 1. Clone repo
git clone https://github.com/redinc23/madcaptees.git
cd madcaptees

# 2. Install dependencies
npm install

# 3. Set up environment (optional - app works without it)
cp .env.example .env.local
# Edit .env.local with your Supabase credentials (or leave blank for seeded data)

# 4. Run dev server
npm run dev
# Opens http://localhost:3000

# 5. Admin dashboard
# Visit http://localhost:3000/admin-dashboard
# Add products, test cart & checkout
```

**Full setup guide**: See [`docs/SETUP.md`](docs/SETUP.md)

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

Copy `.env.example` to `.env.local` and fill in your values:

```bash
# Supabase (required for production data persistence)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Site URL (for OG images, canonical links)
VITE_SITE_URL=https://madcaptees.com

# Stripe (Phase 2)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Rule**: Environment variables starting with `VITE_` are exposed to the browser (public). All others are kept secret on the server.

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for full details on getting credentials.

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
