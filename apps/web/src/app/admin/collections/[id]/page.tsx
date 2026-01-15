"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Plus,
  X,
  RefreshCw,
  AlertCircle,
  Package,
} from "lucide-react";
import { useAdminAuth } from "../../layout";

interface Collection {
  id?: number;
  slug: string;
  title: string;
  hero_copy: string;
  product_ids: number[];
}

interface Product {
  id: number;
  title: string;
  slug: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1";

const mockProducts: Product[] = [
  { id: 1, title: "KoosDoos Small", slug: "koosdoos-small" },
  { id: 2, title: "KoosDoos Medium", slug: "koosdoos-medium" },
  { id: 3, title: "KoosDoos Large", slug: "koosdoos-large" },
  { id: 4, title: "KoosDoos XL", slug: "koosdoos-xl" },
  { id: 5, title: "KoosDoos Personalised", slug: "koosdoos-personalised" },
];

const emptyCollection: Collection = {
  slug: "",
  title: "",
  hero_copy: "",
  product_ids: [],
};

export default function CollectionEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const isNew = id === "new";
  const router = useRouter();
  const { apiKey } = useAdminAuth();

  const [collection, setCollection] = useState<Collection>(emptyCollection);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProducts();
    if (!isNew) {
      fetchCollection();
    }
  }, [id, isNew]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products?per_page=100`, {
        headers: { "X-Admin-API-Key": apiKey },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(
          data.products?.map((p: any) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
          })) || []
        );
      } else {
        setProducts(mockProducts);
      }
    } catch (err) {
      setProducts(mockProducts);
    }
  };

  const fetchCollection = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/collections/${id}`, {
        headers: { "X-Admin-API-Key": apiKey },
      });

      if (response.ok) {
        const data = await response.json();
        setCollection({
          id: data.id,
          slug: data.slug,
          title: data.title,
          hero_copy: data.hero_copy,
          product_ids: data.products?.map((p: any) => p.id) || [],
        });
      } else {
        setError("Failed to load collection");
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
        ? `${API_URL}/admin/collections`
        : `${API_URL}/admin/collections/${id}`;
      const method = isNew ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-Admin-API-Key": apiKey,
        },
        body: JSON.stringify(collection),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(
          isNew ? "Collection created successfully!" : "Collection updated successfully!"
        );
        if (isNew) {
          router.push(`/admin/collections/${data.id}`);
        }
      } else {
        const data = await response.json();
        setError(data.detail || "Failed to save collection");
      }
    } catch (err) {
      setError("Failed to connect to API");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCollection((prev) => ({ ...prev, [name]: value }));
  };

  const toggleProduct = (productId: number) => {
    setCollection((prev) => ({
      ...prev,
      product_ids: prev.product_ids.includes(productId)
        ? prev.product_ids.filter((id) => id !== productId)
        : [...prev.product_ids, productId],
    }));
  };

  const selectedProducts = products.filter((p) =>
    collection.product_ids.includes(p.id)
  );
  const availableProducts = products.filter(
    (p) => !collection.product_ids.includes(p.id)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 text-ember animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/collections"
          className="p-2 text-stone hover:text-white-hot transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-medium text-white-hot">
          {isNew ? "Add New Collection" : "Edit Collection"}
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
          <h2 className="text-lg font-medium text-white-hot mb-4">
            Collection Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-stone text-sm mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={collection.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-charcoal border border-smoke rounded text-white-hot focus:outline-none focus:border-ember"
                placeholder="Best Sellers"
              />
            </div>
            <div>
              <label className="block text-stone text-sm mb-2">Slug *</label>
              <input
                type="text"
                name="slug"
                value={collection.slug}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-charcoal border border-smoke rounded text-white-hot focus:outline-none focus:border-ember"
                placeholder="best-sellers"
              />
            </div>
            <div>
              <label className="block text-stone text-sm mb-2">Hero Copy</label>
              <textarea
                name="hero_copy"
                value={collection.hero_copy}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 bg-charcoal border border-smoke rounded text-white-hot focus:outline-none focus:border-ember resize-none"
                placeholder="Our most popular fire pits..."
              />
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-soot border border-smoke rounded-lg p-6">
          <h2 className="text-lg font-medium text-white-hot mb-4">Products</h2>

          {/* Selected Products */}
          <div className="mb-4">
            <label className="block text-stone text-sm mb-2">
              Selected Products ({selectedProducts.length})
            </label>
            {selectedProducts.length > 0 ? (
              <div className="space-y-2">
                {selectedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between px-3 py-2 bg-charcoal border border-smoke rounded"
                  >
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-ember" />
                      <span className="text-white-hot">{product.title}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleProduct(product.id)}
                      className="text-stone hover:text-flame transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-steel-grey text-sm py-2">
                No products selected
              </p>
            )}
          </div>

          {/* Available Products */}
          <div>
            <label className="block text-stone text-sm mb-2">
              Add Products
            </label>
            {availableProducts.length > 0 ? (
              <div className="space-y-2">
                {availableProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => toggleProduct(product.id)}
                    className="flex items-center gap-2 w-full px-3 py-2 bg-charcoal border border-smoke rounded text-left hover:border-ember transition-colors"
                  >
                    <Plus className="h-4 w-4 text-ember" />
                    <span className="text-stone">{product.title}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-steel-grey text-sm py-2">
                All products are in this collection
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/admin/collections"
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
                {isNew ? "Create Collection" : "Save Changes"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
