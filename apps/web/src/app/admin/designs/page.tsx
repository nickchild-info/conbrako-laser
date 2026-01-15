"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Search,
  RefreshCw,
  AlertCircle,
  Palette,
  Filter,
  Eye,
  Check,
  X,
  Download,
  ChevronLeft,
  ChevronRight,
  FileImage,
  User,
  Calendar,
} from "lucide-react";
import { useAdminAuth } from "../layout";

interface CustomDesign {
  id: number;
  order_id: number;
  customer_email: string;
  design_file_url: string;
  thumbnail_url?: string;
  status: string;
  created_at: string;
  approved_at?: string;
  notes?: string;
  product_size: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1";

const DESIGN_STATUSES = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending Review" },
  { value: "under_review", label: "Under Review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "in_production", label: "In Production" },
];

// Mock designs for when API is not available
const mockDesigns: CustomDesign[] = [
  {
    id: 1,
    order_id: 1003,
    customer_email: "pieter@example.co.za",
    design_file_url: "/uploads/designs/springbok-custom.dxf",
    thumbnail_url: "/images/templates/springbok.jpg",
    status: "pending",
    created_at: "2026-01-15T08:30:00Z",
    product_size: "Large",
    notes: "Custom springbok design with text 'BRAAI TIME'",
  },
  {
    id: 2,
    order_id: 1006,
    customer_email: "maria@example.co.za",
    design_file_url: "/uploads/designs/family-crest.png",
    thumbnail_url: "/images/templates/geometric.jpg",
    status: "under_review",
    created_at: "2026-01-14T14:20:00Z",
    product_size: "XL",
    notes: "Family crest design - checking if details are laser-cuttable",
  },
  {
    id: 3,
    order_id: 1004,
    customer_email: "anna@example.co.za",
    design_file_url: "/uploads/designs/protea-flower.svg",
    thumbnail_url: "/images/templates/protea.jpg",
    status: "approved",
    created_at: "2026-01-13T11:00:00Z",
    approved_at: "2026-01-13T15:30:00Z",
    product_size: "Medium",
  },
  {
    id: 4,
    order_id: 1007,
    customer_email: "thabo@example.co.za",
    design_file_url: "/uploads/designs/company-logo.png",
    thumbnail_url: "/images/templates/custom.jpg",
    status: "rejected",
    created_at: "2026-01-12T09:45:00Z",
    product_size: "Large",
    notes: "Image resolution too low for laser cutting - requested higher quality file",
  },
  {
    id: 5,
    order_id: 1008,
    customer_email: "lisa@example.co.za",
    design_file_url: "/uploads/designs/safari-animals.dxf",
    thumbnail_url: "/images/templates/elephant.jpg",
    status: "in_production",
    created_at: "2026-01-11T16:00:00Z",
    approved_at: "2026-01-12T10:00:00Z",
    product_size: "XL",
  },
];

export default function DesignsPage() {
  const searchParams = useSearchParams();
  const { apiKey } = useAdminAuth();
  const [designs, setDesigns] = useState<CustomDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");
  const [selectedDesign, setSelectedDesign] = useState<CustomDesign | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionNotes, setActionNotes] = useState("");

