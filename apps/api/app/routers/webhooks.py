"""Stripe Webhooks endpoint for handling payment events."""
from fastapi import APIRouter, Request, HTTPException, Depends
from sqlalchemy.orm import Session
from decimal import Decimal
import json

from ..core.database import get_db
from ..core.config import get_settings
from ..models.order import Order, OrderItem, OrderStatus
from ..models.product import Variant

router = APIRouter(tags=["Webhooks"])
settings = get_settings()


@router.post("/webhooks/stripe")
async def stripe_webhook(
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Handle Stripe webhook events.

    Supported events:
    - checkout.session.completed: Creates order and updates inventory
    - payment_intent.payment_failed: Logs failed payment attempt

    Note: This endpoint receives raw body for signature verification.
    """
    # Get raw body for signature verification
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    # Check if Stripe is configured
    if not settings.stripe_secret_key:
        raise HTTPException(
            status_code=503,
            detail="Stripe is not configured"
        )

    # Import stripe
    try:
        import stripe
        stripe.api_key = settings.stripe_secret_key
    except ImportError:
        raise HTTPException(
            status_code=503,
            detail="Stripe library not available"
        )

    # Verify webhook signature
    event = None
    try:
        if settings.stripe_webhook_secret:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.stripe_webhook_secret
            )
        else:
            # In development without webhook secret, parse JSON directly
            event = json.loads(payload)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle the event
    event_type = event.get("type") if isinstance(event, dict) else event.type

    if event_type == "checkout.session.completed":
        session_data = event.get("data", {}).get("object", {}) if isinstance(event, dict) else event.data.object
        await handle_checkout_completed(session_data, db)

    elif event_type == "payment_intent.payment_failed":
        payment_intent = event.get("data", {}).get("object", {}) if isinstance(event, dict) else event.data.object
        await handle_payment_failed(payment_intent, db)

    return {"status": "success", "event_type": event_type}


async def handle_checkout_completed(session: dict, db: Session):
    """
    Handle successful checkout session.

    Creates an order record and updates inventory for purchased items.
    """
    session_id = session.get("id")
    customer_email = session.get("customer_email") or session.get("customer_details", {}).get("email")
    amount_total = session.get("amount_total", 0)

    # Get shipping address
    shipping_details = session.get("shipping_details", {})
    shipping_address = None
    if shipping_details:
        address = shipping_details.get("address", {})
        shipping_address = {
            "name": shipping_details.get("name"),
            "line1": address.get("line1"),
            "line2": address.get("line2"),
            "city": address.get("city"),
            "state": address.get("state"),
            "postal_code": address.get("postal_code"),
            "country": address.get("country"),
        }

    # Check if order already exists (idempotency)
    existing_order = db.query(Order).filter(Order.stripe_session_id == session_id).first()
    if existing_order:
        return existing_order

    # Create the order
    order = Order(
        stripe_session_id=session_id,
        status=OrderStatus.paid,
        customer_email=customer_email,
        total=Decimal(amount_total) / 100,  # Convert from cents
        shipping_address=json.dumps(shipping_address) if shipping_address else None,
    )
    db.add(order)
    db.flush()  # Get order ID

    # Retrieve line items from Stripe session
    try:
        import stripe
        stripe.api_key = settings.stripe_secret_key

        line_items = stripe.checkout.Session.list_line_items(session_id, limit=100)

        # For each line item, we need to find the corresponding product/variant
        # Since we used price_data, we need to look up by price or use metadata
        # For now, we'll create order items based on the session metadata

        # If we stored cart info in metadata, parse it
        metadata = session.get("metadata", {})
        cart_data = metadata.get("cart_items")

        if cart_data:
            cart_items = json.loads(cart_data)
            for item in cart_items:
                variant = db.query(Variant).filter(Variant.id == item["variant_id"]).first()
                if variant:
                    # Create order item
                    order_item = OrderItem(
                        order_id=order.id,
                        product_id=item["product_id"],
                        variant_id=item["variant_id"],
                        quantity=item["quantity"],
                        price=variant.price,
                    )
                    db.add(order_item)

                    # Update inventory
                    variant.inventory_qty = max(0, variant.inventory_qty - item["quantity"])

    except Exception:
        # If we can't get line items, still create the order
        pass

    db.commit()
    return order


async def handle_payment_failed(payment_intent: dict, db: Session):
    """
    Handle failed payment intent.

    Logs the failure for monitoring. Could be extended to:
    - Send notification to admin
    - Update any pending order status
    - Track failed attempts for fraud detection
    """
    payment_intent_id = payment_intent.get("id")
    error_message = payment_intent.get("last_payment_error", {}).get("message", "Unknown error")

    # Log the failure (in production, use proper logging)
    print(f"Payment failed: {payment_intent_id} - {error_message}")

    # Could update related order if one exists
    # For now, we just acknowledge the event
    return {"payment_intent_id": payment_intent_id, "error": error_message}
