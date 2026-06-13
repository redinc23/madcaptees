# Madcap Tees — Deployment Runbook

**Version:** 1.0 | **Date:** June 9, 2026 | **Prerequisites:** GitHub account, Supabase account, Stripe account, Vercel account

---

## 1. Pre-Deployment Checklist

- [ ] GitHub repo created (private): `github.com/redinc23/madcaptees`
- [ ] Supabase project created
- [ ] Stripe account created (test mode)
- [ ] Vercel account connected to GitHub
- [ ] Domain purchased (optional — Vercel subdomain works for MVP)
- [ ] Printful or Printify account created (for POD)

---

## 2. Step-by-Step Deployment

### Step 1: GitHub Repository

```bash
# Create new private repo on GitHub: github.com/redinc23/madcaptees
# Then locally:
git init
git add .
git commit -m "Initial commit: Madcap Tees MVP"
git branch -M main
git remote add origin https://github.com/redinc23/madcaptees.git
git push -u origin main
```

### Step 2: Supabase Setup

1. Go to [supabase.com](https://supabase.com) → New Project
2. Name: `madcap-tees`
3. Region: Choose closest to your audience (e.g., `us-east-1`)
4. Password: Generate strong password, save in 1Password
5. Wait for project to initialize (~2 minutes)

**Run Schema Migration:**
```bash
# In Supabase Dashboard → SQL Editor → New Query
# Paste the complete schema from /docs/SUPABASE_SCHEMA.sql
# Click Run
```

**Create Storage Bucket:**
```bash
# In Supabase Dashboard → Storage → New Bucket
# Name: product-images
# Public bucket: CHECKED (public read)
# Allowed MIME types: image/jpeg, image/png, image/webp
# File size limit: 5MB
```

**Get API Keys:**
```bash
# Dashboard → Project Settings → API
# Copy:
# - Project URL (NEXT_PUBLIC_SUPABASE_URL)
# - anon public key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
# - service_role secret key (SUPABASE_SERVICE_ROLE_KEY) — NEVER expose this
```

### Step 3: Create Admin User

```bash
# In Supabase Dashboard → Authentication → Users → Invite User
# Enter your email
# After signing up, run this SQL to make yourself admin:

UPDATE profiles
SET is_admin = true
WHERE email = 'your-email@example.com';
```

### Step 4: Stripe Setup

1. Go to [stripe.com](https://stripe.com) → Sign up
2. Dashboard → Developers → API Keys
3. Copy:
   - Publishable key (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
   - Secret key (STRIPE_SECRET_KEY)
4. Dashboard → Developers → Webhooks → Add endpoint
   - Endpoint URL: `https://your-domain.vercel.app/api/stripe/webhook`
   - Events: `checkout.session.completed`
   - Copy signing secret (STRIPE_WEBHOOK_SECRET)

### Step 5: Vercel Deployment

1. Go to [vercel.com](https://vercel.com) → Add New Project
2. Import `madcaptees` from GitHub
3. Framework Preset: Next.js
4. Add Environment Variables:

| Key | Value | From Step |
|-----|-------|-----------|
| NEXT_PUBLIC_SUPABASE_URL | `https://xxx.supabase.co` | Step 2 |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | `eyJ...` (public) | Step 2 |
| SUPABASE_SERVICE_ROLE_KEY | `eyJ...` (secret) | Step 2 |
| STRIPE_SECRET_KEY | `sk_test_...` | Step 4 |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | `pk_test_...` | Step 4 |
| STRIPE_WEBHOOK_SECRET | `whsec_...` | Step 4 |
| NEXT_PUBLIC_SITE_URL | `https://madcaptees.vercel.app` | — |
| PRINTFUL_API_KEY | (later) | Step 6 |
| RESEND_API_KEY | (later) | Step 7 |

5. Click Deploy

### Step 6: Print-on-Demand (Optional for MVP)

1. Sign up at [printful.com](https://printful.com) or [printify.com](https://printify.com)
2. Generate API key
3. Add to Vercel env: `PRINTFUL_API_KEY`
4. Map product variants to POD variant IDs in admin

### Step 7: Email Setup (Optional for MVP)

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain
3. Copy API key to Vercel env: `RESEND_API_KEY`

---

## 3. Post-Deployment Verification

### 3.1 Health Checks
```bash
# 1. Homepage loads
curl https://your-domain.vercel.app/

# 2. Products API responds
curl https://your-domain.vercel.app/api/products

# 3. Admin login works
# Visit /admin, sign in with admin email

# 4. Add a test product in admin
# Verify it appears on homepage within 10 seconds

# 5. Add to cart, proceed to checkout
# Complete Stripe test payment (use card 4242 4242 4242 4242)
# Verify order appears in admin
```

### 3.2 Stripe Test Mode
```
Test card: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

### 3.3 Switch to Live Mode
1. Stripe Dashboard → Activate account
2. Replace test keys with live keys in Vercel env
3. Redeploy: `git commit --allow-empty -m "Trigger deploy: live Stripe" && git push`

---

## 4. Domain Configuration

### Custom Domain (optional)
1. Vercel Dashboard → Project → Settings → Domains
2. Add domain: `madcaptees.com`
3. Follow DNS instructions (CNAME or A record)
4. Update `NEXT_PUBLIC_SITE_URL` env var
5. Re-deploy

### SSL
- Automatically handled by Vercel (Let's Encrypt)
- Force HTTPS: Vercel Dashboard → Security → Force HTTPS

---

## 5. Monitoring & Maintenance

### Vercel Analytics
- Dashboard → Analytics → Enable
- Tracks: page views, Core Web Vitals, visitor count

### Uptime Monitoring (recommended)
- [UptimeRobot](https://uptimerobot.com) — free tier, 5-minute checks
- Monitor: homepage, checkout, admin login

### Regular Backups
```bash
# Weekly database backup
supabase db dump --project-ref your-ref > backup-$(date +%Y%m%d).sql

# Image backups
# Download product-images bucket periodically
```

---

## 6. Rollback Procedure

```bash
# If a deploy breaks something:
# 1. Vercel Dashboard → Deployments → Find last good deploy
# 2. Click "Promote to Production"
# 3. Or revert via git:
git revert HEAD
git push
```

---

## 7. Environment Variables Summary

| Variable | Source | Sensitivity |
|----------|--------|-------------|
| NEXT_PUBLIC_SUPABASE_URL | Supabase Settings → API | Public |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase Settings → API | Public |
| SUPABASE_SERVICE_ROLE_KEY | Supabase Settings → API | **SECRET** |
| STRIPE_SECRET_KEY | Stripe Dashboard → API Keys | **SECRET** |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | Stripe Dashboard → API Keys | Public |
| STRIPE_WEBHOOK_SECRET | Stripe Dashboard → Webhooks | **SECRET** |
| PRINTFUL_API_KEY | Printful Dashboard | **SECRET** |
| RESEND_API_KEY | Resend Dashboard | **SECRET** |
| NEXT_PUBLIC_SITE_URL | Your domain | Public |

**CRITICAL:** Never commit `.env.local` or any file containing `SECRET` or `sk_live` keys to GitHub.
