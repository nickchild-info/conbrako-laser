"""Pydantic schemas for collections."""
from pydantic import BaseModel
from .product import ProductList


class PromoBlockBase(BaseModel):
    """Base promo block schema."""
    id: int
    position_index: int
    title: str
    copy: str | None = None
    cta_text: str | None = None
    cta_url: str | None = None
    image_url: str | None = None

    class Config:
        from_attributes = True


class CollectionBase(BaseModel):
    """Base collection schema."""
    id: int
    slug: str
    title: str
    hero_copy: str | None = None


class CollectionList(CollectionBase):
    """Collection schema for list view."""

    class Config:
        from_attributes = True


class CollectionDetail(CollectionBase):
    """Collection schema with products for detail view."""
    products: list[ProductList] = []
    promo_blocks: list[PromoBlockBase] = []

    class Config:
        from_attributes = True


class CollectionListResponse(BaseModel):
    """Response schema for collection list endpoint."""
    collections: list[CollectionList]
    total: int
