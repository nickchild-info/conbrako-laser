"""Tests for collection endpoints."""
import pytest
from app.models.product import Product, Variant, collection_product
from app.models.collection import Collection, PromoBlock


def seed_test_collections(db_session):
    """Helper to seed test collections with products."""
    # Create products first
    product1 = Product(
        id=1,
        slug="koosdoos-small",
        title="KoosDoos Small",
        subtitle="Compact & portable",
        description="The perfect starter fire pit.",
        badges=["new"],
        seats_min=2,
        seats_max=3,
        material="2.5mm Mild Steel",
        finish="Raw Steel",
    )
    product2 = Product(
        id=2,
        slug="koosdoos-medium",
        title="KoosDoos Medium",
        subtitle="Perfect for 4-6 people",
        description="The popular mid-size fire pit.",
        badges=["best-seller"],
        seats_min=4,
        seats_max=6,
        material="3mm Mild Steel",
        finish="Raw Steel",
    )

    db_session.add_all([product1, product2])
    db_session.commit()

    # Create variants for products
    variant1 = Variant(
        id=1,
        product_id=1,
        sku="KDS-SM",
        price=1299.00,
        inventory_qty=25,
        weight=8.0,
        dimensions_mm="300x350x300",
    )
    variant2 = Variant(
        id=2,
        product_id=2,
        sku="KDS-MD",
        price=1899.00,
        inventory_qty=30,
        weight=12.0,
        dimensions_mm="450x400x450",
    )

    db_session.add_all([variant1, variant2])
    db_session.commit()

    # Create collections
    collection1 = Collection(
        id=1,
        slug="fire-pits",
        title="Fire Pits",
        hero_copy="Premium steel fire pits for your backyard",
    )
    collection2 = Collection(
        id=2,
        slug="best-sellers",
        title="Best Sellers",
        hero_copy="Our most popular fire pits",
    )

    # Add products to collections
    collection1.products = [product1, product2]
    collection2.products = [product2]  # Only medium is best seller

    db_session.add_all([collection1, collection2])
    db_session.commit()

    # Create promo blocks
    promo1 = PromoBlock(
        id=1,
        collection_id=1,
        position_index=2,
        title="Custom Designs",
        copy="Make it your own with laser-cut personalisation",
        cta_text="Start Designing",
        cta_url="/personalise",
        image_url="/images/promo/custom-design.jpg",
    )

    db_session.add(promo1)
    db_session.commit()

    return [collection1, collection2]


class TestCollectionList:
    """Tests for collection list endpoint."""

    def test_list_collections_empty(self, client, db_session):
        """Test listing collections when database is empty."""
        response = client.get("/api/v1/collections")
        assert response.status_code == 200
        data = response.json()
        assert data["collections"] == []
        assert data["total"] == 0

    def test_list_collections_with_data(self, client, db_session):
        """Test listing collections with seeded data."""
        seed_test_collections(db_session)

        response = client.get("/api/v1/collections")
        assert response.status_code == 200
        data = response.json()
        assert len(data["collections"]) == 2
        assert data["total"] == 2

    def test_collection_list_includes_basic_info(self, client, db_session):
        """Test that collection list includes basic info."""
        seed_test_collections(db_session)

        response = client.get("/api/v1/collections")
        assert response.status_code == 200
        data = response.json()

        collection = data["collections"][0]
        assert "id" in collection
        assert "slug" in collection
        assert "title" in collection
        assert "hero_copy" in collection


class TestCollectionDetail:
    """Tests for collection detail endpoint."""

    def test_get_collection_by_slug(self, client, db_session):
        """Test getting a collection by its slug."""
        seed_test_collections(db_session)

        response = client.get("/api/v1/collections/fire-pits")
        assert response.status_code == 200
        data = response.json()
        assert data["slug"] == "fire-pits"
        assert data["title"] == "Fire Pits"
        assert "products" in data

    def test_get_collection_not_found(self, client, db_session):
        """Test 404 for non-existent collection."""
        response = client.get("/api/v1/collections/nonexistent-collection")
        assert response.status_code == 404

    def test_collection_includes_products(self, client, db_session):
        """Test that collection detail includes products."""
        seed_test_collections(db_session)

        response = client.get("/api/v1/collections/fire-pits")
        assert response.status_code == 200
        data = response.json()
        assert len(data["products"]) == 2

        # Check product structure
        product = data["products"][0]
        assert "id" in product
        assert "slug" in product
        assert "title" in product
        assert "variants" in product

    def test_collection_includes_promo_blocks(self, client, db_session):
        """Test that collection detail includes promo blocks."""
        seed_test_collections(db_session)

        response = client.get("/api/v1/collections/fire-pits")
        assert response.status_code == 200
        data = response.json()
        assert "promo_blocks" in data
        assert len(data["promo_blocks"]) == 1

        promo = data["promo_blocks"][0]
        assert promo["title"] == "Custom Designs"
        assert promo["cta_text"] == "Start Designing"
        assert promo["cta_url"] == "/personalise"

    def test_best_sellers_collection(self, client, db_session):
        """Test best sellers collection only has best seller products."""
        seed_test_collections(db_session)

        response = client.get("/api/v1/collections/best-sellers")
        assert response.status_code == 200
        data = response.json()
        assert len(data["products"]) == 1
        assert data["products"][0]["slug"] == "koosdoos-medium"