  const fetchDesigns = async () => {
    setLoading(true);
    setError("");

    try {
      // In a real implementation, this would fetch from the custom designs endpoint
      let filtered = mockDesigns;
      if (statusFilter) {
        filtered = filtered.filter((d) => d.status === statusFilter);
      }
      if (search) {
        filtered = filtered.filter((d) =>
          d.customer_email.toLowerCase().includes(search.toLowerCase())
        );
      }
      setDesigns(filtered);
    } catch (err) {
      setDesigns(mockDesigns);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigns();
  }, [statusFilter, apiKey]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDesigns();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const updateDesignStatus = async (designId: number, newStatus: string, notes?: string) => {
    setActionLoading(true);
    try {
      // In a real implementation, this would call the API
      setDesigns((prev) =>
        prev.map((d) =>
          d.id === designId
            ? {
                ...d,
                status: newStatus,
                notes: notes || d.notes,
                approved_at:
                  newStatus === "approved" ? new Date().toISOString() : d.approved_at,
              }
            : d
        )
      );
      setSelectedDesign(null);
      setActionNotes("");
    } catch (err) {
      setError("Failed to update design status");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-orange-500/20 text-orange-400";
      case "under_review":
        return "bg-blue-500/20 text-blue-400";
      case "approved":
        return "bg-green-500/20 text-green-400";
      case "rejected":
        return "bg-red-500/20 text-red-400";
      case "in_production":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-steel-grey/20 text-stone";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, " ");
  };

  if (loading && designs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 text-ember animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-steel-grey" />
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-soot border border-smoke rounded text-white-hot placeholder:text-steel-grey focus:outline-none focus:border-ember"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-steel-grey" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 bg-soot border border-smoke rounded text-white-hot focus:outline-none focus:border-ember appearance-none cursor-pointer"
          >
            {DESIGN_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={fetchDesigns}
          className="px-4 py-2 bg-soot border border-smoke rounded text-stone hover:text-white-hot hover:border-ember transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {DESIGN_STATUSES.slice(1).map((status) => {
          const count = mockDesigns.filter((d) => d.status === status.value).length;
          return (
            <button
              key={status.value}
              onClick={() => setStatusFilter(status.value)}
              className={`p-4 bg-soot border rounded-lg text-left transition-colors ${
                statusFilter === status.value
                  ? "border-ember"
                  : "border-smoke hover:border-ember/50"
              }`}
            >
              <p className="text-2xl font-bebas-neue text-white-hot">{count}</p>
              <p className="text-stone text-sm capitalize">
                {status.label}
              </p>
            </button>
          );
        })}
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

      {/* Designs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {designs.length > 0 ? (
          designs.map((design) => (
            <div
              key={design.id}
              className="bg-soot border border-smoke rounded-lg overflow-hidden hover:border-ember/50 transition-colors"
            >
              {/* Preview Image */}
              <div className="aspect-video bg-charcoal relative">
                {design.thumbnail_url ? (
                  <Image
                    src={design.thumbnail_url}
                    alt="Design preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileImage className="h-12 w-12 text-steel-grey" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${getStatusColor(
                      design.status
                    )}`}
                  >
                    {getStatusLabel(design.status)}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-center gap-2 text-stone text-sm mb-2">
                  <User className="h-4 w-4" />
                  <span className="truncate">{design.customer_email}</span>
                </div>
                <div className="flex items-center gap-2 text-steel-grey text-sm mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(design.created_at)}</span>
                </div>
                <div className="flex items-center gap-2 text-steel-grey text-sm mb-4">
                  <Palette className="h-4 w-4" />
                  <span>Size: {design.product_size}</span>
                </div>

                {design.notes && (
                  <p className="text-stone text-sm mb-4 line-clamp-2">
                    {design.notes}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedDesign(design)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-charcoal border border-smoke rounded text-stone hover:text-white-hot hover:border-ember transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    Review
                  </button>
                  <a
                    href={design.design_file_url}
                    download
                    className="p-2 bg-charcoal border border-smoke rounded text-stone hover:text-white-hot hover:border-ember transition-colors"
                    title="Download file"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Palette className="h-12 w-12 mx-auto mb-3 text-steel-grey" />
            <p className="text-stone">No designs found</p>
            {(search || statusFilter) && (
              <p className="text-steel-grey text-sm mt-1">
                Try adjusting your filters
              </p>
            )}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedDesign && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-soot border border-smoke rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-smoke">
              <h3 className="text-lg font-medium text-white-hot">
                Review Design #{selectedDesign.id}
              </h3>
              <button
                onClick={() => {
                  setSelectedDesign(null);
                  setActionNotes("");
                }}
                className="text-stone hover:text-white-hot"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Preview */}
              <div className="aspect-video bg-charcoal rounded-lg mb-6 relative overflow-hidden">
                {selectedDesign.thumbnail_url ? (
                  <Image
                    src={selectedDesign.thumbnail_url}
                    alt="Design preview"
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileImage className="h-16 w-16 text-steel-grey" />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-steel-grey text-sm">Customer</p>
                  <p className="text-white-hot">{selectedDesign.customer_email}</p>
                </div>
                <div>
                  <p className="text-steel-grey text-sm">Order</p>
                  <Link
                    href={`/admin/orders/${selectedDesign.order_id}`}
                    className="text-ember hover:text-flame"
                  >
                    #{selectedDesign.order_id}
                  </Link>
                </div>
                <div>
                  <p className="text-steel-grey text-sm">Size</p>
                  <p className="text-white-hot">{selectedDesign.product_size}</p>
                </div>
                <div>
                  <p className="text-steel-grey text-sm">Status</p>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${getStatusColor(
                      selectedDesign.status
                    )}`}
                  >
                    {getStatusLabel(selectedDesign.status)}
                  </span>
                </div>
              </div>

              {/* File Info */}
              <div className="bg-charcoal rounded-lg p-4 mb-6">
                <p className="text-steel-grey text-sm mb-2">File</p>
                <div className="flex items-center justify-between">
                  <p className="text-stone truncate">
                    {selectedDesign.design_file_url.split("/").pop()}
                  </p>
                  <a
                    href={selectedDesign.design_file_url}
                    download
                    className="text-ember hover:text-flame flex items-center gap-1"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                </div>
              </div>

              {/* Notes */}
              {selectedDesign.notes && (
                <div className="mb-6">
                  <p className="text-steel-grey text-sm mb-2">Notes</p>
                  <p className="text-stone">{selectedDesign.notes}</p>
                </div>
              )}

              {/* Action Notes */}
              {(selectedDesign.status === "pending" ||
                selectedDesign.status === "under_review") && (
                <div className="mb-6">
                  <label className="block text-steel-grey text-sm mb-2">
                    Add Notes (optional)
                  </label>
                  <textarea
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 bg-charcoal border border-smoke rounded text-white-hot focus:outline-none focus:border-ember resize-none"
                    placeholder="Reason for approval/rejection..."
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {selectedDesign.status === "pending" && (
                  <button
                    onClick={() =>
                      updateDesignStatus(selectedDesign.id, "under_review", actionNotes)
                    }
                    disabled={actionLoading}
                    className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded hover:bg-blue-500/30 transition-colors disabled:opacity-50"
                  >
                    Start Review
                  </button>
                )}
                {(selectedDesign.status === "pending" ||
                  selectedDesign.status === "under_review") && (
                  <>
                    <button
                      onClick={() =>
                        updateDesignStatus(selectedDesign.id, "approved", actionNotes)
                      }
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white-hot rounded hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        updateDesignStatus(selectedDesign.id, "rejected", actionNotes)
                      }
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-flame text-white-hot rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </button>
                  </>
                )}
                {selectedDesign.status === "approved" && (
                  <button
                    onClick={() =>
                      updateDesignStatus(selectedDesign.id, "in_production")
                    }
                    disabled={actionLoading}
                    className="flex-1 px-4 py-2 bg-purple-500 text-white-hot rounded hover:bg-purple-600 transition-colors disabled:opacity-50"
                  >
                    Move to Production
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
