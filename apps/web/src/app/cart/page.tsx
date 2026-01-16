"use client";

import { useEffect, useState, useCallback } from "react";
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
  Loader2,
  AlertCircle,
  User,
  ChevronDown,
  ChevronUp,
  Home,
  Check,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/data/products";
import { Breadcrumbs } from "@/components/layout";
import { Button } from "@/components/ui";
import {
  trackViewCart,
  trackBeginCheckout,
  trackRemoveFromCart,
  toAnalyticsItem,
  AnalyticsItem,
} from "@/lib/analytics";
import { createPayfastCheckout } from "@/lib/api/cart";
import { usePayfastSubmit } from "@/components/checkout/PayfastForm";
import { ShippingCalculator } from "@/components/shipping";
import { AddressForm } from "@/components/checkout";
import type { CartItemRequest, CheckoutShippingAddress } from "@/lib/api/types";
import type { ShippingQuote } from "@/lib/api/shipping";

const FREE_SHIPPING_THRESHOLD = 2500;

// Checkout step type
type CheckoutStep = "cart" | "checkout";

export default function CartPage() {
  const {
    items,
    subtotal,
    itemCount,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  const { submitPayfast } = usePayfastSubmit();

  // Checkout flow state
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Customer info
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerFirstName, setCustomerFirstName] = useState("");
  const [customerLastName, setCustomerLastName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // Billing Address
  const [billingAddress, setBillingAddress] = useState<CheckoutShippingAddress | null>(null);
  const [isBillingAddressValid, setIsBillingAddressValid] = useState(false);
  const [sameAsDelivery, setSameAsDelivery] = useState(true);

  // Delivery/Shipping
  const [shippingAddress, setShippingAddress] = useState<CheckoutShippingAddress | null>(null);
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<ShippingQuote | null>(null);

  // UI state - multiple sections can be expanded
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () => new Set(["customer", "billing", "delivery"])
  );

  // Calculated values
  const shippingCost = selectedShipping?.price ?? (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 150);
  const total = subtotal + shippingCost;
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  // Check if checkout is ready
  const billingReady = sameAsDelivery || (isBillingAddressValid && billingAddress !== null);
  const isCheckoutReady =
    customerEmail.length > 0 &&
    customerFirstName.length > 0 &&
    isAddressValid &&
    shippingAddress !== null &&
    billingReady;

  // Load saved checkout info from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("conbrako-checkout-info");
      if (saved) {
        const data = JSON.parse(saved);
        if (data.email) setCustomerEmail(data.email);
        if (data.firstName) setCustomerFirstName(data.firstName);
        if (data.lastName) setCustomerLastName(data.lastName);
        if (data.phone) setCustomerPhone(data.phone);
        if (data.address) {
          setShippingAddress(data.address);
          setIsAddressValid(true);
        }
        if (data.billingAddress) {
          setBillingAddress(data.billingAddress);
          setIsBillingAddressValid(true);
        }
        if (typeof data.sameAsDelivery === 'boolean') {
          setSameAsDelivery(data.sameAsDelivery);
        }
      }
    } catch (e) {
      // Ignore parse errors from corrupted localStorage
    }
  }, []);

  // Save checkout info to localStorage when fields change
  useEffect(() => {
    const data = {
      email: customerEmail,
      firstName: customerFirstName,
      lastName: customerLastName,
      phone: customerPhone,
      address: shippingAddress,
      billingAddress: billingAddress,
      sameAsDelivery: sameAsDelivery,
    };
    localStorage.setItem("conbrako-checkout-info", JSON.stringify(data));
  }, [customerEmail, customerFirstName, customerLastName, customerPhone, shippingAddress, billingAddress, sameAsDelivery]);

  // Convert cart items to analytics items
  const getAnalyticsItems = (): AnalyticsItem[] => {
    return items.map((item) =>
      toAnalyticsItem(
        item.product.id,
        item.product.title,
        item.variant.price,
        item.quantity,
        item.variant.name
      )
    );
  };

  // Track view_cart event on page load
  useEffect(() => {
    if (items.length > 0) {
      trackViewCart(getAnalyticsItems(), subtotal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const handleRemoveItem = (variantId: string) => {
    const item = items.find((i) => i.variantId === variantId);
    if (item) {
      const analyticsItem = toAnalyticsItem(
        item.product.id,
        item.product.title,
        item.variant.price,
        item.quantity,
        item.variant.name
      );
      trackRemoveFromCart(analyticsItem, item.variant.price * item.quantity);
    }
    removeItem(variantId);
  };

  const handleAddressChange = useCallback(
    (address: CheckoutShippingAddress, isValid: boolean) => {
      setShippingAddress(address);
      setIsAddressValid(isValid);
    },
    []
  );

  const handleBillingAddressChange = useCallback(
    (address: CheckoutShippingAddress, isValid: boolean) => {
      setBillingAddress(address);
      setIsBillingAddressValid(isValid);
    },
    []
  );

  const handleShippingSelect = useCallback((quote: ShippingQuote) => {
    setSelectedShipping(quote);
  }, []);

  const handleProceedToCheckout = () => {
    setCheckoutStep("checkout");
    setExpandedSections(new Set(["customer", "billing", "delivery"]));
  };

  const handleBackToCart = () => {
    setCheckoutStep("cart");
    setCheckoutError(null);
  };

  const handleCheckout = async () => {
    if (!isCheckoutReady || !shippingAddress) {
      setCheckoutError("Please fill in all required fields");
      return;
    }

    setCheckoutError(null);
    setIsCheckingOut(true);

    // Track begin_checkout event
    trackBeginCheckout(getAnalyticsItems(), subtotal);

    try {
      // Convert cart items to API format
      const cartItems: CartItemRequest[] = items.map((item) => ({
        product_id: item.product.id,
        variant_id: item.variantId,
        quantity: item.quantity,
      }));

      // Create Payfast checkout
      const response = await createPayfastCheckout({
        items: cartItems,
        customer_email: customerEmail,
        customer_first_name: customerFirstName,
        customer_last_name: customerLastName,
        customer_phone: customerPhone || undefined,
        shipping_address: shippingAddress,
        shipping_service: selectedShipping?.service_type || "standard",
        shipping_cost: shippingCost,
      });

      // Submit to Payfast (this will redirect the page)
      submitPayfast(response.payfast_url, response.form_fields);
    } catch (error) {
      console.error("Checkout error:", error);

      let errorMessage = "Something went wrong during checkout. Please try again.";

      if (error instanceof Error) {
        if (error.message.includes("fetch") || error.message.includes("network")) {
          errorMessage = "Unable to connect to checkout server. Please check your connection and try again.";
        } else if (error.message.includes("inventory") || error.message.includes("stock")) {
          errorMessage = "Some items in your cart may be out of stock. Please refresh and try again.";
        } else if (error.message) {
          errorMessage = error.message;
        }
      }

      setCheckoutError(errorMessage);
      setIsCheckingOut(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  // Validate email format
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-soot border-b border-smoke py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={
              checkoutStep === "checkout"
                ? [{ label: "Cart", href: "/cart" }, { label: "Checkout" }]
                : [{ label: "Cart" }]
            }
          />
          <h1 className="font-display text-4xl sm:text-5xl text-white-hot mt-4">
            {checkoutStep === "checkout" ? "Checkout" : "Your Cart"}
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
            {/* Main content */}
            <div className="lg:col-span-2">
              {checkoutStep === "cart" ? (
                <>
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
                              onClick={() => handleRemoveItem(item.variantId)}
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

                  {/* Shipping Calculator */}
                  <div className="mt-8">
                    <ShippingCalculator
                      onShippingSelect={handleShippingSelect}
                      selectedService={selectedShipping?.service_type}
                    />
                  </div>
                </>
              ) : (
                /* Checkout form */
                <div className="space-y-6">
                  {/* Back to cart link */}
                  <button
                    onClick={handleBackToCart}
                    className="inline-flex items-center gap-2 text-stone hover:text-white-hot transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to cart
                  </button>

                  {/* Customer Information Section */}
                  <div className="bg-soot border border-smoke">
                    <button
                      onClick={() => toggleSection("customer")}
                      className="w-full flex items-center justify-between p-4"
                    >
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-ember" />
                        <span className="font-display text-lg text-white-hot">
                          Customer Information
                        </span>
                        {customerEmail && customerFirstName && (
                          <span className="text-sm text-stone">
                            ({customerFirstName} {customerLastName})
                          </span>
                        )}
                      </div>
                      {expandedSections.has("customer") ? (
                        <ChevronUp className="h-5 w-5 text-stone" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-stone" />
                      )}
                    </button>
                    {expandedSections.has("customer") && (
                      <div className="p-4 pt-0 space-y-4 border-t border-smoke">
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm text-stone mb-1.5"
                          >
                            Email Address <span className="text-ember">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            placeholder="your@email.com"
                            className={`w-full bg-charcoal border ${
                              customerEmail && !isEmailValid
                                ? "border-red-500"
                                : "border-steel-grey"
                            } text-white-hot px-3 py-2 focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember placeholder:text-steel-grey`}
                          />
                          {customerEmail && !isEmailValid && (
                            <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                              <AlertCircle className="h-3.5 w-3.5" />
                              Please enter a valid email address
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="firstName"
                              className="block text-sm text-stone mb-1.5"
                            >
                              First Name <span className="text-ember">*</span>
                            </label>
                            <input
                              type="text"
                              id="firstName"
                              value={customerFirstName}
                              onChange={(e) => setCustomerFirstName(e.target.value)}
                              placeholder="John"
                              className="w-full bg-charcoal border border-steel-grey text-white-hot px-3 py-2 focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember placeholder:text-steel-grey"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="lastName"
                              className="block text-sm text-stone mb-1.5"
                            >
                              Last Name
                            </label>
                            <input
                              type="text"
                              id="lastName"
                              value={customerLastName}
                              onChange={(e) => setCustomerLastName(e.target.value)}
                              placeholder="Doe"
                              className="w-full bg-charcoal border border-steel-grey text-white-hot px-3 py-2 focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember placeholder:text-steel-grey"
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-sm text-stone mb-1.5"
                          >
                            Phone Number (optional)
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="e.g. 082 123 4567"
                            className="w-full bg-charcoal border border-steel-grey text-white-hot px-3 py-2 focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember placeholder:text-steel-grey"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Billing Address Section */}
                  <div className="bg-soot border border-smoke">
                    <button
                      onClick={() => toggleSection("billing")}
                      className="w-full flex items-center justify-between p-4"
                    >
                      <div className="flex items-center gap-3">
                        <Home className="h-5 w-5 text-ember" />
                        <span className="font-display text-lg text-white-hot">
                          Billing Address
                        </span>
                        {sameAsDelivery ? (
                          <span className="text-sm text-stone">(Same as delivery)</span>
                        ) : isBillingAddressValid && billingAddress ? (
                          <span className="text-sm text-stone">
                            ({billingAddress.suburb}, {billingAddress.city})
                          </span>
                        ) : null}
                      </div>
                      {expandedSections.has("billing") ? (
                        <ChevronUp className="h-5 w-5 text-stone" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-stone" />
                      )}
                    </button>
                    {expandedSections.has("billing") && (
                      <div className="p-4 pt-0 border-t border-smoke">
                        {/* Same as delivery checkbox */}
                        <label className="flex items-center gap-3 mb-4 cursor-pointer group">
                          <div
                            className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${
                              sameAsDelivery
                                ? "bg-ember border-ember"
                                : "border-steel-grey group-hover:border-ember"
                            }`}
                            onClick={() => setSameAsDelivery(!sameAsDelivery)}
                          >
                            {sameAsDelivery && <Check className="h-3.5 w-3.5 text-white" />}
                          </div>
                          <span className="text-stone group-hover:text-white-hot transition-colors">
                            Same as delivery address
                          </span>
                        </label>

                        {/* Billing address form (only show if not same as delivery) */}
                        {!sameAsDelivery && (
                          <AddressForm
                            onAddressChange={handleBillingAddressChange}
                            initialAddress={billingAddress || undefined}
                            title="Billing Address"
                            hideTitle
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Delivery Address Section */}
                  <div className="bg-soot border border-smoke">
                    <button
                      onClick={() => toggleSection("delivery")}
                      className="w-full flex items-center justify-between p-4"
                    >
                      <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5 text-ember" />
                        <span className="font-display text-lg text-white-hot">
                          Delivery Address
                        </span>
                        {isAddressValid && shippingAddress && (
                          <span className="text-sm text-stone">
                            ({shippingAddress.suburb}, {shippingAddress.city})
                          </span>
                        )}
                      </div>
                      {expandedSections.has("delivery") ? (
                        <ChevronUp className="h-5 w-5 text-stone" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-stone" />
                      )}
                    </button>
                    {expandedSections.has("delivery") && (
                      <div className="p-4 pt-0 border-t border-smoke">
                        <AddressForm
                          onAddressChange={handleAddressChange}
                          initialAddress={shippingAddress || undefined}
                          title="Delivery Address"
                          hideTitle
                        />
                      </div>
                    )}
                  </div>

                  {/* Shipping Options Section */}
                  <div className="bg-soot border border-smoke p-4">
                    <ShippingCalculator
                      onShippingSelect={handleShippingSelect}
                      selectedService={selectedShipping?.service_type}
                    />
                  </div>

                  {/* Order items summary (collapsed) */}
                  <div className="bg-soot border border-smoke p-4">
                    <h3 className="font-display text-lg text-white-hot mb-4">
                      Order Items ({itemCount})
                    </h3>
                    <ul className="space-y-2">
                      {items.map((item) => (
                        <li
                          key={item.variantId}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-stone">
                            {item.product.title} ({item.variant.name}) × {item.quantity}
                          </span>
                          <span className="text-white-hot font-medium">
                            {formatPrice(item.variant.price * item.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Order summary sidebar */}
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
                    <span className="text-stone">
                      Shipping
                      {selectedShipping && (
                        <span className="text-xs ml-1">
                          ({selectedShipping.service_name})
                        </span>
                      )}
                    </span>
                    <span className="text-white-hot font-medium">
                      {shippingCost === 0 ? (
                        <span className="text-ember">FREE</span>
                      ) : (
                        formatPrice(shippingCost)
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

                {checkoutStep === "cart" && (
                  <p className="text-xs text-stone mb-6">
                    Taxes calculated at checkout. Final shipping cost based on delivery address.
                  </p>
                )}

                {/* Checkout error message */}
                {checkoutError && (
                  <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-red-400">{checkoutError}</p>
                      <button
                        onClick={() => setCheckoutError(null)}
                        className="text-xs text-red-300 hover:text-red-200 underline mt-1"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}

                {/* Action button */}
                {checkoutStep === "cart" ? (
                  <Button
                    size="lg"
                    className="w-full mb-4"
                    onClick={handleProceedToCheckout}
                    disabled={items.length === 0}
                  >
                    Proceed To Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                ) : (
                  <>
                    {/* Validation hints */}
                    {!isCheckoutReady && (
                      <div className="mb-4 p-3 bg-smoke/50 border border-steel-grey rounded">
                        <p className="text-sm text-stone mb-2">Please complete:</p>
                        <ul className="text-xs text-stone space-y-1">
                          {(!customerEmail || !isEmailValid) && (
                            <li className="flex items-center gap-1">
                              <AlertCircle className="h-3 w-3 text-ember" />
                              Valid email address
                            </li>
                          )}
                          {!customerFirstName && (
                            <li className="flex items-center gap-1">
                              <AlertCircle className="h-3 w-3 text-ember" />
                              First name
                            </li>
                          )}
                          {!sameAsDelivery && !isBillingAddressValid && (
                            <li className="flex items-center gap-1">
                              <AlertCircle className="h-3 w-3 text-ember" />
                              Billing address
                            </li>
                          )}
                          {!isAddressValid && (
                            <li className="flex items-center gap-1">
                              <AlertCircle className="h-3 w-3 text-ember" />
                              Delivery address
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    <Button
                      size="lg"
                      className="w-full mb-4"
                      onClick={handleCheckout}
                      disabled={isCheckingOut || !isCheckoutReady}
                    >
                      {isCheckingOut ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Pay {formatPrice(total)}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-stone text-center mb-4">
                      You will be redirected to Payfast to complete payment
                    </p>
                  </>
                )}

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
