/**
 * Collections API Service
 */
import api from "../api-client";
import type { CollectionListResponse, CollectionDetail } from "./types";

/**
 * Get all collections
 */
export async function getCollections(): Promise<CollectionListResponse> {
  return api.get<CollectionListResponse>("/collections");
}

/**
 * Get a single collection by its slug, including products and promo blocks
 */
export async function getCollectionBySlug(
  slug: string
): Promise<CollectionDetail> {
  return api.get<CollectionDetail>(`/collections/${slug}`);
}

export const collectionsApi = {
  getCollections,
  getCollectionBySlug,
};
