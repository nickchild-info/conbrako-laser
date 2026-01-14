"""
Database seed script for KoosDoos Fire Pits.

This script populates the database with initial data:
- Products (KoosDoos Small, Medium, Large, XL, Personalised)
- Product variants with pricing and inventory
- Product images
- Review summaries
- Collections (Fire Pits, Best Sellers, New Arrivals, Personalised)
- Promo blocks for collections
- Design templates for personalisation

Usage:
    cd apps/api
    python -m scripts.seed

To reset and reseed:
    python -m scripts.seed --reset
"""

import argparse
import sys
from pathlib import Path

# Add the app directory to the path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from app.core.database import engine, SessionLocal, Base
from app.models import (
    Product,
    Variant,
    ProductImage,
    ReviewSummary,
    Collection,
    PromoBlock,
    DesignTemplate,
    DesignCategory,
    collection_product,
)


def clear_database(db: Session):
    """Clear all seeded data from the database."""
    print("Clearing existing data...")

    # Delete in order of dependencies
    db.execute(collection_product.delete())
    db.query(PromoBlock).delete()
    db.query(ReviewSummary).delete()
    db.query(ProductImage).delete()
    db.query(Variant).delete()
    db.query(Product).delete()
    db.query(Collection).delete()
    db.query(DesignTemplate).delete()
    db.commit()
    print("Database cleared.")


def seed_products(db: Session) -> dict[str, Product]:
    """Seed products and return a mapping of slug to Product."""
    print("Seeding products...")

    products_data = [
        {
            "slug": "koosdoos-small",
            "title": "KoosDoos Small",
            "subtitle": "Compact & portable | Perfect for 2-3 people",
            "description": (
                "The perfect starter fire pit for intimate gatherings or camping adventures. "
                "Our Small KoosDoos packs flat for easy transport and assembles in under 5 minutes "
                "with no tools. Laser-cut from premium South African steel with signature "
                "flame-pattern ventilation for optimal airflow."
            ),
            "badges": ["new"],
            "seats_min": 2,
            "seats_max": 3,
            "material": "2.5mm Mild Steel",
            "finish": "Raw Steel",
        },
        {
            "slug": "koosdoos-medium",
            "title": "KoosDoos Medium",
            "subtitle": "Most popular size | Ideal for 4-6 people",
            "description": (
                "Our best-selling size, perfect for backyard braais and family gatherings. "
                "The Medium KoosDoos delivers serious heat output while remaining portable enough "
                "to move around your property. Features our signature laser-cut designs and "
                "assembles without tools."
            ),
            "badges": ["best-seller"],
            "seats_min": 4,
            "seats_max": 6,
            "material": "3mm Mild Steel",
            "finish": "Raw Steel",
        },
        {
            "slug": "koosdoos-large",
            "title": "KoosDoos Large",
            "subtitle": "Family favourite | Great for 6-8 people",
            "description": (
                "When you need more fire for bigger gatherings. The Large KoosDoos is perfect "
                "for entertaining, delivering impressive flames and heat output. Built from 3mm "
                "steel for durability, with our signature flat-pack design that assembles in minutes."
            ),
            "badges": [],
            "seats_min": 6,
            "seats_max": 8,
            "material": "3mm Mild Steel",
            "finish": "Raw Steel",
        },
        {
            "slug": "koosdoos-xl",
            "title": "KoosDoos XL",
            "subtitle": "The beast | For 8-12 people",
            "description": (
                "Go big or go home. The XL KoosDoos is our largest fire pit, perfect for parties, "
                "events, and serious braai enthusiasts who want maximum fire. Built from heavy-duty "
                "4mm steel for ultimate durability. A true centrepiece for any outdoor space."
            ),
            "badges": [],
            "seats_min": 8,
            "seats_max": 12,
            "material": "4mm Mild Steel",
            "finish": "Raw Steel",
        },
        {
            "slug": "koosdoos-personalised",
            "title": "KoosDoos Personalised",
            "subtitle": "Your design | Your fire pit",
            "description": (
                "Make it yours. Upload your own design or choose from our template library to "
                "create a one-of-a-kind fire pit. Perfect for businesses, sports clubs, family "
                "crests, or any custom artwork. Our team will review your design and laser-cut "
                "it into premium steel."
            ),
            "badges": ["new"],
            "seats_min": 4,
            "seats_max": 8,
            "material": "3mm Mild Steel",
            "finish": "Raw Steel",
        },
    ]

    products = {}
    for data in products_data:
        product = Product(**data)
        db.add(product)
        db.flush()  # Get the ID
        products[data["slug"]] = product

    db.commit()
    print(f"  Created {len(products)} products.")
    return products


