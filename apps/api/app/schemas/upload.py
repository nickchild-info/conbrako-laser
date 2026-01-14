"""Upload-related Pydantic schemas."""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class UploadDesignResponse(BaseModel):
    """Response for design file upload."""
    file_id: str = Field(..., description="Unique identifier for the uploaded file")
    file_url: str = Field(..., description="URL to access the uploaded file")
    thumbnail_url: Optional[str] = Field(None, description="URL to the generated thumbnail")
    file_name: str = Field(..., description="Original file name")
    file_type: str = Field(..., description="MIME type of the file")
    file_size: int = Field(..., description="File size in bytes")
    is_valid: bool = Field(..., description="Whether the file passed validation")
    validation_errors: list[str] = Field(default_factory=list, description="List of validation errors if any")
    uploaded_at: datetime = Field(default_factory=datetime.utcnow, description="Upload timestamp")


class DXFValidationResult(BaseModel):
    """Result of DXF file validation."""
    is_valid: bool = Field(..., description="Whether the DXF file is valid")
    errors: list[str] = Field(default_factory=list, description="List of validation errors")
    warnings: list[str] = Field(default_factory=list, description="List of warnings")
    entity_count: Optional[int] = Field(None, description="Number of entities in the DXF file")
    layers: list[str] = Field(default_factory=list, description="List of layers found in the file")
    bounding_box: Optional[dict] = Field(None, description="Bounding box dimensions")


class UploadErrorResponse(BaseModel):
    """Error response for upload failures."""
    error: str = Field(..., description="Error message")
    details: Optional[str] = Field(None, description="Detailed error information")
