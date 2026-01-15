"""Shipping API endpoints for The Courier Guy integration."""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal
from datetime import datetime

from ..core.database import get_db
from ..models.order import Order, OrderStatus
from ..services import tcg

router = APIRouter(prefix="/shipping", tags=["Shipping"])


# ============================================================================
# Request/Response Models
# ============================================================================

class AddressRequest(BaseModel):
    """Delivery address for shipping quote."""
    street: str = Field(..., min_length=1, max_length=255)
    suburb: str = Field(..., min_length=1, max_length=100)
    city: str = Field(..., min_length=1, max_length=100)
    province: str = Field(..., min_length=1, max_length=50)
    postal_code: str = Field(..., min_length=4, max_length=10)
    country: str = Field(default="ZA", max_length=2)
    contact_name: Optional[str] = Field(None, max_length=100)
    contact_phone: Optional[str] = Field(None, max_length=20)
    contact_email: Optional[str] = Field(None, max_length=255)


class ParcelRequest(BaseModel):
    """Parcel dimensions for shipping quote."""
    length: float = Field(..., gt=0, description="Length in cm")
    width: float = Field(..., gt=0, description="Width in cm")
    height: float = Field(..., gt=0, description="Height in cm")
    weight: float = Field(..., gt=0, description="Weight in kg")
    description: Optional[str] = None


class ShippingQuoteRequest(BaseModel):
    """Request body for shipping quote."""
    destination: AddressRequest
    parcels: list[ParcelRequest] = Field(..., min_length=1)


class ShippingQuoteResponse(BaseModel):
    """Individual shipping quote option."""
    service_type: str
    service_name: str
    price: Decimal
    estimated_days: int
    estimated_delivery: datetime

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat(),
            Decimal: lambda v: float(v),
        }


class ShippingQuotesResponse(BaseModel):
    """Response containing all available shipping quotes."""
    quotes: list[ShippingQuoteResponse]
    from_address: str
    to_province: str


class CreateShipmentRequest(BaseModel):
    """Request body for creating a shipment."""
    order_id: int
    service_type: str = Field(..., description="Service type from quote (standard, express, overnight)")


class ShipmentResponse(BaseModel):
    """Response after creating a shipment."""
    waybill: str
    tracking_url: str
    label_url: Optional[str]
    collection_date: datetime
    estimated_delivery: datetime

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat(),
        }


class TrackingEventResponse(BaseModel):
    """Individual tracking event."""
    timestamp: datetime
    status: str
    description: str
    location: Optional[str]

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat(),
        }


class TrackingResponse(BaseModel):
    """Response containing tracking events."""
    waybill: str
    events: list[TrackingEventResponse]
    current_status: str


# ============================================================================
# Default parcel sizes for KoosDoos products
# ============================================================================

# Product dimensions in flat-pack form (L x W x H in cm, weight in kg)
PRODUCT_PARCELS = {
    "small": {"length": 60, "width": 60, "height": 15, "weight": 15},
    "medium": {"length": 70, "width": 70, "height": 15, "weight": 22},
    "large": {"length": 80, "width": 80, "height": 18, "weight": 30},
    "xl": {"length": 90, "width": 90, "height": 20, "weight": 40},
    "personalised_medium": {"length": 70, "width": 70, "height": 15, "weight": 22},
    "personalised_large": {"length": 80, "width": 80, "height": 18, "weight": 30},
    "personalised_xl": {"length": 90, "width": 90, "height": 20, "weight": 40},
}


def get_parcel_for_variant(variant_sku: str) -> tcg.Parcel:
    """Get parcel dimensions for a variant SKU."""
    # Map SKU prefixes to parcel sizes
    sku_lower = variant_sku.lower()

    if "xl" in sku_lower:
        size = "xl"
    elif "large" in sku_lower or "lg" in sku_lower:
        size = "large"
    elif "medium" in sku_lower or "med" in sku_lower:
        size = "medium"
    else:
        size = "small"

    dims = PRODUCT_PARCELS.get(size, PRODUCT_PARCELS["medium"])

    return tcg.Parcel(
        length=dims["length"],
        width=dims["width"],
        height=dims["height"],
        weight=dims["weight"],
        description=f"KoosDoos Fire Pit ({size.title()})",
    )


# ============================================================================
# API Endpoints
# ============================================================================

@router.post("/quote", response_model=ShippingQuotesResponse)
async def get_shipping_quote(request: ShippingQuoteRequest):
    """
    Get shipping quotes for delivery.

    Returns available shipping options with prices and estimated delivery times
    based on the destination address and parcel dimensions.

    In sandbox mode (TCG_SANDBOX=true), returns mock quotes with realistic
    South African shipping rates.
    """
    # Convert request to TCG types
    destination = tcg.Address(
        street=request.destination.street,
        suburb=request.destination.suburb,
        city=request.destination.city,
        province=request.destination.province,
        postal_code=request.destination.postal_code,
        country=request.destination.country,
        contact_name=request.destination.contact_name,
        contact_phone=request.destination.contact_phone,
        contact_email=request.destination.contact_email,
    )

    parcels = [
        tcg.Parcel(
            length=p.length,
            width=p.width,
            height=p.height,
            weight=p.weight,
            description=p.description,
        )
        for p in request.parcels
    ]

    # Get quotes from TCG service
    quotes = await tcg.get_shipping_quotes(destination, parcels)

    # Get warehouse address for response
    warehouse = tcg.get_warehouse_address()

    return ShippingQuotesResponse(
        quotes=[
            ShippingQuoteResponse(
                service_type=q.service_type,
                service_name=q.service_name,
                price=q.price,
                estimated_days=q.estimated_days,
                estimated_delivery=q.estimated_delivery,
            )
            for q in quotes
        ],
        from_address=f"{warehouse.suburb}, {warehouse.city}",
        to_province=request.destination.province,
    )


