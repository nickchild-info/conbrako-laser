/**
 * Design Templates API Service
 */
import api, { buildQueryString } from "../api-client";
import type { DesignTemplateListResponse, DesignCategory } from "./types";

export interface GetDesignTemplatesParams {
  category?: DesignCategory;
}

/**
 * Get all design templates with optional category filter
 */
export async function getDesignTemplates(
  params: GetDesignTemplatesParams = {}
): Promise<DesignTemplateListResponse> {
  const queryString = buildQueryString(params);
  return api.get<DesignTemplateListResponse>(`/design-templates${queryString}`);
}

export const designTemplatesApi = {
  getDesignTemplates,
};
