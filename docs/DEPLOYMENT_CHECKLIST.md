# Deployment Checklist — Madcap Tees

Follow this checklist to deploy from local dev → Supabase → Vercel → Cloudflare.

**Estimated time:** 30-45 minutes (first time)

---

## Phase 1: Prepare (5 min)

- [ ] Have accounts ready: GitHub, Supabase, Vercel, Cloudflare (optional for MVP)
- [ ] Have domain registered (if using custom domain, optional for MVP)
- [ ] Clone repo and run `npm install` locally
- [ ] Run `npm run dev` and verify store works at http://localhost:3000

---

## Phase 2: Supabase Setup (10 min)

**Create Supabase Project:**
- [ ] Go to [supabase.com](https://supabase.com) → Create Project
- [ ] Name: `madcap-tees`
- [ ] Region: `us-east-1` (or closest to audience)
- [ ] Save password to password manager
- [ ] Wait for project to initialize (~2 min)

**Run Database Schema:**
- [ ] Supabase Dashboard → SQL Editor → New Query
- [ ] Copy all SQL from `/supabase/migrations/001_initial_schema.sql`
- [ ] Paste into SQL Editor and Run
- [ ] Verify tables created: products, product_images, product_variants, orders, order_items

**Create Storage Bucket:**
- [ ] Supabase Dashboard → Storage → New Bucket
- [ ] Name: `product-images`
- [ ] Public: ✅ Enabled
- [ ] Allowed MIME: `image/jpeg`, `image/png`, `image/webp`
- [ ] File size: 5MB

**Get API Credentials:**
- [ ] Supabase Dashboard → Project Settings → API
- [ ] Copy and save:
  - `Project URL` → **VITE_SUPABASE_URL**
  - `anon public key` → **VITE_SUPABASE_ANON_KEY**
  - (service_role key → keep safe, not needed for frontend)

---

## Phase 3: Local Testing with Supabase (5 min)

**Connect Locally:**
- [ ] Create `.env.local` file in project root:
  ```
  VITE_SUPABASE_URL=https://your-project.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJ...
  VITE_SITE_URL=http://localhost:3000
  VITE_ADMIN_PASSWORD=changeme123
  ```
- [ ] Restart `npm run dev`
- [ ] Admin Dashboard → Add a test product
- [ ] Refresh page → product should persist ✅
- [ ] Check Supabase Dashboard → products table → see your product

**Test Admin Login:**
- [ ] Visit http://localhost:3000/admin-dashboard
- [ ] Login with password: `changeme123`
- [ ] See admin dashboard ✅

**Test Shopping Flow:**
- [ ] Add product to cart
- [ ] Checkout → fill shipping info
- [ ] Place order (demo payment)
- [ ] Check Supabase → orders table → see order ✅

---

## Phase 4: Vercel Deployment (10 min)

**Connect GitHub:**
- [ ] Push branch to GitHub:
  ```bash
  git add -A && git commit -m "Deploy: Supabase + Vercel config"
  git push origin claude/friendly-ritchie-dy0sd0
  ```
- [ ] GitHub → Create Pull Request → Merge to `main`
- [ ] `main` branch now has all updates

**Deploy to Vercel:**
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] New Project → Import `madcaptees` from GitHub
- [ ] Framework: `Vite` (or leave blank)
- [ ] Root Directory: `./`
- [ ] Build: `npm run build` (auto-detected)
- [ ] Output: `dist` (auto-detected)

**Add Environment Variables to Vercel:**
- [ ] Vercel Dashboard → Project Settings → Environment Variables
- [ ] Add (use values from Supabase Phase 2):

| Key | Value | Scope |
|-----|-------|-------|
| `VITE_SUPABASE_URL` | `https://xxx.supabase.co` | Production |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...` | Production |
| `VITE_SITE_URL` | `https://your-project.vercel.app` | Production |
| `VITE_ADMIN_PASSWORD` | Your secure password (change from changeme123!) | Production |

- [ ] Deploy → Wait for build to complete
- [ ] Vercel gives you a URL: `https://your-project.vercel.app`

**Test Vercel Deployment:**
- [ ] Visit `https://your-project.vercel.app`
- [ ] Store should load ✅
- [ ] Admin Dashboard works with your password ✅
- [ ] Add a product in admin → appears on storefront ✅

---

## Phase 5: Custom Domain (Optional, 10 min)

**Skip this if using Vercel subdomain.**

