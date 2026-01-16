# KoosDoos Fire Pits — Web Storefront

A rugged, product-led ecommerce website for **KoosDoos Fire Pits** selling "rough & tough" fire bomas / fire boxes. Built tough. Burns harder.

Primary reference for UX patterns (structure, not visuals/assets): Solo Stove “Backyard Fire Pits” collection page:
- Product listing grid with image carousel per card
- Filters + sort
- Reviews count per product
- Price + sale/strike-through
- Badges (e.g., “New”)
- Sticky cart + quick add

## Goals
- Build a high-converting product listing page (PLP) + product detail pages (PDP) + cart/checkout.
- Strong SEO for “fire pit”, “boma”, “fire box”, “braai” adjacent keywords.
- Fast performance (Core Web Vitals) and mobile-first UX.
- CMS-lite so non-devs can manage products, collections, pricing, promos, content blocks.

## Non-goals (Phase 1)
- Complex personalization/recommendations.
- Multi-warehouse shipping logic.
- Marketplace integrations (Amazon, Takealot, etc.).

---

# Proposed Architecture (recommended)
**Frontend:** Next.js (App Router) + Tailwind  
**Backend API:** Python FastAPI  
**DB:** Postgres (products, variants, collections, reviews summary, inventory, promos)  
**Media:** S3-compatible object storage (images), CDN  
**Search:** Postgres trigram first; swap to Meilisearch/Algolia later  
**Payments:** Payfast (South African payment gateway)
**Analytics:** GA4 via GTM, Meta pixel optional
**Email:** Post-purchase via Payfast ITN → email provider (later)

> Alternative (faster launch): Shopify backend + headless storefront. Keep the same frontend patterns; swap FastAPI for Shopify Storefront API. (Not the default in this repo unless you choose it.)

---

# Pages (MVP)
1. Home
2. Collection / PLP (Backyard Fire Pits equivalent)
3. PDP (product detail)
4. **Personalise** — Custom design page for premium laser-cut panels
5. Cart (drawer + page)
6. Checkout (Payfast hosted)
7. Content pages: About, FAQs, Shipping/Returns, Warranty, Contact
8. Legal: Privacy, Terms

---

# Personalise Feature
The Personalise page allows customers to order custom laser-cut front panels with:
- **Template Selection**: Pre-designed templates across categories (Wildlife, Nature, Sports, Custom, Patterns)
- **Custom Upload**: Upload own designs (PNG, JPG, SVG, DXF formats supported)
- **Size Selection**: Available in Medium, Large, and XL sizes
- Premium pricing for personalised designs subject to approval

---

# PLP UX Requirements (must-have)
- Hero title + short intro copy
- Breadcrumbs
- Product count
- Sort + Filters:
  - Category/Collection
  - Size (or “seats X–Y people”)
  - Price range
  - Color/finish (optional)
  - “In stock” toggle (optional)
- “All filters” drawer on mobile
- Product card:
  - Image carousel (2–6 images)
  - Badge (New / Sale / Best Seller)
  - Name
  - 1–2 line value prop
  - Reviews count + rating summary (OK to store summary only in MVP)
  - Price + compare-at price + savings label
  - Quick add to cart (default variant) OR “Choose options”
- Mid-grid promo/banner tile (e.g., “Find your size” / “Lifetime warranty” / “Built like a tank”)
- Pagination or infinite scroll (pick one; pagination is better for SEO)

---

# Repo Structure (suggested)
/
  apps/
    web/                # Next.js storefront
    api/                # FastAPI
  packages/
    ui/                 # shared UI components (optional)
  infra/                # terraform/pulumi later
  docs/
    prd.json
    analytics.md
    seo.md
  .github/workflows/    # CI
  docker-compose.yml

---

# Local Development
## Prereqs
- Node 20+
- Python 3.11+
- Docker (Postgres)

## Start DB
docker compose up -d postgres

## API
cd apps/api
python -m venv .venv
source .venv/bin/activate  # (Windows: .venv\Scripts\activate)
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

## Web
cd apps/web
npm i
npm run dev

Web: http://localhost:3000  
API: http://localhost:8000/docs

---

# Data Model (MVP)
- Product (id, slug, title, subtitle, description, badges, seats_min, seats_max, material, finish)
- Variant (id, product_id, sku, price, compare_at_price, weight, dimensions, inventory_qty)
- ProductImage (product_id, url, alt, sort_order)
- Collection (id, slug, title, hero_copy)
- CollectionProduct (collection_id, product_id, sort_order)
- ReviewSummary (product_id, rating_avg, rating_count)
- PromoBlock (collection_id, position_index, title, copy, cta_text, cta_url, image_url)
- DesignTemplate (id, name, category, thumbnail, svgPath) — for personalised designs

## Product Lineup
KoosDoos fire pits are available in four sizes:
- **Small** (600×600×450mm) — Seats 2-4 people
- **Medium** (750×750×500mm) — Seats 4-6 people ⭐ Best Seller
- **Large** (900×900×550mm) — Seats 6-8 people
- **XL** (1100×1100×600mm) — Seats 8-12 people

All sizes available with optional personalised laser-cut front panels.

---

# Milestones (agent execution order)
1. Discovery + wireframes (PLP + PDP + cart)
2. Design system + brand pass (Figma) → tokens
3. Implement Web shell (header, footer, nav, breadcrumb)
4. Implement PLP:
   - Filters/sort UI
   - Product grid + card carousel
   - PromoBlock tile
5. Implement PDP:
   - Gallery, options, add-to-cart, trust blocks (shipping/warranty)
6. Implement Cart + Payfast checkout
7. Admin/CMS-lite:
   - Seed script + minimal admin UI OR JSON-based config first
8. SEO + analytics + performance pass
9. Tests (unit + e2e smoke) + CI/CD deploy

---

# Acceptance Criteria (MVP)
- PLP loads < 2s on 4G for a median image set (CDN + optimized images)
- Lighthouse: Performance 85+ mobile, Accessibility 95+
- Create order end-to-end via Payfast
- Products manageable without code changes (seed tool / admin / CMS-lite)
- SEO: indexable PLP + PDP, clean URLs, meta, OG, sitemap

---

# Notes on IP / Similarity
We replicate **interaction patterns and information architecture** only. No copying of Solo Stove assets, copy, or distinctive visual design.
