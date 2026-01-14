"""Product API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import Optional

from ..core.database import get_db
from ..models.product import Product, Variant
from ..schemas.product import ProductList, ProductDetail, ProductListResponse

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=ProductListResponse)
async def list_products(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(12, ge=1, le=100, description="Items per page"),
    sort: Optional[str] = Query(
        None,
        description="Sort field: featured, price_asc, price_desc, rating, newest"
    ),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price filter"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price filter"),
    badges: Optional[str] = Query(None, description="Comma-separated badge filters (e.g., bestseller,new)"),
):
    """
    List all products with optional filtering and sorting.

    - **page**: Page number for pagination (default: 1)
    - **per_page**: Number of items per page (default: 12, max: 100)
    - **sort**: Sort order (featured, price_asc, price_desc, rating, newest)
    - **min_price**: Filter by minimum price
    - **max_price**: Filter by maximum price
    - **badges**: Filter by badges (comma-separated)
    """
    # Base query with eager loading
    query = db.query(Product).options(
        joinedload(Product.variants),
        joinedload(Product.images),
        joinedload(Product.review_summary),
    )

    # Apply price filters (using subquery on variants)
    if min_price is not None or max_price is not None:
        variant_subquery = db.query(Variant.product_id).distinct()
        if min_price is not None:
            variant_subquery = variant_subquery.filter(Variant.price >= min_price)
        if max_price is not None:
            variant_subquery = variant_subquery.filter(Variant.price <= max_price)
        query = query.filter(Product.id.in_(variant_subquery))

    # Apply badge filter
    if badges:
        badge_list = [b.strip().lower() for b in badges.split(",")]
        for badge in badge_list:
            query = query.filter(Product.badges.any(badge))

    # Apply sorting
    if sort == "price_asc":
        # Sort by minimum variant price ascending
        query = query.outerjoin(Product.variants).group_by(Product.id).order_by(
            db.query(Variant.price).filter(Variant.product_id == Product.id).order_by(Variant.price.asc()).limit(1).scalar_subquery()
        )
    elif sort == "price_desc":
        # Sort by minimum variant price descending
        query = query.outerjoin(Product.variants).group_by(Product.id).order_by(
            db.query(Variant.price).filter(Variant.product_id == Product.id).order_by(Variant.price.asc()).limit(1).scalar_subquery().desc()
        )
    elif sort == "rating":
        query = query.outerjoin(Product.review_summary).order_by(
            Product.review_summary.has() == False,  # Products with reviews first
            Product.review_summary.property.mapper.class_.rating_avg.desc()
        )
    elif sort == "newest":
        query = query.order_by(Product.id.desc())
    else:
        # Default: featured (by ID for now, could add featured flag later)
        query = query.order_by(Product.id.asc())

    # Get total count before pagination
    # Use a separate count query for efficiency
    count_query = db.query(Product)
    if min_price is not None or max_price is not None:
        variant_subquery = db.query(Variant.product_id).distinct()
        if min_price is not None:
            variant_subquery = variant_subquery.filter(Variant.price >= min_price)
        if max_price is not None:
            variant_subquery = variant_subquery.filter(Variant.price <= max_price)
        count_query = count_query.filter(Product.id.in_(variant_subquery))
    if badges:
        badge_list = [b.strip().lower() for b in badges.split(",")]
        for badge in badge_list:
            count_query = count_query.filter(Product.badges.any(badge))

    total = count_query.count()

    # Apply pagination
    offset = (page - 1) * per_page
    products = query.offset(offset).limit(per_page).all()

    # Calculate total pages
    total_pages = (total + per_page - 1) // per_page if total > 0 else 1

    return ProductListResponse(
        products=[ProductList.model_validate(p) for p in products],
        total=total,
        page=page,
        per_page=per_page,
        total_pages=total_pages,
    )


@router.get("/{slug}", response_model=ProductDetail)
async def get_product_by_slug(
    slug: str,
    db: Session = Depends(get_db),
):
    """
    Get a single product by its slug.

    - **slug**: The product's URL-friendly slug

    Returns full product details including variants, images, and review summary.
    """
    product = (
        db.query(Product)
        .options(
            joinedload(Product.variants),
            joinedload(Product.images),
            joinedload(Product.review_summary),
        )
        .filter(Product.slug == slug)
        .first()
    )

    if not product:
        raise HTTPException(status_code=404, detail=f"Product with slug '{slug}' not found")

    return ProductDetail.model_validate(product)
