"""Pydantic schemas for design templates."""
from pydantic import BaseModel
from ..models.design import DesignCategory


class DesignTemplateBase(BaseModel):
    """Base design template schema."""
    id: int
    name: str
    category: DesignCategory
    thumbnail: str | None = None
    svg_path: str | None = None

    class Config:
        from_attributes = True


class DesignTemplateListResponse(BaseModel):
    """Response schema for design template list endpoint."""
    templates: list[DesignTemplateBase]
    total: int
