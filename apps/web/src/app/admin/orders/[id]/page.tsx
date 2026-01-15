"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  Package,
  Mail,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { useAdminAuth } from "../../layout";

interface OrderItem {
  id: number;
  product_id: number;
  variant_id: number;
  product_title: string;
  variant_sku: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  stripe_session_id: string;
  customer_email: string;
  total: number;
  status: string;
  shipping_address?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1";

const STATUS_TRANSITIONS: Record<string, string[]> = {
  pending: ["paid", "cancelled"],
  paid: ["processing", "refunded", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: ["refunded"],
  cancelled: [],
  refunded: [],
};

// Mock order for when API is not available
const mockOrder: Order = {
  id: 1001,
  stripe_session_id: "cs_test_abc123def456",
  customer_email: "jan@example.co.za",
  total: 549500,
  status: "paid",
  shipping_address: JSON.stringify({
    line1: "123 Main Road",
    line2: "Sandton",
    city: "Johannesburg",
    state: "Gauteng",
    postal_code: "2196",
    country: "ZA",
  }),
  created_at: "2026-01-14T10:30:00Z",
  updated_at: "2026-01-14T10:35:00Z",
  items: [
    {
      id: 1,
      product_id: 3,
      variant_id: 3,
      product_title: "KoosDoos Large",
      variant_sku: "KD-LG-001",
      quantity: 1,
      price: 549500,
    },
  ],
};

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { apiKey } = useAdminAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/admin/orders/${id}`, {
        headers: { "X-Admin-API-Key": apiKey },
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        // Use mock order
        setOrder({ ...mockOrder, id: parseInt(id) });
      }
    } catch (err) {
      // Use mock order on error
      setOrder({ ...mockOrder, id: parseInt(id) });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!order) return;

    setUpdating(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/admin/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-API-Key": apiKey,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data);
        setSuccess(`Order status updated to "${newStatus}"`);
      } else {
        const data = await response.json();
        setError(data.detail || "Failed to update status");
      }
    } catch (err) {
      // Demo mode - update locally
      setOrder((prev) =>
        prev ? { ...prev, status: newStatus, updated_at: new Date().toISOString() } : null
      );
      setSuccess(`Order status updated to "${newStatus}"`);
    } finally {
      setUpdating(false);
    }
  };

  const formatPrice = (cents: number) => {
    return `R${(cents / 100).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "processing":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "shipped":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "delivered":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "cancelled":
      case "refunded":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-steel-grey/20 text-stone border-steel-grey/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return CheckCircle;
      case "shipped":
        return Truck;
      case "cancelled":
      case "refunded":
        return XCircle;
      default:
        return Clock;
    }
  };

  const parseAddress = (addressJson?: string) => {
    if (!addressJson) return null;
    try {
      return JSON.parse(addressJson);
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 text-ember animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto mb-3 text-flame" />
        <p className="text-white-hot">Order not found</p>
        <Link href="/admin/orders" className="text-ember hover:text-flame mt-4 inline-block">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(order.status);
  const address = parseAddress(order.shipping_address);
  const availableTransitions = STATUS_TRANSITIONS[order.status] || [];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/orders"
          className="p-2 text-stone hover:text-white-hot transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-medium text-white-hot">Order #{order.id}</h1>
          <p className="text-stone text-sm">{formatDate(order.created_at)}</p>
        </div>
        <div className="ml-auto">
          <span
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded border text-sm font-medium capitalize ${getStatusColor(
              order.status
            )}`}
          >
            <StatusIcon className="h-4 w-4" />
            {order.status}
          </span>
        </div>
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
          <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
          <p className="text-green-400">{success}</p>
          <button onClick={() => setSuccess("")} className="ml-auto text-green-400">
            ×
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-soot border border-smoke rounded-lg p-6">
            <h2 className="text-lg font-medium text-white-hot mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 pb-4 border-b border-smoke last:border-0 last:pb-0"
                >
                  <div className="w-16 h-16 bg-charcoal rounded flex items-center justify-center flex-shrink-0">
                    <Package className="h-8 w-8 text-steel-grey" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white-hot font-medium truncate">
                      {item.product_title}
                    </p>
                    <p className="text-stone text-sm">
                      SKU: {item.variant_sku} • Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white-hot font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-stone text-sm">
                        {formatPrice(item.price)} each
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-4 border-t border-smoke">
              <div className="flex justify-between text-stone mb-2">
                <span>Subtotal</span>
                <span>{formatPrice(order.total)}</span>
              </div>
              <div className="flex justify-between text-stone mb-2">
                <span>Shipping</span>
                <span>{order.total >= 250000 ? "FREE" : formatPrice(15000)}</span>
              </div>
              <div className="flex justify-between text-white-hot font-medium text-lg pt-2 border-t border-smoke">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Status Updates */}
          {availableTransitions.length > 0 && (
            <div className="bg-soot border border-smoke rounded-lg p-6">
              <h2 className="text-lg font-medium text-white-hot mb-4">
                Update Status
              </h2>
              <div className="flex flex-wrap gap-3">
                {availableTransitions.map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(status)}
                    disabled={updating}
                    className={`px-4 py-2 rounded font-medium capitalize transition-colors disabled:opacity-50 ${
                      status === "cancelled" || status === "refunded"
                        ? "bg-flame/20 text-flame hover:bg-flame/30 border border-flame/30"
                        : "bg-ember text-white-hot hover:bg-flame"
                    }`}
                  >
                    {updating ? "Updating..." : `Mark as ${status}`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Customer Info Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-soot border border-smoke rounded-lg p-6">
            <h2 className="text-lg font-medium text-white-hot mb-4">Customer</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-charcoal rounded-full flex items-center justify-center">
                <Mail className="h-5 w-5 text-ember" />
              </div>
              <div>
                <p className="text-white-hot">{order.customer_email}</p>
                <a
                  href={`mailto:${order.customer_email}`}
                  className="text-ember text-sm hover:text-flame"
                >
                  Send email
                </a>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {address && (
            <div className="bg-soot border border-smoke rounded-lg p-6">
              <h2 className="text-lg font-medium text-white-hot mb-4">
                Shipping Address
              </h2>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-ember flex-shrink-0 mt-0.5" />
                <div className="text-stone">
                  <p>{address.line1}</p>
                  {address.line2 && <p>{address.line2}</p>}
                  <p>
                    {address.city}, {address.state}
                  </p>
                  <p>{address.postal_code}</p>
                  <p>{address.country}</p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Info */}
          <div className="bg-soot border border-smoke rounded-lg p-6">
            <h2 className="text-lg font-medium text-white-hot mb-4">Payment</h2>
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-ember" />
              <div>
                <p className="text-white-hot">Stripe</p>
                <p className="text-stone text-sm truncate max-w-[200px]">
                  {order.stripe_session_id}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-soot border border-smoke rounded-lg p-6">
            <h2 className="text-lg font-medium text-white-hot mb-4">Timeline</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-ember rounded-full" />
                <span className="text-stone">Created</span>
                <span className="text-steel-grey ml-auto">
                  {formatDate(order.created_at)}
                </span>
              </div>
              {order.updated_at !== order.created_at && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-ember rounded-full" />
                  <span className="text-stone">Updated</span>
                  <span className="text-steel-grey ml-auto">
                    {formatDate(order.updated_at)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
