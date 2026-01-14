"""Design template API endpoints."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from ..core.database import get_db
from ..models.design import DesignTemplate, DesignCategory
from ..schemas.design import DesignTemplateBase, DesignTemplateListResponse

router = APIRouter(prefix="/design-templates", tags=["Design Templates"])


@router.get("", response_model=DesignTemplateListResponse)
async def list_design_templates(
    db: Session = Depends(get_db),
    category: Optional[DesignCategory] = Query(
        None,
        description="Filter by category: wildlife, nature, sports, custom, patterns"
    ),
):
    """
    List all design templates for fire pit personalisation.

    - **category**: Optional filter by design category

    Returns a list of pre-made design templates that customers can choose from
    for their personalised fire pit orders.
    """
    query = db.query(DesignTemplate)

    # Apply category filter if provided
    if category:
        query = query.filter(DesignTemplate.category == category)

    # Order by category then name
    query = query.order_by(DesignTemplate.category, DesignTemplate.name)

    templates = query.all()

    return DesignTemplateListResponse(
        templates=[DesignTemplateBase.model_validate(t) for t in templates],
        total=len(templates),
    )
