# Madcap Tees — Design System & UI Specification

**Version:** 1.0 | **Date:** June 9, 2026

---

## 1. Design Philosophy

Madcap Tees is not generic e-commerce. The aesthetic is a **vintage screen-print newsstand**: newsprint-cream paper with halftone dot textures, ink-black rules, a Mad-red accent punch, gold and teal secondaries. Cards have hard offset shadows and lift on hover. Badges and stamps are tilted like stickers. The vibe is Mad Magazine meets punk zine meets modern DTC brand.

Reference DNA:
- **Threadless** → discovery patterns, clean grids, community feel
- **Busted Tees** → humor-forward copy, bold CTAs, made-to-order transparency

---

## 2. Color Palette

### Primary Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-ink` | `#0A0A0A` | Primary text, borders, rules |
| `--color-paper` | `#F5F0E8` | Page background, newsprint cream |
| `--color-mad-red` | `#C41E3A` | Primary CTA, accent, sale badges, logo elements |
| `--color-white` | `#FFFFFF` | Cards, modals, overlays |

### Secondary Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-gold` | `#D4A843` | Featured badges, hero highlights, premium accents |
| `--color-teal` | `#1B7A7A` | Secondary CTAs, links on hover, info badges |
| `--color-slate` | `#64748B` | Muted text, captions, disabled states |
| `--color-success` | `#00C853` | Announcement bar, success toasts, free shipping progress |
| `--color-warning` | `#FF8F00` | Low stock, pending status |
| `--color-error` | `#D32F2F` | Errors, out of stock, cancelled orders |

### Product Colors (Swatches)
| Name | Hex | Usage |
|------|-----|-------|
| Black | `#0A0A0A` | Default tee color |
| White | `#F8F8F8` | Contrast option |
| Heather Grey | `#9CA3AF` | Neutral staple |
| Navy | `#1E3A5F` | Classic alternative |
| Red | `#C41E3A` | Bold option |
| Teal | `#1B7A7A` | Brand-aligned option |

### Halftone Dot Texture
```css
/* Applied as overlay on paper backgrounds */
background-image: radial-gradient(circle, #0A0A0A 0.5px, transparent 0.5px);
background-size: 4px 4px;
opacity: 0.03;
```

---

## 3. Typography

| Role | Font | Weights | Usage |
|------|------|---------|-------|
| Display | Anton | 400 | Hero headlines, section titles, product names on cards |
| Label / UI | Space Mono | 400, 700 | Navigation labels, buttons, tags, price, category labels |
| Body | DM Sans | 400, 500, 700 | Descriptions, paragraphs, form inputs, error messages |

### Type Scale
| Token | Size | Line Height | Letter Spacing | Usage |
|-------|------|-------------|----------------|-------|
| `text-hero` | 64px / 40px mobile | 1.0 | -0.02em | Hero headline |
| `text-h1` | 48px / 32px mobile | 1.1 | -0.01em | Page titles |
| `text-h2` | 36px / 24px mobile | 1.2 | 0 | Section headers |
| `text-h3` | 24px / 20px mobile | 1.3 | 0 | Card titles, subsections |
| `text-body` | 16px | 1.6 | 0 | Body copy, descriptions |
| `text-small` | 14px | 1.5 | 0.01em | Captions, metadata |
| `text-micro` | 12px | 1.4 | 0.05em | Labels, uppercase tags |
| `text-price` | 20px / 18px mobile | 1.2 | 0 | Price display |

---

## 4. Spacing & Layout

### Grid System
- **Container max-width:** 1400px, centered
- **Gutter:** 24px (desktop), 16px (mobile)
- **Page padding:** 48px horizontal (desktop), 16px (mobile)

### Spacing Scale
| Token | Value |
|-------|-------|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 24px |
| `space-6` | 32px |
| `space-7` | 48px |
| `space-8` | 64px |
| `space-9` | 96px |

---

## 5. Component Specifications

### 5.1 Announcement Bar
```
Background: #00C853 (success green)
Text: white, 12px, Space Mono, uppercase, letter-spacing 0.1em
Height: 40px
Content: "FREE DOMESTIC SHIPPING ON ORDERS OVER $125 | MADE TO ORDER — 7 DAY PRODUCTION"
Mobile: Text scrolls horizontally if too long; dismissible with X
```

