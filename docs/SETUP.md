# Madcap Tees — Local Development Setup

Quick start for developers wanting to run the project locally.

## Prerequisites

- Node.js 20+ (`node --version`)
- npm 10+ (`npm --version`)
- Git
- Text editor (VS Code recommended)

## 1. Clone & Install

```bash
git clone https://github.com/redinc23/madcaptees.git
cd madcaptees
npm install
```

## 2. Environment Setup

### Option A: With Supabase (Recommended)

1. Create free Supabase project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Fill in your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_SITE_URL=http://localhost:3000
   ```
4. Run schema migration:
   - Go to Supabase Dashboard → SQL Editor → New Query
   - Paste contents of `/supabase/migrations/001_initial_schema.sql`
   - Click "Run"

### Option B: Without Supabase (Fallback - In-Memory)

Skip `.env.local` entirely. App works with seeded data but changes don't persist across refreshes.

## 3. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

## 4. Development Commands

```bash
# Start dev server (hot reload)
npm run dev

# Type check (TypeScript)
npm run build

# Lint code
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## 5. Common Tasks

### Add a Product in Admin

1. Visit http://localhost:3000/admin-dashboard
2. Click "Add New Shirt"
3. Fill form, click "Publish Product"
4. If Supabase connected: product persists in database
5. If fallback mode: product disappears on refresh

### Test Cart & Checkout

1. Shop page, add items to cart
2. Open cart drawer (top right)
3. Proceed to checkout
4. Fill shipping info
5. Payment page: use test card `4242 4242 4242 4242`
6. Complete order → order appears in admin

### Debug Supabase Connection

```javascript
// In browser console (DevTools F12):
fetch('https://your-project.supabase.co/rest/v1/products', {
  headers: {
    apikey: 'your-anon-key',
    Authorization: `Bearer your-anon-key`,
  },
}).then(r => r.json()).then(console.log)
```

If this works, Supabase is connected. If you get 401/403, check credentials.

## 6. File Structure

```
madcaptees/
├── src/
│   ├── pages/          # Legacy (Home.tsx deleted)
│   ├── sections/       # React components (Navbar, Shop, Checkout, etc.)
│   ├── components/ui/  # Radix + shadcn components
│   ├── hooks/          # useCart, useToast
│   ├── lib/
│   │   ├── data.ts     # Seeded data + local store
│   │   ├── api.ts      # Supabase layer (fallback to local)
│   │   └── supabase.ts # Supabase client config
│   ├── types/          # TypeScript definitions
│   ├── App.tsx         # Main router logic
│   └── main.tsx
├── supabase/
│   └── migrations/     # SQL schema files
├── docs/
│   ├── DEPLOYMENT.md   # Production deployment guide
│   ├── SETUP.md        # This file
│   ├── ARCHITECTURE.md # Tech decisions
│   └── SUPABASE_SCHEMA.sql
├── .env.example        # Template for env vars
├── vercel.json         # Vercel deployment config
├── vite.config.ts      # Build config
└── package.json
```

## 7. Code Walkthrough

### How Data Flows

1. **API Layer** (`src/lib/api.ts`):
   - Checks if Supabase is configured
   - If yes: queries Supabase
   - If no: falls back to seeded local data (`src/lib/data.ts`)
   - All views use `api.ts` functions, never `data.ts` directly

2. **State Management**:
   - Cart: `useCart()` hook (persists to localStorage)
   - UI: `currentView` in App.tsx (useState, not URL-based yet)
   - Products: fetched fresh on admin load

3. **Admin Operations**:
   - Create: `createProduct()` → inserts to Supabase or local store
   - Update: `updateProduct()` → updates row
   - Delete: `deleteProduct()` → soft or hard delete
   - All operations reload data after success

### Important Types

```typescript
// Product shape
interface Product {
  id: string;
  title: string;
  slug: string;
  base_price: number;
  sale_price: number | null;
  product_images: ProductImage[];
  product_variants: ProductVariant[];
  // ...
}

// Cart item
interface CartItem {
  product_variant_id: string;
  title: string;
  size: string;
  color: string;
  unit_price: number;
  quantity: number;
  // ...
}
```

## 8. Common Issues

### "Admin add product doesn't work"
- If Supabase connected: check Supabase Dashboard → Logs
- If fallback mode: products don't persist on refresh (expected)
- Check browser console for JavaScript errors

### "Can't fetch products"
- Supabase Dashboard → Authentication → check if RLS policies allow anon select
- Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Supabase Dashboard → SQL Editor → test query:
  ```sql
  SELECT * FROM products LIMIT 5;
  ```

### "Port 3000 already in use"
```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use different port
npm run dev -- --port 3001
```

### "TypeScript errors on build"
```bash
# Clear cache and rebuild
rm -rf node_modules/.vite
npm run build
```

## 9. Next Steps

1. **Get Supabase working locally** → run through Option A above
2. **Test admin CRUD** → add/edit/delete a product
3. **Verify cart → checkout** → place test order
4. **Deploy to Vercel** → see `/docs/DEPLOYMENT.md`
5. **Set up domain** → Cloudflare + custom domain routing

## 10. Getting Help

- **TypeScript errors?** Check `/src/types/index.ts` for type definitions
- **Supabase connection?** See troubleshooting in `/docs/DEPLOYMENT.md`
- **Component not rendering?** Check console for React errors in DevTools
- **Database schema?** See `/supabase/migrations/001_initial_schema.sql`

---

**Happy hacking! 🚀**
