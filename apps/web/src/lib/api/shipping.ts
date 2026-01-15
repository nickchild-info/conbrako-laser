/**
 * Shipping API Service
 *
 * Client for The Courier Guy shipping integration endpoints
 */
import api from "../api-client";

// ============================================================================
// Types
// ============================================================================

export interface ShippingAddress {
  street: string;
  suburb: string;
  city: string;
  province: string;
  postal_code: string;
  country?: string;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
}

export interface Parcel {
  length: number;
  width: number;
  height: number;
  weight: number;
  description?: string;
}

export interface ShippingQuote {
  service_type: string;
  service_name: string;
  price: number;
  estimated_days: number;
  estimated_delivery?: string;
}

export interface ShippingQuotesResponse {
  quotes: ShippingQuote[];
  from_address: string;
  to_province: string;
}

export interface SimpleQuoteResponse {
  province: string;
  product_size: string;
  quantity: number;
  quotes: ShippingQuote[];
}

export interface Shipment {
  waybill: string;
  tracking_url: string;
  label_url?: string;
  collection_date: string;
  estimated_delivery: string;
}

export interface TrackingEvent {
  timestamp: string;
  status: string;
  description: string;
  location?: string;
}

export interface TrackingResponse {
  waybill: string;
  events: TrackingEvent[];
  current_status: string;
}

// South African provinces
export const SA_PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
] as const;

export type SAProvince = (typeof SA_PROVINCES)[number];

// Product sizes for shipping calculations
export type ProductSize = "small" | "medium" | "large" | "xl";

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get shipping quotes for a full address with parcels
 */
export async function getShippingQuotes(
  address: ShippingAddress,
  parcels: Parcel[]
): Promise<ShippingQuotesResponse> {
  return api.post<ShippingQuotesResponse>("/shipping/quote", {
    destination: address,
    parcels,
  });
}

/**
 * Get simplified shipping quote by province and product size
 * Useful for cart page shipping calculator
 */
export async function getSimpleQuote(
  province: string,
  productSize: ProductSize = "medium",
  quantity: number = 1
): Promise<SimpleQuoteResponse> {
  const params = new URLSearchParams({
    province,
    product_size: productSize,
    quantity: quantity.toString(),
  });
  return api.post<SimpleQuoteResponse>(`/shipping/quote/simple?${params}`);
}

/**
 * Create a shipment for an order
 * Should be called after successful payment
 */
export async function createShipment(
  orderId: number,
  serviceType: string
): Promise<Shipment> {
  return api.post<Shipment>("/shipping/create", {
    order_id: orderId,
    service_type: serviceType,
  });
}

/**
 * Get tracking events for a waybill
 */
export async function getTracking(waybill: string): Promise<TrackingResponse> {
  return api.get<TrackingResponse>(`/shipping/track/${waybill}`);
}

/**
 * Get tracking events for an order by order ID
 */
export async function getOrderTracking(
  orderId: number
): Promise<TrackingResponse> {
  return api.get<TrackingResponse>(`/shipping/track/order/${orderId}`);
}

// ============================================================================
// Mock Data (for development when API is unavailable)
// ============================================================================

/**
 * Mock shipping rates by province (used when API is unavailable)
 */
export const MOCK_SHIPPING_RATES: Record<
  string,
  { standard: number; express: number; overnight: number }
> = {
  Gauteng: { standard: 95, express: 150, overnight: 250 },
  "Western Cape": { standard: 150, express: 220, overnight: 350 },
  "KwaZulu-Natal": { standard: 120, express: 180, overnight: 280 },
  "Eastern Cape": { standard: 140, express: 200, overnight: 320 },
  "Free State": { standard: 110, express: 170, overnight: 270 },
  Limpopo: { standard: 130, express: 190, overnight: 300 },
  Mpumalanga: { standard: 115, express: 175, overnight: 275 },
  "Northern Cape": { standard: 160, express: 240, overnight: 380 },
  "North West": { standard: 120, express: 180, overnight: 280 },
};

/**
 * Get mock shipping quotes (fallback when API unavailable)
 */
export function getMockShippingQuotes(province: string): ShippingQuote[] {
  const rates = MOCK_SHIPPING_RATES[province] || MOCK_SHIPPING_RATES["Gauteng"];

  const today = new Date();

  return [
    {
      service_type: "standard",
      service_name: "Standard Delivery",
      price: rates.standard,
      estimated_days: 5,
      estimated_delivery: new Date(
        today.getTime() + 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      service_type: "express",
      service_name: "Express Delivery",
      price: rates.express,
      estimated_days: 3,
      estimated_delivery: new Date(
        today.getTime() + 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      service_type: "overnight",
      service_name: "Overnight Delivery",
      price: rates.overnight,
      estimated_days: 1,
      estimated_delivery: new Date(
        today.getTime() + 1 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
  ];
}

// ============================================================================
// Export
// ============================================================================

export const shippingApi = {
  getShippingQuotes,
  getSimpleQuote,
  createShipment,
  getTracking,
  getOrderTracking,
  getMockShippingQuotes,
};
