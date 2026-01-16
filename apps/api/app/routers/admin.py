"""Admin API endpoints for product, collection, and order management."""
from fastapi import APIRouter, Depends, HTTPException, Query, Header, status
from sqlalchemy.orm import Session, joinedload
from typing import Optional
import hashlib
import hmac
import os

from ..core.database import get_db
from ..core.config import get_settings
from ..models.product import Product, Variant, ProductImage, ReviewSummary
from ..models.collection import Collection, PromoBlock
from ..models.order import Order, OrderItem, OrderStatus
from ..schemas.admin import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    VariantCreate,
    VariantUpdate,
    ProductImageCreate,
    CollectionCreate,
    CollectionUpdate,
    CollectionResponse,
    PromoBlockCreate,
    PromoBlockUpdate,
    PromoBlockResponse,
    OrderStatusUpdate,
    OrderAdminResponse,
    OrderListResponse,
    OrderItemResponse,
    MessageResponse,
)

router = APIRouter(prefix="/admin", tags=["Admin"])

settings = get_settings()

# Admin API key from environment variable (simple auth for MVP)
ADMIN_API_KEY = os.getenv("ADMIN_API_KEY", "koosdoos-admin-secret-key-change-in-production")


# ============================================
# Admin Authentication Middleware
# ============================================

async def verify_admin_token(x_admin_api_key: str = Header(..., alias="X-Admin-API-Key")):
    """
    Verify admin API key from header.

    In production, this should be replaced with proper JWT authentication
    or OAuth2 with user roles.
    """
    if not hmac.compare_digest(x_admin_api_key, ADMIN_API_KEY):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin API key",
            headers={"WWW-Authenticate": "ApiKey"},
        )
    return True


# ============================================
# Product Admin Endpoints
# ============================================

@router.post("/products", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db),
    _: bool = Depends(verify_admin_token),
):
    """
    Create a new product with variants and images.

    Requires admin API key in X-Admin-API-Key header.
    """
    # Check for duplicate slug
    existing = db.query(Product).filter(Product.slug == product_data.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Product with slug '{product_data.slug}' already exists",
        )

    # Create product
    product = Product(
        slug=product_data.slug,
        title=product_data.title,
        subtitle=product_data.subtitle,
        description=product_data.description,
        badges=product_data.badges,
        seats_min=product_data.seats_min,
        seats_max=product_data.seats_max,
        material=product_data.material,
        finish=product_data.finish,
    )
    db.add(product)
    db.flush()  # Get product ID

    # Create variants
    for variant_data in product_data.variants:
        # Check for duplicate SKU
        existing_sku = db.query(Variant).filter(Variant.sku == variant_data.sku).first()
        if existing_sku:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Variant with SKU '{variant_data.sku}' already exists",
            )

        variant = Variant(
            product_id=product.id,
            sku=variant_data.sku,
            price=variant_data.price,
            compare_at_price=variant_data.compare_at_price,
            inventory_qty=variant_data.inventory_qty,
            weight=variant_data.weight,
            dimensions_mm=variant_data.dimensions_mm,
        )
        db.add(variant)

    # Create images
    for image_data in product_data.images:
        image = ProductImage(
            product_id=product.id,
            url=image_data.url,
            alt=image_data.alt,
            sort_order=image_data.sort_order,
        )
        db.add(image)

    # Create review summary if provided
    if product_data.review_summary:
        review = ReviewSummary(
            product_id=product.id,
            rating_avg=product_data.review_summary.rating_avg,
            rating_count=product_data.review_summary.rating_count,
        )
        db.add(review)

    db.commit()
    db.refresh(product)

    return ProductResponse.model_validate(product)


@router.put("/products/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: Session = Depends(get_db),
    _: bool = Depends(verify_admin_token),
):
    """
    Update an existing product.

    Only fields provided in the request body will be updated.
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found",
        )

    # Check for slug conflict if updating slug
    if product_data.slug and product_data.slug != product.slug:
        existing = db.query(Product).filter(Product.slug == product_data.slug).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Product with slug '{product_data.slug}' already exists",
            )

    # Update only provided fields
    update_data = product_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)

    return ProductResponse.model_validate(product)


@router.delete("/products/{product_id}", response_model=MessageResponse)
async def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    _: bool = Depends(verify_admin_token),
):
    """
    Delete a product and all its related data (variants, images, review summary).

    This is a permanent deletion - use with caution.
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found",
        )

    # Check if product is in any orders
    order_items = db.query(OrderItem).filter(OrderItem.product_id == product_id).first()
    if order_items:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot delete product that has existing orders. Consider marking as inactive instead.",
        )

    product_title = product.title
    db.delete(product)
    db.commit()

    return MessageResponse(message=f"Product '{product_title}' deleted successfully", id=product_id)