def seed_variants(db: Session, products: dict[str, Product]):
    """Seed product variants."""
    print("Seeding variants...")

    variants_data = [
        # KoosDoos Small
        {
            "product_slug": "koosdoos-small",
            "sku": "KDS-SM",
            "price": 1299.00,
            "compare_at_price": None,
            "inventory_qty": 25,
            "weight": 8.0,
            "dimensions_mm": "300x300x350",
        },
        # KoosDoos Medium
        {
            "product_slug": "koosdoos-medium",
            "sku": "KDS-MD",
            "price": 1999.00,
            "compare_at_price": 2299.00,
            "inventory_qty": 18,
            "weight": 15.0,
            "dimensions_mm": "400x400x450",
        },
        # KoosDoos Large
        {
            "product_slug": "koosdoos-large",
            "sku": "KDS-LG",
            "price": 2799.00,
            "compare_at_price": None,
            "inventory_qty": 12,
            "weight": 22.0,
            "dimensions_mm": "500x500x550",
        },
        # KoosDoos XL
        {
            "product_slug": "koosdoos-xl",
            "sku": "KDS-XL",
            "price": 3999.00,
            "compare_at_price": 4499.00,
            "inventory_qty": 6,
            "weight": 35.0,
            "dimensions_mm": "650x650x650",
        },
        # KoosDoos Personalised - Medium
        {
            "product_slug": "koosdoos-personalised",
            "sku": "KDS-PERS-MD",
            "price": 2999.00,
            "compare_at_price": None,
            "inventory_qty": 99,
            "weight": 15.0,
            "dimensions_mm": "400x400x450",
        },
        # KoosDoos Personalised - Large
        {
            "product_slug": "koosdoos-personalised",
            "sku": "KDS-PERS-LG",
            "price": 3799.00,
            "compare_at_price": None,
            "inventory_qty": 99,
            "weight": 22.0,
            "dimensions_mm": "500x500x550",
        },
        # KoosDoos Personalised - XL
        {
            "product_slug": "koosdoos-personalised",
            "sku": "KDS-PERS-XL",
            "price": 4999.00,
            "compare_at_price": None,
            "inventory_qty": 99,
            "weight": 35.0,
            "dimensions_mm": "650x650x650",
        },
    ]

    count = 0
    for data in variants_data:
        product = products[data.pop("product_slug")]
        variant = Variant(product_id=product.id, **data)
        db.add(variant)
        count += 1

    db.commit()
    print(f"  Created {count} variants.")


def seed_images(db: Session, products: dict[str, Product]):
    """Seed product images."""
    print("Seeding product images...")

    images_data = [
        # KoosDoos Small
        {"product_slug": "koosdoos-small", "url": "/images/products/elephant-fire-1.jpg", "alt": "KoosDoos Small fire pit with active flames", "sort_order": 1},
        {"product_slug": "koosdoos-small", "url": "/images/products/veld-flame-1.jpg", "alt": "KoosDoos Small showing flame pattern cutouts", "sort_order": 2},
        # KoosDoos Medium
        {"product_slug": "koosdoos-medium", "url": "/images/products/elephant-fire-1.jpg", "alt": "KoosDoos Medium fire pit at night", "sort_order": 1},
        {"product_slug": "koosdoos-medium", "url": "/images/products/elephant-fire-2.jpg", "alt": "KoosDoos Medium showing steel patina", "sort_order": 2},
        {"product_slug": "koosdoos-medium", "url": "/images/products/veld-flame-1.jpg", "alt": "KoosDoos Medium with flame cutouts", "sort_order": 3},
        # KoosDoos Large
        {"product_slug": "koosdoos-large", "url": "/images/products/elephant-fire-2.jpg", "alt": "KoosDoos Large fire pit in backyard", "sort_order": 1},
        {"product_slug": "koosdoos-large", "url": "/images/products/elephant-fire-3.jpg", "alt": "KoosDoos Large showing construction detail", "sort_order": 2},
        # KoosDoos XL
        {"product_slug": "koosdoos-xl", "url": "/images/products/elephant-fire-1.jpg", "alt": "KoosDoos XL fire pit with roaring flames", "sort_order": 1},
        {"product_slug": "koosdoos-xl", "url": "/images/products/elephant-fire-3.jpg", "alt": "KoosDoos XL top-down view", "sort_order": 2},
        # KoosDoos Personalised
        {"product_slug": "koosdoos-personalised", "url": "/images/products/elephant-fire-2.jpg", "alt": "KoosDoos Personalised fire pit with custom design", "sort_order": 1},
        {"product_slug": "koosdoos-personalised", "url": "/images/products/elephant-fire-1.jpg", "alt": "Example of personalised laser-cut design", "sort_order": 2},
    ]

    count = 0
    for data in images_data:
        product = products[data.pop("product_slug")]
        image = ProductImage(product_id=product.id, **data)
        db.add(image)
        count += 1

    db.commit()
    print(f"  Created {count} product images.")


