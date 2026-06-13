# Madcap Tees — System Architecture

**Version:** 1.0 | **Date:** June 9, 2026

---

## 1. System Overview

```
Shopper ───────▶ Vercel (Next.js App) ◀────── GitHub (CI/CD push)
                   │
    ┌──────────────┼──────────────┐
    │              │              │
    ▼              ▼              ▼
Supabase      Stripe        Cloud Run (optional)
- Postgres    - Checkout    - POD webhook worker
- Auth        - Webhooks    - Heavy async jobs
- Storage     - Customer    
- Edge Funcs  - portal      
```

---

## 2. Component Details

### 2.1 Vercel (Frontend Hosting)
- **Next.js 15** with App Router
- Server Components for catalog/product pages (fast initial load)
- Client Components for cart, filters, admin forms (interactivity)
- Server Actions for admin writes (no separate API routes)
- Edge caching for public pages
- Image optimization via Next.js Image

### 2.2 Supabase (Backend)
- **PostgreSQL:** Primary database with Row Level Security
- **Auth:** Email + OAuth (Google), JWT sessions, admin role claims
- **Storage:** `product-images` bucket, public read, admin write
- **Edge Functions:** Optional — Stripe webhook forwarding, email triggers
- **Realtime:** Optional — live order updates in admin

### 2.3 Stripe (Payments)
- **Checkout Session:** Server-side creation from cart
- **Webhook:** `checkout.session.completed` → order creation
- **Customer Portal:** Subscription management (future)
- **Tax:** Stripe Tax for automatic sales tax (recommended post-MVP)

### 2.4 Google Cloud Run (Worker)
- Containerized Node.js worker for POD order forwarding
- Triggered by Supabase `orders` table insert (webhook or database trigger)
- Calls Printful/Printify API to create fulfillment order
- Receives callback webhooks for status updates (shipped/delivered)

---

## 3. Data Flow Diagrams

### 3.1 Shopper Browsing (Read)
```
Shopper → Vercel Edge Cache (public pages)
   ↓
Next.js Server Component → Supabase Client (anon key)
   ↓
Postgres RLS: SELECT published = true only
   ↓
Response: products + images + variants (filtered by RLS)
```

### 3.2 Admin Add Product (Write)
```
Faith → /admin/products/new → Supabase Auth check
   ↓
Server Action (service_role key) → INSERT products
   ↓
Upload images → Supabase Storage (product-images bucket)
   ↓
INSERT product_images, product_variants
   ↓
Revalidate storefront cache → Product live instantly
```

### 3.3 Checkout Flow
```
Shopper → Cart → "Checkout" button
   ↓
Server Action: Create Stripe Checkout Session (line items + shipping)
   ↓
Redirect to Stripe hosted checkout
   ↓
Payment success → Stripe webhook → /api/stripe/webhook
   ↓
Verify signature → INSERT order (paid) → Clear cart
   ↓
(Async) Send to Cloud Run → Printful order creation
   ↓
Confirmation page + email receipt
```

---

## 4. Caching Strategy

| Layer | TTL | Invalidation |
|-------|-----|--------------|
| Vercel Edge Cache (public pages) | 60s | On product publish/unpublish |
| Next.js ISR (product pages) | 300s | On-demand via revalidateTag |
| Browser Cache (images) | 1 year | Versioned URLs from Supabase |
| Supabase Query Cache | 30s | Realtime updates for admin |

---

## 5. Scalability Considerations

- **Vercel:** Auto-scales serverless functions. No config needed.
- **Supabase:** Free tier handles 500MB DB, 2GB bandwidth. Upgrade to Pro at ~$25/mo for 8GB DB.
- **Stripe:** No scaling concern — hosted checkout.
- **Cloud Run:** Scales to zero (no cost when idle). Billed per request.
- **Image Delivery:** Supabase Storage CDN handles image delivery. Next.js Image optimizes at build time.

---

## 6. Disaster Recovery

- **Database:** Supabase provides daily backups (Pro tier). Export schema + data weekly via `pg_dump`.
- **Code:** GitHub is source of truth. Vercel deploys from main branch. Rollback = revert commit.
- **Images:** Supabase Storage replicated. Keep local backups of original artwork.
- **Orders:** Stripe retains payment records. Database backups ensure order history recovery.
