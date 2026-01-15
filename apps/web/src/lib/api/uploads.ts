/**
 * Uploads API Service
 */
import api from "../api-client";
import type { UploadDesignResponse, DXFValidationResult } from "./types";

/**
 * Upload a custom design file (PNG, JPG, SVG, DXF)
 */
export async function uploadDesign(file: File): Promise<UploadDesignResponse> {
  return api.upload<UploadDesignResponse>("/uploads/design", file, "file");
}

/**
 * Validate a DXF file without storing it
 */
export async function validateDxf(file: File): Promise<DXFValidationResult> {
  return api.upload<DXFValidationResult>(
    "/uploads/design/validate-dxf",
    file,
    "file"
  );
}

export const uploadsApi = {
  uploadDesign,
  validateDxf,
};