def seed_reviews(db: Session, products: dict[str, Product]):
    """Seed review summaries."""
    print("Seeding review summaries...")

    reviews_data = [
        {"product_slug": "koosdoos-small", "rating_avg": 4.7, "rating_count": 89},
        {"product_slug": "koosdoos-medium", "rating_avg": 4.9, "rating_count": 234},
        {"product_slug": "koosdoos-large", "rating_avg": 4.8, "rating_count": 156},
        {"product_slug": "koosdoos-xl", "rating_avg": 4.9, "rating_count": 67},
        {"product_slug": "koosdoos-personalised", "rating_avg": 5.0, "rating_count": 23},
    ]

    count = 0
    for data in reviews_data:
        product = products[data.pop("product_slug")]
        review = ReviewSummary(product_id=product.id, **data)
        db.add(review)
        count += 1

    db.commit()
    print(f"  Created {count} review summaries.")


def seed_collections(db: Session, products: dict[str, Product]) -> dict[str, Collection]:
    """Seed collections and return a mapping of slug to Collection."""
    print("Seeding collections...")

    collections_data = [
        {
            "slug": "fire-pits",
            "title": "Fire Pits",
            "hero_copy": "Premium laser-cut steel fire pits. Flat-pack design. Rugged construction. Not for sissies.",
            "product_slugs": list(products.keys()),  # All products
        },
        {
            "slug": "best-sellers",
            "title": "Best Sellers",
            "hero_copy": "Our most-loved fire pits. Tried, tested, and loved by real braai enthusiasts.",
            "product_slugs": ["koosdoos-medium"],  # Products with best-seller badge
        },
        {
            "slug": "new-arrivals",
            "title": "New Arrivals",
            "hero_copy": "Fresh off the laser cutter. The latest additions to the KoosDoos family.",
            "product_slugs": ["koosdoos-small", "koosdoos-personalised"],  # Products with new badge
        },
        {
            "slug": "personalised",
            "title": "Personalised",
            "hero_copy": "Create your own unique fire pit with custom designs or choose from our templates.",
            "product_slugs": ["koosdoos-personalised"],
        },
    ]

    collections = {}
    for data in collections_data:
        product_slugs = data.pop("product_slugs")
        collection = Collection(**data)
        db.add(collection)
        db.flush()  # Get the ID

        # Add products to collection
        for slug in product_slugs:
            if slug in products:
                collection.products.append(products[slug])

        collections[data["slug"]] = collection

    db.commit()
    print(f"  Created {len(collections)} collections.")
    return collections


def seed_promo_blocks(db: Session, collections: dict[str, Collection]):
    """Seed promotional blocks for collections."""
    print("Seeding promo blocks...")

    promo_data = [
        {
            "collection_slug": "fire-pits",
            "position_index": 2,
            "title": "Flat-Pack Fire",
            "copy": "All our fire pits ship flat and assemble in minutes. No tools. No fuss. Just fire.",
            "cta_text": "See How It Works",
            "cta_url": "/pages/assembly",
            "image_url": None,
        },
        {
            "collection_slug": "fire-pits",
            "position_index": 5,
            "title": "Make It Yours",
            "copy": "Upload your own design or choose from our templates. Create a fire pit that's uniquely yours.",
            "cta_text": "Personalise Now",
            "cta_url": "/personalise",
            "image_url": None,
        },
        {
            "collection_slug": "best-sellers",
            "position_index": 1,
            "title": "Why We're #1",
            "copy": "Quality steel. Expert craftsmanship. Real South African fire pits loved by thousands.",
            "cta_text": "Read Reviews",
            "cta_url": "/reviews",
            "image_url": None,
        },
    ]

    count = 0
    for data in promo_data:
        collection = collections.get(data.pop("collection_slug"))
        if collection:
            promo = PromoBlock(collection_id=collection.id, **data)
            db.add(promo)
            count += 1

    db.commit()
    print(f"  Created {count} promo blocks.")


