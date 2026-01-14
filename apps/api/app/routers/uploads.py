"""Upload endpoints for design files."""
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from typing import Optional
from datetime import datetime
import io

from ..schemas.upload import (
    UploadDesignResponse,
    DXFValidationResult,
    UploadErrorResponse,
)
from ..services.storage import StorageService
from ..services.dxf_validator import DXFValidator, ImageValidator

router = APIRouter(prefix="/uploads", tags=["uploads"])

# Allowed file types for design uploads
ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".svg", ".dxf"}
ALLOWED_MIME_TYPES = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/svg+xml": ".svg",
    "application/dxf": ".dxf",
    "image/vnd.dxf": ".dxf",
    "application/x-dxf": ".dxf",
    "image/x-dxf": ".dxf",
    # Some systems report DXF as octet-stream
    "application/octet-stream": None,  # Need to check extension
}

# Maximum file size (10MB)
MAX_FILE_SIZE = 10 * 1024 * 1024


def get_storage_service() -> StorageService:
    """Dependency to get storage service."""
    return StorageService()


def get_dxf_validator() -> DXFValidator:
    """Dependency to get DXF validator."""
    return DXFValidator()


def get_image_validator() -> ImageValidator:
    """Dependency to get image validator."""
    return ImageValidator()


@router.post(
    "/design",
    response_model=UploadDesignResponse,
    responses={
        400: {"model": UploadErrorResponse, "description": "Invalid file"},
        413: {"model": UploadErrorResponse, "description": "File too large"},
    },
    summary="Upload custom design file",
    description="Upload a design file (PNG, JPG, SVG, or DXF) for personalised fire pit cutting.",
)
async def upload_design(
    file: UploadFile = File(..., description="Design file to upload"),
    storage_service: StorageService = Depends(get_storage_service),
    dxf_validator: DXFValidator = Depends(get_dxf_validator),
    image_validator: ImageValidator = Depends(get_image_validator),
) -> UploadDesignResponse:
    """
    Upload a custom design file for personalised fire pit.

    Supported formats:
    - **PNG**: Raster image (recommended minimum 500x500px)
    - **JPG/JPEG**: Raster image (recommended minimum 500x500px)
    - **SVG**: Vector format (best for clean cuts)
    - **DXF**: CAD format (professional laser cutting format)

    DXF files undergo additional validation to ensure compatibility
    with laser cutting equipment.
    """
    # Check filename
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="File must have a filename"
        )

    # Get file extension
    filename_lower = file.filename.lower()
    file_ext = "." + filename_lower.split(".")[-1] if "." in filename_lower else ""

    # Validate extension
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{file_ext}' is not allowed. Allowed types: PNG, JPG, SVG, DXF"
        )

    # Read file content
    file_content = await file.read()
    file_size = len(file_content)

    # Check file size
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File size ({file_size / 1024 / 1024:.2f}MB) exceeds maximum allowed ({MAX_FILE_SIZE / 1024 / 1024}MB)"
        )

    if file_size == 0:
        raise HTTPException(
            status_code=400,
            detail="File is empty"
        )

    # Determine content type
    content_type = file.content_type or "application/octet-stream"

    # Validate file based on type
    validation_errors = []
    validation_warnings = []

    if file_ext == ".dxf":
        # DXF validation
        validation_result = await dxf_validator.validate(file_content, file.filename)
        validation_errors = validation_result.get("errors", [])
        validation_warnings = validation_result.get("warnings", [])
    else:
        # Image validation
        validation_result = await image_validator.validate(file_content, file.filename, content_type)
        validation_errors = validation_result.get("errors", [])
        validation_warnings = validation_result.get("warnings", [])

    # If validation fails, still upload but mark as invalid
    is_valid = len(validation_errors) == 0

    # Upload file to storage
    upload_result = await storage_service.upload_file(
        file_content=file_content,
        original_filename=file.filename,
        content_type=content_type,
        prefix="designs"
    )

    # Generate thumbnail for images (not for DXF)
    thumbnail_url = None
    if is_valid and file_ext in {".png", ".jpg", ".jpeg"}:
        thumbnail_url = await _generate_thumbnail(
            file_content,
            upload_result["storage_key"],
            storage_service
        )

    return UploadDesignResponse(
        file_id=upload_result["file_id"],
        file_url=upload_result["file_url"],
        thumbnail_url=thumbnail_url,
        file_name=file.filename,
        file_type=content_type,
        file_size=file_size,
        is_valid=is_valid,
        validation_errors=validation_errors + validation_warnings,
        uploaded_at=datetime.utcnow(),
    )


@router.post(
    "/design/validate-dxf",
    response_model=DXFValidationResult,
    responses={
        400: {"model": UploadErrorResponse, "description": "Invalid file"},
    },
    summary="Validate DXF file without uploading",
    description="Validate a DXF file for laser cutting compatibility without storing it.",
)
async def validate_dxf(
    file: UploadFile = File(..., description="DXF file to validate"),
    dxf_validator: DXFValidator = Depends(get_dxf_validator),
) -> DXFValidationResult:
    """
    Validate a DXF file for laser cutting compatibility.

    This endpoint validates the DXF file structure and content
    without storing the file, useful for pre-upload validation.

    Checks performed:
    - File format and structure
    - Entity types (LINE, CIRCLE, ARC, POLYLINE, etc.)
    - Bounding box calculation
    - Layer extraction
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="File must have a filename")

    if not file.filename.lower().endswith(".dxf"):
        raise HTTPException(status_code=400, detail="File must be a DXF file")

    file_content = await file.read()

    if len(file_content) == 0:
        raise HTTPException(status_code=400, detail="File is empty")

    result = await dxf_validator.validate(file_content, file.filename)

    return DXFValidationResult(
        is_valid=result["is_valid"],
        errors=result["errors"],
        warnings=result["warnings"],
        entity_count=result["entity_count"],
        layers=result["layers"],
        bounding_box=result["bounding_box"],
    )


async def _generate_thumbnail(
    file_content: bytes,
    original_key: str,
    storage_service: StorageService,
    max_size: int = 200
) -> Optional[str]:
    """
    Generate a thumbnail for an image file.

    Args:
        file_content: Original image content
        original_key: Storage key of original file
        storage_service: Storage service instance
        max_size: Maximum dimension for thumbnail

    Returns:
        URL to thumbnail or None if generation fails
    """
    try:
        from PIL import Image

        # Open image
        img = Image.open(io.BytesIO(file_content))

        # Convert to RGB if necessary (for PNG with transparency)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")

        # Calculate thumbnail size maintaining aspect ratio
        img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)

        # Save to bytes
        thumb_buffer = io.BytesIO()
        img.save(thumb_buffer, format="PNG", optimize=True)
        thumb_content = thumb_buffer.getvalue()

        # Upload thumbnail
        return await storage_service.upload_thumbnail(thumb_content, original_key)

    except ImportError:
        # Pillow not installed
        return None
    except Exception:
        # Failed to generate thumbnail
        return None
