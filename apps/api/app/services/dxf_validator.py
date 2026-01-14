"""DXF file validation service."""
from typing import Optional
import io


class DXFValidator:
    """Validator for DXF (AutoCAD Drawing Exchange Format) files."""

    # Maximum file size for DXF files (10MB)
    MAX_FILE_SIZE = 10 * 1024 * 1024

    # Required DXF sections
    REQUIRED_SECTIONS = ["HEADER", "ENTITIES"]

    # Allowed entity types for laser cutting
    ALLOWED_ENTITIES = [
        "LINE", "CIRCLE", "ARC", "POLYLINE", "LWPOLYLINE",
        "SPLINE", "ELLIPSE", "POINT", "TEXT", "MTEXT"
    ]

    def __init__(self):
        """Initialize DXF validator."""
        self._ezdxf_available = False
        try:
            import ezdxf
            self._ezdxf_available = True
        except ImportError:
            pass

    async def validate(self, file_content: bytes, filename: str) -> dict:
        """
        Validate a DXF file for laser cutting compatibility.

        Args:
            file_content: The DXF file content as bytes
            filename: Original filename

        Returns:
            dict with validation results
        """
        errors = []
        warnings = []
        entity_count = 0
        layers = []
        bounding_box = None

        # Check file size
        file_size = len(file_content)
        if file_size > self.MAX_FILE_SIZE:
            errors.append(f"File size ({file_size / 1024 / 1024:.2f}MB) exceeds maximum allowed ({self.MAX_FILE_SIZE / 1024 / 1024}MB)")

        # Check file extension
        if not filename.lower().endswith('.dxf'):
            errors.append("File must have .dxf extension")

        # Basic structure validation
        try:
            content_str = file_content.decode('utf-8', errors='ignore')
        except Exception:
            try:
                content_str = file_content.decode('latin-1', errors='ignore')
            except Exception:
                errors.append("Unable to decode file content")
                return self._build_result(False, errors, warnings, entity_count, layers, bounding_box)

        # Check for DXF header markers
        if "0\nSECTION" not in content_str and "0\r\nSECTION" not in content_str:
            errors.append("Invalid DXF format: Missing SECTION markers")

        if "ENDSEC" not in content_str:
            errors.append("Invalid DXF format: Missing ENDSEC markers")

        if "EOF" not in content_str:
            warnings.append("DXF file may be incomplete: Missing EOF marker")

        # Check for ENTITIES section (required for laser cutting)
        if "ENTITIES" not in content_str:
            errors.append("DXF file must contain ENTITIES section for laser cutting")

        # Try advanced validation with ezdxf if available
        if self._ezdxf_available and not errors:
            try:
                import ezdxf
                doc = ezdxf.read(io.BytesIO(file_content))

                # Count entities
                modelspace = doc.modelspace()
                entity_count = len(list(modelspace))

                if entity_count == 0:
                    errors.append("DXF file contains no entities to cut")

                # Get layers
                layers = [layer.dxf.name for layer in doc.layers]

                # Check for problematic entities
                entity_types = set()
                for entity in modelspace:
                    entity_types.add(entity.dxftype())

                # Warn about text entities (may not render correctly)
                if "TEXT" in entity_types or "MTEXT" in entity_types:
                    warnings.append("File contains text entities - text will be converted to outlines for cutting")

                # Calculate bounding box
                try:
                    from ezdxf import bbox
                    cache = bbox.Cache()
                    bounding_box_result = bbox.extents(modelspace, cache=cache)
                    if bounding_box_result.has_data:
                        bounding_box = {
                            "min_x": round(bounding_box_result.extmin.x, 2),
                            "min_y": round(bounding_box_result.extmin.y, 2),
                            "max_x": round(bounding_box_result.extmax.x, 2),
                            "max_y": round(bounding_box_result.extmax.y, 2),
                            "width": round(bounding_box_result.extmax.x - bounding_box_result.extmin.x, 2),
                            "height": round(bounding_box_result.extmax.y - bounding_box_result.extmin.y, 2),
                        }
                except Exception:
                    warnings.append("Could not calculate bounding box")

            except Exception as e:
                errors.append(f"Failed to parse DXF file: {str(e)}")
        elif not self._ezdxf_available:
            warnings.append("Advanced DXF validation unavailable (ezdxf not installed)")
            # Basic entity count from string parsing
            entity_count = content_str.count("\nLINE\n") + content_str.count("\nCIRCLE\n") + \
                          content_str.count("\nARC\n") + content_str.count("\nPOLYLINE\n") + \
                          content_str.count("\nLWPOLYLINE\n")

        return self._build_result(
            is_valid=len(errors) == 0,
            errors=errors,
            warnings=warnings,
            entity_count=entity_count,
            layers=layers,
            bounding_box=bounding_box
        )

    def _build_result(
        self,
        is_valid: bool,
        errors: list,
        warnings: list,
        entity_count: int,
        layers: list,
        bounding_box: Optional[dict]
    ) -> dict:
        """Build validation result dictionary."""
        return {
            "is_valid": is_valid,
            "errors": errors,
            "warnings": warnings,
            "entity_count": entity_count,
            "layers": layers,
            "bounding_box": bounding_box,
        }