# ============================================
# Variant Admin Endpoints
# ============================================

@router.post("/products/{product_id}/variants", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def add_variant(
    product_id: int,
    variant_data: VariantCreate,
    db: Session = Depends(get_db),
    _: bool = Depends(verify_admin_token),
):
    """Add a new variant to an existing product."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found",
        )

    # Check for duplicate SKU
    existing_sku = db.query(Variant).filter(Variant.sku == variant_data.sku).first()
    if existing_sku:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Variant with SKU '{variant_data.sku}' already exists",
        )

    variant = Variant(
        product_id=product_id,
        sku=variant_data.sku,
        price=variant_data.price,
        compare_at_price=variant_data.compare_at_price,
        inventory_qty=variant_data.inventory_qty,
        weight=variant_data.weight,
        dimensions_mm=variant_data.dimensions_mm,
    )
    db.add(variant)
    db.commit()

    return MessageResponse(message=f"Variant '{variant_data.sku}' added successfully", id=variant.id)


@router.put("/variants/{variant_id}", response_model=MessageResponse)
async def update_variant(
    variant_id: int,
    variant_data: VariantUpdate,
    db: Session = Depends(get_db),
    _: bool = Depends(verify_admin_token),
):
    """Update an existing variant."""
    variant = db.query(Variant).filter(Variant.id == variant_id).first()
    if not variant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Variant with ID {variant_id} not found",
        )

    # Check for SKU conflict if updating SKU
    if variant_data.sku and variant_data.sku != variant.sku:
        existing = db.query(Variant).filter(Variant.sku == variant_data.sku).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Variant with SKU '{variant_data.sku}' already exists",
            )

    update_data = variant_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(variant, field, value)

    db.commit()

    return MessageResponse(message=f"Variant updated successfully", id=variant_id)


@router.delete("/variants/{variant_id}", response_model=MessageResponse)
async def delete_variant(
    variant_id: int,
    db: Session = Depends(get_db),
    _: bool = Depends(verify_admin_token),
):
    """Delete a variant."""
    variant = db.query(Variant).filter(Variant.id == variant_id).first()
    if not variant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Variant with ID {variant_id} not found",
        )

    # Check if variant is in any orders
    order_items = db.query(OrderItem).filter(OrderItem.variant_id == variant_id).first()
    if order_items:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot delete variant that has existing orders.",
        )

    db.delete(variant)
    db.commit()

    return MessageResponse(message="Variant deleted successfully", id=variant_id)


# ============================================
# Collection Admin Endpoints
# ============================================

@router.post("/collections", response_model=CollectionResponse, status_code=status.HTTP_201_CREATED)
async def create_collection(
    collection_data: CollectionCreate,
    db: Session = Depends(get_db),
    _: bool = Depends(verify_admin_token),
):
    """Create a new collection."""
    # Check for duplicate slug
    existing = db.query(Collection).filter(Collection.slug == collection_data.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Collection with slug '{collection_data.slug}' already exists",
        )

    collection = Collection(
        slug=collection_data.slug,
        title=collection_data.title,
        hero_copy=collection_data.hero_copy,
    )

    # Add products to collection
    if collection_data.product_ids:
        products = db.query(Product).filter(Product.id.in_(collection_data.product_ids)).all()
        found_ids = {p.id for p in products}
        missing_ids = set(collection_data.product_ids) - found_ids
        if missing_ids:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Products with IDs {list(missing_ids)} not found",
            )
        collection.products = products

    db.add(collection)
    db.commit()
    db.refresh(collection)

    return CollectionResponse.model_validate(collection)


@router.put("/collections/{collection_id}", response_model=CollectionResponse)
async def update_collection(
    collection_id: int,
    collection_data: CollectionUpdate,
    db: Session = Depends(get_db),
    _: bool = Depends(verify_admin_token),
):
    """Update an existing collection."""
    collection = db.query(Collection).filter(Collection.id == collection_id).first()
    if not collection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Collection with ID {collection_id} not found",
        )

    # Check for slug conflict if updating slug
    if collection_data.slug and collection_data.slug != collection.slug:
        existing = db.query(Collection).filter(Collection.slug == collection_data.slug).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Collection with slug '{collection_data.slug}' already exists",
            )

    # Update basic fields
    update_data = collection_data.model_dump(exclude_unset=True, exclude={"product_ids"})
    for field, value in update_data.items():
        setattr(collection, field, value)

    # Update product associations if provided
    if collection_data.product_ids is not None:
        products = db.query(Product).filter(Product.id.in_(collection_data.product_ids)).all()
        found_ids = {p.id for p in products}
        missing_ids = set(collection_data.product_ids) - found_ids
        if missing_ids:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Products with IDs {list(missing_ids)} not found",
            )
        collection.products = products

    db.commit()
    db.refresh(collection)

    return CollectionResponse.model_validate(collection)


@router.delete("/collections/{collection_id}", response_model=MessageResponse)
async def delete_collection(
    collection_id: int,
    db: Session = Depends(get_db),
    _: bool = Depends(verify_admin_token),
):
    """Delete a collection."""
    collection = db.query(Collection).filter(Collection.id == collection_id).first()
    if not collection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Collection with ID {collection_id} not found",
        )

    collection_title = collection.title
    db.delete(collection)
    db.commit()

    return MessageResponse(message=f"Collection '{collection_title}' deleted successfully", id=collection_id)


# ============================================
# Promo Block Admin Endpoints
# ============================================

@router.post("/promo-blocks", response_model=PromoBlockResponse, status_code=status.HTTP_201_CREATED)
async def create_promo_block(
    promo_data: PromoBlockCreate,
    db: Session = Depends(get_db),
    _: bool = Depends(verify_admin_token),
):
    """Create a new promo block."""
    # Verify collection exists
    collection = db.query(Collection).filter(Collection.id == promo_data.collection_id).first()
    if not collection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Collection with ID {promo_data.collection_id} not found",
        )

    promo = PromoBlock(
        collection_id=promo_data.collection_id,
        position_index=promo_data.position_index,
        title=promo_data.title,
        copy=promo_data.copy,
        cta_text=promo_data.cta_text,
        cta_url=promo_data.cta_url,
        image_url=promo_data.image_url,
    )
    db.add(promo)
    db.commit()
    db.refresh(promo)

    return PromoBlockResponse.model_validate(promo)


@router.put("/promo-blocks/{promo_id}", response_model=PromoBlockResponse)
async def update_promo_block(
    promo_id: int,
    promo_data: PromoBlockUpdate,
    db: Session = Depends(get_db),
    _: bool = Depends(verify_admin_token),
):
    """Update an existing promo block."""
    promo = db.query(PromoBlock).filter(PromoBlock.id == promo_id).first()
    if not promo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Promo block with ID {promo_id} not found",
        )

    # Verify new collection exists if updating collection_id
    if promo_data.collection_id and promo_data.collection_id != promo.collection_id:
        collection = db.query(Collection).filter(Collection.id == promo_data.collection_id).first()
        if not collection:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Collection with ID {promo_data.collection_id} not found",
            )

    update_data = promo_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(promo, field, value)

    db.commit()
    db.refresh(promo)

    return PromoBlockResponse.model_validate(promo)


@router.delete("/promo-blocks/{promo_id}", response_model=MessageResponse)
async def delete_promo_block(
    promo_id: int,
    db: Session = Depends(get_db),
    _: bool = Depends(verify_admin_token),
):
    """Delete a promo block."""
    promo = db.query(PromoBlock).filter(PromoBlock.id == promo_id).first()
    if not promo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Promo block with ID {promo_id} not found",
        )

    db.delete(promo)
    db.commit()

    return MessageResponse(message="Promo block deleted successfully", id=promo_id)


# ============================================
# Order Admin Endpoints
# ============================================

@router.get("/orders", response_model=OrderListResponse)
async def list_orders(
    db: Session = Depends(get_db),
    _: bool = Depends(verify_admin_token),
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(20, ge=1, le=100, description="Items per page"),
    status: Optional[OrderStatus] = Query(None, description="Filter by order status"),
    customer_email: Optional[str] = Query(None, description="Filter by customer email"),
):
    """
    List all orders with pagination and optional filters.

    Returns orders sorted by creation date (newest first).
    """
    query = db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.product),
        joinedload(Order.items).joinedload(OrderItem.variant),
    )

    # Apply filters
    if status:
        query = query.filter(Order.status == status)
    if customer_email:
        query = query.filter(Order.customer_email.ilike(f"%{customer_email}%"))

    # Get total count
    total = query.count()

    # Apply sorting and pagination
    orders = (
        query
        .order_by(Order.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )

    # Calculate total pages
    total_pages = (total + per_page - 1) // per_page if total > 0 else 1

    # Build response with product/variant info
    order_responses = []
    for order in orders:
        items = []
        for item in order.items:
            item_response = OrderItemResponse(
                id=item.id,
                product_id=item.product_id,
                variant_id=item.variant_id,
                quantity=item.quantity,
                price=item.price,
                product_title=item.product.title if item.product else None,
                variant_sku=item.variant.sku if item.variant else None,
            )
            items.append(item_response)

        order_response = OrderAdminResponse(
            id=order.id,
            payfast_payment_id=order.payfast_payment_id,
            status=order.status,
            customer_email=order.customer_email,
            total=order.total,
            shipping_address=order.shipping_address,
            created_at=order.created_at,
            updated_at=order.updated_at,
            items=items,
        )
        order_responses.append(order_response)

    return OrderListResponse(
        orders=order_responses,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=total_pages,
    )


@router.get("/orders/{order_id}", response_model=OrderAdminResponse)
async def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    _: bool = Depends(verify_admin_token),
):
    """Get a single order by ID with full details."""
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
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with ID {order_id} not found",
        )

    items = []
    for item in order.items:
        item_response = OrderItemResponse(
            id=item.id,
            product_id=item.product_id,
            variant_id=item.variant_id,
            quantity=item.quantity,
            price=item.price,
            product_title=item.product.title if item.product else None,
            variant_sku=item.variant.sku if item.variant else None,
        )
        items.append(item_response)

    return OrderAdminResponse(
        id=order.id,
        payfast_payment_id=order.payfast_payment_id,
        status=order.status,
        customer_email=order.customer_email,
        total=order.total,
        shipping_address=order.shipping_address,
        created_at=order.created_at,
        updated_at=order.updated_at,
        items=items,
    )


@router.put("/orders/{order_id}/status", response_model=OrderAdminResponse)
async def update_order_status(
    order_id: int,
    status_data: OrderStatusUpdate,
    db: Session = Depends(get_db),
    _: bool = Depends(verify_admin_token),
):
    """
    Update the status of an order.

    Valid status transitions:
    - pending -> paid, cancelled
    - paid -> processing, refunded, cancelled
    - processing -> shipped, cancelled
    - shipped -> delivered
    - delivered -> refunded
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
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with ID {order_id} not found",
        )

    # Define valid status transitions
    valid_transitions = {
        OrderStatus.PENDING: [OrderStatus.PAID, OrderStatus.CANCELLED],
        OrderStatus.PAID: [OrderStatus.PROCESSING, OrderStatus.REFUNDED, OrderStatus.CANCELLED],
        OrderStatus.PROCESSING: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
        OrderStatus.SHIPPED: [OrderStatus.DELIVERED],
        OrderStatus.DELIVERED: [OrderStatus.REFUNDED],
        OrderStatus.CANCELLED: [],
        OrderStatus.REFUNDED: [],
    }

    current_status = order.status
    new_status = status_data.status

    if new_status not in valid_transitions.get(current_status, []):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status transition from '{current_status.value}' to '{new_status.value}'",
        )

    order.status = new_status
    db.commit()
    db.refresh(order)

    items = []
    for item in order.items:
        item_response = OrderItemResponse(
            id=item.id,
            product_id=item.product_id,
            variant_id=item.variant_id,
            quantity=item.quantity,
            price=item.price,
            product_title=item.product.title if item.product else None,
            variant_sku=item.variant.sku if item.variant else None,
        )
        items.append(item_response)

    return OrderAdminResponse(
        id=order.id,
        payfast_payment_id=order.payfast_payment_id,
        status=order.status,
        customer_email=order.customer_email,
        total=order.total,
        shipping_address=order.shipping_address,
        created_at=order.created_at,
        updated_at=order.updated_at,
        items=items,
    )


# ============================================
# Product Image Admin Endpoints
# ============================================

@router.post("/products/{product_id}/images", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def add_product_image(
    product_id: int,
    image_data: ProductImageCreate,
    db: Session = Depends(get_db),
    _: bool = Depends(verify_admin_token),
):
    """Add a new image to a product."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found",
        )

    image = ProductImage(
        product_id=product_id,
        url=image_data.url,
        alt=image_data.alt,
        sort_order=image_data.sort_order,
    )
    db.add(image)
    db.commit()

    return MessageResponse(message="Image added successfully", id=image.id)


@router.delete("/images/{image_id}", response_model=MessageResponse)
async def delete_product_image(
    image_id: int,
    db: Session = Depends(get_db),
    _: bool = Depends(verify_admin_token),
):
    """Delete a product image."""
    image = db.query(ProductImage).filter(ProductImage.id == image_id).first()
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Image with ID {image_id} not found",
        )

    db.delete(image)
    db.commit()

    return MessageResponse(message="Image deleted successfully", id=image_id)
