"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  FolderOpen,
  ShoppingCart,
  Palette,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { useAdminAuth } from "./layout";

interface DashboardStats {
  products: number;
  collections: number;
  orders: number;
  pendingDesigns: number;
  recentOrders: Array<{
    id: number;
    customer_email: string;
    total: number;
    status: string;
    created_at: string;
  }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1";

export default function AdminDashboard() {
  const { apiKey } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    setError("");

    try {
      const headers = { "X-Admin-API-Key": apiKey };

      // Fetch orders to get stats
      const ordersRes = await fetch(`${API_URL}/admin/orders?page=1&per_page=5`, {
        headers,
      });

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setStats({
          products: 5, // Mock data - would come from API
          collections: 4,
          orders: ordersData.total || 0,
          pendingDesigns: 2,
          recentOrders: ordersData.orders || [],
        });
      } else {
        // Use mock data if API not available
        setStats({
          products: 5,
          collections: 4,
          orders: 12,
          pendingDesigns: 2,
          recentOrders: [],
        });
      }
    } catch (err) {
      // Use mock data on error
      setStats({
        products: 5,
        collections: 4,
        orders: 12,
        pendingDesigns: 2,
        recentOrders: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [apiKey]);

  const formatPrice = (cents: number) => {
    return `R${(cents / 100).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "delivered":
        return "bg-green-500/20 text-green-400";
      case "processing":
      case "shipped":
        return "bg-blue-500/20 text-blue-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "cancelled":
      case "refunded":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-steel-grey/20 text-stone";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 text-ember animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/products"
          className="bg-soot border border-smoke rounded-lg p-6 hover:border-ember transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-stone text-sm">Products</p>
              <p className="text-3xl font-bebas-neue text-white-hot mt-1">
                {stats?.products || 0}
              </p>
            </div>
            <Package className="h-10 w-10 text-steel-grey group-hover:text-ember transition-colors" />
          </div>
        </Link>

        <Link
          href="/admin/collections"
          className="bg-soot border border-smoke rounded-lg p-6 hover:border-ember transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-stone text-sm">Collections</p>
              <p className="text-3xl font-bebas-neue text-white-hot mt-1">
                {stats?.collections || 0}
              </p>
            </div>
            <FolderOpen className="h-10 w-10 text-steel-grey group-hover:text-ember transition-colors" />
          </div>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-soot border border-smoke rounded-lg p-6 hover:border-ember transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-stone text-sm">Total Orders</p>
              <p className="text-3xl font-bebas-neue text-white-hot mt-1">
                {stats?.orders || 0}
              </p>
            </div>
            <ShoppingCart className="h-10 w-10 text-steel-grey group-hover:text-ember transition-colors" />
          </div>
        </Link>

        <Link
          href="/admin/designs"
          className="bg-soot border border-smoke rounded-lg p-6 hover:border-ember transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-stone text-sm">Pending Designs</p>
              <p className="text-3xl font-bebas-neue text-white-hot mt-1">
                {stats?.pendingDesigns || 0}
              </p>
            </div>
            <Palette className="h-10 w-10 text-steel-grey group-hover:text-ember transition-colors" />
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="bg-soot border border-smoke rounded-lg p-6">
        <h2 className="text-lg font-medium text-white-hot mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-3 px-4 py-3 bg-charcoal border border-smoke rounded hover:border-ember transition-colors"
          >
            <Package className="h-5 w-5 text-ember" />
            <span className="text-stone">Add Product</span>
          </Link>
          <Link
            href="/admin/collections/new"
            className="flex items-center gap-3 px-4 py-3 bg-charcoal border border-smoke rounded hover:border-ember transition-colors"
          >
            <FolderOpen className="h-5 w-5 text-ember" />
            <span className="text-stone">Add Collection</span>
          </Link>
          <Link
            href="/admin/orders?status=pending"
            className="flex items-center gap-3 px-4 py-3 bg-charcoal border border-smoke rounded hover:border-ember transition-colors"
          >
            <ShoppingCart className="h-5 w-5 text-ember" />
            <span className="text-stone">Pending Orders</span>
          </Link>
          <Link
            href="/admin/designs?status=pending"
            className="flex items-center gap-3 px-4 py-3 bg-charcoal border border-smoke rounded hover:border-ember transition-colors"
          >
            <Palette className="h-5 w-5 text-ember" />
            <span className="text-stone">Review Designs</span>
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-soot border border-smoke rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-white-hot">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-ember hover:text-flame text-sm flex items-center gap-1 transition-colors"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-smoke">
                  <th className="text-left text-stone text-xs uppercase tracking-wide py-3 px-2">
                    Order
                  </th>
                  <th className="text-left text-stone text-xs uppercase tracking-wide py-3 px-2">
                    Customer
                  </th>
                  <th className="text-left text-stone text-xs uppercase tracking-wide py-3 px-2">
                    Total
                  </th>
                  <th className="text-left text-stone text-xs uppercase tracking-wide py-3 px-2">
                    Status
                  </th>
                  <th className="text-left text-stone text-xs uppercase tracking-wide py-3 px-2">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-smoke/50 hover:bg-smoke/20"
                  >
                    <td className="py-3 px-2">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-ember hover:text-flame"
                      >
                        #{order.id}
                      </Link>
                    </td>
                    <td className="py-3 px-2 text-white-hot">
                      {order.customer_email}
                    </td>
                    <td className="py-3 px-2 text-white-hot">
                      {formatPrice(order.total)}
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-stone text-sm">
                      {formatDate(order.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-stone">
            <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No orders yet</p>
            <p className="text-sm text-steel-grey mt-1">
              Orders will appear here once customers make purchases
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
