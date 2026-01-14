"""Cart and Checkout API endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from decimal import Decimal

from ..core.database import get_db
from ..core.config import get_settings
from ..models.product import Product, Variant
from ..models.order import Order, OrderItem, OrderStatus
from ..schemas.cart import (
    CartValidateRequest,
    CartValidateResponse,
    ValidatedCartItem,
    CheckoutCreateRequest,
    CheckoutCreateResponse,
    OrderResponse,
    OrderItemResponse,
)

router = APIRouter(tags=["Cart & Checkout"])
settings = get_settings()


@router.post("/cart/validate", response_model=CartValidateResponse)
async def validate_cart(
    request: CartValidateRequest,
    db: Session = Depends(get_db),
):
    """
    Validate cart items and return current pricing.

    Checks that all products and variants exist, calculates current prices,
    and validates inventory availability.

    - **items**: List of cart items with product_id, variant_id, and quantity
    """
    validated_items: list[ValidatedCartItem] = []
    errors: list[str] = []
    subtotal = Decimal("0.00")
    all_valid = True

    for item in request.items:
        # Fetch variant with product data
        variant = (
            db.query(Variant)
            .options(joinedload(Variant.product))
            .filter(
                Variant.id == item.variant_id,
                Variant.product_id == item.product_id,
            )
            .first()
        )

        if not variant:
            errors.append(f"Product/variant combination not found: {item.product_id}/{item.variant_id}")
            all_valid = False
            continue

        # Check availability
        available = variant.inventory_qty >= item.quantity
        if not available:
            errors.append(
                f"{variant.product.title} ({variant.sku}): Only {variant.inventory_qty} available, {item.quantity} requested"
            )
            all_valid = False

        # Calculate line total
        line_total = variant.price * item.quantity
        subtotal += line_total

        validated_items.append(
            ValidatedCartItem(
                product_id=item.product_id,
                variant_id=item.variant_id,
                quantity=item.quantity,
                sku=variant.sku,
                title=variant.product.title,
                price=variant.price,
                line_total=line_total,
                available=available,
                available_qty=variant.inventory_qty,
            )
        )

    return CartValidateResponse(
        valid=all_valid and len(validated_items) > 0,
        items=validated_items,
        subtotal=subtotal,
        errors=errors,
    )


@router.post("/checkout/create-session", response_model=CheckoutCreateResponse)
async def create_checkout_session(
    request: CheckoutCreateRequest,
    db: Session = Depends(get_db),
):
    """
    Create a Stripe checkout session for the cart.

    Validates cart items, creates line items for Stripe, and returns
    the checkout URL for redirecting the customer.

    - **items**: List of cart items to purchase
    - **customer_email**: Customer's email address
    - **success_url**: URL to redirect after successful payment
    - **cancel_url**: URL to redirect if payment is cancelled
    """
    # Check if Stripe is configured
    if not settings.stripe_secret_key:
        raise HTTPException(
            status_code=503,
            detail="Payment processing is not configured. Please contact support."
        )

    # Import stripe here to avoid import errors if not installed
    try:
        import stripe
        stripe.api_key = settings.stripe_secret_key
    except ImportError:
        raise HTTPException(
            status_code=503,
            detail="Payment processing is not available. Please contact support."
        )

    # Validate all items first
    line_items = []
    total = Decimal("0.00")

    for item in request.items:
        variant = (
            db.query(Variant)
            .options(joinedload(Variant.product))
            .filter(
                Variant.id == item.variant_id,
                Variant.product_id == item.product_id,
            )
            .first()
        )

        if not variant:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid product/variant: {item.product_id}/{item.variant_id}"
            )

        if variant.inventory_qty < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {variant.product.title}: {variant.inventory_qty} available"
            )

        # Build Stripe line item
        line_items.append({
            "price_data": {
                "currency": "zar",
                "unit_amount": int(variant.price * 100),  # Stripe uses cents
                "product_data": {
                    "name": variant.product.title,
                    "description": f"SKU: {variant.sku}",
                },
            },
            "quantity": item.quantity,
        })

        total += variant.price * item.quantity

    if not line_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    try:
        # Build cart items metadata for webhook processing
        import json
        cart_items_data = [
            {
                "product_id": item.product_id,
                "variant_id": item.variant_id,
                "quantity": item.quantity,
            }
            for item in request.items
        ]

        # Create Stripe checkout session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            customer_email=request.customer_email,
            success_url=request.success_url,
            cancel_url=request.cancel_url,
            shipping_address_collection={
                "allowed_countries": ["ZA"],
            },
            shipping_options=[
                {
                    "shipping_rate_data": {
                        "type": "fixed_amount",
                        "fixed_amount": {
                            "amount": 0 if total >= Decimal("2500") else 15000,  # Free shipping over R2500
                            "currency": "zar",
                        },
                        "display_name": "Standard Shipping" if total < Decimal("2500") else "Free Shipping",
                        "delivery_estimate": {
                            "minimum": {"unit": "business_day", "value": 5},
                            "maximum": {"unit": "business_day", "value": 10},
                        },
                    },
                },
            ],
            metadata={
                "source": "koosdoos_web",
                "cart_items": json.dumps(cart_items_data),
            },
        )

        return CheckoutCreateResponse(
            session_id=checkout_session.id,
            checkout_url=checkout_session.url,
        )

    except stripe.error.StripeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Payment processing error: {str(e)}"
        )


@router.get("/orders/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    db: Session = Depends(get_db),
):
    """
    Get order details by ID.

    Returns full order information including items, status, and shipping address.

    - **order_id**: The order ID to retrieve
    """
    order = (
        db.query(Order)
        .options(
            joinedload(Order.items).joinedload(OrderItem.product),
            joinedload(Order.items).joinedload(OrderItem.variant),
        )
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(status_code=404, detail=f"Order {order_id} not found")

    # Build response with enriched item data
    order_items = []
    for item in order.items:
        order_items.append(
            OrderItemResponse(
                id=item.id,
                product_id=item.product_id,
                variant_id=item.variant_id,
                quantity=item.quantity,
                price=item.price,
                product_title=item.product.title if item.product else None,
                variant_sku=item.variant.sku if item.variant else None,
            )
        )

    return OrderResponse(
        id=order.id,
        stripe_session_id=order.stripe_session_id,
        status=order.status.value,
        customer_email=order.customer_email,
        total=order.total,
        shipping_address=order.shipping_address,
        items=order_items,
        created_at=order.created_at.isoformat() if order.created_at else "",
    )
