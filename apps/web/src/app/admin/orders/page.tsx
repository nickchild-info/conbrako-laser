"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  RefreshCw,
  AlertCircle,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
} from "lucide-react";
import { useAdminAuth } from "../layout";

interface Order {
  id: number;
  payfast_payment_id: string | null;
  customer_email: string;
  total: number;
  status: string;
  created_at: string;
  items: Array<{
    id: number;
    product_title: string;
    variant_sku: string;
    quantity: number;
    price: number;
  }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1";

const ORDER_STATUSES = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

// Mock orders for when API is not available
const mockOrders: Order[] = [
  {
    id: 1001,
    payfast_payment_id: "pf_abc123",
    customer_email: "jan@example.co.za",
    total: 399500,
    status: "paid",
    created_at: "2026-01-14T10:30:00Z",
    items: [
      { id: 1, product_title: "KoosDoos Medium", variant_sku: "KD-MD-001", quantity: 1, price: 399500 },
    ],
  },
  {
    id: 1002,
    payfast_payment_id: "pf_def456",
    customer_email: "sarah@example.co.za",
    total: 699000,
    status: "processing",
    created_at: "2026-01-13T15:45:00Z",
    items: [
      { id: 2, product_title: "KoosDoos Large", variant_sku: "KD-LG-001", quantity: 1, price: 549500 },
      { id: 3, product_title: "KoosDoos Small", variant_sku: "KD-SM-001", quantity: 1, price: 299500 },
    ],
  },
  {
    id: 1003,
    payfast_payment_id: "pf_ghi789",
    customer_email: "pieter@example.co.za",
    total: 649500,
    status: "shipped",
    created_at: "2026-01-12T09:15:00Z",
    items: [
      { id: 4, product_title: "KoosDoos Personalised", variant_sku: "KD-PERS-LG", quantity: 1, price: 649500 },
    ],
  },
  {
    id: 1004,
    payfast_payment_id: "pf_jkl012",
    customer_email: "anna@example.co.za",
    total: 749500,
    status: "delivered",
    created_at: "2026-01-10T14:20:00Z",
    items: [
      { id: 5, product_title: "KoosDoos XL", variant_sku: "KD-XL-001", quantity: 1, price: 749500 },
    ],
  },
  {
    id: 1005,
    payfast_payment_id: null,
    customer_email: "johan@example.co.za",
    total: 299500,
    status: "pending",
    created_at: "2026-01-15T08:00:00Z",
    items: [
      { id: 6, product_title: "KoosDoos Small", variant_sku: "KD-SM-001", quantity: 1, price: 299500 },
    ],
  },
];

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const { apiKey } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      let url = `${API_URL}/admin/orders?page=${page}&per_page=10`;
      if (statusFilter) {
        url += `&status=${statusFilter}`;
      }
      if (search) {
        url += `&customer_email=${encodeURIComponent(search)}`;
      }

      const response = await fetch(url, {
        headers: { "X-Admin-API-Key": apiKey },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
        setTotalPages(data.total_pages || 1);
        setTotal(data.total || 0);
      } else {
        // Use mock data
        let filtered = mockOrders;
        if (statusFilter) {
          filtered = filtered.filter((o) => o.status === statusFilter);
        }
        if (search) {
          filtered = filtered.filter((o) =>
            o.customer_email.toLowerCase().includes(search.toLowerCase())
          );
        }
        setOrders(filtered);
        setTotal(filtered.length);
        setTotalPages(1);
      }
    } catch (err) {
      // Use mock data on error
      let filtered = mockOrders;
      if (statusFilter) {
        filtered = filtered.filter((o) => o.status === statusFilter);
      }
      if (search) {
        filtered = filtered.filter((o) =>
          o.customer_email.toLowerCase().includes(search.toLowerCase())
        );
      }
      setOrders(filtered);
      setTotal(filtered.length);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter, apiKey]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) {
        fetchOrders();
      } else {
        setPage(1);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const formatPrice = (cents: number) => {
    return `R${(cents / 100).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`;
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
      case "paid":
        return "bg-blue-500/20 text-blue-400";
      case "processing":
        return "bg-yellow-500/20 text-yellow-400";
      case "shipped":
        return "bg-purple-500/20 text-purple-400";
      case "delivered":
        return "bg-green-500/20 text-green-400";
      case "pending":
        return "bg-orange-500/20 text-orange-400";
      case "cancelled":
      case "refunded":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-steel-grey/20 text-stone";
    }
  };

  if (loading && orders.length === 0) {
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
            {ORDER_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-soot border border-smoke rounded text-stone hover:text-white-hot hover:border-ember transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Stats */}
      <div className="text-stone text-sm">
        Showing {orders.length} of {total} orders
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

      {/* Orders Table */}
      <div className="bg-soot border border-smoke rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-charcoal">
                <th className="text-left text-stone text-xs uppercase tracking-wide py-3 px-4">
                  Order
                </th>
                <th className="text-left text-stone text-xs uppercase tracking-wide py-3 px-4">
                  Customer
                </th>
                <th className="text-left text-stone text-xs uppercase tracking-wide py-3 px-4">
                  Items
                </th>
                <th className="text-left text-stone text-xs uppercase tracking-wide py-3 px-4">
                  Total
                </th>
                <th className="text-left text-stone text-xs uppercase tracking-wide py-3 px-4">
                  Status
                </th>
                <th className="text-left text-stone text-xs uppercase tracking-wide py-3 px-4">
                  Date
                </th>
                <th className="text-right text-stone text-xs uppercase tracking-wide py-3 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-smoke hover:bg-smoke/20"
                  >
                    <td className="py-4 px-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-ember hover:text-flame font-medium"
                      >
                        #{order.id}
                      </Link>
                    </td>
                    <td className="py-4 px-4 text-white-hot">
                      {order.customer_email}
                    </td>
                    <td className="py-4 px-4 text-stone text-sm">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </td>
                    <td className="py-4 px-4 text-white-hot font-medium">
                      {formatPrice(order.total)}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-stone text-sm">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 text-stone hover:text-white-hot transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="text-sm">View</span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-steel-grey" />
                    <p className="text-stone">No orders found</p>
                    {(search || statusFilter) && (
                      <p className="text-steel-grey text-sm mt-1">
                        Try adjusting your filters
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
    </div>
  );
}
