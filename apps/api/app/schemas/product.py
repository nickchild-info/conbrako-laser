"""Pydantic schemas for products."""
from pydantic import BaseModel
from decimal import Decimal


class VariantBase(BaseModel):
    """Base variant schema."""
    id: int
    sku: str
    price: Decimal
    compare_at_price: Decimal | None = None
    inventory_qty: int
    weight: float | None = None
    dimensions_mm: str | None = None


class ProductImageBase(BaseModel):
    """Base product image schema."""
    id: int
    url: str
    alt: str | None = None
    sort_order: int = 0


class ReviewSummaryBase(BaseModel):
    """Base review summary schema."""
    rating_avg: float
    rating_count: int


class ProductBase(BaseModel):
    """Base product schema."""
    id: int
    slug: str
    title: str
    subtitle: str | None = None
    description: str | None = None
    badges: list[str] | None = None
    seats_min: int | None = None
    seats_max: int | None = None
    material: str | None = None
    finish: str | None = None


class ProductList(ProductBase):
    """Product schema for list view (with nested data)."""
    variants: list[VariantBase] = []
    images: list[ProductImageBase] = []
    review_summary: ReviewSummaryBase | None = None

    class Config:
        from_attributes = True


class ProductDetail(ProductBase):
    """Product schema for detail view (full data)."""
    variants: list[VariantBase] = []
    images: list[ProductImageBase] = []
    review_summary: ReviewSummaryBase | None = None

    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    """Response schema for product list endpoint."""
    products: list[ProductList]
    total: int
    page: int
    per_page: int
    total_pages: int
