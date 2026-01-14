"""Collection API endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from ..core.database import get_db
from ..models.collection import Collection
from ..models.product import Product
from ..schemas.collection import CollectionList, CollectionDetail, CollectionListResponse

router = APIRouter(prefix="/collections", tags=["Collections"])


@router.get("", response_model=CollectionListResponse)
async def list_collections(
    db: Session = Depends(get_db),
):
    """
    List all collections.

    Returns a list of all product collections without their associated products.
    Use GET /collections/{slug} to get a collection with its products.
    """
    collections = db.query(Collection).order_by(Collection.id.asc()).all()

    return CollectionListResponse(
        collections=[CollectionList.model_validate(c) for c in collections],
        total=len(collections),
    )


@router.get("/{slug}", response_model=CollectionDetail)
async def get_collection_by_slug(
    slug: str,
    db: Session = Depends(get_db),
):
    """
    Get a single collection by its slug with all associated products.

    - **slug**: The collection's URL-friendly slug

    Returns full collection details including products and promo blocks.
    """
    collection = (
        db.query(Collection)
        .options(
            joinedload(Collection.products).joinedload(Product.variants),
            joinedload(Collection.products).joinedload(Product.images),
            joinedload(Collection.products).joinedload(Product.review_summary),
            joinedload(Collection.promo_blocks),
        )
        .filter(Collection.slug == slug)
        .first()
    )

    if not collection:
        raise HTTPException(status_code=404, detail=f"Collection with slug '{slug}' not found")

    return CollectionDetail.model_validate(collection)
