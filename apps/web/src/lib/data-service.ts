/**
 * Data Service Layer
 *
 * This module provides a unified interface for fetching data from either
 * the API or mock data, depending on configuration and availability.
 *
 * - In production: fetches from FastAPI backend
 * - In development with USE_MOCK_DATA=true: uses local mock data
 * - Graceful fallback to mock data if API is unavailable
 */

import api from "./api-client";
import {
  products as mockProducts,
  collections as mockCollections,
  promoBlocks as mockPromoBlocks,
  designTemplates as mockDesignTemplates,
  getProductBySlug as getMockProductBySlug,
  getCollectionBySlug as getMockCollectionBySlug,
  formatPrice,
} from "@/data/products";
import type { Product, Collection, PromoBlock } from "@/types";
import type {
  ProductListItem,
  ProductDetail as ApiProductDetail,
  CollectionDetail as ApiCollectionDetail,
  DesignTemplate as ApiDesignTemplate,
} from "./api/types";

// Re-export formatPrice for convenience
export { formatPrice };

// Check if we should use mock data
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

/**
 * Transform API product to frontend Product type
 */
function transformApiProduct(apiProduct: ProductListItem | ApiProductDetail): Product {
  return {
    id: apiProduct.id,
    slug: apiProduct.slug,
    title: apiProduct.title,
    subtitle: apiProduct.subtitle || "",
    description: "description" in apiProduct ? (apiProduct.description || "") : "",
    badges: apiProduct.badges as Product["badges"],
    seatsMin: "seats_min" in apiProduct ? (apiProduct.seats_min || 0) : 0,
    seatsMax: "seats_max" in apiProduct ? (apiProduct.seats_max || 0) : 0,
    material: "material" in apiProduct ? (apiProduct.material || "") : "",
    finish: "finish" in apiProduct ? (apiProduct.finish || "") : "",
    variants: apiProduct.variants.map((v) => ({
      id: v.id,
      productId: apiProduct.id,
      sku: v.sku,
      name: v.sku.split("-").pop() || v.sku, // Extract name from SKU
      price: v.price,
      compareAtPrice: v.compare_at_price || undefined,
      inventoryQty: v.inventory_qty,
      weight: v.weight,
      dimensions: parseDimensions(v.dimensions_mm),
    })),
    images: apiProduct.images.map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt,
      sortOrder: img.sort_order,
    })),
    reviewSummary: apiProduct.review_summary
      ? {
          ratingAvg: apiProduct.review_summary.rating_avg,
          ratingCount: apiProduct.review_summary.rating_count,
        }
      : { ratingAvg: 0, ratingCount: 0 },
  };
}

/**
 * Parse dimensions string "WxDxH" to Dimensions object
 */
function parseDimensions(dimensionsStr: string | null): { width: number; height: number; depth: number } {
  if (!dimensionsStr) {
    return { width: 0, height: 0, depth: 0 };
  }
  const parts = dimensionsStr.split("x").map(Number);
  return {
    width: parts[0] || 0,
    depth: parts[1] || 0,
    height: parts[2] || 0,
  };
}

/**
 * Transform API collection to frontend Collection type
 */
function transformApiCollection(apiCollection: ApiCollectionDetail): Collection {
  return {
    id: apiCollection.id,
    slug: apiCollection.slug,
    title: apiCollection.title,
    heroCopy: apiCollection.hero_copy || "",
    products: apiCollection.products.map(transformApiProduct),
  };
}

/**
 * Transform API promo block to frontend PromoBlock type
 */
function transformApiPromoBlock(apiPromo: ApiCollectionDetail["promo_blocks"][0], collectionId: string): PromoBlock {
  return {
    id: apiPromo.id,
    collectionId,
    positionIndex: apiPromo.position_index,
    title: apiPromo.title,
    copy: apiPromo.copy || "",
    ctaText: apiPromo.cta_text || "",
    ctaUrl: apiPromo.cta_url || "",
    imageUrl: apiPromo.image_url || undefined,
  };
}

/**
 * Get all products with optional filtering
 */
