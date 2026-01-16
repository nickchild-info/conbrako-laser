"""Cart and Checkout API endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from decimal import Decimal
import json

from ..core.database import get_db
from ..core.config import get_settings
from ..models.product import Product, Variant
from ..models.order import Order, OrderItem, OrderStatus
from ..schemas.cart import (
    CartValidateRequest,
    CartValidateResponse,
    ValidatedCartItem,
    PayfastCheckoutRequest,
    PayfastCheckoutResponse,
    PayfastFormField,
    OrderResponse,
    OrderItemResponse,
)
from ..services import payfast

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


@router.post("/checkout/payfast", response_model=PayfastCheckoutResponse)
async def create_payfast_checkout(
    request: PayfastCheckoutRequest,
    db: Session = Depends(get_db),
):
    """
    Create a Payfast checkout for the cart.

    Creates a pending order and returns form data for posting to Payfast.
    The frontend should create a hidden form with the returned fields and submit it.

    Flow:
    1. Validate cart items
    2. Create pending order with shipping address
    3. Generate Payfast form data with signature
    4. Return form fields for frontend to submit

    After successful payment, Payfast will:
    - Redirect user to return_url (order confirmation page)
    - Send ITN to notify_url (our webhook) to confirm payment
    """
    # Validate all items and calculate total
    subtotal = Decimal("0.00")
    order_items_data = []

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

        line_total = variant.price * item.quantity
        subtotal += line_total

        order_items_data.append({
            "product_id": item.product_id,
            "variant_id": item.variant_id,
            "quantity": item.quantity,
            "price": variant.price,
            "title": variant.product.title,
        })

    if not order_items_data:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # Calculate total with shipping
    shipping_cost = request.shipping_cost
    total = subtotal + shipping_cost

    # Build shipping address JSON
    shipping_address_json = json.dumps({
        "line1": request.shipping_address.street,
        "suburb": request.shipping_address.suburb,
        "city": request.shipping_address.city,
        "state": request.shipping_address.province,
        "province": request.shipping_address.province,
        "postal_code": request.shipping_address.postal_code,
        "country": request.shipping_address.country,
        "name": f"{request.customer_first_name} {request.customer_last_name}".strip(),
    })

    # Create pending order
    order = Order(
        status=OrderStatus.PENDING,
        customer_email=request.customer_email,
        customer_name=f"{request.customer_first_name} {request.customer_last_name}".strip(),
        customer_phone=request.customer_phone,
        total=total,
        shipping_cost=shipping_cost,
        shipping_service=request.shipping_service,
        shipping_address=shipping_address_json,
    )
    db.add(order)
    db.flush()  # Get order ID

    # Create order items
    for item_data in order_items_data:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item_data["product_id"],
            variant_id=item_data["variant_id"],
            quantity=item_data["quantity"],
            price=item_data["price"],
        )
        db.add(order_item)

    db.commit()

    # Build item name for Payfast
    item_count = sum(item.quantity for item in request.items)
    item_name = f"KoosDoos Fire Pit Order #{order.id}"
    if item_count > 1:
        item_name = f"KoosDoos Fire Pits ({item_count} items) - Order #{order.id}"

    # Generate Payfast form data
    form_data = payfast.build_payment_form_data(
        order_id=str(order.id),
        amount=total,
        item_name=item_name,
        customer_email=request.customer_email,
        customer_first_name=request.customer_first_name,
        customer_last_name=request.customer_last_name,
        item_description=f"Order #{order.id} - {item_count} item(s)",
        custom_str1=request.shipping_service,  # Store shipping service
    )

    # Convert to list of form fields
    form_fields = [
        PayfastFormField(name=key, value=str(value))
        for key, value in form_data.items()
        if value is not None
    ]

    return PayfastCheckoutResponse(
        order_id=order.id,
        payfast_url=payfast.get_payfast_url(),
        form_fields=form_fields,
        total=total,
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
        payfast_payment_id=order.payfast_payment_id,
        status=order.status.value,
        customer_email=order.customer_email,
        customer_name=order.customer_name,
        total=order.total,
        shipping_cost=order.shipping_cost,
        shipping_service=order.shipping_service,
        shipping_address=order.shipping_address,
        waybill=order.waybill,
        tracking_url=order.tracking_url,
        items=order_items,
        created_at=order.created_at.isoformat() if order.created_at else "",
    )
