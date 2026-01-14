"""Product and related models."""
from sqlalchemy import Column, Integer, String, Text, Numeric, ForeignKey, Table, Float
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from ..core.database import Base


# Many-to-many association table for Collection <-> Product
collection_product = Table(
    "collection_product",
    Base.metadata,
    Column("collection_id", Integer, ForeignKey("collections.id"), primary_key=True),
    Column("product_id", Integer, ForeignKey("products.id"), primary_key=True),
)


class Product(Base):
    """Product model for fire pits."""
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    title = Column(String(255), nullable=False)
    subtitle = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    badges = Column(ARRAY(String), nullable=True)  # e.g., ["bestseller", "new"]
    seats_min = Column(Integer, nullable=True)
    seats_max = Column(Integer, nullable=True)
    material = Column(String(100), nullable=True)
    finish = Column(String(100), nullable=True)

    # Relationships
    variants = relationship("Variant", back_populates="product", cascade="all, delete-orphan")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan", order_by="ProductImage.sort_order")
    review_summary = relationship("ReviewSummary", back_populates="product", uselist=False, cascade="all, delete-orphan")
    collections = relationship("Collection", secondary=collection_product, back_populates="products")


class Variant(Base):
    """Product variant model (sizes, configurations)."""
    __tablename__ = "variants"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    sku = Column(String(100), unique=True, nullable=False, index=True)
    price = Column(Numeric(10, 2), nullable=False)  # Price in ZAR
    compare_at_price = Column(Numeric(10, 2), nullable=True)  # Original price for sales
    inventory_qty = Column(Integer, default=0)
    weight = Column(Float, nullable=True)  # Weight in kg
    dimensions_mm = Column(String(100), nullable=True)  # e.g., "600x600x450"

    # Relationships
    product = relationship("Product", back_populates="variants")
    order_items = relationship("OrderItem", back_populates="variant")


class ProductImage(Base):
    """Product image model."""
    __tablename__ = "product_images"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    url = Column(String(500), nullable=False)
    alt = Column(String(255), nullable=True)
    sort_order = Column(Integer, default=0)

    # Relationships
    product = relationship("Product", back_populates="images")


class ReviewSummary(Base):
    """Aggregated review summary for a product."""
    __tablename__ = "review_summaries"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), unique=True, nullable=False)
    rating_avg = Column(Float, nullable=False, default=0.0)
    rating_count = Column(Integer, nullable=False, default=0)

    # Relationships
    product = relationship("Product", back_populates="review_summary")