def seed_design_templates(db: Session):
    """Seed design templates for personalisation."""
    print("Seeding design templates...")

    templates_data = [
        # Wildlife
        {"name": "Springbok", "category": DesignCategory.WILDLIFE, "thumbnail": "/images/templates/springbok.svg", "svg_path": "/images/templates/springbok.svg"},
        {"name": "Elephant", "category": DesignCategory.WILDLIFE, "thumbnail": "/images/templates/elephant.svg", "svg_path": "/images/templates/elephant.svg"},
        {"name": "Lion", "category": DesignCategory.WILDLIFE, "thumbnail": "/images/templates/lion.svg", "svg_path": "/images/templates/lion.svg"},
        {"name": "Rhino", "category": DesignCategory.WILDLIFE, "thumbnail": "/images/templates/rhino.svg", "svg_path": "/images/templates/rhino.svg"},
        # Nature
        {"name": "Protea", "category": DesignCategory.NATURE, "thumbnail": "/images/templates/protea.svg", "svg_path": "/images/templates/protea.svg"},
        {"name": "Baobab Tree", "category": DesignCategory.NATURE, "thumbnail": "/images/templates/baobab.svg", "svg_path": "/images/templates/baobab.svg"},
        {"name": "Aloe", "category": DesignCategory.NATURE, "thumbnail": "/images/templates/aloe.svg", "svg_path": "/images/templates/aloe.svg"},
        # Sports
        {"name": "Rugby Ball", "category": DesignCategory.SPORTS, "thumbnail": "/images/templates/rugby.svg", "svg_path": "/images/templates/rugby.svg"},
        {"name": "Soccer Ball", "category": DesignCategory.SPORTS, "thumbnail": "/images/templates/soccer.svg", "svg_path": "/images/templates/soccer.svg"},
        {"name": "Golf Club", "category": DesignCategory.SPORTS, "thumbnail": "/images/templates/golf.svg", "svg_path": "/images/templates/golf.svg"},
        # Custom
        {"name": "Family Crest Frame", "category": DesignCategory.CUSTOM, "thumbnail": "/images/templates/crest.svg", "svg_path": "/images/templates/crest.svg"},
        {"name": "Business Logo Frame", "category": DesignCategory.CUSTOM, "thumbnail": "/images/templates/logo-frame.svg", "svg_path": "/images/templates/logo-frame.svg"},
        # Patterns
        {"name": "African Geometric", "category": DesignCategory.PATTERNS, "thumbnail": "/images/templates/african-geo.svg", "svg_path": "/images/templates/african-geo.svg"},
        {"name": "Flame Pattern", "category": DesignCategory.PATTERNS, "thumbnail": "/images/templates/flames.svg", "svg_path": "/images/templates/flames.svg"},
        {"name": "Ndebele", "category": DesignCategory.PATTERNS, "thumbnail": "/images/templates/ndebele.svg", "svg_path": "/images/templates/ndebele.svg"},
    ]

    count = 0
    for data in templates_data:
        template = DesignTemplate(**data)
        db.add(template)
        count += 1

    db.commit()
    print(f"  Created {count} design templates.")


def run_seed(reset: bool = False):
    """Run the database seeding."""
    print("\n" + "=" * 50)
    print("KoosDoos Fire Pits - Database Seeding")
    print("=" * 50 + "\n")

    db = SessionLocal()

    try:
        if reset:
            clear_database(db)

        # Seed in order of dependencies
        products = seed_products(db)
        seed_variants(db, products)
        seed_images(db, products)
        seed_reviews(db, products)
        collections = seed_collections(db, products)
        seed_promo_blocks(db, collections)
        seed_design_templates(db)

        print("\n" + "=" * 50)
        print("Seeding complete!")
        print("=" * 50 + "\n")

        # Print summary
        print("Summary:")
        print(f"  - Products: {len(products)}")
        print(f"  - Collections: {len(collections)}")
        print(f"  - Design Templates: 15")
        print("")

    except Exception as e:
        print(f"\nError during seeding: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed the KoosDoos database")
    parser.add_argument(
        "--reset",
        action="store_true",
        help="Clear existing data before seeding"
    )
    args = parser.parse_args()

    run_seed(reset=args.reset)
