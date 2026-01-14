"""Collection and promo block models."""
from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from ..core.database import Base
from .product import collection_product


class Collection(Base):
    """Collection model for grouping products."""
    __tablename__ = "collections"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    title = Column(String(255), nullable=False)
    hero_copy = Column(Text, nullable=True)

    # Relationships
    products = relationship("Product", secondary=collection_product, back_populates="collections")
    promo_blocks = relationship("PromoBlock", back_populates="collection", cascade="all, delete-orphan")


class PromoBlock(Base):
    """Promotional block within a collection."""
    __tablename__ = "promo_blocks"

    id = Column(Integer, primary_key=True, index=True)
    collection_id = Column(Integer, ForeignKey("collections.id"), nullable=False)
    position_index = Column(Integer, nullable=False, default=0)  # Position in grid
    title = Column(String(255), nullable=False)
    copy = Column(Text, nullable=True)
    cta_text = Column(String(100), nullable=True)
    cta_url = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=True)

    # Relationships
    collection = relationship("Collection", back_populates="promo_blocks")
