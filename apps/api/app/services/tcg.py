"""The Courier Guy (TCG) shipping service.

Handles shipping quotes, shipment creation, and tracking
for The Courier Guy delivery service in South Africa.

Docs: https://developer.thecourierguy.co.za

When TCG_SANDBOX=true, returns realistic mock data for development.
"""
import uuid
import random
from datetime import datetime, timedelta
from typing import Optional
from decimal import Decimal
from dataclasses import dataclass
import httpx

from app.core.config import get_settings


@dataclass
class Address:
    """Shipping address."""
    street: str
    suburb: str
    city: str
    province: str
    postal_code: str
    country: str = "ZA"
    contact_name: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None


@dataclass
class Parcel:
    """Parcel dimensions and weight."""
    length: float  # cm
    width: float  # cm
    height: float  # cm
    weight: float  # kg
    description: Optional[str] = None


@dataclass
class ShippingQuote:
    """Shipping quote from TCG."""
    service_type: str
    service_name: str
    price: Decimal
    estimated_days: int
    estimated_delivery: datetime


@dataclass
class Shipment:
    """Created shipment details."""
    waybill: str
    tracking_url: str
    label_url: Optional[str]
    collection_date: datetime
    estimated_delivery: datetime


@dataclass
class TrackingEvent:
    """Tracking event for a shipment."""
    timestamp: datetime
    status: str
    description: str
    location: Optional[str] = None


# Province-based shipping rates for mock mode (in ZAR)
MOCK_SHIPPING_RATES = {
    "Gauteng": {"standard": 95, "express": 150, "overnight": 250},
    "Western Cape": {"standard": 150, "express": 220, "overnight": 350},
    "KwaZulu-Natal": {"standard": 140, "express": 200, "overnight": 320},
    "Eastern Cape": {"standard": 160, "express": 230, "overnight": 380},
    "Free State": {"standard": 130, "express": 190, "overnight": 300},
    "Mpumalanga": {"standard": 120, "express": 180, "overnight": 280},
    "Limpopo": {"standard": 150, "express": 220, "overnight": 350},
    "North West": {"standard": 130, "express": 190, "overnight": 300},
    "Northern Cape": {"standard": 180, "express": 260, "overnight": 420},
}

# Delivery days by province from Gauteng (mock)
MOCK_DELIVERY_DAYS = {
    "Gauteng": {"standard": 2, "express": 1, "overnight": 1},
    "Western Cape": {"standard": 4, "express": 2, "overnight": 1},
    "KwaZulu-Natal": {"standard": 3, "express": 2, "overnight": 1},
    "Eastern Cape": {"standard": 4, "express": 2, "overnight": 1},
    "Free State": {"standard": 3, "express": 2, "overnight": 1},
    "Mpumalanga": {"standard": 2, "express": 1, "overnight": 1},
    "Limpopo": {"standard": 3, "express": 2, "overnight": 1},
    "North West": {"standard": 3, "express": 2, "overnight": 1},
    "Northern Cape": {"standard": 5, "express": 3, "overnight": 2},
}


def get_warehouse_address() -> Address:
    """Get the warehouse/collection address from settings."""
    settings = get_settings()
    return Address(
        street=settings.warehouse_address,
        suburb=settings.warehouse_suburb,
        city=settings.warehouse_city,
        province=settings.warehouse_province,
        postal_code=settings.warehouse_postal_code,
        country=settings.warehouse_country,
        contact_name="KoosDoos Fire Pits",
        contact_phone="+27 12 345 6789",
        contact_email="shipping@koosdoos.co.za",
    )


def calculate_volumetric_weight(parcel: Parcel) -> float:
    """Calculate volumetric weight for shipping.

    TCG uses volumetric factor of 5000.
    Volumetric weight = (L x W x H) / 5000

    Returns the greater of actual weight or volumetric weight.
    """
    volumetric = (parcel.length * parcel.width * parcel.height) / 5000
    return max(parcel.weight, volumetric)


async def get_shipping_quotes(
    destination: Address,
    parcels: list[Parcel],
) -> list[ShippingQuote]:
    """Get shipping quotes from TCG.

    Args:
        destination: Delivery address
        parcels: List of parcels to ship

    Returns:
        List of available shipping options with prices
    """
    settings = get_settings()

    if settings.tcg_sandbox:
        return _get_mock_quotes(destination, parcels)

    # Real TCG API call
    return await _get_tcg_quotes(destination, parcels)


