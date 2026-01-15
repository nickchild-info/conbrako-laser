/**
 * Cart & Checkout API Service
 */
import api from "../api-client";
import type {
  CartItemRequest,
  CartValidateResponse,
  CheckoutCreateRequest,
  CheckoutCreateResponse,
  OrderResponse,
  PayfastCheckoutRequest,
  PayfastCheckoutResponse,
} from "./types";

/**
 * Validate cart items and get current pricing
 */
export async function validateCart(
  items: CartItemRequest[]
): Promise<CartValidateResponse> {
  return api.post<CartValidateResponse>("/cart/validate", { items });
}

/**
 * Create a Stripe checkout session (legacy - use createPayfastCheckout instead)
 */
export async function createCheckoutSession(
  request: CheckoutCreateRequest
): Promise<CheckoutCreateResponse> {
  return api.post<CheckoutCreateResponse>("/checkout/create-session", request);
}

/**
 * Create a Payfast checkout
 * Returns form data that should be submitted to Payfast
 */
export async function createPayfastCheckout(
  request: PayfastCheckoutRequest
): Promise<PayfastCheckoutResponse> {
  return api.post<PayfastCheckoutResponse>("/checkout/payfast", request);
}

/**
 * Get order details by ID
 */
export async function getOrder(orderId: string): Promise<OrderResponse> {
  return api.get<OrderResponse>(`/orders/${orderId}`);
}

export const cartApi = {
  validateCart,
  createCheckoutSession,
  createPayfastCheckout,
  getOrder,
};
