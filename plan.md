# KoosDoos Fire Pits - Development Plan

## Overview

E-commerce site for KoosDoos Fire Pits - laser-cut steel fire pits made in South Africa.

**Database:** SQLite (koosdoos.db) | **Currency:** ZAR (South African Rand) | **Locale:** en-ZA

---

## Completed Tasks ✅

### Phase 1: Backend Simplification (COMPLETE)
- ✅ Deleted `apps/api/docker-compose.yml`
- ✅ Removed `psycopg2-binary` from requirements.txt
- ✅ Removed `asyncpg` from requirements.txt
- ✅ Updated `alembic.ini` to use SQLite URL
- ✅ Updated `.env.example` to use SQLite
- ✅ Updated `.env.production.example` for SQLite deployment
- ✅ Simplified `database.py` to SQLite-only engine
- ✅ Added `POST /admin/sql-query` endpoint with SELECT-only validation
- ✅ Added dangerous keyword blocking (INSERT, UPDATE, DELETE, DROP)

### Phase 2: Checkout UX Improvements (COMPLETE)
- ✅ Persist checkout details in localStorage
- ✅ Expand Customer Info, Billing, and Delivery sections by default
- ✅ Added Billing Address section with "Same as delivery" checkbox
- ✅ Fixed R currency spacing (R2,500 instead of R 2 500)

### Phase 3: UI Fixes (COMPLETE)
- ✅ Fixed button icon alignment (icons now inline with text)
- ✅ Updated Header, Footer, ProductCard styling
- ✅ Enhanced global CSS with animations and effects

---

## Pending Tasks 📋

### Phase 4: Product & Pricing Restructure

```json
[
  {
    "category": "phase_4_pricing",
    "description": "Restructure Product Pricing",
    "steps": [
      "Make standard KoosDoos (plain metal) the base/cheaper option",
      "Add 40% markup for personalised designs",
      "Update product data in products.ts",
      "Update price display logic",
      "Ensure Medium base price is below R2,500 free shipping threshold"
    ],
    "passes": false,
    "notes": "Standard = base price, Personalised = base + 40%"
  },
  {
    "category": "phase_4_pricing",
    "description": "Create Accessories Product Category",
    "steps": [
      "Add accessories collection to product data",
      "Create 'Raise the Base' insert product (Large & XL only)",
      "Create 'Braai-Box' grid topper product (all sizes)",
      "Add size compatibility data to accessories",
      "Update product filtering for accessories"
    ],
    "passes": false,
    "notes": "Accessories help customers reach free shipping threshold"
  }
]
```

### Phase 5: Accessories Page & Features

```json
[
  {
    "category": "phase_5_accessories",
    "description": "Accessories Page",
    "steps": [
      "Create /collections/accessories route",
      "Design accessories listing page",
      "Add size filter for compatible products",
      "Add 'Works with' badges on product cards",
      "Link from main navigation"
    ],
    "passes": false,
    "notes": "New page for Raise the Base and Braai-Box products"
  },
  {
    "category": "phase_5_accessories",
    "description": "Raise the Base Insert",
    "steps": [
      "Create product entry for Raise the Base",
      "Add product images/placeholders",
      "Set size compatibility (Large, XL only)",
      "Add to accessories collection",
      "Create product detail page content"
    ],
    "passes": false,
    "notes": "Elevates fire position in Large and XL fire pits"
  },
  {
    "category": "phase_5_accessories",
    "description": "Braai-Box Grid Topper",
    "steps": [
      "Create product entries for each size (Small, Medium, Large, XL)",
      "Add product images/placeholders",
      "Set size-specific pricing",
      "Add to accessories collection",
      "Create product detail page content",
      "Add 'Complete the set' upsell on fire pit pages"
    ],
    "passes": false,
    "notes": "Converts fire pit into a braai - available for all sizes"
  },
  {
    "category": "phase_5_accessories",
    "description": "Cart Upsell Feature",
    "steps": [
      "Add 'Add Braai-Box' suggestion in cart",
      "Show when cart total is below free shipping threshold",
      "Calculate price needed to reach R2,500",
      "Quick-add button for compatible Braai-Box"
    ],
    "passes": false,
    "notes": "Encourage accessories to reach free shipping"
  }
]
```

---

## Pricing Strategy

### Fire Pits (Base Prices - Standard Plain Metal)

| Size | Standard Price | Personalised (+40%) |
|------|---------------|---------------------|
| Small | R999 | R1,399 |
| Medium | R1,499 | R2,099 |
| Large | R2,199 | R3,079 |
| XL | R2,999 | R4,199 |

*Note: Medium at R1,499 is below the R2,500 free shipping threshold*

### Accessories

| Product | Sizes | Price Range |
|---------|-------|-------------|
| Braai-Box Grid | Small, Medium, Large, XL | R399 - R799 |
| Raise the Base | Large, XL only | R499 - R699 |

### Free Shipping Strategy
- Threshold: R2,500
- Medium (R1,499) + Braai-Box (R599) = R2,098 → Still needs ~R400 more
- Medium (R1,499) + Braai-Box (R599) + Raise the Base (R499) = R2,597 → FREE SHIPPING ✅
- Large (R2,199) + Braai-Box (R699) = R2,898 → FREE SHIPPING ✅

---

## Product Catalog Structure

```
Fire Pits (main collection)
├── KoosDoos Small (Standard)
├── KoosDoos Small (Personalised)
├── KoosDoos Medium (Standard)
├── KoosDoos Medium (Personalised)
├── KoosDoos Large (Standard)
├── KoosDoos Large (Personalised)
├── KoosDoos XL (Standard)
└── KoosDoos XL (Personalised)

Accessories (new collection)
├── Braai-Box Small
├── Braai-Box Medium
├── Braai-Box Large
├── Braai-Box XL
├── Raise the Base Large
└── Raise the Base XL
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router), Tailwind CSS v4 |
| Backend | FastAPI, SQLAlchemy, SQLite |
| Payments | Payfast (SA gateway) |
| Shipping | The Courier Guy API |
| Hosting | Vercel (frontend), Railway (backend) |

---

## Remote Database Access

```bash
curl -X POST "https://your-api.com/api/v1/admin/sql-query" \
  -H "X-Admin-API-Key: your-admin-key" \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT * FROM orders ORDER BY created_at DESC LIMIT 10"}'
```

---

## Progress Summary

| Phase | Status | Progress |
|-------|--------|----------|
| 1. Backend Simplification | ✅ Complete | 9/9 |
| 2. Checkout UX | ✅ Complete | 4/4 |
| 3. UI Fixes | ✅ Complete | 3/3 |
| 4. Pricing Restructure | ⏳ Pending | 0/10 |
| 5. Accessories | ⏳ Pending | 0/20 |

**Completed: 16 tasks | Pending: 30 tasks**
