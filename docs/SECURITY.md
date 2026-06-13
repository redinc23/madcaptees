# Madcap Tees — Security Policy

**Version:** 1.0 | **Date:** June 9, 2026 | **Classification:** Internal

---

## 1. Security Principles

1. **Never trust the client** — All writes validated server-side
2. **Least privilege** — RLS policies enforce minimal access
3. **Defense in depth** — Multiple layers of protection
4. **No secrets in client** — Service keys server-side only

---

## 2. Authentication & Authorization

### 2.1 Supabase Auth
- **Method:** Email/password + OAuth (Google)
- **Session:** JWT tokens, httpOnly cookies
- **Password policy:** Min 8 chars, 1 uppercase, 1 number
- **Rate limiting:** 5 failed login attempts → 15-minute lockout

### 2.2 Admin Role
- Stored in `profiles.is_admin` boolean
- Checked in: RLS policies, middleware route guards, UI conditional rendering
- **Three layers of protection:**
  1. **Middleware:** `/admin/*` routes redirect non-admin to homepage
  2. **RLS:** Database policies reject non-admin writes
  3. **UI:** Admin nav hidden for non-admin users (cosmetic only — not a security control)

### 2.3 Role Claim Pattern
```sql
-- Add is_admin to JWT via database trigger
CREATE OR REPLACE FUNCTION public.set_admin_claim()
RETURNS TRIGGER AS $$
BEGIN
  -- This runs on auth.users changes
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 3. Row Level Security (RLS)

### 3.1 Policy Summary

| Table | Public Read | Authenticated Read | Admin Write | Service Write |
|-------|-------------|-------------------|-------------|---------------|
| products | published=true only | published=true only | admin role | service_role |
| product_images | published product only | published product only | admin role | service_role |
| product_variants | published product only | published product only | admin role | service_role |
| collections | all | all | admin role | service_role |
| orders | none | own orders only | admin role | service_role |
| order_items | none | via orders join | admin role | service_role |
| profiles | minimal | own profile | admin role | service_role |

### 3.2 Enabling RLS
```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

---

## 4. Stripe Security

### 4.1 Webhook Verification
```typescript
// Every webhook endpoint MUST verify signature
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature')!;
  
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    // Process verified event
  } catch (err) {
    return new Response('Invalid signature', { status: 400 });
  }
}
```

### 4.2 PCI Compliance
- **Stripe Checkout** keeps you out of PCI scope — no card data touches your servers
- Never log or store card numbers, CVV, or magnetic stripe data
- Use Stripe Elements if building custom forms (not needed for Checkout)

---

## 5. API Security

### 5.1 CORS Policy
```typescript
// Only allow your domains
const allowedOrigins = [
  'https://madcaptees.com',
  'https://www.madcaptees.com',
  'https://madcaptees.vercel.app'
];
```

### 5.2 Rate Limiting
```typescript
// Vercel KV or Upstash for rate limiting
// Admin endpoints: 100 req/min per IP
// Public endpoints: 1000 req/min per IP
// Checkout creation: 10 req/min per IP
```

### 5.3 Input Validation
```typescript
// Zod schemas for all inputs
import { z } from 'zod';

const productSchema = z.object({
  title: z.string().min(1).max(200),
  price: z.number().positive().max(1000),
  description: z.string().max(5000).optional(),
  category: z.enum(['tees', 'hoodies', 'longsleeve', 'hats', 'stickers']),
});
```

---

## 6. File Upload Security

### 6.1 Image Validation
```typescript
// Server-side checks before Storage upload
- Max file size: 5MB
- Allowed types: image/jpeg, image/png, image/webp
- Image dimensions: max 4000x4000px
- Strip EXIF metadata (to remove GPS, camera info)
- Scan with ClamAV (if available)
```

### 6.2 Storage Bucket Policy
```sql
-- product-images bucket
-- Public read (products are for sale)
-- Admin-only write
CREATE POLICY "admin_upload_images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.jwt() ->> 'role' = 'admin'
);
```

---

## 7. Dependency Security

### 7.1 Regular Audits
```bash
# Weekly
npm audit

# Fix automatically
npm audit fix

# Or override specific packages
npm audit fix --force  # CAREFUL: may break things
```

### 7.2 Dependency Pinning
```json
// package.json — use exact versions for critical packages
"stripe": "15.0.0",
"@supabase/supabase-js": "2.43.0"
```

---

## 8. Incident Response

| Severity | Definition | Response Time | Action |
|----------|-----------|---------------|--------|
| Critical | Data breach, payment fraud, admin compromised | 1 hour | Disable auth, rotate all keys, notify Stripe |
| High | RLS bypass, unauthorized admin access | 4 hours | Patch vulnerability, audit logs, review access |
| Medium | Dependency vulnerability, rate limit bypass | 24 hours | Update package, implement fix |
| Low | Non-security bug, cosmetic issue | 7 days | Fix in next sprint |

### Security Contacts
- Primary: Faith (@madcaptees)
- Technical: GitHub Issues (private repo)
- Stripe: support@stripe.com (for payment issues)
- Supabase: support@supabase.com (for platform issues)

---

## 9. Security Checklist (Pre-Launch)

- [ ] All RLS policies enabled and tested
- [ ] Stripe webhooks signature-verified
- [ ] No SECRET keys in client-side code
- [ ] Admin route protected by middleware
- [ ] Input validation on all forms (Zod)
- [ ] Image upload size/type limits enforced
- [ ] CORS configured for production domain only
- [ ] HTTPS enforced (Vercel default)
- [ ] Security headers configured (HSTS, CSP)
- [ ] Dependency audit clean (`npm audit`)
- [ ] Test mode transactions verified end-to-end
- [ ] Rollback procedure tested