### 5.2 Navigation Bar
```
Height: 72px desktop / 64px mobile
Background: #F5F0E8 with subtle bottom border 1px #0A0A0A at 10% opacity
Logo: Centered, 180px wide, SVG
Left group: Collections (dropdown), Apparel (dropdown)
Right group: Stickers, Best Sellers, New Arrivals
Far right: Search icon, Account icon, Cart icon with badge
Cart badge: #C41E3A background, white text, 16px circle, positioned top-right of icon
Sticky on scroll: background gets 95% opacity + backdrop blur
```

### 5.3 Dropdown Menu (Collections/Apparel)
```
Trigger: text + chevron-down icon
Panel: white background, 1px ink border, 4px hard shadow offset (4px right, 4px down)
Width: 240px
Items: 14px DM Sans, padding 12px 16px
Hover: #F5F0E8 background, ink text
Divider: 1px solid ink at 10%
```

### 5.4 Hero Carousel
```
Height: 70vh desktop / 50vh mobile
Background: #0A0A0A (images cover full area)
Overlay: linear gradient from ink at 60% opacity (bottom) to transparent (top)
Headline: Anton, 64px/40px, white
Subhead: DM Sans, 18px, white at 80% opacity
CTA: Mad-red background, white text, Space Mono 14px uppercase, padding 16px 32px
Dots: 8px circles, white at 40% / active: white 100%
Arrows: 48px circles, white at 20% background, white icon, positioned left/right
```

### 5.5 Collection Promo Cards
```
Grid: 5 columns desktop, 3 tablet, 2 mobile
Gap: 16px
Card: aspect-ratio 4:5, border-radius 0 (sharp corners), overflow hidden
Image: cover, full card
Overlay: gradient from ink at 70% (bottom) to transparent
Title: Anton, 24px, white
CTA: white border 1px, white text, Space Mono 12px uppercase, padding 8px 16px
Hover: image scale 1.05 over 400ms, overlay lightens
```

### 5.6 Product Card
```
Background: white, 1px ink border at 15%
Border-radius: 0 (sharp corners — newsprint aesthetic)
Image container: aspect-ratio 3:4, overflow hidden
Image: cover, centered
Sale badge: positioned top-left, #C41E3A background, white text, Space Mono 11px uppercase, padding 4px 8px, rotated -3deg (sticker effect)
Quick View button: appears on hover, centered over image, #0A0A0A background at 80% opacity, white text, 14px Space Mono
Info padding: 16px
Title: DM Sans 14px, 500 weight, ink color, 2-line clamp
Price regular: 14px, slate color, strikethrough
Price sale: 16px, mad-red, 700 weight
Save text: 12px, mad-red
Hover: card lifts 4px up (translateY -4px), shadow hardens: 4px 4px 0px ink at 20%
Transition: 200ms ease-out
```

### 5.7 Quick View Modal
```
Overlay: #0A0A0A at 60% opacity, backdrop blur 4px
Modal: white background, max-width 900px, max-height 90vh, overflow-y auto
Close: X button top-right, 40px touch target
Layout: 2-column (image left, info right) desktop; stacked mobile
Image: main + thumbnail strip below
Add to Cart: full-width, mad-red, white text, 16px Space Mono uppercase
```

### 5.8 Size Selector
```
Layout: flex row, gap 8px
Button: 48px x 48px, 1px ink border, DM Sans 14px
Selected: ink background, white text, 2px ink border
Disabled (out of stock): 50% opacity, strikethrough
Hover: ink background at 10%
Transition: 150ms
```

### 5.9 Color Swatches
```
Layout: flex row, gap 8px
Swatch: 32px circle, 2px border (transparent default, ink when selected)
Inner: 24px circle showing actual color
Selected: ink border 2px, scale 1.1
Hover: scale 1.05
```

### 5.10 Cart Drawer
```
Slide from right: transform translateX(100%) → translateX(0), 300ms ease
Width: 420px desktop, 100% mobile
Header: "YOUR CART" — Anton 24px, item count badge
Body: scrollable, product list
Product item: 80px thumbnail left, details right
Quantity: stepper buttons (+/-), 36px wide
Remove: X icon, slate color
Footer: subtotal line, free shipping progress bar, checkout button
Progress bar: 8px height, #E5E5E5 background, #00C853 fill, animated width
Checkout button: full-width, mad-red, white text, 16px Space Mono, padding 18px
```

### 5.11 Buttons

