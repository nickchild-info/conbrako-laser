/**
 * API Response Types
 *
 * These types mirror the Pydantic schemas from the FastAPI backend
 */

// Product Types
export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  sort_order: number;
}

export interface Variant {
  id: string;
  sku: string;
  price: number;
  compare_at_price: number | null;
  inventory_qty: number;
  weight: number;
  dimensions_mm: string | null;
}

export interface ReviewSummary {
  rating_avg: number;
  rating_count: number;
}

export interface ProductListItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  badges: string[];
  variants: Variant[];
  images: ProductImage[];
  review_summary: ReviewSummary | null;
}

export interface ProductDetail extends ProductListItem {
  description: string | null;
  seats_min: number | null;
  seats_max: number | null;
  material: string | null;
  finish: string | null;
}

export interface ProductListResponse {
  products: ProductListItem[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Collection Types
export interface PromoBlock {
  id: string;
  position_index: number;
  title: string;
  copy: string | null;
  cta_text: string | null;
  cta_url: string | null;
  image_url: string | null;
}

export interface CollectionListItem {
  id: string;
  slug: string;
  title: string;
  hero_copy: string | null;
}

export interface CollectionDetail extends CollectionListItem {
  products: ProductListItem[];
  promo_blocks: PromoBlock[];
}

export interface CollectionListResponse {
  collections: CollectionListItem[];
  total: number;
}

// Design Template Types
export type DesignCategory =
  | "wildlife"
  | "nature"
  | "sports"
  | "custom"
  | "patterns";

export interface DesignTemplate {
  id: string;
  name: string;
  category: DesignCategory;
  thumbnail: string | null;
  svg_path: string | null;
}

export interface DesignTemplateListResponse {
  templates: DesignTemplate[];
  total: number;
}

// Cart Types
export interface CartItemRequest {
  product_id: string;
  variant_id: string;
  quantity: number;
}

export interface ValidatedCartItem {
  product_id: string;
  variant_id: string;
  quantity: number;
  sku: string;
  title: string;
  price: number;
  line_total: number;
  available: boolean;
  inventory_qty: number;
}

export interface CartValidateResponse {
  valid: boolean;
  items: ValidatedCartItem[];
  subtotal: number;
  errors: string[];
}

export interface OrderItem {
  id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  price: number;
  product_title: string | null;
  variant_sku: string | null;
}

export interface OrderResponse {
  id: string;
  payfast_payment_id: string | null;
  status: string;
  customer_email: string | null;
  customer_name: string | null;
  total: number;
  shipping_cost: number | null;
  shipping_service: string | null;
  shipping_address: string | null;
  waybill: string | null;
  tracking_url: string | null;
  created_at: string;
  items: OrderItem[];
}

// Payfast Checkout Types
export interface CheckoutShippingAddress {
  street: string;
  suburb: string;
  city: string;
  province: string;
  postal_code: string;
  country?: string;
}

export interface PayfastCheckoutRequest {
  items: CartItemRequest[];
  customer_email: string;
  customer_first_name: string;
  customer_last_name?: string;
  customer_phone?: string;
  shipping_address: CheckoutShippingAddress;
  shipping_service?: string;
  shipping_cost: number;
}

export interface PayfastFormField {
  name: string;
  value: string;
}

export interface PayfastCheckoutResponse {
  order_id: number;
  payfast_url: string;
  form_fields: PayfastFormField[];
  total: number;
}

// Upload Types
export interface UploadDesignResponse {
  file_id: string;
  file_url: string;
  thumbnail_url: string | null;
  is_valid: boolean;
  validation_message: string | null;
  dxf_info: DXFValidationResult | null;
}

export interface DXFValidationResult {
  is_valid: boolean;
  entity_count: number;
  layers: string[];
  bounding_box: {
    min_x: number;
    min_y: number;
    max_x: number;
    max_y: number;
  } | null;
  warnings: string[];
  errors: string[];
}

// Health Check Types
export interface HealthResponse {
  status: string;
  timestamp: string;
}

export interface HealthDbResponse extends HealthResponse {
  database: string;
}
