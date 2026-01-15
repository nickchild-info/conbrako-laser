"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  RefreshCw,
  AlertCircle,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAdminAuth } from "../layout";

interface Product {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  badges: string[];
  images: Array<{ id: number; url: string; alt: string }>;
  variants: Array<{
    id: number;
    sku: string;
    price: number;
    inventory_qty: number;
  }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1";

// Mock products for when API is not available
const mockProducts: Product[] = [
  {
    id: 1,
    slug: "koosdoos-small",
    title: "KoosDoos Small",
    subtitle: "Compact Fire Pit",
    badges: [],
    images: [{ id: 1, url: "/images/products/koosdoos-small-1.jpg", alt: "KoosDoos Small" }],
    variants: [{ id: 1, sku: "KD-SM-001", price: 299500, inventory_qty: 25 }],
  },
  {
    id: 2,
    slug: "koosdoos-medium",
    title: "KoosDoos Medium",
    subtitle: "Classic Fire Pit",
    badges: ["best-seller"],
    images: [{ id: 2, url: "/images/products/koosdoos-medium-1.jpg", alt: "KoosDoos Medium" }],
    variants: [{ id: 2, sku: "KD-MD-001", price: 399500, inventory_qty: 18 }],
  },
  {
    id: 3,
    slug: "koosdoos-large",
    title: "KoosDoos Large",
    subtitle: "Family Fire Pit",
    badges: ["new"],
    images: [{ id: 3, url: "/images/products/koosdoos-large-1.jpg", alt: "KoosDoos Large" }],
    variants: [{ id: 3, sku: "KD-LG-001", price: 549500, inventory_qty: 12 }],
  },
  {
    id: 4,
    slug: "koosdoos-xl",
    title: "KoosDoos XL",
    subtitle: "Ultimate Fire Pit",
    badges: [],
    images: [{ id: 4, url: "/images/products/koosdoos-xl-1.jpg", alt: "KoosDoos XL" }],
    variants: [{ id: 4, sku: "KD-XL-001", price: 749500, inventory_qty: 8 }],
  },
  {
    id: 5,
    slug: "koosdoos-personalised",
    title: "KoosDoos Personalised",
    subtitle: "Custom Design Fire Pit",
    badges: ["new"],
    images: [{ id: 5, url: "/images/products/koosdoos-personalised-1.jpg", alt: "KoosDoos Personalised" }],
    variants: [
      { id: 5, sku: "KD-PERS-MD", price: 499500, inventory_qty: 99 },
      { id: 6, sku: "KD-PERS-LG", price: 649500, inventory_qty: 99 },
      { id: 7, sku: "KD-PERS-XL", price: 849500, inventory_qty: 99 },
    ],
  },
];

export default function ProductsPage() {
  const { apiKey } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/products?page=${page}&per_page=10`,
        {
          headers: { "X-Admin-API-Key": apiKey },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
        setTotalPages(data.total_pages || 1);
      } else {
        // Use mock data
        setProducts(mockProducts);
        setTotalPages(1);
      }
    } catch (err) {
      // Use mock data on error
      setProducts(mockProducts);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, apiKey]);

  const handleDelete = async (productId: number) => {
    setDeleting(true);
    try {
      const response = await fetch(`${API_URL}/admin/products/${productId}`, {
        method: "DELETE",
        headers: { "X-Admin-API-Key": apiKey },
      });

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== productId));
        setDeleteConfirm(null);
      } else {
        const data = await response.json();
        setError(data.detail || "Failed to delete product");
      }
    } catch (err) {
      setError("Failed to connect to API");
    } finally {
      setDeleting(false);
    }
  };

  const formatPrice = (cents: number) => {
    return `R${(cents / 100).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`;
  };

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 text-ember animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-steel-grey" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 bg-soot border border-smoke rounded text-white-hot placeholder:text-steel-grey focus:outline-none focus:border-ember w-full sm:w-64"
          />
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-ember text-white-hot px-4 py-2 rounded font-medium hover:bg-flame transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {error && (
        <div className="bg-flame/10 border border-flame/20 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-flame flex-shrink-0" />
          <p className="text-flame">{error}</p>
          <button
            onClick={() => setError("")}
            className="ml-auto text-flame hover:text-white-hot"
          >
            ×
          </button>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-soot border border-smoke rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-charcoal">
                <th className="text-left text-stone text-xs uppercase tracking-wide py-3 px-4">
                  Product
                </th>
                <th className="text-left text-stone text-xs uppercase tracking-wide py-3 px-4">
                  SKU
                </th>
                <th className="text-left text-stone text-xs uppercase tracking-wide py-3 px-4">
                  Price
                </th>
                <th className="text-left text-stone text-xs uppercase tracking-wide py-3 px-4">
                  Stock
                </th>
                <th className="text-left text-stone text-xs uppercase tracking-wide py-3 px-4">
                  Badges
                </th>
                <th className="text-right text-stone text-xs uppercase tracking-wide py-3 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t border-smoke hover:bg-smoke/20"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-charcoal rounded overflow-hidden flex-shrink-0">
                          {product.images[0] ? (
                            <Image
                              src={product.images[0].url}
                              alt={product.images[0].alt}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-6 w-6 text-steel-grey" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-white-hot font-medium">
                            {product.title}
                          </p>
                          <p className="text-stone text-sm">{product.subtitle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-stone text-sm">
                      {product.variants[0]?.sku || "-"}
                    </td>
                    <td className="py-4 px-4 text-white-hot">
                      {product.variants[0]
                        ? formatPrice(product.variants[0].price)
                        : "-"}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-sm ${
                          (product.variants[0]?.inventory_qty || 0) < 10
                            ? "text-flame"
                            : "text-stone"
                        }`}
                      >
                        {product.variants.reduce(
                          (sum, v) => sum + v.inventory_qty,
                          0
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-1">
                        {product.badges.map((badge) => (
                          <span
                            key={badge}
                            className={`text-xs px-2 py-0.5 rounded ${
                              badge === "new"
                                ? "bg-ember/20 text-ember"
                                : badge === "best-seller"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-steel-grey/20 text-stone"
                            }`}
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-2 text-stone hover:text-white-hot transition-colors"
                          title="Edit product"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          className="p-2 text-stone hover:text-flame transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <Package className="h-12 w-12 mx-auto mb-3 text-steel-grey" />
                    <p className="text-stone">No products found</p>
                    {search && (
                      <p className="text-steel-grey text-sm mt-1">
                        Try a different search term
                      </p>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-smoke">
            <p className="text-stone text-sm">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 text-stone hover:text-white-hot disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 text-stone hover:text-white-hot disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-soot border border-smoke rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-white-hot mb-2">
              Delete Product?
            </h3>
            <p className="text-stone mb-6">
              This action cannot be undone. Are you sure you want to delete this
              product?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-charcoal border border-smoke text-stone rounded hover:text-white-hot transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-flame text-white-hot rounded hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
