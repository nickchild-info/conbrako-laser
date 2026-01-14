"""Pydantic schemas for cart and checkout."""
from pydantic import BaseModel, EmailStr
from decimal import Decimal


class CartItem(BaseModel):
    """Single cart item for validation."""
    product_id: int
    variant_id: int
    quantity: int


class CartValidateRequest(BaseModel):
    """Request body for cart validation."""
    items: list[CartItem]


class ValidatedCartItem(BaseModel):
    """Validated cart item with current pricing."""
    product_id: int
    variant_id: int
    quantity: int
    sku: str
    title: str
    price: Decimal
    line_total: Decimal
    available: bool
    available_qty: int


class CartValidateResponse(BaseModel):
    """Response for cart validation."""
    valid: bool
    items: list[ValidatedCartItem]
    subtotal: Decimal
    errors: list[str] = []


class CheckoutCreateRequest(BaseModel):
    """Request body for creating checkout session."""
    items: list[CartItem]
    customer_email: EmailStr
    success_url: str
    cancel_url: str


class CheckoutCreateResponse(BaseModel):
    """Response for checkout session creation."""
    session_id: str
    checkout_url: str


class OrderItemResponse(BaseModel):
    """Order item in order details."""
    id: int
    product_id: int
    variant_id: int
    quantity: int
    price: Decimal
    product_title: str | None = None
    variant_sku: str | None = None

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    """Response for order details."""
    id: int
    stripe_session_id: str | None
    status: str
    customer_email: str
    total: Decimal
    shipping_address: str | None
    items: list[OrderItemResponse] = []
    created_at: str

    class Config:
        from_attributes = True
