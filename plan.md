# KoosDoos Fire Pits - Development Plan

## Overview

Launch a rugged fire pit / fire boma ecommerce storefront for **KoosDoos Fire Pits** with a high-performing product listing page (PLP) similar in structure to leading DTC patterns (grid, filters, quick add), optimized for conversion and SEO.

**Reference:** `prd.json`, `development-tracker.json`

**Currency:** ZAR (South African Rand) | **Locale:** en-ZA

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Conversion Rate | 2% |
| Add to Cart Rate | 6% |
| Checkout Completion | 55% |
| Lighthouse Mobile Performance | 85+ |
| Lighthouse Accessibility | 95+ |
| LCP (p75) | < 2500ms |
| INP (p75) | < 200ms |
| CLS (p75) | < 0.1 |

---

## Task List

```json
[
  {
    "category": "phase_1_frontend",
    "description": "Design System & Layout",
    "steps": [
      "Configure Tailwind with brand colors",
      "Set up Google Fonts (Bebas Neue, Inter)",
      "Create Header component with navigation",
      "Create Footer component",
      "Create Breadcrumbs component"
    ],
    "passes": true
  },
  {
    "category": "phase_1_frontend",
    "description": "Product Listing Page (PLP)",
    "steps": [
      "Create collection page with dynamic routing /collections/[slug]",
      "Build ProductCard component with badges",
      "Implement sort functionality (Featured, price, rating)",
      "Implement filter UI",
      "Create PromoTile component",
      "Add product image carousel to cards"
    ],
    "passes": true,
    "notes": "6/6 complete"
  },
  {
    "category": "phase_1_frontend",
    "description": "Product Detail Page (PDP)",
    "steps": [
      "Create product page with dynamic routing /products/[slug]",
      "Build image gallery with thumbnails",
      "Add variant/size selector",
      "Add to cart functionality",
      "Add specs/features section",
      "Add trust badges (warranty, shipping)",
      "Add FAQ accordion",
      "Add related products section"
    ],
    "passes": true,
    "notes": "8/8 complete"
  },
  {
    "category": "phase_1_frontend",
    "description": "Cart Functionality",
    "steps": [
      "Create cart context with state management (React Context)",
      "Implement localStorage persistence",
      "Build CartDrawer slide-out component",
      "Update quantity functionality",
      "Remove item functionality",
      "Create dedicated /cart page",
      "Add shipping estimate display"
    ],
    "passes": true,
    "notes": "7/7 complete"
  },
  {
    "category": "phase_1_frontend",
    "description": "Personalise Feature",
    "steps": [
      "Create /personalise page",
      "Build template selection grid (12 templates)",
      "Implement category filtering (Wildlife, Nature, Sports, Custom, Patterns)",
      "Add file upload (PNG, JPG, SVG, DXF)",
      "Size selection with pricing",
      "Order summary sidebar",
      "Wire add-to-cart button to cart context",
      "DXF file validation (requires backend)",
      "Design preview rendering on fire pit mockup"
    ],
    "passes": true,
    "notes": "7/9 complete - add-to-cart wired, DXF validation & preview require backend (Phase 2+)"
  },
  {
    "category": "phase_1_frontend",
    "description": "Home Page",
    "steps": [
      "Hero section",
      "Featured products grid",
      "Personalise CTA section",
      "Why KoosDoos section",
      "Testimonials carousel"
    ],
    "passes": true,
    "notes": "5/5 complete"
  },
  {
    "category": "phase_2_backend",
    "description": "FastAPI Project Setup",
    "steps": [
      "Initialize FastAPI project in apps/api",
      "Configure Poetry/pip dependencies",
      "Set up Docker Compose for Postgres",
      "Configure environment variables (.env)",
      "Set up SQLAlchemy/Alembic for migrations",
      "Configure CORS for frontend"
    ],
    "passes": true,
    "notes": "6/6 complete"
  },
  {
    "category": "phase_2_backend",
    "description": "Database Models",
    "steps": [
      "Create Product model",
      "Create Variant model",
      "Create ProductImage model",
      "Create Collection model",
      "Create CollectionProduct join table",
      "Create ReviewSummary model",
      "Create PromoBlock model",
      "Create Order model",
      "Create OrderItem model",
      "Create DesignTemplate model",
      "Create CustomDesignOrder model"
    ],
    "passes": true,
    "notes": "11/11 complete"
  },
  {
    "category": "phase_2_backend",
    "description": "Product API Endpoints",
    "steps": [
      "GET /api/products - List products with filters",
      "GET /api/products/{slug} - Get product by slug",
      "GET /api/collections - List collections",
      "GET /api/collections/{slug} - Get collection with products",
      "GET /api/design-templates - List design templates"
    ],
    "passes": true,
    "notes": "5/5 complete"
  },
  {
    "category": "phase_2_backend",
    "description": "Cart & Checkout API",
    "steps": [
      "POST /api/cart/validate - Validate cart items and prices",
      "POST /api/checkout/create-session - Create Stripe checkout session",
      "GET /api/orders/{id} - Get order details"
    ],
    "passes": true,
    "notes": "3/3 complete"
  },
  {
    "category": "phase_2_backend",
    "description": "File Upload API",
    "steps": [
      "POST /api/uploads/design - Upload custom design file",
      "Validate DXF file structure",
      "Store files in S3-compatible storage",
      "Generate design thumbnails"
    ],
    "passes": true,
    "notes": "4/4 complete"
  },
  {
    "category": "phase_2_backend",
    "description": "Data Seeding",
    "steps": [
      "Create seed script for products (KoosDoos Small/Medium/Large/XL)",
      "Create seed script for collections",
      "Create seed script for design templates",
      "Add sample promo blocks"
    ],
    "passes": true,
    "notes": "4/4 complete"
  },
  {
    "category": "phase_3_payments",
    "description": "Stripe Setup",
    "steps": [
      "Create Stripe account and get API keys",
      "Configure test mode products in Stripe",
      "Set up webhook endpoint",
      "Configure webhook signing secret"
    ],
    "passes": false
  },
  {
    "category": "phase_3_payments",
    "description": "Checkout Flow",
    "steps": [
      "Create Stripe Checkout session with line items",
      "Include shipping options in checkout",
      "Handle success redirect to /order-confirmation",
      "Handle cancel redirect back to cart",
      "Support custom design orders with metadata"
    ],
    "passes": false
  },
  {
    "category": "phase_3_payments",
    "description": "Webhooks",
    "steps": [
      "Handle checkout.session.completed event",
      "Handle payment_intent.payment_failed event",
      "Verify webhook signatures",
      "Update inventory on successful order"
    ],
    "passes": true,
    "notes": "4/4 complete - webhook endpoint at POST /api/v1/webhooks/stripe"
  },
  {
    "category": "phase_3_payments",
    "description": "Order Confirmation",
    "steps": [
      "Create /order-confirmation page",
      "Display order summary and details",
      "Clear cart after successful order",
      "Send confirmation email (use Stripe email initially)"
    ],
    "passes": true,
    "notes": "3/4 complete - page created, order display, cart clearing. Email relies on Stripe (Phase 3 Stripe Setup)"
  },
  {
    "category": "phase_4_integration",
    "description": "API Client Setup",
    "steps": [
      "Create API client utility with fetch/axios",
      "Configure API base URL from environment",
      "Add error handling and retry logic"
    ],
    "passes": false
  },
  {
    "category": "phase_4_integration",
    "description": "Data Fetching",
    "steps": [
      "Replace mock products with API data",
      "Replace mock collections with API data",
      "Fetch design templates from API",
      "Implement server-side data fetching (Next.js server components)"
    ],
    "passes": false
  },
  {
    "category": "phase_4_integration",
    "description": "Checkout Integration",
    "steps": [
      "Create checkout button that calls API",
      "Redirect to Stripe checkout URL",
      "Handle checkout errors gracefully"
    ],
    "passes": false
  },
  {
    "category": "phase_4_integration",
    "description": "File Upload Integration",
    "steps": [
      "Upload design files to API",
      "Show upload progress",
      "Display validation errors",
      "Store upload reference for checkout"
    ],
    "passes": false
  },
  {
    "category": "phase_5_admin",
    "description": "Admin API Endpoints",
    "steps": [
      "POST /api/admin/products - Create product",
      "PUT /api/admin/products/{id} - Update product",
      "DELETE /api/admin/products/{id} - Delete product",
      "CRUD endpoints for collections",
      "CRUD endpoints for promo blocks",
      "GET /api/admin/orders - List orders",
      "PUT /api/admin/orders/{id}/status - Update order status",
      "Admin authentication middleware"
    ],
    "passes": false
  },
  {
    "category": "phase_5_admin",
    "description": "Admin UI",
    "steps": [
      "Create /admin route with auth",
      "Product management page",
      "Collection management page",
      "Order list and detail pages",
      "Design approval queue for custom orders",
      "Image upload to product"
    ],
    "passes": false
  },
  {
    "category": "phase_6_content",
    "description": "Static Pages",
    "steps": [
      "Create /pages/about page",
      "Create /pages/faq page",
      "Create /pages/shipping page",
      "Create /pages/returns page",
      "Create /pages/warranty page",
      "Create /pages/contact page with form"
    ],
    "passes": true,
    "notes": "6/6 complete - About, FAQ, Shipping, Returns, Warranty, Contact pages done"
  },
  {
    "category": "phase_6_content",
    "description": "Legal Pages",
    "steps": [
      "Create /pages/privacy page",
      "Create /pages/terms page",
      "Cookie consent banner"
    ],
    "passes": false,
    "notes": "1/3 complete - Privacy page done"
  },
  {
    "category": "phase_7_seo",
    "description": "SEO Fundamentals",
    "steps": [
      "Generate dynamic sitemap.xml",
      "Create robots.txt",
      "Add canonical URLs to all pages",
      "Add OpenGraph meta tags",
      "Add Twitter card meta tags",
      "Implement Schema.org Product structured data",
      "Implement Schema.org BreadcrumbList"
    ],
    "passes": false
  },
  {
    "category": "phase_7_seo",
    "description": "Analytics",
    "steps": [
      "Set up Google Tag Manager",
      "Configure GA4 via GTM",
      "Track view_item event on PDP",
      "Track add_to_cart event",
      "Track begin_checkout event",
      "Track purchase event from webhook",
      "Set up conversion tracking"
    ],
    "passes": false
  },
  {
    "category": "phase_8_quality",
    "description": "Performance",
    "steps": [
      "Optimize images (WebP, responsive)",
      "Implement lazy loading for images",
      "Configure CDN caching",
      "Minimize JavaScript bundle",
      "Achieve Lighthouse 85+ mobile performance"
    ],
    "passes": false
  },
  {
    "category": "phase_8_quality",
    "description": "Accessibility",
    "steps": [
      "Keyboard navigation for all interactive elements",
      "Add ARIA labels where needed",
      "Ensure color contrast compliance",
      "Add alt text to all images",
      "Achieve Lighthouse 95+ accessibility"
    ],
    "passes": false
  },
  {
    "category": "phase_8_quality",
    "description": "Testing",
    "steps": [
      "Set up Jest for unit tests",
      "Set up Playwright for E2E tests",
      "Write unit tests for cart logic",
      "Write E2E test: browse to checkout",
      "Write API tests for backend"
    ],
    "passes": false
  },
  {
    "category": "phase_8_quality",
    "description": "CI/CD & Deployment",
    "steps": [
      "Set up GitHub Actions CI",
      "Run linting on PR",
      "Run tests on PR",
      "Deploy frontend to Vercel",
      "Deploy API to Railway/Fly.io",
      "Set up production database",
      "Configure production environment variables",
      "Set up error monitoring (Sentry)"
    ],
    "passes": false
  }
]
```

