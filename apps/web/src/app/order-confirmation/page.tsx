"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/data/products";
import { Breadcrumbs } from "@/components/layout";
import { Button } from "@/components/ui";

interface OrderDetails {
  id: string;
  orderNumber: string;
  email: string;
  total: number;
  subtotal: number;
  shipping: number;
  items: Array<{
    name: string;
    variant: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress?: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    country: string;
  };
  estimatedDelivery: string;
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart, items, subtotal } = useCart();
  const [orderCleared, setOrderCleared] = useState(false);

  // Mock order details for display (in production, this would come from API)
  const [order, setOrder] = useState<OrderDetails | null>(null);

  // Clear cart on successful order
  useEffect(() => {
    if (sessionId && !orderCleared && items.length > 0) {
      // Store order details from cart before clearing
      const orderItems = items.map((item) => ({
        name: item.product.title,
        variant: item.variant.name,
        quantity: item.quantity,
        price: item.variant.price * item.quantity,
      }));

      const shipping = subtotal >= 2500 ? 0 : 150;

      setOrder({
        id: sessionId,
        orderNumber: `KD-${Date.now().toString(36).toUpperCase()}`,
        email: "customer@example.com", // Would come from Stripe session
        total: subtotal + shipping,
        subtotal: subtotal,
        shipping: shipping,
        items: orderItems,
        estimatedDelivery: getEstimatedDelivery(),
      });

      clearCart();
      setOrderCleared(true);
    } else if (sessionId && !order) {
      // If cart is already cleared, show a generic success state
      setOrder({
        id: sessionId,
        orderNumber: `KD-${sessionId.slice(-8).toUpperCase()}`,
        email: "Your email",
        total: 0,
        subtotal: 0,
        shipping: 0,
        items: [],
        estimatedDelivery: getEstimatedDelivery(),
      });
    }
  }, [sessionId, orderCleared, items, subtotal, clearCart, order]);

  function getEstimatedDelivery(): string {
    const date = new Date();
    date.setDate(date.getDate() + 5); // 5 business days
    return date.toLocaleDateString("en-ZA", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // No session ID - show error state
  if (!sessionId) {
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

        {/* Order Details Card */}
        <div className="bg-soot border border-smoke p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-smoke">
            <div>
              <p className="text-stone text-sm mb-1">Order Number</p>
              <p className="font-display text-2xl text-ember">
                {order?.orderNumber || "Processing..."}
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 text-stone hover:text-white-hot transition-colors text-sm"
            >
              <Printer className="h-4 w-4" />
              Print Receipt
            </button>
          </div>

          {/* Order Items */}
          {order && order.items.length > 0 && (
            <div className="mb-6 pb-6 border-b border-smoke">
              <h3 className="font-display text-lg text-white-hot mb-4">
                Order Items
              </h3>
              <ul className="space-y-3">
                {order.items.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-start gap-4"
                  >
                    <div>
                      <p className="text-white-hot font-medium">{item.name}</p>
                      <p className="text-stone text-sm">
                        {item.variant} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-white-hot font-medium">
                      {formatPrice(item.price)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Order Summary */}
          {order && order.total > 0 && (
            <div className="mb-6 pb-6 border-b border-smoke">
              <h3 className="font-display text-lg text-white-hot mb-4">
                Order Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-stone">
                  <span>Subtotal</span>
                  <span className="text-white-hot">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-stone">
                  <span>Shipping</span>
                  <span className="text-white-hot">
                    {order.shipping === 0 ? (
                      <span className="text-ember">FREE</span>
                    ) : (
                      formatPrice(order.shipping)
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
                  A confirmation email will be sent to your email address with
                  your order details and tracking information.
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
                <p className="text-stone text-sm">
                  {order?.estimatedDelivery || "5-7 business days"}
                </p>
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
                  information.
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
