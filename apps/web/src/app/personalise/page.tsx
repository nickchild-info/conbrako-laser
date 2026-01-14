"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Upload,
  FileImage,
  Check,
  AlertCircle,
  ArrowRight,
  Flame,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { designTemplates, formatPrice } from "@/data/products";
import { Breadcrumbs } from "@/components/layout";
import { Button } from "@/components/ui";
import { useCart } from "@/lib/cart-context";

type DesignOption = "upload" | "template";

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

export default function PersonalisePage() {
  const { addItem } = useCart();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [designOption, setDesignOption] = useState<DesignOption>("template");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [notes, setNotes] = useState("");

  const filteredTemplates =
    categoryFilter === "All"
      ? designTemplates
      : designTemplates.filter((t) => t.category === categoryFilter);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        alert("Please upload a PNG, JPG, SVG, or DXF file");
        return;
      }

      setUploadedFile(file);
      setSelectedTemplate(null);

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
    }
  };

  const clearUpload = () => {
    setUploadedFile(null);
    setUploadPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddToCart = () => {
    // In a real app, this would submit the design for approval
    // For now, we'll add the personalised product to cart
    const variantId =
      selectedSize.id === "medium"
        ? "v5"
        : selectedSize.id === "large"
        ? "v6"
        : "v7";
    addItem("5", variantId);
  };

  const isReadyToOrder =
    (designOption === "template" && selectedTemplate) ||
    (designOption === "upload" && uploadedFile);

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
                    </label>
                  ) : (
                    <div className="border border-smoke p-6">
                      <div className="flex items-start gap-4">
                        {uploadPreview ? (
                          <div className="w-24 h-24 bg-charcoal border border-smoke flex-shrink-0">
                            <Image
                              src={uploadPreview}
                              alt="Upload preview"
                              width={96}
                              height={96}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-24 h-24 bg-charcoal border border-smoke flex-shrink-0 flex items-center justify-center">
                            <FileImage className="h-8 w-8 text-steel-grey" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-white-hot font-medium">
                            {uploadedFile.name}
                          </p>
                          <p className="text-sm text-stone">
                            {(uploadedFile.size / 1024).toFixed(1)} KB
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-sm text-ember">
                            <Check className="h-4 w-4" />
                            File uploaded successfully
                          </div>
                        </div>
                        <button
                          onClick={clearUpload}
                          className="p-2 text-stone hover:text-white-hot transition-colors"
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
