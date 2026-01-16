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
    PayfastCheckoutRequest,
    PayfastCheckoutResponse,
    OrderItemResponse,
    OrderResponse,
)
from .upload import (
    UploadDesignResponse,
    DXFValidationResult,
    UploadErrorResponse,
)
from .admin import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    VariantCreate,
    VariantUpdate,
    ProductImageCreate,
    ReviewSummaryCreate,
    CollectionCreate,
    CollectionUpdate,
    CollectionResponse,
    PromoBlockCreate,
    PromoBlockUpdate,
    PromoBlockResponse,
    OrderStatusUpdate,
    OrderAdminResponse,
    OrderListResponse,
    OrderItemResponse as AdminOrderItemResponse,
    MessageResponse,
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
    "PayfastCheckoutRequest",
    "PayfastCheckoutResponse",
    "OrderItemResponse",
    "OrderResponse",
    # Upload schemas
    "UploadDesignResponse",
    "DXFValidationResult",
    "UploadErrorResponse",
    # Admin schemas
    "ProductCreate",
    "ProductUpdate",
    "ProductResponse",
    "VariantCreate",
    "VariantUpdate",
    "ProductImageCreate",
    "ReviewSummaryCreate",
    "CollectionCreate",
    "CollectionUpdate",
    "CollectionResponse",
    "PromoBlockCreate",
    "PromoBlockUpdate",
    "PromoBlockResponse",
    "OrderStatusUpdate",
    "OrderAdminResponse",
    "OrderListResponse",
    "AdminOrderItemResponse",
    "MessageResponse",
]
