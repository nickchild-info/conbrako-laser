"""Tests for admin API endpoints."""
import pytest
from fastapi.testclient import TestClient
from decimal import Decimal

# Admin API key for testing
ADMIN_API_KEY = "koosdoos-admin-secret-key-change-in-production"
ADMIN_HEADERS = {"X-Admin-API-Key": ADMIN_API_KEY}


class TestAdminAuth:
    """Test admin authentication middleware."""

    def test_missing_api_key(self, client: TestClient):
        """Test that requests without API key are rejected."""
        response = client.get("/api/v1/admin/orders")
        assert response.status_code == 422  # Missing header validation

    def test_invalid_api_key(self, client: TestClient):
        """Test that requests with invalid API key are rejected."""
        response = client.get(
            "/api/v1/admin/orders",
            headers={"X-Admin-API-Key": "invalid-key"},
        )
        assert response.status_code == 401
        assert "Invalid admin API key" in response.json()["detail"]

    def test_valid_api_key(self, client: TestClient):
        """Test that requests with valid API key are accepted."""
        response = client.get("/api/v1/admin/orders", headers=ADMIN_HEADERS)
        assert response.status_code == 200


class TestProductAdmin:
    """Test product admin endpoints."""

    def test_create_product(self, client: TestClient):
        """Test creating a new product."""
        product_data = {
            "slug": "test-fire-pit",
            "title": "Test Fire Pit",
            "subtitle": "A test product",
            "description": "Test description",
            "badges": ["new"],
            "seats_min": 4,
            "seats_max": 6,
            "material": "Steel",
            "finish": "Matte Black",
            "variants": [
                {
                    "sku": "TEST-001",
                    "price": "1999.00",
                    "compare_at_price": "2499.00",
                    "inventory_qty": 10,
                    "weight": 15.5,
                    "dimensions_mm": "600x600x450",
                }
            ],
            "images": [
                {
                    "url": "https://example.com/image.jpg",
                    "alt": "Test image",
                    "sort_order": 0,
                }
            ],
            "review_summary": {
                "rating_avg": 4.5,
                "rating_count": 10,
            },
        }

        response = client.post(
            "/api/v1/admin/products",
            json=product_data,
            headers=ADMIN_HEADERS,
        )
        assert response.status_code == 201
        data = response.json()
        assert data["slug"] == "test-fire-pit"
        assert data["title"] == "Test Fire Pit"

    def test_create_product_duplicate_slug(self, client: TestClient, db_session):
        """Test that creating a product with duplicate slug fails."""
        from app.models.product import Product

        # Create existing product
        existing = Product(slug="existing-product", title="Existing Product")
        db_session.add(existing)
        db_session.commit()

        product_data = {
            "slug": "existing-product",
            "title": "New Product",
        }

        response = client.post(
            "/api/v1/admin/products",
            json=product_data,
            headers=ADMIN_HEADERS,
        )
        assert response.status_code == 409
        assert "already exists" in response.json()["detail"]

    def test_update_product(self, client: TestClient, db_session):
        """Test updating a product."""
        from app.models.product import Product

        product = Product(
            slug="update-me",
            title="Original Title",
            description="Original description",
        )
        db_session.add(product)
        db_session.commit()

        update_data = {
            "title": "Updated Title",
            "description": "Updated description",
        }

        response = client.put(
            f"/api/v1/admin/products/{product.id}",
            json=update_data,
            headers=ADMIN_HEADERS,
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Updated Title"

    def test_update_product_not_found(self, client: TestClient):
        """Test updating non-existent product."""
        response = client.put(
            "/api/v1/admin/products/99999",
            json={"title": "New Title"},
            headers=ADMIN_HEADERS,
        )
        assert response.status_code == 404

    def test_delete_product(self, client: TestClient, db_session):
        """Test deleting a product."""
        from app.models.product import Product

        product = Product(slug="delete-me", title="Delete Me")
        db_session.add(product)
        db_session.commit()
        product_id = product.id

        response = client.delete(
            f"/api/v1/admin/products/{product_id}",
            headers=ADMIN_HEADERS,
        )
        assert response.status_code == 200
        assert "deleted successfully" in response.json()["message"]

        # Verify product is deleted
        deleted = db_session.query(Product).filter(Product.id == product_id).first()
        assert deleted is None


class TestCollectionAdmin:
    """Test collection admin endpoints."""

    def test_create_collection(self, client: TestClient):
        """Test creating a new collection."""
        collection_data = {
            "slug": "test-collection",
            "title": "Test Collection",
            "hero_copy": "Test hero copy",
            "product_ids": [],
        }

        response = client.post(
            "/api/v1/admin/collections",
            json=collection_data,
            headers=ADMIN_HEADERS,
        )
        assert response.status_code == 201
        data = response.json()
        assert data["slug"] == "test-collection"

    def test_create_collection_with_products(self, client: TestClient, db_session):
        """Test creating a collection with products."""
        from app.models.product import Product

        # Create products first
        product1 = Product(slug="prod-1", title="Product 1")
        product2 = Product(slug="prod-2", title="Product 2")
        db_session.add_all([product1, product2])
        db_session.commit()

        collection_data = {
            "slug": "collection-with-products",
            "title": "Collection with Products",
            "product_ids": [product1.id, product2.id],
        }

        response = client.post(
            "/api/v1/admin/collections",
            json=collection_data,
            headers=ADMIN_HEADERS,
        )
        assert response.status_code == 201

    def test_update_collection(self, client: TestClient, db_session):
        """Test updating a collection."""
        from app.models.collection import Collection

        collection = Collection(
            slug="update-collection",
            title="Original Title",
        )
        db_session.add(collection)
        db_session.commit()

        response = client.put(
            f"/api/v1/admin/collections/{collection.id}",
            json={"title": "Updated Title"},
            headers=ADMIN_HEADERS,
        )
        assert response.status_code == 200
        assert response.json()["title"] == "Updated Title"

    def test_delete_collection(self, client: TestClient, db_session):
        """Test deleting a collection."""
        from app.models.collection import Collection

        collection = Collection(slug="delete-collection", title="Delete Me")
        db_session.add(collection)
        db_session.commit()
        collection_id = collection.id

        response = client.delete(
            f"/api/v1/admin/collections/{collection_id}",
            headers=ADMIN_HEADERS,
        )
        assert response.status_code == 200


class TestPromoBlockAdmin:
    """Test promo block admin endpoints."""

    def test_create_promo_block(self, client: TestClient, db_session):
        """Test creating a promo block."""
        from app.models.collection import Collection

        collection = Collection(slug="promo-collection", title="Promo Collection")
        db_session.add(collection)
        db_session.commit()

        promo_data = {
            "collection_id": collection.id,
            "position_index": 0,
            "title": "Test Promo",
            "copy": "Test promo copy",
            "cta_text": "Shop Now",
            "cta_url": "/collections/test",
            "image_url": "https://example.com/promo.jpg",
        }

        response = client.post(
            "/api/v1/admin/promo-blocks",
            json=promo_data,
            headers=ADMIN_HEADERS,
        )
        assert response.status_code == 201
        assert response.json()["title"] == "Test Promo"

    def test_update_promo_block(self, client: TestClient, db_session):
        """Test updating a promo block."""
        from app.models.collection import Collection, PromoBlock

        collection = Collection(slug="promo-update", title="Promo Update")
        db_session.add(collection)
        db_session.commit()

        promo = PromoBlock(
            collection_id=collection.id,
            title="Original Promo",
            position_index=0,
        )
        db_session.add(promo)
        db_session.commit()

        response = client.put(
            f"/api/v1/admin/promo-blocks/{promo.id}",
            json={"title": "Updated Promo"},
            headers=ADMIN_HEADERS,
        )
        assert response.status_code == 200
        assert response.json()["title"] == "Updated Promo"

    def test_delete_promo_block(self, client: TestClient, db_session):
        """Test deleting a promo block."""
        from app.models.collection import Collection, PromoBlock

        collection = Collection(slug="promo-delete", title="Promo Delete")
        db_session.add(collection)
        db_session.commit()

        promo = PromoBlock(
            collection_id=collection.id,
            title="Delete Me",
            position_index=0,
        )
        db_session.add(promo)
        db_session.commit()

        response = client.delete(
            f"/api/v1/admin/promo-blocks/{promo.id}",
            headers=ADMIN_HEADERS,
        )
        assert response.status_code == 200


class TestOrderAdmin:
    """Test order admin endpoints."""

    def test_list_orders_empty(self, client: TestClient):
        """Test listing orders when empty."""
        response = client.get("/api/v1/admin/orders", headers=ADMIN_HEADERS)
        assert response.status_code == 200
        data = response.json()
        assert data["orders"] == []
        assert data["total"] == 0

    def test_list_orders_with_data(self, client: TestClient, db_session):
        """Test listing orders with data."""
        from app.models.order import Order, OrderStatus
        from decimal import Decimal

        order = Order(
            customer_email="test@example.com",
            total=Decimal("1999.00"),
            status=OrderStatus.PENDING,
        )
        db_session.add(order)
        db_session.commit()

        response = client.get("/api/v1/admin/orders", headers=ADMIN_HEADERS)
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 1
        assert len(data["orders"]) == 1
        assert data["orders"][0]["customer_email"] == "test@example.com"

    def test_list_orders_filter_by_status(self, client: TestClient, db_session):
        """Test filtering orders by status."""
        from app.models.order import Order, OrderStatus
        from decimal import Decimal

        # Create orders with different statuses
        pending = Order(
            customer_email="pending@example.com",
            total=Decimal("1000.00"),
            status=OrderStatus.PENDING,
        )
        paid = Order(
            customer_email="paid@example.com",
            total=Decimal("2000.00"),
            status=OrderStatus.PAID,
        )
        db_session.add_all([pending, paid])
        db_session.commit()

        # Filter by pending status
        response = client.get(
            "/api/v1/admin/orders?status=pending",
            headers=ADMIN_HEADERS,
        )
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 1
        assert data["orders"][0]["customer_email"] == "pending@example.com"

    def test_update_order_status(self, client: TestClient, db_session):
        """Test updating order status."""
        from app.models.order import Order, OrderStatus
        from decimal import Decimal

        order = Order(
            customer_email="status@example.com",
            total=Decimal("1999.00"),
            status=OrderStatus.PENDING,
        )
        db_session.add(order)
        db_session.commit()

        response = client.put(
            f"/api/v1/admin/orders/{order.id}/status",
            json={"status": "paid"},
            headers=ADMIN_HEADERS,
        )
        assert response.status_code == 200
        assert response.json()["status"] == "paid"

    def test_update_order_status_invalid_transition(self, client: TestClient, db_session):
        """Test invalid status transition."""
        from app.models.order import Order, OrderStatus
        from decimal import Decimal

        order = Order(
            customer_email="invalid@example.com",
            total=Decimal("1999.00"),
            status=OrderStatus.PENDING,
        )
        db_session.add(order)
        db_session.commit()

        # Try to go from pending to shipped (invalid)
        response = client.put(
            f"/api/v1/admin/orders/{order.id}/status",
            json={"status": "shipped"},
            headers=ADMIN_HEADERS,
        )
        assert response.status_code == 400
        assert "Invalid status transition" in response.json()["detail"]

    def test_get_order_detail(self, client: TestClient, db_session):
        """Test getting order detail."""
        from app.models.order import Order, OrderStatus
        from decimal import Decimal

        order = Order(
            customer_email="detail@example.com",
            total=Decimal("1999.00"),
            status=OrderStatus.PENDING,
            shipping_address='{"city": "Pretoria"}',
        )
        db_session.add(order)
        db_session.commit()

        response = client.get(
            f"/api/v1/admin/orders/{order.id}",
            headers=ADMIN_HEADERS,
        )
        assert response.status_code == 200
        data = response.json()
        assert data["customer_email"] == "detail@example.com"
        assert data["shipping_address"] == '{"city": "Pretoria"}'


class TestVariantAdmin:
    """Test variant admin endpoints."""

    def test_add_variant_to_product(self, client: TestClient, db_session):
        """Test adding a variant to a product."""
        from app.models.product import Product

        product = Product(slug="variant-product", title="Variant Product")
        db_session.add(product)
        db_session.commit()

        variant_data = {
            "sku": "NEW-VARIANT-001",
            "price": "2999.00",
            "inventory_qty": 5,
        }

        response = client.post(
            f"/api/v1/admin/products/{product.id}/variants",
            json=variant_data,
            headers=ADMIN_HEADERS,
        )
        assert response.status_code == 201
        assert "added successfully" in response.json()["message"]

    def test_update_variant(self, client: TestClient, db_session):
        """Test updating a variant."""
        from app.models.product import Product, Variant
        from decimal import Decimal

        product = Product(slug="variant-update-product", title="Variant Update")
        db_session.add(product)
        db_session.commit()

        variant = Variant(
            product_id=product.id,
            sku="UPDATE-VAR-001",
            price=Decimal("1999.00"),
            inventory_qty=10,
        )
        db_session.add(variant)
        db_session.commit()

        response = client.put(
            f"/api/v1/admin/variants/{variant.id}",
            json={"price": "2499.00", "inventory_qty": 20},
            headers=ADMIN_HEADERS,
        )
        assert response.status_code == 200

    def test_delete_variant(self, client: TestClient, db_session):
        """Test deleting a variant."""
        from app.models.product import Product, Variant
        from decimal import Decimal

        product = Product(slug="variant-delete-product", title="Variant Delete")
        db_session.add(product)
        db_session.commit()

        variant = Variant(
            product_id=product.id,
            sku="DELETE-VAR-001",
            price=Decimal("1999.00"),
            inventory_qty=10,
        )
        db_session.add(variant)
        db_session.commit()

        response = client.delete(
            f"/api/v1/admin/variants/{variant.id}",
            headers=ADMIN_HEADERS,
        )
        assert response.status_code == 200


class TestImageAdmin:
    """Test image admin endpoints."""

    def test_add_image_to_product(self, client: TestClient, db_session):
        """Test adding an image to a product."""
        from app.models.product import Product

        product = Product(slug="image-product", title="Image Product")
        db_session.add(product)
        db_session.commit()

        image_data = {
            "url": "https://example.com/new-image.jpg",
            "alt": "New image",
            "sort_order": 0,
        }

        response = client.post(
            f"/api/v1/admin/products/{product.id}/images",
            json=image_data,
            headers=ADMIN_HEADERS,
        )
        assert response.status_code == 201

    def test_delete_image(self, client: TestClient, db_session):
        """Test deleting an image."""
        from app.models.product import Product, ProductImage

        product = Product(slug="image-delete-product", title="Image Delete")
        db_session.add(product)
        db_session.commit()

        image = ProductImage(
            product_id=product.id,
            url="https://example.com/delete-me.jpg",
            alt="Delete me",
        )
        db_session.add(image)
        db_session.commit()

        response = client.delete(
            f"/api/v1/admin/images/{image.id}",
            headers=ADMIN_HEADERS,
        )
        assert response.status_code == 200
