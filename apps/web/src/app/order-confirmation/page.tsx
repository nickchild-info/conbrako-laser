"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Package,
  Truck,
  Mail,
  ArrowRight,
  Printer,
  Shield,
  Clock,
  ExternalLink,
  MapPin,
  Loader2,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/data/products";
import { Breadcrumbs } from "@/components/layout";
import { Button } from "@/components/ui";
import { trackPurchase, toAnalyticsItem, AnalyticsPurchaseItem } from "@/lib/analytics";
import { getOrder } from "@/lib/api/cart";
import { getOrderTracking, type TrackingEvent } from "@/lib/api/shipping";
import type { OrderResponse } from "@/lib/api/types";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const sessionId = searchParams.get("session_id"); // Legacy Stripe support
  const { clearCart, items, subtotal } = useCart();
  const [orderCleared, setOrderCleared] = useState(false);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [tracking, setTracking] = useState<TrackingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch order details from API
  useEffect(() => {
    const fetchOrder = async () => {
      // Support both order_id (Payfast) and session_id (legacy Stripe)
      const id = orderId || sessionId;

      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const orderData = await getOrder(id);
        setOrder(orderData);

        // Try to fetch tracking if waybill exists
        if (orderData.waybill) {
          try {
            const trackingData = await getOrderTracking(parseInt(id));
            setTracking(trackingData.events);
          } catch {
            // Tracking not available yet, that's ok
          }
        }

        // Track purchase event if this is a fresh order
        if (!orderCleared && items.length > 0) {
          const analyticsItems: AnalyticsPurchaseItem[] = items.map((item) => ({
            ...toAnalyticsItem(
              item.product.id,
              item.product.title,
              item.variant.price,
              item.quantity,
              item.variant.name
            ),
            quantity: item.quantity,
          }));

          trackPurchase(
            `KD-${orderData.id}`,
            analyticsItems,
            orderData.total,
            orderData.shipping_cost || 0,
            0 // tax
          );

          clearCart();
          setOrderCleared(true);
        } else if (!orderCleared) {
          // Cart already cleared, just mark as processed
          setOrderCleared(true);
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError("Failed to load order details");

        // Fallback: create order from cart data if available
        if (!orderCleared && items.length > 0) {
          const shipping = subtotal >= 2500 ? 0 : 150;
          const orderNumber = `KD-${Date.now().toString(36).toUpperCase()}`;

          // Track purchase with cart data
          const analyticsItems: AnalyticsPurchaseItem[] = items.map((item) => ({
            ...toAnalyticsItem(
              item.product.id,
              item.product.title,
              item.variant.price,
              item.quantity,
              item.variant.name
            ),
            quantity: item.quantity,
          }));

          trackPurchase(
            orderNumber,
            analyticsItems,
            subtotal + shipping,
            shipping,
            0
          );

          clearCart();
          setOrderCleared(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, sessionId, orderCleared, items, subtotal, clearCart]);

  function getEstimatedDelivery(): string {
    if (order?.shipping_service === "overnight") {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      return date.toLocaleDateString("en-ZA", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } else if (order?.shipping_service === "express") {
      const date = new Date();
      date.setDate(date.getDate() + 3);
      return date.toLocaleDateString("en-ZA", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } else {
      const date = new Date();
      date.setDate(date.getDate() + 5);
      return date.toLocaleDateString("en-ZA", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  }

  function formatShippingAddress(addressJson: string | null): string {
    if (!addressJson) return "";
    try {
      const address = JSON.parse(addressJson);
      return `${address.line1 || address.street}, ${address.suburb}, ${address.city}, ${address.province || address.state} ${address.postal_code}`;
    } catch {
      return "";
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="bg-soot border-b border-smoke py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={[{ label: "Order Confirmation" }]} />
            <h1 className="font-display text-4xl sm:text-5xl text-white-hot mt-4">
              Order Confirmation
            </h1>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Loader2 className="h-12 w-12 text-ember mx-auto mb-4 animate-spin" />
          <p className="text-stone">Loading order details...</p>
        </div>
      </div>
    );
  }

  // No order ID - show error state
  if (!orderId && !sessionId) {
    return (
      <div className="min-h-screen">
        <div className="bg-soot border-b border-smoke py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={[{ label: "Order Confirmation" }]} />
            <h1 className="font-display text-4xl sm:text-5xl text-white-hot mt-4">
              Order Not Found
            </h1>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="w-20 h-20 bg-soot border border-smoke rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-10 w-10 text-steel-grey" />
          </div>
          <h2 className="font-display text-2xl text-white-hot mb-4">
            No Order Information Found
          </h2>
          <p className="text-stone mb-8 max-w-md mx-auto">
            We couldn&apos;t find your order details. If you just completed a
            purchase, check your email for confirmation. If you need help,
            please contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/collections/fire-pits">
              <Button size="lg">Continue Shopping</Button>
            </Link>
            <Link href="/pages/contact">
              <Button variant="outline" size="lg">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const orderNumber = order ? `KD-${order.id}` : `KD-${(orderId || sessionId)?.slice(-8).toUpperCase()}`;
  const shippingAddress = order ? formatShippingAddress(order.shipping_address) : null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-soot border-b border-smoke py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Order Confirmation" }]} />
          <h1 className="font-display text-4xl sm:text-5xl text-white-hot mt-4">
            Order Confirmed
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-ember/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-ember" />
          </div>
          <h2 className="font-display text-3xl text-white-hot mb-3">
            Thank You For Your Order!
          </h2>
          <p className="text-stone text-lg max-w-lg mx-auto">
            Your fire pit is being prepared. We&apos;ll send you a shipping
            confirmation email once it&apos;s on its way.
          </p>
        </div>

        {/* Error message if API failed */}
        {error && (
          <div className="mb-8 p-4 bg-yellow-900/20 border border-yellow-500/50 rounded">
            <p className="text-sm text-yellow-400">
              Note: We couldn&apos;t load full order details, but your payment was successful.
              Check your email for order confirmation.
            </p>
          </div>
        )}

        {/* Order Details Card */}
        <div className="bg-soot border border-smoke p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-smoke">
            <div>
              <p className="text-stone text-sm mb-1">Order Number</p>
              <p className="font-display text-2xl text-ember">{orderNumber}</p>
            </div>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 text-stone hover:text-white-hot transition-colors text-sm"
            >
              <Printer className="h-4 w-4" />
              Print Receipt
            </button>
          </div>

          {/* Order Status */}
          {order && (
            <div className="mb-6 pb-6 border-b border-smoke">
              <div className="flex items-center justify-between">
                <span className="text-stone">Status</span>
                <span className={`font-medium px-2 py-1 text-sm ${
                  order.status === "paid" || order.status === "processing"
                    ? "bg-green-900/30 text-green-400"
                    : order.status === "shipped"
                    ? "bg-blue-900/30 text-blue-400"
                    : order.status === "delivered"
                    ? "bg-ember/30 text-ember"
                    : "bg-smoke text-stone"
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          )}

          {/* Order Items */}
          {order && order.items.length > 0 && (
            <div className="mb-6 pb-6 border-b border-smoke">
              <h3 className="font-display text-lg text-white-hot mb-4">
                Order Items
              </h3>
              <ul className="space-y-3">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-start gap-4"
                  >
                    <div>
                      <p className="text-white-hot font-medium">
                        {item.product_title || "Product"}
                      </p>
                      <p className="text-stone text-sm">
                        {item.variant_sku || "Standard"} x {item.quantity}
                      </p>
                    </div>
                    <p className="text-white-hot font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Order Summary */}
          {order && (
            <div className="mb-6 pb-6 border-b border-smoke">
              <h3 className="font-display text-lg text-white-hot mb-4">
                Order Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-stone">
                  <span>Subtotal</span>
                  <span className="text-white-hot">
                    {formatPrice(order.total - (order.shipping_cost || 0))}
                  </span>
                </div>
                <div className="flex justify-between text-stone">
                  <span>
                    Shipping
                    {order.shipping_service && (
                      <span className="text-xs ml-1">
                        ({order.shipping_service})
                      </span>
                    )}
                  </span>
                  <span className="text-white-hot">
                    {order.shipping_cost === 0 ? (
                      <span className="text-ember">FREE</span>
                    ) : (
                      formatPrice(order.shipping_cost || 0)
                    )}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-smoke">
                  <span className="text-white-hot font-medium">Total</span>
                  <span className="text-xl font-bold text-ember">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Shipping Address */}
          {shippingAddress && (
            <div className="mb-6 pb-6 border-b border-smoke">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-charcoal border border-smoke rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-ember" />
                </div>
                <div>
                  <p className="text-white-hot font-medium mb-1">
                    Delivery Address
                  </p>
                  <p className="text-stone text-sm">{shippingAddress}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tracking Information */}
          {order?.waybill && (
            <div className="mb-6 pb-6 border-b border-smoke">
              <h3 className="font-display text-lg text-white-hot mb-4">
                Tracking Information
              </h3>
              <div className="bg-charcoal border border-smoke p-4">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div>
                    <p className="text-stone text-sm">Waybill Number</p>
                    <p className="text-white-hot font-mono">{order.waybill}</p>
                  </div>
                  {order.tracking_url && (
                    <a
                      href={order.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-ember hover:text-flame text-sm"
                    >
                      Track Shipment
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>

                {/* Tracking Events */}
                {tracking.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-smoke">
                    <p className="text-stone text-sm mb-3">Tracking History</p>
                    <ul className="space-y-3">
                      {tracking.slice().reverse().map((event, index) => (
                        <li key={index} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className={`w-2 h-2 rounded-full ${
                              index === 0 ? "bg-ember" : "bg-steel-grey"
                            }`} />
                            {index < tracking.length - 1 && (
                              <div className="w-px h-full bg-smoke" />
                            )}
                          </div>
                          <div className="pb-3">
                            <p className="text-white-hot text-sm font-medium">
                              {event.status}
                            </p>
                            <p className="text-stone text-xs">
                              {event.description}
                            </p>
                            <p className="text-steel-grey text-xs mt-1">
                              {new Date(event.timestamp).toLocaleString("en-ZA")}
                              {event.location && ` - ${event.location}`}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Delivery Info */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-charcoal border border-smoke rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5 text-ember" />
              </div>
              <div>
                <p className="text-white-hot font-medium mb-1">
                  Confirmation Email
                </p>
                <p className="text-stone text-sm">
                  {order?.customer_email ? (
                    <>Sent to {order.customer_email}</>
                  ) : (
                    <>A confirmation email will be sent to your email address.</>
                  )}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-charcoal border border-smoke rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="h-5 w-5 text-ember" />
              </div>
              <div>
                <p className="text-white-hot font-medium mb-1">
                  Estimated Delivery
                </p>
                <p className="text-stone text-sm">{getEstimatedDelivery()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-soot border border-smoke p-6 sm:p-8 mb-8">
          <h3 className="font-display text-xl text-white-hot mb-6">
            What Happens Next?
          </h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-ember rounded-full flex items-center justify-center text-white-hot text-sm font-bold">
                  1
                </div>
                <div className="w-px h-full bg-smoke mt-2" />
              </div>
              <div className="pb-6">
                <p className="text-white-hot font-medium mb-1">
                  Order Processing
                </p>
                <p className="text-stone text-sm">
                  We&apos;re preparing your fire pit. This usually takes 1-2
                  business days.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-ember rounded-full flex items-center justify-center text-white-hot text-sm font-bold">
                  2
                </div>
                <div className="w-px h-full bg-smoke mt-2" />
              </div>
              <div className="pb-6">
                <p className="text-white-hot font-medium mb-1">Shipping</p>
                <p className="text-stone text-sm">
                  Once shipped, you&apos;ll receive an email with tracking
                  information from The Courier Guy.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-ember rounded-full flex items-center justify-center text-white-hot text-sm font-bold flex-shrink-0">
                3
              </div>
              <div>
                <p className="text-white-hot font-medium mb-1">
                  Delivery & Assembly
                </p>
                <p className="text-stone text-sm">
                  Your fire pit arrives flat-packed. Assembly takes just 5
                  minutes with no tools required!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          <div className="bg-soot border border-smoke p-4 text-center">
            <Shield className="h-6 w-6 text-ember mx-auto mb-2" />
            <p className="text-white-hot text-sm font-medium">2 Year Warranty</p>
            <p className="text-stone text-xs">Full coverage</p>
          </div>
          <div className="bg-soot border border-smoke p-4 text-center">
            <Truck className="h-6 w-6 text-ember mx-auto mb-2" />
            <p className="text-white-hot text-sm font-medium">Fast Shipping</p>
            <p className="text-stone text-xs">SA nationwide</p>
          </div>
          <div className="bg-soot border border-smoke p-4 text-center">
            <Clock className="h-6 w-6 text-ember mx-auto mb-2" />
            <p className="text-white-hot text-sm font-medium">5 Min Assembly</p>
            <p className="text-stone text-xs">No tools needed</p>
          </div>
          <div className="bg-soot border border-smoke p-4 text-center">
            <Package className="h-6 w-6 text-ember mx-auto mb-2" />
            <p className="text-white-hot text-sm font-medium">Flat-Pack</p>
            <p className="text-stone text-xs">Easy to store</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-stone mb-6">
            Got questions about your order? We&apos;re here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/collections/fire-pits">
              <Button size="lg">
                Continue Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pages/faq">
              <Button variant="outline" size="lg">
                View FAQs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen">
          <div className="bg-soot border-b border-smoke py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="font-display text-4xl sm:text-5xl text-white-hot mt-4">
                Order Confirmation
              </h1>
            </div>
          </div>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <Loader2 className="h-12 w-12 text-ember mx-auto mb-4 animate-spin" />
            <p className="text-stone">Loading...</p>
          </div>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