def _get_mock_quotes(destination: Address, parcels: list[Parcel]) -> list[ShippingQuote]:
    """Generate mock shipping quotes for development."""
    province = destination.province

    # Default to most expensive if province not found
    rates = MOCK_SHIPPING_RATES.get(province, MOCK_SHIPPING_RATES["Northern Cape"])
    days = MOCK_DELIVERY_DAYS.get(province, MOCK_DELIVERY_DAYS["Northern Cape"])

    # Calculate total weight for price adjustment
    total_weight = sum(calculate_volumetric_weight(p) for p in parcels)

    # Weight surcharge: R10 per kg over 10kg
    weight_surcharge = max(0, (total_weight - 10) * 10)

    now = datetime.now()
    quotes = []

    for service_type, base_price in rates.items():
        price = Decimal(str(base_price + weight_surcharge))
        delivery_days = days[service_type]

        # Calculate estimated delivery (skip weekends)
        estimated = now + timedelta(days=delivery_days)
        while estimated.weekday() >= 5:  # Saturday = 5, Sunday = 6
            estimated += timedelta(days=1)

        service_names = {
            "standard": "Standard Delivery",
            "express": "Express Delivery",
            "overnight": "Overnight Delivery",
        }

        quotes.append(ShippingQuote(
            service_type=service_type,
            service_name=service_names[service_type],
            price=price,
            estimated_days=delivery_days,
            estimated_delivery=estimated,
        ))

    return sorted(quotes, key=lambda q: q.price)


async def _get_tcg_quotes(destination: Address, parcels: list[Parcel]) -> list[ShippingQuote]:
    """Get real quotes from TCG API."""
    settings = get_settings()
    warehouse = get_warehouse_address()

    # Build request payload
    payload = {
        "collection": {
            "address": warehouse.street,
            "suburb": warehouse.suburb,
            "city": warehouse.city,
            "province": warehouse.province,
            "postal_code": warehouse.postal_code,
            "country": warehouse.country,
        },
        "delivery": {
            "address": destination.street,
            "suburb": destination.suburb,
            "city": destination.city,
            "province": destination.province,
            "postal_code": destination.postal_code,
            "country": destination.country,
        },
        "parcels": [
            {
                "length": p.length,
                "width": p.width,
                "height": p.height,
                "weight": p.weight,
            }
            for p in parcels
        ],
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{settings.tcg_api_url}/rate",
            json=payload,
            headers={
                "Authorization": f"Bearer {settings.tcg_api_key}",
                "Content-Type": "application/json",
            },
            timeout=30.0,
        )
        response.raise_for_status()
        data = response.json()

    # Parse response into ShippingQuote objects
    quotes = []
    for rate in data.get("rates", []):
        quotes.append(ShippingQuote(
            service_type=rate["service_type"],
            service_name=rate["service_name"],
            price=Decimal(str(rate["price"])),
            estimated_days=rate["estimated_days"],
            estimated_delivery=datetime.fromisoformat(rate["estimated_delivery"]),
        ))

    return quotes


async def create_shipment(
    destination: Address,
    parcels: list[Parcel],
    service_type: str,
    order_reference: str,
) -> Shipment:
    """Create a shipment with TCG.

    Args:
        destination: Delivery address
        parcels: List of parcels to ship
        service_type: Selected service type from quote
        order_reference: Our order ID for reference

    Returns:
        Shipment details including waybill number
    """
    settings = get_settings()

    if settings.tcg_sandbox:
        return _create_mock_shipment(destination, service_type)

    return await _create_tcg_shipment(destination, parcels, service_type, order_reference)


def _create_mock_shipment(destination: Address, service_type: str) -> Shipment:
    """Create a mock shipment for development."""
    # Generate mock waybill number
    waybill = f"TCG{random.randint(100000000, 999999999)}"

    days = MOCK_DELIVERY_DAYS.get(destination.province, MOCK_DELIVERY_DAYS["Northern Cape"])
    delivery_days = days.get(service_type, 3)

    now = datetime.now()
    collection_date = now + timedelta(days=1)
    estimated_delivery = now + timedelta(days=delivery_days + 1)

    # Skip weekends
    while collection_date.weekday() >= 5:
        collection_date += timedelta(days=1)
    while estimated_delivery.weekday() >= 5:
        estimated_delivery += timedelta(days=1)

    return Shipment(
        waybill=waybill,
        tracking_url=f"https://www.thecourierguy.co.za/track/{waybill}",
        label_url=None,  # Mock doesn't generate labels
        collection_date=collection_date,
        estimated_delivery=estimated_delivery,
    )


