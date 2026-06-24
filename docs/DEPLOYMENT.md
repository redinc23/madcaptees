# Madcap Tees — Deployment Runbook

**Version:** 2.0 | **Date:** June 24, 2026 | **Stack:** Vite + React SPA | **Prerequisites:** GitHub, Supabase, Vercel, Cloudflare accounts

---

## 1. Architecture Overview

- **Frontend:** Vite 7 + React (SPA) → deployed to Vercel
- **Database:** Supabase PostgreSQL + RLS policies
- **Storage:** Supabase Storage (product images)
- **Auth:** Supabase Auth (Phase 2)
- **Domain:** Cloudflare DNS routing to Vercel
- **Payments:** Stripe (Phase 2)
- **Email:** Resend (Phase 2)

---

## 2. Pre-Deployment Checklist

- [ ] GitHub repo: `github.com/redinc23/madcaptees`
- [ ] Supabase account (free tier works for MVP)
- [ ] Vercel account (connected to GitHub)
- [ ] Cloudflare account (for domain + DNS)
- [ ] Domain registered (Namecheap, GoDaddy, etc.)
- [ ] Stripe account (test mode for Phase 2)

---

## 3. Step-by-Step Setup

### Step 1: Supabase Project Creation

1. Go to [supabase.com](https://supabase.com) → Create Project
2. **Project Name:** `madcap-tees`
3. **Region:** us-east-1 (or closest to your audience)
4. **Password:** Generate strong password, save to password manager
5. Wait for initialization (~2 min)

**Database Schema:**
```bash
# In Supabase Dashboard → SQL Editor → New Query
# Paste the complete schema from /supabase/migrations/001_initial_schema.sql
# Click Run
```

**Storage Bucket for Product Images:**
1. Supabase Dashboard → Storage → New Bucket
2. **Name:** `product-images`
3. **Public:** Enable (allow public read)
4. **Allowed MIME types:** `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`
5. **File size limit:** 5MB
6. **RLS Policy:** Allow public select

**Get API Keys:**
```
Dashboard → Project Settings → API → Reveal
Copy:
  • Project URL → VITE_SUPABASE_URL
  • Anon Public Key → VITE_SUPABASE_ANON_KEY
  • Service Role Key → Save securely (never expose)
```

### Step 2: Local Environment Setup

```bash
# 1. Copy .env.example to .env.local
cp .env.example .env.local

# 2. Fill in Supabase values
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# 3. Test locally
npm run dev
# Visit http://localhost:3000
# Try adding a product in admin, refresh → should persist to Supabase
```

**Never commit `.env.local` — add to `.gitignore`:**
```bash
echo ".env.local" >> .gitignore
echo ".env.*.local" >> .gitignore
```

### Step 3: Vercel Deployment

1. Go to [vercel.com](https://vercel.com) → Add New Project
2. Import `madcaptees` from GitHub
3. **Framework:** Select "Vite" (or leave blank for auto-detect)
4. **Root Directory:** `./` (default)
5. **Build Command:** `npm run build` (auto-detected)
6. **Output Directory:** `dist` (auto-detected)

**Add Environment Variables:**
```
VITE_SUPABASE_URL        = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY   = eyJ... (from Supabase)
VITE_SITE_URL            = https://madcaptees.vercel.app (or your domain)
```

7. Click **Deploy**
8. Wait for build to complete (~2 min)
9. Test: Visit `https://your-project.vercel.app`

### Step 4: Cloudflare Domain Setup (Custom Domain)

**Only needed if you have a custom domain. Skip for MVP with Vercel subdomain.**

1. Register domain (Namecheap, GoDaddy, etc.)
2. Go to [cloudflare.com](https://cloudflare.com) → Add Site
3. Enter domain: `madcaptees.com`
4. **Name servers:** Copy Cloudflare's nameservers
5. Go to domain registrar, update nameservers to Cloudflare's
6. Wait 24-48 hours for propagation
7. Cloudflare Dashboard → DNS → Add CNAME record:
   ```
   Name:  @
   Type:  CNAME
   Content: your-project.vercel.app
   Proxy: Orange cloud (Cloudflare proxied)
   ```
8. Add another CNAME for www:
   ```
   Name: www
   Type: CNAME
   Content: your-project.vercel.app
   Proxy: Proxied
   ```
9. Vercel Dashboard → Project Settings → Domains → Add `madcaptees.com`
10. Update `.env`:
    ```
    VITE_SITE_URL=https://madcaptees.com
    ```
11. Redeploy to Vercel

**SSL/TLS:**
- Cloudflare: Dashboard → SSL/TLS → Full Strict
- Vercel: Automatic with Let's Encrypt

**Cloudflare Security Settings (recommended):**
- SSL/TLS: Full Strict
- Caching: Browser Cache TTL = 30 days
- Minification: Enable JS, CSS, HTML
- Speed: Enable Rocket Loader

### Step 5: Create Admin User (Phase 2)

When Supabase Auth is wired:
```sql
-- Supabase Dashboard → SQL Editor
INSERT INTO profiles (id, email, is_admin)
VALUES ('user-id', 'you@example.com', true);
```

---

## 4. Verification Checklist

### Test the Deployment
```bash
# 1. Homepage loads
curl https://madcaptees.vercel.app/

# 2. Admin dashboard accessible (no auth yet, so public)
# Visit: https://madcaptees.vercel.app/admin-dashboard

# 3. Add a product via admin
# Refresh page → product persists (verify in Supabase)

# 4. Add to cart → checkout flow works
```

### Supabase Health Check
1. Supabase Dashboard → Logs → look for any errors
2. Supabase Dashboard → Database → Check products table has rows
3. Test a real query in SQL Editor:
   ```sql
   SELECT COUNT(*) as product_count FROM products WHERE published = true;
   ```

---

## 5. Environment Variables Reference

| Variable | Example | Where to get | Public? |
|----------|---------|-------------|---------|
| `VITE_SUPABASE_URL` | `https://abc.supabase.co` | Supabase → Settings → API | ✅ Yes |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...` | Supabase → Settings → API | ✅ Yes |
| `VITE_SITE_URL` | `https://madcaptees.com` | Your domain | ✅ Yes |
| `STRIPE_SECRET_KEY` | `sk_test_...` | Stripe → Developers → Keys | 🔒 Secret |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | Stripe → Developers → Keys | ✅ Yes |

**Rule:** Prefix `VITE_` = exposed to frontend (public only). Everything else = backend secret.

---

## 6. Stripe Setup (Phase 2)

1. Go to [stripe.com](https://stripe.com) → Sign up
2. Stripe Dashboard → Developers → API Keys
3. Copy **Publishable** and **Secret** keys (test mode)
4. Add to Vercel environment:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY = pk_test_...
   STRIPE_SECRET_KEY = sk_test_... (secret, not exposed to frontend)
   ```
5. Set up webhook (after server routes are ready):
   ```
   Stripe Dashboard → Developers → Webhooks → Add endpoint
   URL: https://madcaptees.com/api/webhooks/stripe
   Events: checkout.session.completed, charge.dispute.created
   Copy signing secret → STRIPE_WEBHOOK_SECRET in Vercel
   ```

---

## 7. Troubleshooting

### "Supabase connection fails"
- Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel
- Supabase Dashboard → Project Settings → API → Copy again
- Redeploy: `git commit --allow-empty -m "Redeploy" && git push`

### "Products don't persist"
- Check Supabase dashboard → Database → products table
- Check browser DevTools → Network → XHR requests to supabase
- Check Supabase → Logs for errors

### "Admin dashboard 404"
- Check that url navigation works (should show /admin-dashboard)
- If using React Router (Phase 2), ensure admin route is defined

### "Domain not pointing to site"
- Cloudflare DNS: check CNAME records are correct
- DNS propagation: use `nslookup madcaptees.com` to verify
- Cloudflare → DNS → Verify orange cloud = proxied
- Wait 24-48 hours for global propagation

---

## 8. Post-Launch Monitoring

### Analytics
- Vercel Dashboard → Analytics → Enable
- Cloudflare Dashboard → Analytics → Web traffic

### Uptime Monitoring (free)
- [UptimeRobot](https://uptimerobot.com) — ping homepage every 5 min
- Alerts if site goes down

### Error Monitoring
- Supabase Dashboard → Logs (real-time database errors)
- Vercel Dashboard → Functions (edge function logs)

### Database Backups
```bash
# Weekly dump of Supabase database
supabase db dump --project-ref your-ref > backup-$(date +%Y%m%d).sql
```

---

## 9. Rollback (if deploy breaks)

```bash
# Option 1: Vercel rollback
# Vercel Dashboard → Deployments → Find last good deploy → Promote to Production

# Option 2: Git rollback
git revert HEAD
git push
# Vercel auto-redeploys on push

# Option 3: Emergency
# Vercel Dashboard → Project Settings → Domains → point to backup domain
```

---

## 10. Transition to Production Stripe

When ready to go live:
1. Stripe Dashboard → Activate account (complete onboarding)
2. Stripe Dashboard → Developers → API Keys → Switch from test to live
3. Copy live keys: `sk_live_...` and `pk_live_...`
4. **WARNING:** Do NOT copy `sk_live_` to git. Use Vercel env only.
5. Update Vercel environment:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY = pk_live_...
   STRIPE_SECRET_KEY = sk_live_... (NEVER in git)
   STRIPE_WEBHOOK_SECRET = whsec_live_...
   ```
6. Redeploy

---

## Cost Estimate (Monthly)

| Service | Free Tier | Cost for MVP |
|---------|-----------|-------------|
| Supabase | 500MB DB, 1GB storage | Free (well under) |
| Vercel | 100GB bandwidth, 1000 function invocations | Free (well under) |
| Cloudflare | Unlimited requests, basic DDoS | Free ($20/mo if Pro) |
| Domain | N/A | $10-15/year |
| Stripe | 2.9% + $0.30 per transaction | Pay as you go |
| **Total** | | **~$1-2/month** (MVP) |

---

**Last updated:** June 24, 2026
