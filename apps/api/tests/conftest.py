"""Test configuration and fixtures for API tests."""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.database import Base, get_db


# Create an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override the database dependency for tests."""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function")
def db_session():
    """Create database tables and provide a session for each test."""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Provide a test client with database session."""
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def sample_product_data():
    """Sample product data for testing."""
    return {
        "id": 1,
        "slug": "koosdoos-small",
        "title": "KoosDoos Small",
        "subtitle": "Compact & portable",
        "description": "The perfect starter fire pit.",
        "badges": ["new"],
        "seats_min": 2,
        "seats_max": 3,
        "material": "2.5mm Mild Steel",
        "finish": "Raw Steel",
    }


@pytest.fixture
def sample_variant_data():
    """Sample variant data for testing."""
    return {
        "id": 1,
        "product_id": 1,
        "sku": "KDS-SM",
        "price": 1299.00,
        "compare_at_price": None,
        "inventory_qty": 25,
        "weight": 8.0,
        "dimensions_mm": "300x350x300",
    }


@pytest.fixture
def sample_collection_data():
    """Sample collection data for testing."""
    return {
        "id": 1,
        "slug": "fire-pits",
        "title": "Fire Pits",
        "hero_copy": "Premium steel fire pits for your backyard",
    }


@pytest.fixture
def sample_cart_item():
    """Sample cart item for testing."""
    return {
        "product_id": 1,
        "variant_id": 1,
        "quantity": 2,
    }
