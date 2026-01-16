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
    payfast_payment_id = Column(String(255), unique=True, nullable=True, index=True)  # Payfast payment ID
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING, nullable=False)
    customer_email = Column(String(255), nullable=True, index=True)  # Made nullable for pending orders
    customer_name = Column(String(255), nullable=True)
    customer_phone = Column(String(50), nullable=True)
    total = Column(Numeric(10, 2), nullable=False)
    shipping_cost = Column(Numeric(10, 2), nullable=True, default=0)
    shipping_service = Column(String(50), nullable=True)  # standard, express, overnight
    shipping_address = Column(Text, nullable=True)  # JSON-encoded address
    waybill = Column(String(100), nullable=True, index=True)  # TCG waybill number
    tracking_url = Column(String(500), nullable=True)
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
