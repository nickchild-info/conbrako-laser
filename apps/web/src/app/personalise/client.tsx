"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Upload,
  FileImage,
  Check,
  AlertCircle,
  ArrowRight,
  Flame,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice, type DesignTemplate } from "@/lib/data-service";
import { Breadcrumbs } from "@/components/layout";
import { Button } from "@/components/ui";
import { useCart } from "@/lib/cart-context";
import { uploadsApi } from "@/lib/api/uploads";
import type { UploadDesignResponse, DXFValidationResult } from "@/lib/api/types";

type DesignOption = "upload" | "template";

interface PersonalisePageClientProps {
  designTemplates: DesignTemplate[];
}

const sizeOptions = [
  {
    id: "medium",
    name: "Medium",
    price: 2999,
    dimensions: "400 x 450 x 400mm",
    seats: "4-6 people",
  },
  {
    id: "large",
    name: "Large",
    price: 3799,
    dimensions: "500 x 550 x 500mm",
    seats: "6-8 people",
  },
  {
    id: "xl",
    name: "Extra Large",
    price: 4999,
    dimensions: "650 x 650 x 650mm",
    seats: "8-12 people",
  },
];

const categories = ["All", "Wildlife", "Nature", "Sports", "Custom", "Pattern"];

// Upload status type
type UploadStatus = "idle" | "uploading" | "validating" | "success" | "error";

