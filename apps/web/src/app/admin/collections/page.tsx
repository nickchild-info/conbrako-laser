"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  RefreshCw,
  AlertCircle,
  FolderOpen,
  Package,
} from "lucide-react";
import { useAdminAuth } from "../layout";

interface Collection {
  id: number;
  slug: string;
  title: string;
  hero_copy: string;
  products?: Array<{ id: number; title: string }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1";

// Mock collections for when API is not available
const mockCollections: Collection[] = [
  {
    id: 1,
    slug: "fire-pits",
    title: "Fire Pits",
    hero_copy: "Built tough. Burns harder. Our complete range of steel fire pits.",
    products: [
      { id: 1, title: "KoosDoos Small" },
      { id: 2, title: "KoosDoos Medium" },
      { id: 3, title: "KoosDoos Large" },
      { id: 4, title: "KoosDoos XL" },
      { id: 5, title: "KoosDoos Personalised" },
    ],
  },
  {
    id: 2,
    slug: "best-sellers",
    title: "Best Sellers",
    hero_copy: "Our most popular fire pits, loved by thousands of South Africans.",
    products: [
      { id: 2, title: "KoosDoos Medium" },
      { id: 3, title: "KoosDoos Large" },
    ],
  },
  {
    id: 3,
    slug: "new-arrivals",
    title: "New Arrivals",
    hero_copy: "Fresh from the workshop. Check out our latest additions.",
    products: [
      { id: 3, title: "KoosDoos Large" },
      { id: 5, title: "KoosDoos Personalised" },
    ],
  },
  {
    id: 4,
    slug: "personalised",
    title: "Personalised",
    hero_copy: "Make it yours. Custom laser-cut designs for your fire pit.",
    products: [{ id: 5, title: "KoosDoos Personalised" }],
  },
];

export default function CollectionsPage() {
  const { apiKey } = useAdminAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCollections = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/collections`, {
        headers: { "X-Admin-API-Key": apiKey },
      });

      if (response.ok) {
        const data = await response.json();
        setCollections(data.collections || []);
      } else {
        setCollections(mockCollections);
      }
    } catch (err) {
      setCollections(mockCollections);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, [apiKey]);

  const handleDelete = async (collectionId: number) => {
    setDeleting(true);
    try {
      const response = await fetch(`${API_URL}/admin/collections/${collectionId}`, {
        method: "DELETE",
        headers: { "X-Admin-API-Key": apiKey },
      });

      if (response.ok) {
        setCollections(collections.filter((c) => c.id !== collectionId));
        setDeleteConfirm(null);
      } else {
        const data = await response.json();
        setError(data.detail || "Failed to delete collection");
      }
    } catch (err) {
      setError("Failed to connect to API");
    } finally {
      setDeleting(false);
    }
  };

  const filteredCollections = collections.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
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
            placeholder="Search collections..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 bg-soot border border-smoke rounded text-white-hot placeholder:text-steel-grey focus:outline-none focus:border-ember w-full sm:w-64"
          />
        </div>
        <Link
          href="/admin/collections/new"
          className="inline-flex items-center gap-2 bg-ember text-white-hot px-4 py-2 rounded font-medium hover:bg-flame transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Collection
        </Link>
      </div>

      {error && (
        <div className="bg-flame/10 border border-flame/20 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-flame flex-shrink-0" />
          <p className="text-flame">{error}</p>
          <button onClick={() => setError("")} className="ml-auto text-flame">
            ×
          </button>
        </div>
      )}

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCollections.length > 0 ? (
          filteredCollections.map((collection) => (
            <div
              key={collection.id}
              className="bg-soot border border-smoke rounded-lg p-6 hover:border-ember/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-charcoal rounded">
                  <FolderOpen className="h-6 w-6 text-ember" />
                </div>
                <div className="flex gap-1">
                  <Link
                    href={`/admin/collections/${collection.id}`}
                    className="p-2 text-stone hover:text-white-hot transition-colors"
                    title="Edit collection"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => setDeleteConfirm(collection.id)}
                    className="p-2 text-stone hover:text-flame transition-colors"
                    title="Delete collection"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-medium text-white-hot mb-1">
                {collection.title}
              </h3>
              <p className="text-stone text-sm mb-4 line-clamp-2">
                {collection.hero_copy}
              </p>

              <div className="flex items-center gap-2 text-steel-grey text-sm">
                <Package className="h-4 w-4" />
                <span>
                  {collection.products?.length || 0} product
                  {(collection.products?.length || 0) !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-smoke">
                <Link
                  href={`/collections/${collection.slug}`}
                  className="text-ember hover:text-flame text-sm transition-colors"
                  target="_blank"
                >
                  View on store →
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <FolderOpen className="h-12 w-12 mx-auto mb-3 text-steel-grey" />
            <p className="text-stone">No collections found</p>
            {search && (
              <p className="text-steel-grey text-sm mt-1">
                Try a different search term
              </p>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-soot border border-smoke rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-white-hot mb-2">
              Delete Collection?
            </h3>
            <p className="text-stone mb-6">
              This will remove the collection but not the products in it. Are you
              sure?
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
