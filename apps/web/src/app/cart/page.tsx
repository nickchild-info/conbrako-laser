"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/data/products";
import { Breadcrumbs } from "@/components/layout";
import { Button } from "@/components/ui";

const FREE_SHIPPING_THRESHOLD = 2500;

export default function CartPage() {
  const {
    items,
    subtotal,
    itemCount,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  const shippingEstimate = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 150;
  const total = subtotal + shippingEstimate;
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-soot border-b border-smoke py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Cart" }]} />
          <h1 className="font-display text-4xl sm:text-5xl text-white-hot mt-4">
            Your Cart
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {items.length === 0 ? (
          /* Empty cart state */
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-steel-grey mx-auto mb-6" />
            <h2 className="font-display text-2xl text-white-hot mb-3">
              Your Cart Is Empty
            </h2>
            <p className="text-stone mb-8 max-w-md mx-auto">
              Looks like you haven&apos;t added any fire pits to your cart yet.
              Browse our collection and find your perfect KoosDoos.
            </p>
            <Link href="/collections/fire-pits">
              <Button size="lg">
                Shop Fire Pits
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-3 lg:gap-12">
            {/* Cart items */}
            <div className="lg:col-span-2">
              {/* Free shipping progress */}
              <div className="bg-soot border border-smoke p-4 mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <Truck className="h-5 w-5 text-ember flex-shrink-0" />
                  <p className="text-sm text-stone">
                    {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                      <span className="text-ember font-medium">
                        You qualify for FREE shipping!
                      </span>
                    ) : (
                      <>
                        Add{" "}
                        <span className="text-white-hot font-medium">
                          {formatPrice(amountToFreeShipping)}
                        </span>{" "}
                        more for FREE shipping
                      </>
                    )}
                  </p>
                </div>
                <div className="h-2 bg-smoke rounded-full overflow-hidden">
                  <div
                    className="h-full bg-ember transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Items header */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-stone text-sm">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
                <button
                  onClick={clearCart}
                  className="text-sm text-stone hover:text-ember transition-colors"
                >
                  Clear cart
                </button>
              </div>

              {/* Cart item list */}
              <ul className="space-y-4">
                {items.map((item) => (
                  <li
                    key={item.variantId}
                    className="flex gap-4 p-4 bg-soot border border-smoke"
                  >
                    {/* Product image */}
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-charcoal border border-smoke"
                    >
                      {item.product.images[0] ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-steel-grey text-xs">
                          No image
                        </div>
                      )}
                    </Link>

                    {/* Product info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="font-display text-lg text-white-hot hover:text-ember transition-colors line-clamp-1"
                          >
                            {item.product.title}
                          </Link>
                          <p className="text-sm text-stone mt-1">
                            {item.variant.name}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="p-2 text-stone hover:text-ember transition-colors flex-shrink-0"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Price and quantity */}
                      <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-steel-grey">
                          <button
                            onClick={() =>
                              updateQuantity(item.variantId, item.quantity - 1)
                            }
                            className="p-2 text-stone hover:text-white-hot transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-12 text-center text-white-hot font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.variantId, item.quantity + 1)
                            }
                            className="p-2 text-stone hover:text-white-hot transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-white-hot">
                            {formatPrice(item.variant.price * item.quantity)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-stone">
                              {formatPrice(item.variant.price)} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Continue shopping */}
              <Link
                href="/collections/fire-pits"
                className="inline-flex items-center gap-2 text-stone hover:text-white-hot transition-colors mt-6"
              >
                <ArrowLeft className="h-4 w-4" />
                Continue shopping
              </Link>
            </div>

            {/* Order summary */}
            <div className="mt-12 lg:mt-0">
              <div className="sticky top-[180px] bg-soot border border-smoke p-6">
                <h2 className="font-display text-xl text-white-hot mb-6">
                  Order Summary
                </h2>

                {/* Pricing breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-stone">Subtotal</span>
                    <span className="text-white-hot font-medium">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone">Shipping estimate</span>
                    <span className="text-white-hot font-medium">
                      {shippingEstimate === 0 ? (
                        <span className="text-ember">FREE</span>
                      ) : (
                        formatPrice(shippingEstimate)
                      )}
                    </span>
                  </div>
                  <div className="border-t border-smoke pt-3 flex items-center justify-between">
                    <span className="text-white-hot font-medium">Total</span>
                    <span className="text-2xl font-bold text-ember">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone mb-6">
                  Taxes calculated at checkout. Final shipping cost based on delivery address.
                </p>

                {/* Checkout button */}
                <Button size="lg" className="w-full mb-4">
                  Proceed To Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-smoke">
                  <div className="text-center">
                    <Truck className="h-5 w-5 text-ember mx-auto mb-1" />
                    <span className="text-xs text-stone block">Free over R2,500</span>
                  </div>
                  <div className="text-center">
                    <Shield className="h-5 w-5 text-ember mx-auto mb-1" />
                    <span className="text-xs text-stone block">2 Year Warranty</span>
                  </div>
                  <div className="text-center">
                    <RotateCcw className="h-5 w-5 text-ember mx-auto mb-1" />
                    <span className="text-xs text-stone block">Easy Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