async def _create_tcg_shipment(
    destination: Address,
    parcels: list[Parcel],
    service_type: str,
    order_reference: str,
) -> Shipment:
    """Create a real shipment with TCG API."""
    settings = get_settings()
    warehouse = get_warehouse_address()

    payload = {
        "service_type": service_type,
        "reference": order_reference,
        "collection": {
            "address": warehouse.street,
            "suburb": warehouse.suburb,
            "city": warehouse.city,
            "province": warehouse.province,
            "postal_code": warehouse.postal_code,
            "country": warehouse.country,
            "contact_name": warehouse.contact_name,
            "contact_phone": warehouse.contact_phone,
            "contact_email": warehouse.contact_email,
        },
        "delivery": {
            "address": destination.street,
            "suburb": destination.suburb,
            "city": destination.city,
            "province": destination.province,
            "postal_code": destination.postal_code,
            "country": destination.country,
            "contact_name": destination.contact_name,
            "contact_phone": destination.contact_phone,
            "contact_email": destination.contact_email,
        },
        "parcels": [
            {
                "length": p.length,
                "width": p.width,
                "height": p.height,
                "weight": p.weight,
                "description": p.description,
            }
            for p in parcels
        ],
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{settings.tcg_api_url}/shipment",
            json=payload,
            headers={
                "Authorization": f"Bearer {settings.tcg_api_key}",
                "Content-Type": "application/json",
            },
            timeout=30.0,
        )
        response.raise_for_status()
        data = response.json()

    return Shipment(
        waybill=data["waybill"],
        tracking_url=data["tracking_url"],
        label_url=data.get("label_url"),
        collection_date=datetime.fromisoformat(data["collection_date"]),
        estimated_delivery=datetime.fromisoformat(data["estimated_delivery"]),
    )


async def get_tracking(waybill: str) -> list[TrackingEvent]:
    """Get tracking events for a shipment.

    Args:
        waybill: TCG waybill number

    Returns:
        List of tracking events in chronological order
    """
    settings = get_settings()

    if settings.tcg_sandbox:
        return _get_mock_tracking(waybill)

    return await _get_tcg_tracking(waybill)


def _get_mock_tracking(waybill: str) -> list[TrackingEvent]:
    """Generate mock tracking events for development."""
    now = datetime.now()

    # Generate a realistic tracking history
    events = [
        TrackingEvent(
            timestamp=now - timedelta(days=2, hours=14),
            status="COLLECTED",
            description="Parcel collected from sender",
            location="Centurion, Gauteng",
        ),
        TrackingEvent(
            timestamp=now - timedelta(days=2, hours=10),
            status="IN_TRANSIT",
            description="Parcel arrived at sorting facility",
            location="Johannesburg Hub",
        ),
        TrackingEvent(
            timestamp=now - timedelta(days=1, hours=16),
            status="IN_TRANSIT",
            description="Parcel departed sorting facility",
            location="Johannesburg Hub",
        ),
        TrackingEvent(
            timestamp=now - timedelta(days=1, hours=6),
            status="IN_TRANSIT",
            description="Parcel arrived at destination depot",
            location="Local Depot",
        ),
        TrackingEvent(
            timestamp=now - timedelta(hours=8),
            status="OUT_FOR_DELIVERY",
            description="Parcel out for delivery",
            location="Local Depot",
        ),
    ]

    # Randomly add delivered status
    if random.random() > 0.3:
        events.append(TrackingEvent(
            timestamp=now - timedelta(hours=2),
            status="DELIVERED",
            description="Parcel delivered successfully",
            location="Delivery Address",
        ))

    return events


async def _get_tcg_tracking(waybill: str) -> list[TrackingEvent]:
    """Get real tracking from TCG API."""
    settings = get_settings()

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.tcg_api_url}/shipment/{waybill}",
            headers={
                "Authorization": f"Bearer {settings.tcg_api_key}",
            },
            timeout=30.0,
        )
        response.raise_for_status()
        data = response.json()

    events = []
    for event in data.get("tracking_events", []):
        events.append(TrackingEvent(
            timestamp=datetime.fromisoformat(event["timestamp"]),
            status=event["status"],
            description=event["description"],
            location=event.get("location"),
        ))

    return events


# Tracking status constants
class TrackingStatus:
    PENDING = "PENDING"
    COLLECTED = "COLLECTED"
    IN_TRANSIT = "IN_TRANSIT"
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY"
    DELIVERED = "DELIVERED"
    FAILED_DELIVERY = "FAILED_DELIVERY"
    RETURNED = "RETURNED"
