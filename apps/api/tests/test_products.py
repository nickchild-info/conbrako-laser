"""Tests for product endpoints."""
import pytest
from app.models.product import Product, Variant, ProductImage, ReviewSummary


def seed_test_products(db_session):
    """Helper to seed test products."""
    # Create products
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

    # Create variants
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

    # Create images
    image1 = ProductImage(
        id=1,
        product_id=1,
        url="/images/products/elephant-fire-1.jpg",
        alt="KoosDoos Small fire pit",
        sort_order=1,
    )
    image2 = ProductImage(
        id=2,
        product_id=2,
        url="/images/products/rhino-fire-1.jpg",
        alt="KoosDoos Medium fire pit",
        sort_order=1,
    )

    db_session.add_all([image1, image2])
    db_session.commit()

    # Create review summaries
    review1 = ReviewSummary(
        id=1,
        product_id=1,
        rating_avg=4.7,
        rating_count=89,
    )
    review2 = ReviewSummary(
        id=2,
        product_id=2,
        rating_avg=4.9,
        rating_count=156,
    )

    db_session.add_all([review1, review2])
    db_session.commit()

    return [product1, product2]


class TestProductList:
    """Tests for product list endpoint."""

    def test_list_products_empty(self, client, db_session):
        """Test listing products when database is empty."""
        response = client.get("/api/v1/products")
        assert response.status_code == 200
        data = response.json()
        assert data["products"] == []
        assert data["total"] == 0
        assert data["page"] == 1

    def test_list_products_with_data(self, client, db_session):
        """Test listing products with seeded data."""
        seed_test_products(db_session)

        response = client.get("/api/v1/products")
        assert response.status_code == 200
        data = response.json()
        assert len(data["products"]) == 2
        assert data["total"] == 2

    def test_list_products_pagination(self, client, db_session):
        """Test product pagination."""
        seed_test_products(db_session)

        # Page 1 with 1 item per page
        response = client.get("/api/v1/products?page=1&per_page=1")
        assert response.status_code == 200
        data = response.json()
        assert len(data["products"]) == 1
        assert data["total"] == 2
        assert data["total_pages"] == 2

    def test_list_products_sort_price_asc(self, client, db_session):
        """Test sorting products by price ascending."""
        seed_test_products(db_session)

        response = client.get("/api/v1/products?sort=price_asc")
        assert response.status_code == 200
        data = response.json()
        products = data["products"]
        assert len(products) == 2
        # Small (1299) should come before Medium (1899)
        assert products[0]["slug"] == "koosdoos-small"

    def test_list_products_sort_price_desc(self, client, db_session):
        """Test sorting products by price descending."""
        seed_test_products(db_session)

        response = client.get("/api/v1/products?sort=price_desc")
        assert response.status_code == 200
        data = response.json()
        products = data["products"]
        # Medium (1899) should come before Small (1299)
        assert products[0]["slug"] == "koosdoos-medium"

    def test_list_products_filter_by_price(self, client, db_session):
        """Test filtering products by price range."""
        seed_test_products(db_session)

        # Filter for products under R1500
        response = client.get("/api/v1/products?max_price=1500")
        assert response.status_code == 200
        data = response.json()
        assert len(data["products"]) == 1
        assert data["products"][0]["slug"] == "koosdoos-small"


class TestProductDetail:
    """Tests for product detail endpoint."""

    def test_get_product_by_slug(self, client, db_session):
        """Test getting a product by its slug."""
        seed_test_products(db_session)

        response = client.get("/api/v1/products/koosdoos-small")
        assert response.status_code == 200
        data = response.json()
        assert data["slug"] == "koosdoos-small"
        assert data["title"] == "KoosDoos Small"
        assert "variants" in data
        assert "images" in data

    def test_get_product_not_found(self, client, db_session):
        """Test 404 for non-existent product."""
        response = client.get("/api/v1/products/nonexistent-product")
        assert response.status_code == 404

    def test_product_includes_variants(self, client, db_session):
        """Test that product detail includes variants."""
        seed_test_products(db_session)

        response = client.get("/api/v1/products/koosdoos-small")
        assert response.status_code == 200
        data = response.json()
        assert len(data["variants"]) >= 1
        assert data["variants"][0]["sku"] == "KDS-SM"
        assert data["variants"][0]["price"] == 1299.00

    def test_product_includes_images(self, client, db_session):
        """Test that product detail includes images."""
        seed_test_products(db_session)

        response = client.get("/api/v1/products/koosdoos-medium")
        assert response.status_code == 200
        data = response.json()
        assert len(data["images"]) >= 1
        assert "url" in data["images"][0]
        assert "alt" in data["images"][0]

    def test_product_includes_review_summary(self, client, db_session):
        """Test that product detail includes review summary."""
        seed_test_products(db_session)

        response = client.get("/api/v1/products/koosdoos-small")
        assert response.status_code == 200
        data = response.json()
        assert "review_summary" in data
        assert data["review_summary"]["rating_avg"] == 4.7
        assert data["review_summary"]["rating_count"] == 89
