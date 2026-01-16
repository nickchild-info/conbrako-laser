/**
 * Cart & Checkout API Service
 */
import api from "../api-client";
import type {
  CartItemRequest,
  CartValidateResponse,
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
  createPayfastCheckout,
  getOrder,
};
