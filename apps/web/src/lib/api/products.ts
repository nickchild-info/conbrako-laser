/**
 * Products API Service
 */
import api, { buildQueryString } from "../api-client";
import type { ProductListResponse, ProductDetail } from "./types";

export interface GetProductsParams {
  page?: number;
  per_page?: number;
  sort?: "featured" | "price_asc" | "price_desc" | "rating" | "newest";
  min_price?: number;
  max_price?: number;
  badges?: string;
}

/**
 * Get a paginated list of products with optional filters
 */
export async function getProducts(
  params: GetProductsParams = {}
): Promise<ProductListResponse> {
  const queryString = buildQueryString(params);
  return api.get<ProductListResponse>(`/products${queryString}`);
}

/**
 * Get a single product by its slug
 */
export async function getProductBySlug(slug: string): Promise<ProductDetail> {
  return api.get<ProductDetail>(`/products/${slug}`);
}

export const productsApi = {
  getProducts,
  getProductBySlug,
};