**Cloudflare Setup:**
- [ ] Domain registered at Namecheap/GoDaddy/etc.
- [ ] Go to [cloudflare.com](https://cloudflare.com) → Add Site
- [ ] Enter domain: `madcaptees.com`
- [ ] Copy Cloudflare nameservers
- [ ] Go to registrar, update nameservers to Cloudflare's
- [ ] Wait 24-48 hours for propagation

**Add DNS Records to Cloudflare:**
- [ ] Cloudflare Dashboard → DNS → Add Record:
  ```
  Type:     CNAME
  Name:     @
  Content:  your-project.vercel.app
  Proxy:    Proxied (orange cloud)
  TTL:      Auto
  ```
- [ ] Add www subdomain:
  ```
  Type:     CNAME
  Name:     www
  Content:  your-project.vercel.app
  Proxy:    Proxied
  TTL:      Auto
  ```

**Connect Domain to Vercel:**
- [ ] Vercel Dashboard → Project Settings → Domains
- [ ] Add Domain: `madcaptees.com`
- [ ] Follow Vercel's instructions (usually auto-detected from Cloudflare)

**Update Environment Variables:**
- [ ] Vercel → Environment Variables
- [ ] Update `VITE_SITE_URL` to `https://madcaptees.com`
- [ ] Redeploy (git push triggers automatic redeploy)

**SSL/TLS:**
- [ ] Cloudflare → SSL/TLS → Full Strict (auto with Vercel)
- [ ] Verify HTTPS works: `https://madcaptees.com` ✅

---

## Phase 6: Final Verification (5 min)

**Production Health Check:**
- [ ] Homepage loads → all images display ✅
- [ ] Shop page → filter/sort works ✅
- [ ] Product page → size/color selection works ✅
- [ ] Add to cart → cart persists across pages ✅
- [ ] Checkout → order saved to Supabase ✅
- [ ] Admin Dashboard → login with password ✅
- [ ] Admin → add product → appears on storefront ✅
- [ ] Admin → edit product → changes live ✅
- [ ] Admin → delete product → removed from storefront ✅

**Performance Check:**
- [ ] Homepage loads in < 3 seconds
- [ ] Lighthouse score > 80 (Vercel Analytics)
- [ ] No console errors (DevTools F12 → Console)

**Supabase Logs:**
- [ ] Supabase Dashboard → Logs → No errors
- [ ] products table has products ✅
- [ ] orders table has test order ✅

---

## Phase 7: Post-Launch Configuration (5 min)

**Update Admin Password:**
- [ ] Generate a strong password (use 1Password, Bitwarden, etc.)
- [ ] Vercel → Environment Variables → Update `VITE_ADMIN_PASSWORD`
- [ ] Test login with new password
- [ ] Share password securely (NOT in chat, email, or Slack)

**Set Up Monitoring (Optional):**
- [ ] [UptimeRobot](https://uptimerobot.com) → Add homepage to monitoring
- [ ] Cloudflare → Enable Analytics → Web Traffic
- [ ] Vercel → Enable Analytics → Core Web Vitals

**Database Backup (Optional):**
- [ ] Set reminder for weekly backups
- [ ] Use: `supabase db dump --project-ref your-ref > backup.sql`

**Enable Cloudflare Security (Optional):**
- [ ] Cloudflare Dashboard → Security → Firewall Rules
- [ ] Enable DDoS protection (default on)
- [ ] Enable Bot Management (pro feature)

---

## Phase 8: Troubleshooting

### "Supabase connection fails"
```
Symptom: Products don't show, admin can't save
Solution:
1. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel
2. Copy again from Supabase → Settings → API
3. Verify SQL schema ran (Supabase → SQL Editor → check tables)
4. Vercel: Redeploy (git commit --allow-empty -m "Redeploy" && git push)
```

### "Admin dashboard shows 404"
```
Symptom: /admin-dashboard page doesn't exist
Solution: This is a SPA, not Next.js. URL routing is handled by React.
Just visit the root URL, it navigates internally.
```

### "Products disappear on refresh"
```
Symptom: Supabase connected but changes don't persist
Solution:
1. Check Supabase RLS policies (should allow anon read/write)
2. Check Supabase Logs for errors
3. Browser DevTools → Network → check XHR requests
```

### "Domain not pointing to site"
```
Symptom: madcaptees.com goes to wrong place or doesn't resolve
Solution:
1. nslookup madcaptees.com → verify CNAME points to vercel
2. Wait 24-48 hours for DNS propagation
3. Cloudflare Dashboard → DNS → check records
4. Vercel Dashboard → Domains → verify domain is added
```

---

## Summary: What You Get

After completing all phases:

✅ **Live storefront** at `https://madcaptees.com` (or Vercel URL)
✅ **Admin dashboard** with password protection
✅ **Database** persisting all products and orders in Supabase
✅ **Fast deployment** — commit to GitHub → auto-deploys to Vercel
✅ **CDN + Images** — Cloudflare caching + fast image delivery
✅ **Free SSL/TLS** — HTTPS automatically via Vercel + Cloudflare

**Monthly Cost (MVP):** ~$1-2/month (domain registration only)

---

## Next: Phase 2

Ready to add:
- ✅ Real Stripe payments
- ✅ Customer accounts (Supabase Auth)
- ✅ Email confirmations (Resend)
- ✅ React Router for real URLs
- ✅ Product image uploads in admin

See `/docs/PRD.md` for Phase 2 roadmap.

---

**Questions?** Check:
- `/docs/SETUP.md` — Local development
- `/docs/DEPLOYMENT.md` — Detailed docs
- `/docs/SECURITY.md` — Security practices
