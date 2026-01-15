"""Webhook endpoints for handling payment and shipping events."""
from fastapi import APIRouter, Request, HTTPException, Depends, Form
from sqlalchemy.orm import Session
from decimal import Decimal
from typing import Optional
import json
import logging

from ..core.database import get_db
from ..core.config import get_settings
from ..models.order import Order, OrderItem, OrderStatus
from ..models.product import Variant
from ..services import payfast

router = APIRouter(tags=["Webhooks"])
settings = get_settings()
logger = logging.getLogger(__name__)


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


# ============================================================================
# Payfast ITN (Instant Transaction Notification) Webhook
# ============================================================================

@router.post("/webhooks/payfast")
async def payfast_itn(
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Handle Payfast ITN (Instant Transaction Notification).

    Payfast sends a POST with form data when a payment status changes.
    We must:
    1. Validate the source IP is from Payfast
    2. Verify the signature
    3. Verify the payment data matches our records
    4. Update the order status

    Returns 200 OK to acknowledge receipt (required by Payfast).
    """
    # Get client IP for validation
    client_ip = request.client.host if request.client else ""

    # Also check X-Forwarded-For header (for proxied requests)
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        client_ip = forwarded_for.split(",")[0].strip()

    # Validate source IP
    if not payfast.is_valid_itn_source(client_ip):
        logger.warning(f"Payfast ITN from invalid IP: {client_ip}")
        raise HTTPException(status_code=403, detail="Invalid source IP")

    # Parse form data
    form_data = await request.form()
    itn_data = {key: value for key, value in form_data.items()}

    logger.info(f"Payfast ITN received: {itn_data.get('m_payment_id')} - {itn_data.get('payment_status')}")

    # Extract signature before verification
    signature = itn_data.pop("signature", None)
    if not signature:
        logger.warning("Payfast ITN missing signature")
        raise HTTPException(status_code=400, detail="Missing signature")

    # Verify signature
    if not payfast.verify_signature(itn_data, signature, settings.payfast_passphrase):
        logger.warning(f"Payfast ITN invalid signature for payment {itn_data.get('m_payment_id')}")
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Get order reference (m_payment_id is our order ID)
    order_id = itn_data.get("m_payment_id")
    if not order_id:
        logger.warning("Payfast ITN missing m_payment_id")
        raise HTTPException(status_code=400, detail="Missing payment ID")

    # Find the order
    try:
        order = db.query(Order).filter(Order.id == int(order_id)).first()
    except (ValueError, TypeError):
        # Try by payfast_payment_id if order_id is not numeric
        order = db.query(Order).filter(Order.payfast_payment_id == order_id).first()

    if not order:
        logger.warning(f"Payfast ITN for unknown order: {order_id}")
        raise HTTPException(status_code=404, detail="Order not found")

    # Verify amount matches (Payfast sends amount in ZAR, not cents)
    amount_gross = itn_data.get("amount_gross", "0")
    try:
        received_amount = Decimal(amount_gross)
        if abs(received_amount - order.total) > Decimal("0.01"):
            logger.warning(
                f"Payfast ITN amount mismatch for order {order_id}: "
                f"expected {order.total}, received {received_amount}"
            )
            raise HTTPException(status_code=400, detail="Amount mismatch")
    except (ValueError, TypeError):
        logger.warning(f"Payfast ITN invalid amount: {amount_gross}")
        raise HTTPException(status_code=400, detail="Invalid amount")

    # Handle payment status
    payment_status = itn_data.get("payment_status", "").upper()
    pf_payment_id = itn_data.get("pf_payment_id")

    if payment_status == payfast.PaymentStatus.COMPLETE:
        await handle_payfast_complete(order, itn_data, db)
    elif payment_status == payfast.PaymentStatus.FAILED:
        await handle_payfast_failed(order, itn_data, db)
    elif payment_status == payfast.PaymentStatus.CANCELLED:
        await handle_payfast_cancelled(order, itn_data, db)
    else:
        logger.info(f"Payfast ITN unhandled status: {payment_status} for order {order_id}")

    # Store Payfast payment ID for reference
    if pf_payment_id and not order.payfast_payment_id:
        order.payfast_payment_id = pf_payment_id
        db.commit()

    # Always return 200 OK to acknowledge receipt
    return {"status": "ok"}


async def handle_payfast_complete(order: Order, itn_data: dict, db: Session):
    """Handle successful Payfast payment."""
    logger.info(f"Payfast payment complete for order {order.id}")

    # Update order status
    order.status = OrderStatus.paid
    order.payfast_payment_id = itn_data.get("pf_payment_id")

    # Store customer email if not already set
    if not order.customer_email:
        order.customer_email = itn_data.get("email_address")

    # Update inventory for order items
    for item in order.items:
        variant = db.query(Variant).filter(Variant.id == item.variant_id).first()
        if variant:
            variant.inventory_qty = max(0, variant.inventory_qty - item.quantity)

    db.commit()
    logger.info(f"Order {order.id} marked as paid, inventory updated")


async def handle_payfast_failed(order: Order, itn_data: dict, db: Session):
    """Handle failed Payfast payment."""
    logger.warning(f"Payfast payment failed for order {order.id}")

    # Keep order as pending or mark as failed based on business logic
    # For now, we just log it - don't change status to allow retry

    db.commit()


async def handle_payfast_cancelled(order: Order, itn_data: dict, db: Session):
    """Handle cancelled Payfast payment."""
    logger.info(f"Payfast payment cancelled for order {order.id}")

    # Mark order as cancelled
    order.status = OrderStatus.cancelled

    db.commit()