@router.post("/quote/simple")
async def get_simple_shipping_quote(
    province: str,
    product_size: str = "medium",
    quantity: int = 1,
):
    """
    Get shipping quote with simplified parameters.

    Uses default product dimensions based on size.
    Useful for cart page shipping calculator.

    Args:
        province: Destination province (e.g., "Gauteng", "Western Cape")
        product_size: Product size (small, medium, large, xl)
        quantity: Number of items
    """
    # Build minimal destination address
    destination = tcg.Address(
        street="TBD",
        suburb="TBD",
        city="TBD",
        province=province,
        postal_code="0000",
        country="ZA",
    )

    # Get parcel dimensions for product size
    dims = PRODUCT_PARCELS.get(product_size.lower(), PRODUCT_PARCELS["medium"])
    parcels = [
        tcg.Parcel(
            length=dims["length"],
            width=dims["width"],
            height=dims["height"],
            weight=dims["weight"],
        )
        for _ in range(quantity)
    ]

    # Get quotes
    quotes = await tcg.get_shipping_quotes(destination, parcels)

    return {
        "province": province,
        "product_size": product_size,
        "quantity": quantity,
        "quotes": [
            {
                "service_type": q.service_type,
                "service_name": q.service_name,
                "price": float(q.price),
                "estimated_days": q.estimated_days,
            }
            for q in quotes
        ],
    }


@router.post("/create", response_model=ShipmentResponse)
async def create_shipment(
    request: CreateShipmentRequest,
    db: Session = Depends(get_db),
):
    """
    Create a shipment for an order.

    This should be called after successful payment to book the courier collection.
    The waybill number will be stored on the order for tracking.

    In sandbox mode (TCG_SANDBOX=true), returns a mock waybill and tracking URL.
    """
    # Get the order
    order = db.query(Order).filter(Order.id == request.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Check order is paid
    if order.status not in [OrderStatus.PAID, OrderStatus.PROCESSING]:
        raise HTTPException(
            status_code=400,
            detail=f"Order must be paid before creating shipment (current status: {order.status.value})"
        )

    # Check if shipment already exists
    if order.waybill:
        raise HTTPException(
            status_code=400,
            detail=f"Shipment already created for this order (waybill: {order.waybill})"
        )

    # Parse shipping address
    import json
    try:
        address_data = json.loads(order.shipping_address) if order.shipping_address else {}
    except json.JSONDecodeError:
        address_data = {}

    if not address_data:
        raise HTTPException(status_code=400, detail="Order has no shipping address")

    destination = tcg.Address(
        street=address_data.get("line1", "") + " " + address_data.get("line2", ""),
        suburb=address_data.get("suburb", address_data.get("city", "")),
        city=address_data.get("city", ""),
        province=address_data.get("state", address_data.get("province", "")),
        postal_code=address_data.get("postal_code", ""),
        country=address_data.get("country", "ZA"),
        contact_name=address_data.get("name", order.customer_name),
        contact_phone=order.customer_phone,
        contact_email=order.customer_email,
    )

    # Build parcels from order items
    parcels = []
    for item in order.items:
        variant_sku = item.variant.sku if item.variant else "medium"
        for _ in range(item.quantity):
            parcels.append(get_parcel_for_variant(variant_sku))

    if not parcels:
        # Default to medium parcel if no items
        parcels = [get_parcel_for_variant("medium")]

    # Create shipment
    shipment = await tcg.create_shipment(
        destination=destination,
        parcels=parcels,
        service_type=request.service_type,
        order_reference=f"KD-{order.id}",
    )

    # Update order with shipment details
    order.waybill = shipment.waybill
    order.tracking_url = shipment.tracking_url
    order.shipping_service = request.service_type
    order.status = OrderStatus.PROCESSING
    db.commit()

    return ShipmentResponse(
        waybill=shipment.waybill,
        tracking_url=shipment.tracking_url,
        label_url=shipment.label_url,
        collection_date=shipment.collection_date,
        estimated_delivery=shipment.estimated_delivery,
    )


@router.get("/track/{waybill}", response_model=TrackingResponse)
async def track_shipment(waybill: str):
    """
    Get tracking events for a shipment.

    Returns the tracking history for the given waybill number.

    In sandbox mode (TCG_SANDBOX=true), returns mock tracking events.
    """
    events = await tcg.get_tracking(waybill)

    if not events:
        raise HTTPException(status_code=404, detail="No tracking information found")

    # Get current status from most recent event
    current_status = events[-1].status if events else "UNKNOWN"

    return TrackingResponse(
        waybill=waybill,
        events=[
            TrackingEventResponse(
                timestamp=e.timestamp,
                status=e.status,
                description=e.description,
                location=e.location,
            )
            for e in events
        ],
        current_status=current_status,
    )


@router.get("/track/order/{order_id}", response_model=TrackingResponse)
async def track_order_shipment(
    order_id: int,
    db: Session = Depends(get_db),
):
    """
    Get tracking events for an order's shipment.

    Looks up the waybill from the order and returns tracking information.
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if not order.waybill:
        raise HTTPException(status_code=404, detail="No shipment found for this order")

    return await track_shipment(order.waybill)