class ImageValidator:
    """Validator for image files (PNG, JPG, SVG)."""

    # Maximum file size for images (5MB)
    MAX_FILE_SIZE = 5 * 1024 * 1024

    # Minimum dimensions for good quality cutting
    MIN_DIMENSION = 500

    # Allowed MIME types
    ALLOWED_MIME_TYPES = {
        "image/png": [".png"],
        "image/jpeg": [".jpg", ".jpeg"],
        "image/svg+xml": [".svg"],
    }

    async def validate(self, file_content: bytes, filename: str, content_type: str) -> dict:
        """
        Validate an image file for design upload.

        Args:
            file_content: The image file content as bytes
            filename: Original filename
            content_type: MIME type of the file

        Returns:
            dict with validation results
        """
        errors = []
        warnings = []

        # Check file size
        file_size = len(file_content)
        if file_size > self.MAX_FILE_SIZE:
            errors.append(f"File size ({file_size / 1024 / 1024:.2f}MB) exceeds maximum allowed ({self.MAX_FILE_SIZE / 1024 / 1024}MB)")

        # Check MIME type
        if content_type not in self.ALLOWED_MIME_TYPES:
            errors.append(f"File type '{content_type}' is not allowed. Allowed types: PNG, JPG, SVG")

        # Check file extension
        file_ext = "." + filename.lower().split(".")[-1] if "." in filename else ""
        if content_type in self.ALLOWED_MIME_TYPES:
            if file_ext not in self.ALLOWED_MIME_TYPES[content_type]:
                warnings.append(f"File extension '{file_ext}' does not match content type '{content_type}'")

        # SVG-specific validation
        if content_type == "image/svg+xml":
            try:
                content_str = file_content.decode('utf-8')
                if "<svg" not in content_str.lower():
                    errors.append("Invalid SVG file: Missing <svg> element")
                if "<script" in content_str.lower():
                    errors.append("SVG file contains script elements which are not allowed")
            except UnicodeDecodeError:
                errors.append("Invalid SVG file: Unable to decode as UTF-8")

        # Image dimension validation for raster images
        if content_type in ["image/png", "image/jpeg"]:
            try:
                from PIL import Image
                img = Image.open(io.BytesIO(file_content))
                width, height = img.size

                if width < self.MIN_DIMENSION or height < self.MIN_DIMENSION:
                    warnings.append(
                        f"Image dimensions ({width}x{height}) are below recommended minimum "
                        f"({self.MIN_DIMENSION}x{self.MIN_DIMENSION}) for best cutting quality"
                    )
            except ImportError:
                warnings.append("Image dimension validation unavailable (Pillow not installed)")
            except Exception:
                warnings.append("Could not read image dimensions")

        return {
            "is_valid": len(errors) == 0,
            "errors": errors,
            "warnings": warnings,
        }
