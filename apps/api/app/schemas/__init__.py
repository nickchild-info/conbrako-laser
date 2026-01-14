"""Pydantic schemas."""
from .product import (
    VariantBase,
    ProductImageBase,
    ReviewSummaryBase,
    ProductBase,
    ProductList,
    ProductDetail,
    ProductListResponse,
)
from .collection import (
    PromoBlockBase,
    CollectionBase,
    CollectionList,
    CollectionDetail,
    CollectionListResponse,
)
from .design import (
    DesignTemplateBase,
    DesignTemplateListResponse,
)
from .cart import (
    CartItem,
    CartValidateRequest,
    CartValidateResponse,
    ValidatedCartItem,
    CheckoutCreateRequest,
    CheckoutCreateResponse,
    OrderItemResponse,
    OrderResponse,
)
from .upload import (
    UploadDesignResponse,
    DXFValidationResult,
    UploadErrorResponse,
)

__all__ = [
    # Product schemas
    "VariantBase",
    "ProductImageBase",
    "ReviewSummaryBase",
    "ProductBase",
    "ProductList",
    "ProductDetail",
    "ProductListResponse",
    # Collection schemas
    "PromoBlockBase",
    "CollectionBase",
    "CollectionList",
    "CollectionDetail",
    "CollectionListResponse",
    # Design schemas
    "DesignTemplateBase",
    "DesignTemplateListResponse",
    # Cart & Checkout schemas
    "CartItem",
    "CartValidateRequest",
    "CartValidateResponse",
    "ValidatedCartItem",
    "CheckoutCreateRequest",
    "CheckoutCreateResponse",
    "OrderItemResponse",
    "OrderResponse",
    # Upload schemas
    "UploadDesignResponse",
    "DXFValidationResult",
    "UploadErrorResponse",
]
