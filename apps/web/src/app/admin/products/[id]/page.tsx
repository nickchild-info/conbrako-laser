"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  X,
  Upload,
  RefreshCw,
  AlertCircle,
  Package,
  GripVertical,
} from "lucide-react";
import { useAdminAuth } from "../../layout";

interface Variant {
  id?: number;
  sku: string;
  price: number;
  compare_at_price?: number;
  inventory_qty: number;
  weight?: number;
  dimensions_mm?: string;
}

interface ProductImage {
  id?: number;
  url: string;
  alt: string;
  sort_order: number;
}

interface Product {
  id?: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  badges: string[];
  seats_min?: number;
  seats_max?: number;
  material?: string;
  finish?: string;
  variants: Variant[];
  images: ProductImage[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1";

const emptyProduct: Product = {
  slug: "",
  title: "",
  subtitle: "",
  description: "",
  badges: [],
  material: "3mm Laser-Cut Steel",
  finish: "Raw / Natural Rust",
  variants: [
    {
      sku: "",
      price: 0,
      inventory_qty: 0,
    },
  ],
  images: [],
};

export default function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const isNew = id === "new";
  const router = useRouter();
  const { apiKey } = useAdminAuth();

  const [product, setProduct] = useState<Product>(emptyProduct);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Image upload state
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetchProduct();
    }
  }, [id, isNew]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        headers: { "X-Admin-API-Key": apiKey },
      });

      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else {
        setError("Failed to load product");
      }
    } catch (err) {
      setError("Failed to connect to API");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const url = isNew
        ? `${API_URL}/admin/products`
        : `${API_URL}/admin/products/${id}`;
      const method = isNew ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-Admin-API-Key": apiKey,
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(isNew ? "Product created successfully!" : "Product updated successfully!");
        if (isNew) {
          router.push(`/admin/products/${data.id}`);
        }
      } else {
        const data = await response.json();
        setError(data.detail || "Failed to save product");
      }
    } catch (err) {
      setError("Failed to connect to API");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: string | number) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) =>
        i === index ? { ...v, [field]: value } : v
      ),
    }));
  };

  const addVariant = () => {
    setProduct((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { sku: "", price: 0, inventory_qty: 0 },
      ],
    }));
  };

  const removeVariant = (index: number) => {
    if (product.variants.length > 1) {
      setProduct((prev) => ({
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index),
      }));
    }
  };

  const toggleBadge = (badge: string) => {
    setProduct((prev) => ({
      ...prev,
      badges: prev.badges.includes(badge)
        ? prev.badges.filter((b) => b !== badge)
        : [...prev.badges, badge],
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/uploads/design`, {
        method: "POST",
        headers: { "X-Admin-API-Key": apiKey },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProduct((prev) => ({
          ...prev,
          images: [
            ...prev.images,
            {
              url: data.file_url,
              alt: file.name,
              sort_order: prev.images.length,
            },
          ],
        }));
      } else {
        // For demo, add a placeholder image
        setProduct((prev) => ({
          ...prev,
          images: [
            ...prev.images,
            {
              url: `/images/products/${prev.slug || "product"}-${prev.images.length + 1}.jpg`,
              alt: file.name,
              sort_order: prev.images.length,
            },
          ],
        }));
      }
    } catch (err) {
      // For demo, add a placeholder
      setProduct((prev) => ({
        ...prev,
        images: [
          ...prev.images,
          {
            url: `/images/products/${prev.slug || "product"}-${prev.images.length + 1}.jpg`,
            alt: file.name,
            sort_order: prev.images.length,
          },
        ],
      }));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 text-ember animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/products"
          className="p-2 text-stone hover:text-white-hot transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-medium text-white-hot">
          {isNew ? "Add New Product" : "Edit Product"}
        </h1>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-flame/10 border border-flame/20 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-flame flex-shrink-0" />
          <p className="text-flame">{error}</p>
          <button onClick={() => setError("")} className="ml-auto text-flame">
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
          <p className="text-green-400">{success}</p>
          <button onClick={() => setSuccess("")} className="ml-auto text-green-400">
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-soot border border-smoke rounded-lg p-6">
          <h2 className="text-lg font-medium text-white-hot mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone text-sm mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={product.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-charcoal border border-smoke rounded text-white-hot focus:outline-none focus:border-ember"
                placeholder="KoosDoos Medium"
              />
            </div>
            <div>
              <label className="block text-stone text-sm mb-2">Slug *</label>
              <input
                type="text"
                name="slug"
                value={product.slug}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-charcoal border border-smoke rounded text-white-hot focus:outline-none focus:border-ember"
                placeholder="koosdoos-medium"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-stone text-sm mb-2">Subtitle</label>
              <input
                type="text"
                name="subtitle"
                value={product.subtitle}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-charcoal border border-smoke rounded text-white-hot focus:outline-none focus:border-ember"
                placeholder="Classic Fire Pit"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-stone text-sm mb-2">Description</label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 bg-charcoal border border-smoke rounded text-white-hot focus:outline-none focus:border-ember resize-none"
                placeholder="Product description..."
              />
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-soot border border-smoke rounded-lg p-6">
          <h2 className="text-lg font-medium text-white-hot mb-4">Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone text-sm mb-2">Material</label>
              <input
                type="text"
                name="material"
                value={product.material || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-charcoal border border-smoke rounded text-white-hot focus:outline-none focus:border-ember"
                placeholder="3mm Laser-Cut Steel"
              />
            </div>
            <div>
              <label className="block text-stone text-sm mb-2">Finish</label>
              <input
                type="text"
                name="finish"
                value={product.finish || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-charcoal border border-smoke rounded text-white-hot focus:outline-none focus:border-ember"
                placeholder="Raw / Natural Rust"
              />
            </div>
            <div>
              <label className="block text-stone text-sm mb-2">Min Seats</label>
              <input
                type="number"
                name="seats_min"
                value={product.seats_min || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-charcoal border border-smoke rounded text-white-hot focus:outline-none focus:border-ember"
                placeholder="4"
              />
            </div>
            <div>
              <label className="block text-stone text-sm mb-2">Max Seats</label>
              <input
                type="number"
                name="seats_max"
                value={product.seats_max || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-charcoal border border-smoke rounded text-white-hot focus:outline-none focus:border-ember"
                placeholder="6"
              />
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-soot border border-smoke rounded-lg p-6">
          <h2 className="text-lg font-medium text-white-hot mb-4">Badges</h2>
          <div className="flex flex-wrap gap-3">
            {["new", "best-seller", "sale", "limited"].map((badge) => (
              <button
                key={badge}
                type="button"
                onClick={() => toggleBadge(badge)}
                className={`px-4 py-2 rounded border transition-colors capitalize ${
                  product.badges.includes(badge)
                    ? "bg-ember border-ember text-white-hot"
                    : "bg-charcoal border-smoke text-stone hover:border-ember"
                }`}
              >
                {badge}
              </button>
            ))}
          </div>
        </div>

        {/* Variants */}
        <div className="bg-soot border border-smoke rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-white-hot">Variants</h2>
            <button
              type="button"
              onClick={addVariant}
              className="inline-flex items-center gap-2 text-ember hover:text-flame text-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Variant
            </button>
          </div>
          <div className="space-y-4">
            {product.variants.map((variant, index) => (
              <div
                key={index}
                className="p-4 bg-charcoal border border-smoke rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-stone text-sm">Variant {index + 1}</span>
                  {product.variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="text-stone hover:text-flame transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-steel-grey text-xs mb-1">SKU *</label>
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-soot border border-smoke rounded text-white-hot text-sm focus:outline-none focus:border-ember"
                      placeholder="KD-MD-001"
                    />
                  </div>
                  <div>
                    <label className="block text-steel-grey text-xs mb-1">Price (cents) *</label>
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) =>
                        handleVariantChange(index, "price", parseInt(e.target.value) || 0)
                      }
                      required
                      className="w-full px-3 py-2 bg-soot border border-smoke rounded text-white-hot text-sm focus:outline-none focus:border-ember"
                      placeholder="399500"
                    />
                  </div>
                  <div>
                    <label className="block text-steel-grey text-xs mb-1">Stock</label>
                    <input
                      type="number"
                      value={variant.inventory_qty}
                      onChange={(e) =>
                        handleVariantChange(index, "inventory_qty", parseInt(e.target.value) || 0)
                      }
                      className="w-full px-3 py-2 bg-soot border border-smoke rounded text-white-hot text-sm focus:outline-none focus:border-ember"
                      placeholder="25"
                    />
                  </div>
                  <div>
                    <label className="block text-steel-grey text-xs mb-1">Compare at Price</label>
                    <input
                      type="number"
                      value={variant.compare_at_price || ""}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "compare_at_price",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full px-3 py-2 bg-soot border border-smoke rounded text-white-hot text-sm focus:outline-none focus:border-ember"
                      placeholder="449500"
                    />
                  </div>
                  <div>
                    <label className="block text-steel-grey text-xs mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={variant.weight || ""}
                      onChange={(e) =>
                        handleVariantChange(index, "weight", parseFloat(e.target.value) || 0)
                      }
                      className="w-full px-3 py-2 bg-soot border border-smoke rounded text-white-hot text-sm focus:outline-none focus:border-ember"
                      placeholder="28.5"
                    />
                  </div>
                  <div>
                    <label className="block text-steel-grey text-xs mb-1">Dimensions</label>
                    <input
                      type="text"
                      value={variant.dimensions_mm || ""}
                      onChange={(e) =>
                        handleVariantChange(index, "dimensions_mm", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-soot border border-smoke rounded text-white-hot text-sm focus:outline-none focus:border-ember"
                      placeholder="600x600x400"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="bg-soot border border-smoke rounded-lg p-6">
          <h2 className="text-lg font-medium text-white-hot mb-4">Product Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {product.images.map((image, index) => (
              <div
                key={index}
                className="relative group aspect-square bg-charcoal rounded-lg overflow-hidden"
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-black/50 rounded text-white-hot opacity-0 group-hover:opacity-100 transition-opacity hover:bg-flame"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white-hot text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
            <label className="aspect-square bg-charcoal border-2 border-dashed border-smoke rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-ember transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
              {uploading ? (
                <RefreshCw className="h-8 w-8 text-stone animate-spin" />
              ) : (
                <>
                  <Upload className="h-8 w-8 text-stone mb-2" />
                  <span className="text-stone text-sm">Upload</span>
                </>
              )}
            </label>
          </div>
          <p className="text-steel-grey text-sm">
            Drag images to reorder. First image will be used as the main product image.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/admin/products"
            className="px-6 py-2 text-stone hover:text-white-hot transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-ember text-white-hot px-6 py-2 rounded font-medium hover:bg-flame transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isNew ? "Create Product" : "Save Changes"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