| Variant | Style |
|---------|-------|
| Primary | Mad-red bg, white text, 0 border-radius, Space Mono 14px uppercase, padding 14px 28px. Hover: darken 10%, lift 2px. |
| Secondary | Transparent bg, ink border 1px, ink text. Hover: ink bg, white text. |
| Ghost | Transparent, ink text, no border. Hover: underline. |
| Destructive | Error bg (#D32F2F), white text. Hover: darken. |
| Icon | 40px square, transparent, centered icon. Hover: ink at 10% bg. |

### 5.12 Badges & Status Pills
```
Published: #00C853 bg, white text, 4px padding x 8px, Space Mono 11px uppercase
Draft: #64748B bg, white text, same styling
Best Seller: #D4A843 bg, ink text, same styling
Featured: #1B7A7A bg, white text, same styling
Sale: #C41E3A bg, white text, rotated -3deg (sticker effect)
```

### 5.13 Form Inputs
```
Border: 1px ink at 30%, border-radius 0
Padding: 12px 16px
Font: DM Sans 16px
Focus: border ink at 100%, no outline, 2px inset shadow
Label: Space Mono 12px uppercase, letter-spacing 0.05em, ink at 70%
Error: border #D32F2F, error text below 12px
```

---

## 6. Shadows & Elevation

```css
/* Hard offset shadows — newsprint aesthetic */
--shadow-sm: 2px 2px 0px rgba(10, 10, 10, 0.1);
--shadow-md: 4px 4px 0px rgba(10, 10, 10, 0.15);
--shadow-lg: 6px 6px 0px rgba(10, 10, 10, 0.2);
--shadow-xl: 8px 8px 0px rgba(10, 10, 10, 0.25);

/* Card hover lift */
--shadow-lift: 4px 4px 0px rgba(10, 10, 10, 0.2);
transform: translateY(-4px);
```

---

## 7. Animations & Micro-interactions

| Interaction | Animation |
|-------------|-----------|
| Product card hover | translateY(-4px) + shadow-lg, 200ms ease-out |
| Button hover | background darken 10%, translateY(-2px), 150ms |
| Quick View button reveal | opacity 0→1, translateY(8px)→0, 200ms ease-out |
| Cart drawer open | translateX(100%)→0, 300ms cubic-bezier(0.4, 0, 0.2, 1) |
| Modal open | opacity 0→1 + scale(0.95)→scale(1), 200ms ease-out |
| Page transition | fade 150ms |
| Toast notification | slide in from bottom-right, 300ms; auto-dismiss 4s |
| Free shipping bar | width animation, 500ms ease-out |
| Image zoom | scale(1)→scale(1.5) on hover, overflow hidden container |
| Hero slide change | opacity crossfade 400ms |
| Stagger grid load | translateY(20px)→0 + opacity, 50ms stagger per item |
| Badge sticker tilt | rotate(-3deg) static; rotate(0) on hover, 200ms |

---

## 8. Responsive Breakpoints

| Name | Width | Layout Changes |
|------|-------|----------------|
| Mobile | < 640px | Single col, hamburger nav, full-width cards, cart drawer 100% |
| Tablet | 640–1024px | 2–3 col grid, simplified nav, sidebar collapses to top filters |
| Desktop | 1024–1400px | 4 col grid, full nav, sidebar filters visible |
| Wide | > 1400px | 4 col grid, max-width container centered |

---

## 9. Icons

All icons from **Lucide React**:
- Navigation: Search, User, ShoppingBag, ChevronDown, Menu, X
- Cart: Plus, Minus, Trash2, ArrowRight
- Product: Heart, Share2, ZoomIn, Eye
- Admin: Plus, Pencil, Trash2, Upload, Download, BarChart3, Package, DollarSign
- Status: Check, AlertCircle, XCircle, Clock, Truck
- Social: Instagram, Twitter/X, Facebook

Icon size: 20px default, 24px navigation, 16px inline.

---

## 10. Assets

### Logo
- Primary: Horizontal wordmark "MADCAP TEES" in Anton, with a small tilted star/asterisk replacing the dot on the 'i' or as a mark
- Icon: "MT" monogram in a tilted square stamp
- Formats: SVG (primary), PNG fallback
- Colorways: Ink on paper (default), White on ink (dark backgrounds), Red on paper (accent)

### Favicon
- 32x32, 180x180 Apple touch icon
- "MT" stamp or halftone dot pattern

### Product Placeholder
- Auto-generated SVG per product: tee silhouette + product title text + simple motif
- Ensures no broken images ever
