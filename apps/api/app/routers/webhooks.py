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