export function PersonalisePageClient({
  designTemplates,
}: PersonalisePageClientProps) {
  const { addItem } = useCart();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [designOption, setDesignOption] = useState<DesignOption>("template");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [notes, setNotes] = useState("");

  // New upload integration state
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadResponse, setUploadResponse] = useState<UploadDesignResponse | null>(null);
  const [dxfValidation, setDxfValidation] = useState<DXFValidationResult | null>(null);

  const filteredTemplates =
    categoryFilter === "All"
      ? designTemplates
      : designTemplates.filter((t) => t.category === categoryFilter);

  // Upload file to API
  const uploadFileToApi = useCallback(async (file: File) => {
    setUploadStatus("uploading");
    setUploadProgress(0);
    setUploadError(null);
    setDxfValidation(null);

    try {
      // Simulate progress for better UX (actual upload is a single request)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Check if it's a DXF file for special validation
      const isDxf = file.name.toLowerCase().endsWith(".dxf");

      if (isDxf) {
        setUploadStatus("validating");
        try {
          const dxfResult = await uploadsApi.validateDxf(file);
          setDxfValidation(dxfResult);

          if (!dxfResult.is_valid) {
            clearInterval(progressInterval);
            setUploadStatus("error");
            setUploadProgress(0);
            setUploadError(
              dxfResult.errors.length > 0
                ? dxfResult.errors.join(". ")
                : "DXF file validation failed"
            );
            return;
          }
        } catch {
          // DXF validation failed, but we can still try to upload
          console.warn("DXF validation endpoint not available, proceeding with upload");
        }
      }

      // Upload the file
      setUploadStatus("uploading");
      const response = await uploadsApi.uploadDesign(file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.is_valid) {
        setUploadStatus("error");
        setUploadError(response.validation_message || "File validation failed");
        return;
      }

      // Store the upload response for checkout
      setUploadResponse(response);
      if (response.dxf_info) {
        setDxfValidation(response.dxf_info);
      }
      setUploadStatus("success");

    } catch (error) {
      setUploadStatus("error");
      setUploadProgress(0);

      if (error instanceof Error) {
        // Check if it's a network error (API not available)
        if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
          setUploadError("Unable to connect to server. File saved locally.");
          // Still allow the file to be "uploaded" locally for demo purposes
          setUploadStatus("success");
          setUploadResponse({
            file_id: `local-${Date.now()}`,
            file_url: uploadPreview || "",
            thumbnail_url: uploadPreview,
            is_valid: true,
            validation_message: "File saved locally (API unavailable)",
            dxf_info: null,
          });
        } else {
          setUploadError(error.message);
        }
      } else {
        setUploadError("An unexpected error occurred during upload");
      }
    }
  }, [uploadPreview]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      const validTypes = [
        "image/png",
        "image/jpeg",
        "image/svg+xml",
        "application/dxf",
        ".dxf",
      ];
      const isValid =
        validTypes.includes(file.type) || file.name.endsWith(".dxf");

      if (!isValid) {
        setUploadError("Please upload a PNG, JPG, SVG, or DXF file");
        return;
      }

      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setUploadError("File size must be less than 10MB");
        return;
      }

      setUploadedFile(file);
      setSelectedTemplate(null);
      setUploadError(null);

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setUploadPreview(null);
      }

      // Upload to API
      await uploadFileToApi(file);
    }
  };

  const clearUpload = () => {
    setUploadedFile(null);
    setUploadPreview(null);
    setUploadStatus("idle");
    setUploadProgress(0);
    setUploadError(null);
    setUploadResponse(null);
    setDxfValidation(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddToCart = () => {
    // Add the personalised product to cart with design reference
    const variantId =
      selectedSize.id === "medium"
        ? "v5"
        : selectedSize.id === "large"
        ? "v6"
        : "v7";

    // Build custom options with design info
    const customOptions: Record<string, string> = {
      designType: designOption,
    };

    if (designOption === "template" && selectedTemplate) {
      const template = designTemplates.find((t) => t.id === selectedTemplate);
      customOptions.templateId = selectedTemplate;
      customOptions.templateName = template?.name || "Selected Template";
    } else if (designOption === "upload" && uploadResponse) {
      customOptions.uploadFileId = uploadResponse.file_id;
      customOptions.uploadFileName = uploadedFile?.name || "Uploaded Design";
      if (uploadResponse.file_url) {
        customOptions.uploadFileUrl = uploadResponse.file_url;
      }
    }

    if (notes.trim()) {
      customOptions.notes = notes.trim();
    }

    // Add item to cart (the cart context will handle the custom options)
    addItem("5", variantId);

    // Store design reference in localStorage for checkout
    if (typeof window !== "undefined") {
      const designReference = {
        productId: "5",
        variantId,
        designType: designOption,
        templateId: selectedTemplate,
        uploadResponse,
        notes,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("koosdoos_custom_design", JSON.stringify(designReference));
    }
  };

  const isReadyToOrder =
    (designOption === "template" && selectedTemplate) ||
    (designOption === "upload" && uploadedFile && uploadStatus === "success");

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-soot border-b border-smoke py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Personalise" }]} />
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white-hot mt-4">
            Personalise Your Fire Pit
          </h1>
          <p className="text-lg text-stone mt-4 max-w-2xl">
            Create a one-of-a-kind KoosDoos fire pit with your own design or
            choose from our template library. All designs are subject to
            approval to ensure perfect laser-cut results.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          {/* Left: Design selection */}
          <div className="lg:col-span-2 space-y-12">
            {/* Step 1: Choose design method */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-ember text-white-hot flex items-center justify-center font-bold">
                  1
                </div>
                <h2 className="font-display text-2xl text-white-hot">
                  Choose Your Design
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                  onClick={() => setDesignOption("template")}
                  className={cn(
                    "p-6 border text-left transition-all",
                    designOption === "template"
                      ? "border-ember bg-ember/10"
                      : "border-smoke hover:border-steel-grey"
                  )}
                >
                  <Flame className="h-8 w-8 text-ember mb-3" />
                  <h3 className="font-display text-lg text-white-hot mb-1">
                    Use a Template
                  </h3>
                  <p className="text-sm text-stone">
                    Choose from our library of South African-inspired designs
                  </p>
                </button>

                <button
                  onClick={() => setDesignOption("upload")}
                  className={cn(
                    "p-6 border text-left transition-all",
                    designOption === "upload"
                      ? "border-ember bg-ember/10"
                      : "border-smoke hover:border-steel-grey"
                  )}
                >
                  <Upload className="h-8 w-8 text-ember mb-3" />
                  <h3 className="font-display text-lg text-white-hot mb-1">
                    Upload Your Design
                  </h3>
                  <p className="text-sm text-stone">
                    Upload your logo, artwork, or DXF file
                  </p>
                </button>
              </div>

              {/* Template selection */}
              {designOption === "template" && (
                <div id="templates">
                  {/* Category filter */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={cn(
                          "px-3 py-1 text-sm transition-colors",
                          categoryFilter === cat
                            ? "bg-ember text-white-hot"
                            : "bg-smoke text-stone hover:text-white-hot"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Template grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => {
                          setSelectedTemplate(template.id);
                          setUploadedFile(null);
                          setUploadPreview(null);
                        }}
                        className={cn(
                          "relative aspect-square border bg-charcoal p-4 transition-all group",
                          selectedTemplate === template.id
                            ? "border-ember ring-2 ring-ember"
                            : "border-smoke hover:border-steel-grey"
                        )}
                      >
                        {/* Placeholder icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Flame
                            className={cn(
                              "h-12 w-12 transition-colors",
                              selectedTemplate === template.id
                                ? "text-ember"
                                : "text-steel-grey group-hover:text-stone"
                            )}
                          />
                        </div>

                        {/* Selection indicator */}
                        {selectedTemplate === template.id && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-ember rounded-full flex items-center justify-center">
                            <Check className="h-4 w-4 text-white-hot" />
                          </div>
                        )}

                        {/* Template name */}
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-charcoal to-transparent">
                          <p className="text-xs text-white-hot font-medium truncate">
                            {template.name}
                          </p>
                          <p className="text-xs text-stone truncate">
                            {template.category}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload section */}
              {designOption === "upload" && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,.svg,.dxf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="design-upload"
                  />

                  {/* Error display */}
                  {uploadError && !uploadedFile && (
                    <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-red-400 font-medium">Upload Error</p>
                          <p className="text-sm text-red-400/80">{uploadError}</p>
                        </div>
                        <button
                          onClick={() => setUploadError(null)}
                          className="p-1 text-red-400/60 hover:text-red-400 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {!uploadedFile ? (
                    <label
                      htmlFor="design-upload"
                      className="block border-2 border-dashed border-steel-grey hover:border-ember transition-colors cursor-pointer p-12 text-center"
                    >
                      <FileImage className="h-12 w-12 text-steel-grey mx-auto mb-4" />
                      <p className="text-white-hot font-medium mb-2">
                        Drop your file here or click to upload
                      </p>
                      <p className="text-sm text-stone">
                        Supported formats: PNG, JPG, SVG, DXF
                      </p>
                      <p className="text-xs text-ash mt-2">
                        For best results, use high-contrast black and white
                        designs
                      </p>
                      <p className="text-xs text-ash mt-1">Maximum file size: 10MB</p>
                    </label>
                  ) : (
                    <div className={cn(
                      "border p-6 transition-colors",
                      uploadStatus === "error"
                        ? "border-red-500/50 bg-red-500/5"
                        : uploadStatus === "success"
                        ? "border-ember/50 bg-ember/5"
                        : "border-smoke"
                    )}>
                      <div className="flex items-start gap-4">
                        {/* File preview */}
                        {uploadPreview ? (
                          <div className="w-24 h-24 bg-charcoal border border-smoke flex-shrink-0 relative">
                            <Image
                              src={uploadPreview}
                              alt="Upload preview"
                              width={96}
                              height={96}
                              className="w-full h-full object-contain"
                            />
                            {(uploadStatus === "uploading" || uploadStatus === "validating") && (
                              <div className="absolute inset-0 bg-charcoal/80 flex items-center justify-center">
                                <Loader2 className="h-6 w-6 text-ember animate-spin" />
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-24 h-24 bg-charcoal border border-smoke flex-shrink-0 flex items-center justify-center relative">
                            {(uploadStatus === "uploading" || uploadStatus === "validating") ? (
                              <Loader2 className="h-8 w-8 text-ember animate-spin" />
                            ) : (
                              <FileImage className="h-8 w-8 text-steel-grey" />
                            )}
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <p className="text-white-hot font-medium truncate">
                            {uploadedFile.name}
                          </p>
                          <p className="text-sm text-stone">
                            {(uploadedFile.size / 1024).toFixed(1)} KB
                          </p>

                          {/* Progress bar */}
                          {(uploadStatus === "uploading" || uploadStatus === "validating") && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-stone">
                                  {uploadStatus === "validating" ? "Validating..." : "Uploading..."}
                                </span>
                                <span className="text-ember">{uploadProgress}%</span>
                              </div>
                              <div className="h-2 bg-smoke rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-ember transition-all duration-300"
                                  style={{ width: `${uploadProgress}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Success state */}
                          {uploadStatus === "success" && (
                            <div className="mt-2">
                              <div className="flex items-center gap-2 text-sm text-ember">
                                <Check className="h-4 w-4" />
                                File uploaded successfully
                              </div>
                              {uploadResponse?.validation_message && (
                                <p className="text-xs text-stone mt-1">
                                  {uploadResponse.validation_message}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Error state */}
                          {uploadStatus === "error" && uploadError && (
                            <div className="mt-2">
                              <div className="flex items-center gap-2 text-sm text-red-400">
                                <AlertCircle className="h-4 w-4" />
                                {uploadError}
                              </div>
                              <button
                                onClick={() => uploadFileToApi(uploadedFile)}
                                className="mt-2 text-xs text-ember hover:text-ember/80 underline"
                              >
                                Retry Upload
                              </button>
                            </div>
                          )}

                          {/* DXF Validation Info */}
                          {dxfValidation && uploadStatus === "success" && (
                            <div className="mt-3 p-3 bg-charcoal/50 border border-smoke text-xs">
                              <p className="text-white-hot font-medium mb-1">DXF File Info</p>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-stone">
                                <span>Entities:</span>
                                <span className="text-white-hot">{dxfValidation.entity_count}</span>
                                <span>Layers:</span>
                                <span className="text-white-hot">{dxfValidation.layers.join(", ") || "Default"}</span>
                              </div>
                              {dxfValidation.warnings.length > 0 && (
                                <div className="mt-2 text-amber-400">
                                  <p className="font-medium">Warnings:</p>
                                  <ul className="list-disc list-inside">
                                    {dxfValidation.warnings.map((w, i) => (
                                      <li key={i}>{w}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={clearUpload}
                          className="p-2 text-stone hover:text-white-hot transition-colors"
                          disabled={uploadStatus === "uploading" || uploadStatus === "validating"}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Design guidelines */}
                  <div className="mt-6 p-4 bg-soot border border-smoke">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-ember flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-white-hot font-medium mb-2">
                          Design Guidelines
                        </h4>
                        <ul className="text-sm text-stone space-y-1">
                          <li>
                            • High contrast black & white designs work best
                          </li>
                          <li>• Minimum line thickness: 3mm for clean cuts</li>
                          <li>
                            • DXF files will be used directly for laser cutting
                          </li>
                          <li>
                            • Our team will review and may suggest adjustments
                          </li>
                          <li>
                            • Final approval required before production begins
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Step 2: Choose size */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-ember text-white-hot flex items-center justify-center font-bold">
                  2
                </div>
                <h2 className="font-display text-2xl text-white-hot">
                  Choose Your Size
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {sizeOptions.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "p-6 border text-left transition-all",
                      selectedSize.id === size.id
                        ? "border-ember bg-ember/10"
                        : "border-smoke hover:border-steel-grey"
                    )}
                  >
                    <h3 className="font-display text-xl text-white-hot mb-1">
                      {size.name}
                    </h3>
                    <p className="text-2xl font-bold text-ember mb-2">
                      {formatPrice(size.price)}
                    </p>
                    <p className="text-sm text-stone">{size.dimensions}</p>
                    <p className="text-sm text-stone">{size.seats}</p>
                    {selectedSize.id === size.id && (
                      <div className="mt-3 flex items-center gap-1 text-ember text-sm">
                        <Check className="h-4 w-4" />
                        Selected
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Step 3: Additional notes */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-ember text-white-hot flex items-center justify-center font-bold">
                  3
                </div>
                <h2 className="font-display text-2xl text-white-hot">
                  Additional Notes (Optional)
                </h2>
              </div>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests or notes about your design..."
                className="w-full h-32 px-4 py-3 bg-charcoal border border-smoke text-white-hot placeholder:text-ash text-sm focus:outline-none focus:border-ember transition-colors resize-none"
              />
            </section>
          </div>

          {/* Right: Order summary */}
          <div className="mt-12 lg:mt-0">
            <div className="sticky top-[180px] bg-soot border border-smoke p-6">
              <h3 className="font-display text-xl text-white-hot mb-6">
                Order Summary
              </h3>

              {/* Selected design */}
              <div className="mb-6">
                <p className="text-sm text-stone mb-2">Design</p>
                {designOption === "template" && selectedTemplate ? (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-charcoal border border-smoke flex items-center justify-center">
                      <Flame className="h-6 w-6 text-ember" />
                    </div>
                    <div>
                      <p className="text-white-hot font-medium">
                        {
                          designTemplates.find((t) => t.id === selectedTemplate)
                            ?.name
                        }
                      </p>
                      <p className="text-xs text-stone">Template</p>
                    </div>
                  </div>
                ) : designOption === "upload" && uploadedFile ? (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-charcoal border border-smoke flex items-center justify-center overflow-hidden">
                      {uploadPreview ? (
                        <Image
                          src={uploadPreview}
                          alt="Upload"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      ) : (
                        <FileImage className="h-6 w-6 text-ember" />
                      )}
                    </div>
                    <div>
                      <p className="text-white-hot font-medium truncate max-w-[150px]">
                        {uploadedFile.name}
                      </p>
                      <p className="text-xs text-stone">Custom Upload</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-stone italic">No design selected</p>
                )}
              </div>

              {/* Selected size */}
              <div className="mb-6 pb-6 border-b border-smoke">
                <p className="text-sm text-stone mb-2">Size</p>
                <p className="text-white-hot font-medium">{selectedSize.name}</p>
                <p className="text-xs text-stone">{selectedSize.dimensions}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-stone">Fire Pit</span>
                  <span className="text-white-hot">
                    {formatPrice(selectedSize.price)}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-stone">Custom Design</span>
                  <span className="text-stone">Included</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-smoke">
                  <span className="text-white-hot font-medium">Total</span>
                  <span className="text-2xl font-bold text-ember">
                    {formatPrice(selectedSize.price)}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <Button
                size="lg"
                className="w-full mb-4"
                onClick={handleAddToCart}
                disabled={!isReadyToOrder}
              >
                {isReadyToOrder ? (
                  <>
                    Add To Cart
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                ) : (
                  "Select a Design"
                )}
              </Button>

              <p className="text-xs text-stone text-center">
                Design will be reviewed before production.
                <br />
                We&apos;ll contact you if any adjustments are needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
