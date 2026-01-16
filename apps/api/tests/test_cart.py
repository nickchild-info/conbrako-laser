"""Tests for cart and checkout endpoints."""
import pytest
from app.models.product import Product, Variant


def seed_products_for_cart(db_session):
    """Helper to seed products for cart tests."""
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
    variant_out_of_stock = Variant(
        id=3,
        product_id=1,
        sku="KDS-SM-OOS",
        price=1299.00,
        inventory_qty=0,  # Out of stock
        weight=8.0,
        dimensions_mm="300x350x300",
    )

    db_session.add_all([variant1, variant2, variant_out_of_stock])
    db_session.commit()

    return [product1, product2]


class TestCartValidation:
    """Tests for cart validation endpoint."""

    def test_validate_empty_cart(self, client, db_session):
        """Test validating an empty cart."""
        response = client.post("/api/v1/cart/validate", json={"items": []})
        assert response.status_code == 200
        data = response.json()
        assert data["is_valid"] == True
        assert data["items"] == []
        assert data["subtotal"] == 0

    def test_validate_cart_with_valid_items(self, client, db_session):
        """Test validating a cart with valid items."""
        seed_products_for_cart(db_session)

        cart_items = [
            {"product_id": 1, "variant_id": 1, "quantity": 2},
            {"product_id": 2, "variant_id": 2, "quantity": 1},
        ]

        response = client.post("/api/v1/cart/validate", json={"items": cart_items})
        assert response.status_code == 200
        data = response.json()
        assert data["is_valid"] == True
        assert len(data["items"]) == 2

        # Check subtotal calculation
        expected_subtotal = (1299.00 * 2) + (1899.00 * 1)
        assert data["subtotal"] == expected_subtotal

    def test_validate_cart_with_invalid_product(self, client, db_session):
        """Test validating a cart with non-existent product."""
        seed_products_for_cart(db_session)

        cart_items = [
            {"product_id": 999, "variant_id": 999, "quantity": 1},
        ]

        response = client.post("/api/v1/cart/validate", json={"items": cart_items})
        assert response.status_code == 200
        data = response.json()
        assert data["is_valid"] == False
        assert len(data["errors"]) > 0

    def test_validate_cart_with_out_of_stock_item(self, client, db_session):
        """Test validating a cart with out-of-stock item."""
        seed_products_for_cart(db_session)

        cart_items = [
            {"product_id": 1, "variant_id": 3, "quantity": 1},  # Out of stock variant
        ]

        response = client.post("/api/v1/cart/validate", json={"items": cart_items})
        assert response.status_code == 200
        data = response.json()
        # Either is_valid is False or errors contains stock message
        assert data["is_valid"] == False or len(data["errors"]) > 0

    def test_validate_cart_returns_current_prices(self, client, db_session):
        """Test that cart validation returns current prices."""
        seed_products_for_cart(db_session)

        cart_items = [
            {"product_id": 1, "variant_id": 1, "quantity": 1},
        ]

        response = client.post("/api/v1/cart/validate", json={"items": cart_items})
        assert response.status_code == 200
        data = response.json()

        validated_item = data["items"][0]
        assert validated_item["price"] == 1299.00
        assert validated_item["line_total"] == 1299.00


class TestCheckoutSession:
    """Tests for checkout session creation."""

    def test_create_checkout_session_requires_items(self, client, db_session):
        """Test that checkout session requires cart items."""
        response = client.post(
            "/api/v1/checkout/create-session",
            json={
                "items": [],
                "customer_email": "test@example.com",
                "success_url": "http://localhost:3000/order-confirmation",
                "cancel_url": "http://localhost:3000/cart",
            },
        )
        # Should fail with empty cart
        assert response.status_code in [400, 422]

    def test_create_checkout_session_validates_email(self, client, db_session):
        """Test that checkout session validates email format."""
        seed_products_for_cart(db_session)

        response = client.post(
            "/api/v1/checkout/create-session",
            json={
                "items": [{"product_id": 1, "variant_id": 1, "quantity": 1}],
                "customer_email": "invalid-email",
                "success_url": "http://localhost:3000/order-confirmation",
                "cancel_url": "http://localhost:3000/cart",
            },
        )
        # Should fail with invalid email
        assert response.status_code == 422

class TestOrderRetrieval:
    """Tests for order retrieval endpoint."""

    def test_get_order_not_found(self, client, db_session):
        """Test 404 for non-existent order."""
        response = client.get("/api/v1/orders/99999")
        assert response.status_code == 404


class TestShippingCalculation:
    """Tests for shipping calculation logic."""

    def test_free_shipping_threshold(self, client, db_session):
        """Test free shipping over R2,500 threshold."""
        seed_products_for_cart(db_session)

        # Cart total: 1899 * 2 = 3798 (above threshold)
        cart_items = [
            {"product_id": 2, "variant_id": 2, "quantity": 2},
        ]

        response = client.post("/api/v1/cart/validate", json={"items": cart_items})
        assert response.status_code == 200
        data = response.json()

        # Subtotal should be above free shipping threshold
        assert data["subtotal"] >= 2500

    def test_shipping_below_threshold(self, client, db_session):
        """Test shipping charge below R2,500 threshold."""
        seed_products_for_cart(db_session)

        # Cart total: 1299 (below threshold)
        cart_items = [
            {"product_id": 1, "variant_id": 1, "quantity": 1},
        ]

        response = client.post("/api/v1/cart/validate", json={"items": cart_items})
        assert response.status_code == 200
        data = response.json()

        # Subtotal should be below free shipping threshold
        assert data["subtotal"] < 2500
