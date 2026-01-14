"""Design template and custom design order models."""
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from ..core.database import Base


class DesignCategory(enum.Enum):
    """Design template category enumeration."""
    WILDLIFE = "wildlife"
    NATURE = "nature"
    SPORTS = "sports"
    CUSTOM = "custom"
    PATTERNS = "patterns"


class CustomDesignStatus(enum.Enum):
    """Custom design order status enumeration."""
    PENDING = "pending"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    IN_PRODUCTION = "in_production"


class DesignTemplate(Base):
    """Pre-made design template for personalisation."""
    __tablename__ = "design_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    category = Column(Enum(DesignCategory), nullable=False)
    thumbnail = Column(String(500), nullable=True)  # URL to thumbnail image
    svg_path = Column(String(500), nullable=True)  # URL to SVG file


class CustomDesignOrder(Base):
    """Custom design order for personalised fire pits."""
    __tablename__ = "custom_design_orders"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    design_file_url = Column(String(500), nullable=True)  # URL to uploaded design file
    status = Column(Enum(CustomDesignStatus), default=CustomDesignStatus.PENDING, nullable=False)
    approved_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    notes = Column(String(1000), nullable=True)  # Admin notes

    # Relationships
    order = relationship("Order", back_populates="custom_design_orders")
