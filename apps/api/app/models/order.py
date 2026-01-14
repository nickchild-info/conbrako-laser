"""Order and order item models."""
from sqlalchemy import Column, Integer, String, Text, Numeric, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from ..core.database import Base


class OrderStatus(enum.Enum):
    """Order status enumeration."""
    PENDING = "pending"
    PAID = "paid"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"


class Order(Base):
    """Order model for customer purchases."""
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    stripe_session_id = Column(String(255), unique=True, nullable=True, index=True)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING, nullable=False)
    customer_email = Column(String(255), nullable=False, index=True)
    total = Column(Numeric(10, 2), nullable=False)
    shipping_address = Column(Text, nullable=True)  # JSON-encoded address
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    custom_design_orders = relationship("CustomDesignOrder", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    """Individual item within an order."""
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    variant_id = Column(Integer, ForeignKey("variants.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    price = Column(Numeric(10, 2), nullable=False)  # Price at time of purchase

    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product")
    variant = relationship("Variant", back_populates="order_items")