export async function getProducts(params?: {
  page?: number;
  perPage?: number;
  sort?: "featured" | "price_asc" | "price_desc" | "rating" | "newest";
  minPrice?: number;
  maxPrice?: number;
  badges?: string;
}): Promise<{ products: Product[]; total: number; page: number; totalPages: number }> {
  if (USE_MOCK_DATA) {
    return {
      products: mockProducts,
      total: mockProducts.length,
      page: 1,
      totalPages: 1,
    };
  }

  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set("page", String(params.page));
    if (params?.perPage) queryParams.set("per_page", String(params.perPage));
    if (params?.sort) queryParams.set("sort", params.sort);
    if (params?.minPrice) queryParams.set("min_price", String(params.minPrice));
    if (params?.maxPrice) queryParams.set("max_price", String(params.maxPrice));
    if (params?.badges) queryParams.set("badges", params.badges);

    const queryString = queryParams.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ""}`;

    const response = await api.get<{
      products: ProductListItem[];
      total: number;
      page: number;
      per_page: number;
      total_pages: number;
    }>(endpoint);

    return {
      products: response.products.map(transformApiProduct),
      total: response.total,
      page: response.page,
      totalPages: response.total_pages,
    };
  } catch (error) {
    console.warn("Failed to fetch products from API, using mock data:", error);
    return {
      products: mockProducts,
      total: mockProducts.length,
      page: 1,
      totalPages: 1,
    };
  }
}

/**
 * Get a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (USE_MOCK_DATA) {
    return getMockProductBySlug(slug);
  }

  try {
    const apiProduct = await api.get<ApiProductDetail>(`/products/${slug}`);
    return transformApiProduct(apiProduct);
  } catch (error) {
    console.warn(`Failed to fetch product "${slug}" from API, using mock data:`, error);
    return getMockProductBySlug(slug);
  }
}

/**
 * Get all collections
 */
export async function getCollections(): Promise<Collection[]> {
  if (USE_MOCK_DATA) {
    return mockCollections;
  }

  try {
    const response = await api.get<{
      collections: Array<{
        id: string;
        slug: string;
        title: string;
        hero_copy: string | null;
      }>;
      total: number;
    }>("/collections");

    // For collection list, we need to fetch each collection's products separately
    // For now, return basic collection info - products will be fetched when needed
    return response.collections.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      heroCopy: c.hero_copy || "",
      products: [], // Products will be fetched separately
    }));
  } catch (error) {
    console.warn("Failed to fetch collections from API, using mock data:", error);
    return mockCollections;
  }
}

/**
 * Get a single collection by slug with products and promo blocks
 */
export async function getCollectionBySlug(
  slug: string
): Promise<{ collection: Collection; promoBlocks: PromoBlock[] } | undefined> {
  if (USE_MOCK_DATA) {
    const collection = getMockCollectionBySlug(slug);
    if (!collection) return undefined;
    const promos = mockPromoBlocks.filter((p) => p.collectionId === collection.id);
    return { collection, promoBlocks: promos };
  }

  try {
    const apiCollection = await api.get<ApiCollectionDetail>(`/collections/${slug}`);
    const collection = transformApiCollection(apiCollection);
    const promoBlocks = apiCollection.promo_blocks.map((p) =>
      transformApiPromoBlock(p, apiCollection.id)
    );
    return { collection, promoBlocks };
  } catch (error) {
    console.warn(`Failed to fetch collection "${slug}" from API, using mock data:`, error);
    const collection = getMockCollectionBySlug(slug);
    if (!collection) return undefined;
    const promos = mockPromoBlocks.filter((p) => p.collectionId === collection.id);
    return { collection, promoBlocks: promos };
  }
}

/**
 * Get all promo blocks, optionally filtered by collection
 */
export async function getPromoBlocks(collectionId?: string): Promise<PromoBlock[]> {
  // Promo blocks are fetched as part of collections in the API
  // For standalone access, use mock data
  if (collectionId) {
    return mockPromoBlocks.filter((p) => p.collectionId === collectionId);
  }
  return mockPromoBlocks;
}

/**
 * Design template type for frontend use
 */
export interface DesignTemplate {
  id: string;
  name: string;
  category: string;
  description?: string;
  previewUrl: string;
}

/**
 * Get all design templates with optional category filter
 */
export async function getDesignTemplates(category?: string): Promise<DesignTemplate[]> {
  if (USE_MOCK_DATA) {
    if (category) {
      return mockDesignTemplates.filter(
        (t) => t.category.toLowerCase() === category.toLowerCase()
      );
    }
    return mockDesignTemplates;
  }

  try {
    const queryParams = category ? `?category=${category.toLowerCase()}` : "";
    const response = await api.get<{
      templates: ApiDesignTemplate[];
      total: number;
    }>(`/design-templates${queryParams}`);

    return response.templates.map((t) => ({
      id: t.id,
      name: t.name,
      category: t.category,
      previewUrl: t.thumbnail || t.svg_path || "/images/templates/placeholder.svg",
    }));
  } catch (error) {
    console.warn("Failed to fetch design templates from API, using mock data:", error);
    if (category) {
      return mockDesignTemplates.filter(
        (t) => t.category.toLowerCase() === category.toLowerCase()
      );
    }
    return mockDesignTemplates;
  }
}

/**
 * Get featured products for homepage
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  const { products } = await getProducts();
  // Filter out personalised products and take first 4
  return products.filter((p) => p.slug !== "koosdoos-personalised").slice(0, 4);
}

/**
 * Get related products for a given product
 */
export async function getRelatedProducts(currentProductId: string, limit: number = 4): Promise<Product[]> {
  const { products } = await getProducts();
  return products.filter((p) => p.id !== currentProductId).slice(0, limit);
}
