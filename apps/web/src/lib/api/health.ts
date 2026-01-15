/**
 * Health Check API Service
 */
import api from "../api-client";
import type { HealthResponse, HealthDbResponse } from "./types";

/**
 * Basic health check
 */
export async function getHealth(): Promise<HealthResponse> {
  return api.get<HealthResponse>("/health");
}

/**
 * Health check with database connectivity
 */
export async function getHealthDb(): Promise<HealthDbResponse> {
  return api.get<HealthDbResponse>("/health/db");
}

export const healthApi = {
  getHealth,
  getHealthDb,
};
