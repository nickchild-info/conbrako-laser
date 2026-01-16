"""Initialize the database with all tables."""
import sys
import os

# Add app to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import Base, engine
from app.core.config import get_settings

# Import all models to register them
from app.models import (
    Product, Variant, ProductImage, ReviewSummary,
    Collection, PromoBlock,
    Order, OrderItem,
    DesignTemplate, CustomDesignOrder,
)

def init_db():
    """Create all database tables."""
    settings = get_settings()
    print(f"Initializing database: {settings.database_url}")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db()
