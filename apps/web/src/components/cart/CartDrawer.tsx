"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/data/products";
import { Button } from "@/components/ui";

const FREE_SHIPPING_THRESHOLD = 2500;

export function CartDrawer() {
  const {
    items,
    subtotal,
    itemCount,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
  } = useCart();

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeCart]);

  const shippingMessage =
    subtotal >= FREE_SHIPPING_THRESHOLD
      ? "You qualify for FREE shipping!"
      : `Add ${formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for FREE shipping`;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-charcoal/80 z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-md bg-soot z-50 transform transition-transform duration-300 ease-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-smoke">
          <h2 className="font-display text-xl text-white-hot flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Cart ({itemCount})
          </h2>
          <button
            onClick={closeCart}
            className="p-2 text-stone hover:text-white-hot transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free shipping progress */}
        <div className="p-4 bg-charcoal border-b border-smoke">
          <p className="text-sm text-stone mb-2">{shippingMessage}</p>
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

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-steel-grey mb-4" />
              <p className="text-stone mb-4">Your cart is empty</p>
              <Button variant="primary" onClick={closeCart}>
                Start Shopping
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.variantId}
                  className="flex gap-4 p-3 bg-charcoal border border-smoke"
                >
                  {/* Product image */}
                  <div className="relative w-20 h-20 flex-shrink-0 bg-smoke">
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
                  </div>

                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product.slug}`}
                      onClick={closeCart}
                      className="font-medium text-white-hot hover:text-ember transition-colors line-clamp-1"
                    >
                      {item.product.title}
                    </Link>
                    <p className="text-sm text-stone">{item.variant.name}</p>
                    <p className="text-sm font-bold text-white-hot mt-1">
                      {formatPrice(item.variant.price)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-steel-grey">
                        <button
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity - 1)
                          }
                          className="p-1 text-stone hover:text-white-hot transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-sm text-white-hot">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity + 1)
                          }
                          className="p-1 text-stone hover:text-white-hot transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="p-1 text-stone hover:text-ember transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-smoke p-4 space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-stone">Subtotal</span>
              <span className="text-lg font-bold text-white-hot">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="text-xs text-stone">
              Shipping and taxes calculated at checkout
            </p>

            {/* Checkout button */}
            <Button variant="primary" size="lg" className="w-full">
              Chuck It In The Bakkie
            </Button>

            {/* Continue shopping */}
            <button
              onClick={closeCart}
              className="w-full text-center text-sm text-stone hover:text-white-hot transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
