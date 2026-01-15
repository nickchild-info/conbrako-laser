"""Pydantic schemas for cart and checkout."""
from pydantic import BaseModel, EmailStr, Field
from decimal import Decimal
from typing import Optional


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
    """Request body for creating checkout session (legacy Stripe)."""
    items: list[CartItem]
    customer_email: EmailStr
    success_url: str
    cancel_url: str


class CheckoutCreateResponse(BaseModel):
    """Response for checkout session creation (legacy Stripe)."""
    session_id: str
    checkout_url: str


# ============================================================================
# Payfast Checkout Schemas
# ============================================================================

class ShippingAddress(BaseModel):
    """Shipping address for checkout."""
    street: str = Field(..., min_length=1)
    suburb: str = Field(..., min_length=1)
    city: str = Field(..., min_length=1)
    province: str = Field(..., min_length=1)
    postal_code: str = Field(..., min_length=4)
    country: str = Field(default="ZA")


class PayfastCheckoutRequest(BaseModel):
    """Request body for creating Payfast checkout."""
    items: list[CartItem]
    customer_email: EmailStr
    customer_first_name: str = Field(..., min_length=1, max_length=100)
    customer_last_name: str = Field(default="", max_length=100)
    customer_phone: Optional[str] = Field(None, max_length=20)
    shipping_address: ShippingAddress
    shipping_service: str = Field(default="standard", description="standard, express, or overnight")
    shipping_cost: Decimal = Field(default=Decimal("0"), ge=0)


class PayfastFormField(BaseModel):
    """Single hidden form field for Payfast."""
    name: str
    value: str


class PayfastCheckoutResponse(BaseModel):
    """Response for Payfast checkout initiation."""
    order_id: int
    payfast_url: str
    form_fields: list[PayfastFormField]
    total: Decimal

    class Config:
        json_encoders = {
            Decimal: lambda v: float(v),
        }


# ============================================================================
# Order Response Schemas
# ============================================================================

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
    stripe_session_id: str | None = None
    payfast_payment_id: str | None = None
    status: str
    customer_email: str | None
    customer_name: str | None = None
    total: Decimal
    shipping_cost: Decimal | None = None
    shipping_service: str | None = None
    shipping_address: str | None = None
    waybill: str | None = None
    tracking_url: str | None = None
    items: list[OrderItemResponse] = []
    created_at: str

    class Config:
        from_attributes = True