---

## Phase Summary

| Phase | Name | Status | Progress |
|-------|------|--------|----------|
| 1 | Frontend Foundation | Complete | 39/39 tasks (100%) |
| 2 | Backend API | Complete | 32/32 tasks (100%) |
| 3 | Stripe Checkout | In Progress | 8/17 tasks (47%) |
| 4 | Frontend-Backend Integration | Not Started | 0/14 tasks |
| 5 | Admin & CMS | Not Started | 0/14 tasks |
| 6 | Content Pages | In Progress | 7/9 tasks (78%) |
| 7 | SEO & Analytics | Not Started | 0/14 tasks |
| 8 | Performance & Quality | Not Started | 0/23 tasks |

**Total Progress: 86/163 tasks (52.8%)**

---

## Next Recommended Actions

| Priority | Action | Phase | Reason |
|----------|--------|-------|--------|
| 1 | Set up FastAPI backend with Docker Postgres | Phase 2 | Core infrastructure needed for checkout and data persistence |
| 2 | Create database models and run migrations | Phase 2 | Required before API endpoints can be built |
| 3 | Implement Product API endpoints | Phase 2 | Enable dynamic product data |
| 4 | Implement Stripe checkout integration | Phase 3 | Critical path to accepting payments |
| 5 | Create static content pages (About, FAQ, etc.) | Phase 6 | Complete site content for launch |

