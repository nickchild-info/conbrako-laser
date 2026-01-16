"""Pydantic schemas for admin API endpoints."""
from pydantic import BaseModel, Field
from decimal import Decimal
from datetime import datetime
from typing import Optional
from ..models.order import OrderStatus


# ============================================
# Product Admin Schemas
# ============================================

class VariantCreate(BaseModel):
    """Schema for creating a new variant."""
    sku: str = Field(..., min_length=1, max_length=100)
    price: Decimal = Field(..., gt=0)
    compare_at_price: Optional[Decimal] = None
    inventory_qty: int = Field(default=0, ge=0)
    weight: Optional[float] = None
    dimensions_mm: Optional[str] = None


class VariantUpdate(BaseModel):
    """Schema for updating a variant."""
    sku: Optional[str] = Field(None, min_length=1, max_length=100)
    price: Optional[Decimal] = Field(None, gt=0)
    compare_at_price: Optional[Decimal] = None
    inventory_qty: Optional[int] = Field(None, ge=0)
    weight: Optional[float] = None
    dimensions_mm: Optional[str] = None


class ProductImageCreate(BaseModel):
    """Schema for creating a product image."""
    url: str = Field(..., min_length=1, max_length=500)
    alt: Optional[str] = Field(None, max_length=255)
    sort_order: int = Field(default=0, ge=0)


class ReviewSummaryCreate(BaseModel):
    """Schema for creating a review summary."""
    rating_avg: float = Field(..., ge=0, le=5)
    rating_count: int = Field(..., ge=0)


class ProductCreate(BaseModel):
    """Schema for creating a new product."""
    slug: str = Field(..., min_length=1, max_length=255)
    title: str = Field(..., min_length=1, max_length=255)
    subtitle: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    badges: Optional[list[str]] = None
    seats_min: Optional[int] = Field(None, ge=1)
    seats_max: Optional[int] = Field(None, ge=1)
    material: Optional[str] = Field(None, max_length=100)
    finish: Optional[str] = Field(None, max_length=100)
    variants: list[VariantCreate] = Field(default_factory=list)
    images: list[ProductImageCreate] = Field(default_factory=list)
    review_summary: Optional[ReviewSummaryCreate] = None


class ProductUpdate(BaseModel):
    """Schema for updating a product."""
    slug: Optional[str] = Field(None, min_length=1, max_length=255)
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    subtitle: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    badges: Optional[list[str]] = None
    seats_min: Optional[int] = Field(None, ge=1)
    seats_max: Optional[int] = Field(None, ge=1)
    material: Optional[str] = Field(None, max_length=100)
    finish: Optional[str] = Field(None, max_length=100)


class ProductResponse(BaseModel):
    """Schema for product response."""
    id: int
    slug: str
    title: str
    subtitle: Optional[str] = None
    description: Optional[str] = None
    badges: Optional[list[str]] = None
    seats_min: Optional[int] = None
    seats_max: Optional[int] = None
    material: Optional[str] = None
    finish: Optional[str] = None

    class Config:
        from_attributes = True


# ============================================
# Collection Admin Schemas
# ============================================

class CollectionCreate(BaseModel):
    """Schema for creating a new collection."""
    slug: str = Field(..., min_length=1, max_length=255)
    title: str = Field(..., min_length=1, max_length=255)
    hero_copy: Optional[str] = None
    product_ids: list[int] = Field(default_factory=list)


class CollectionUpdate(BaseModel):
    """Schema for updating a collection."""
    slug: Optional[str] = Field(None, min_length=1, max_length=255)
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    hero_copy: Optional[str] = None
    product_ids: Optional[list[int]] = None


class CollectionResponse(BaseModel):
    """Schema for collection response."""
    id: int
    slug: str
    title: str
    hero_copy: Optional[str] = None

    class Config:
        from_attributes = True


# ============================================
# Promo Block Admin Schemas
# ============================================

class PromoBlockCreate(BaseModel):
    """Schema for creating a promo block."""
    collection_id: int
    position_index: int = Field(default=0, ge=0)
    title: str = Field(..., min_length=1, max_length=255)
    copy: Optional[str] = None
    cta_text: Optional[str] = Field(None, max_length=100)
    cta_url: Optional[str] = Field(None, max_length=500)
    image_url: Optional[str] = Field(None, max_length=500)


class PromoBlockUpdate(BaseModel):
    """Schema for updating a promo block."""
    collection_id: Optional[int] = None
    position_index: Optional[int] = Field(None, ge=0)
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    copy: Optional[str] = None
    cta_text: Optional[str] = Field(None, max_length=100)
    cta_url: Optional[str] = Field(None, max_length=500)
    image_url: Optional[str] = Field(None, max_length=500)


class PromoBlockResponse(BaseModel):
    """Schema for promo block response."""
    id: int
    collection_id: int
    position_index: int
    title: str
    copy: Optional[str] = None
    cta_text: Optional[str] = None
    cta_url: Optional[str] = None
    image_url: Optional[str] = None

    class Config:
        from_attributes = True


# ============================================
# Order Admin Schemas
# ============================================

class OrderStatusUpdate(BaseModel):
    """Schema for updating order status."""
    status: OrderStatus


class OrderItemResponse(BaseModel):
    """Schema for order item in admin response."""
    id: int
    product_id: int
    variant_id: int
    quantity: int
    price: Decimal
    product_title: Optional[str] = None
    variant_sku: Optional[str] = None

    class Config:
        from_attributes = True


class OrderAdminResponse(BaseModel):
    """Schema for order in admin response."""
    id: int
    payfast_payment_id: Optional[str] = None
    status: OrderStatus
    customer_email: str
    total: Decimal
    shipping_address: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    items: list[OrderItemResponse] = []

    class Config:
        from_attributes = True


class OrderListResponse(BaseModel):
    """Response schema for admin order list."""
    orders: list[OrderAdminResponse]
    total: int
    page: int
    per_page: int
    total_pages: int


# ============================================
# Admin Authentication Schemas
# ============================================

class AdminToken(BaseModel):
    """Schema for admin authentication token."""
    access_token: str
    token_type: str = "bearer"


class AdminCredentials(BaseModel):
    """Schema for admin login credentials."""
    username: str
    password: str


class MessageResponse(BaseModel):
    """Generic message response."""
    message: str
    id: Optional[int] = None


# ============================================
# SQL Query Schemas
# ============================================

class SQLQueryRequest(BaseModel):
    """Schema for SQL query request."""
    query: str = Field(..., min_length=1, description="SQL SELECT query to execute")


class SQLQueryResponse(BaseModel):
    """Schema for SQL query response."""
    columns: list[str]
    rows: list[list]
    row_count: int