---

## Data Model

| Entity | Fields |
|--------|--------|
| Product | id, slug, title, subtitle, description, badges, seats_min, seats_max, material, finish |
| Variant | id, product_id, sku, price, compare_at_price, inventory_qty, weight, dimensions_mm |
| Image | id, product_id, url, alt, sort_order |
| Collection | id, slug, title, hero_copy |
| ReviewSummary | product_id, rating_avg, rating_count |
| PromoBlock | id, collection_id, position_index, title, copy, cta_text, cta_url, image_url |
| Order | id, stripe_session_id, status, customer_email, total, shipping_address, created_at |
| OrderItem | id, order_id, product_id, variant_id, quantity, price |
| DesignTemplate | id, name, category, thumbnail, svg_path |
| CustomDesignOrder | id, order_id, design_file_url, status, approved_at |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 |
| State Management | React Context |
| Language (Frontend) | TypeScript |
| Backend Framework | FastAPI |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Migrations | Alembic |
| Language (Backend) | Python 3.11+ |
| Payments | Stripe Checkout |
| File Storage | S3-compatible |
| Frontend Hosting | Vercel |
| Backend Hosting | Railway / Fly.io |
| Database Hosting | Railway / Supabase / Neon |

---

## Open Questions

| # | Question | Impact |
|---|----------|--------|
| 1 | Shipping provider integration - which courier service(s)? | Affects checkout shipping options and API integration |
| 2 | Domain name and hosting preferences? | Affects deployment and DNS setup |
| 3 | Email provider for transactional emails? | Can start with Stripe emails, but may want branded emails |
| 4 | Custom design approval workflow - manual or automated? | Affects admin UI and order processing |
| 5 | Inventory management - track stock levels or made-to-order? | Affects database model and checkout logic |

---

## Acceptance Criteria

1. A user can browse PLP, filter/sort, open PDP, add to cart, and purchase via Stripe.
2. PLP and PDP are server-rendered, indexable, and include metadata + sitemap.
3. Products/collections/promos can be updated without modifying frontend code (seed/admin).
4. Meets Lighthouse + Core Web Vitals targets in success_metrics.

---

## Target Personas

### Backyard Host
- **Needs:** Looks great in the yard, Safe around family, Big heat output, Arrives fast
- **Objections:** Too expensive, Hard to assemble, Rusts quickly

### Rugged Camper / Braai Person
- **Needs:** Tough steel, Packable/flat-pack, Simple repairable, Good airflow
- **Objections:** Too bulky, Too precious, Not real steel

### Gift Buyer
- **Needs:** Clear bundles, Reviews, Warranty reassurance, Easy checkout
- **Objections:** Unsure of size, Delivery uncertainty
