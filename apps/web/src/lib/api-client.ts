/**
 * KoosDoos API Client
 *
 * A typed fetch wrapper with error handling and retry logic
 * for communicating with the FastAPI backend.
 */

// API Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1";
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

// Retry configuration
const DEFAULT_RETRY_COUNT = 3;
const RETRY_DELAY_MS = 1000;
const RETRYABLE_STATUS_CODES = [408, 429, 500, 502, 503, 504];

/**
 * Custom API Error class with status code and response body
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Request options extending the standard fetch options
 */
interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  retries?: number;
  retryDelay?: number;
  timeout?: number;
}

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Calculate exponential backoff delay
 */
const getBackoffDelay = (attempt: number, baseDelay: number): number => {
  return baseDelay * Math.pow(2, attempt);
};

/**
 * Check if an error is retryable
 */
const isRetryableError = (status: number): boolean => {
  return RETRYABLE_STATUS_CODES.includes(status);
};

/**
 * Make an API request with automatic retry logic
 */
async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    retries = DEFAULT_RETRY_COUNT,
    retryDelay = RETRY_DELAY_MS,
    timeout = 30000,
    body,
    headers = {},
    ...fetchOptions
  } = options;

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...headers,
  };

  const config: RequestInit = {
    ...fetchOptions,
    headers: requestHeaders,
    signal: controller.signal,
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  let lastError: Error | null = null;
  let attempt = 0;

  while (attempt <= retries) {
    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorBody: unknown;
        try {
          errorBody = await response.json();
        } catch {
          errorBody = await response.text();
        }

        const errorMessage =
          typeof errorBody === "object" &&
          errorBody !== null &&
          "detail" in errorBody
            ? String((errorBody as { detail: unknown }).detail)
            : `HTTP ${response.status}: ${response.statusText}`;

        // Check if we should retry
        if (isRetryableError(response.status) && attempt < retries) {
          lastError = new ApiError(errorMessage, response.status, errorBody);
          attempt++;
          await sleep(getBackoffDelay(attempt, retryDelay));
          continue;
        }

        throw new ApiError(errorMessage, response.status, errorBody);
      }

      // Handle empty responses
      const contentType = response.headers.get("content-type");
      if (
        response.status === 204 ||
        !contentType?.includes("application/json")
      ) {
        return {} as T;
      }

      return response.json() as Promise<T>;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      // Handle network errors and timeouts
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new ApiError("Request timeout", 408);
        }

        // Retry on network errors
        if (attempt < retries) {
          lastError = error;
          attempt++;
          await sleep(getBackoffDelay(attempt, retryDelay));
          continue;
        }

        throw new ApiError(error.message, 0);
      }

      throw new ApiError("Unknown error occurred", 0);
    }
  }

  // If we've exhausted retries, throw the last error
  if (lastError) {
    throw lastError instanceof ApiError
      ? lastError
      : new ApiError(lastError.message, 0);
  }

  throw new ApiError("Request failed after retries", 0);
}

/**
 * API Client with typed methods for all endpoints
 */
export const api = {
  /**
   * Check if mock data mode is enabled
   */
  useMockData: USE_MOCK_DATA,

  /**
   * GET request
   */
  get: <T>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(endpoint, { ...options, method: "GET" }),

  /**
   * POST request
   */
  post: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, "method">) =>
    request<T>(endpoint, { ...options, method: "POST", body }),

  /**
   * PUT request
   */
  put: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, "method">) =>
    request<T>(endpoint, { ...options, method: "PUT", body }),

  /**
   * PATCH request
   */
  patch: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, "method">) =>
    request<T>(endpoint, { ...options, method: "PATCH", body }),

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),

  /**
   * Upload a file via multipart/form-data
   */
  upload: async <T>(
    endpoint: string,
    file: File,
    fieldName: string = "file",
    additionalData?: Record<string, string>
  ): Promise<T> => {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

    const formData = new FormData();
    formData.append(fieldName, file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      let errorBody: unknown;
      try {
        errorBody = await response.json();
      } catch {
        errorBody = await response.text();
      }

      const errorMessage =
        typeof errorBody === "object" &&
        errorBody !== null &&
        "detail" in errorBody
          ? String((errorBody as { detail: unknown }).detail)
          : `HTTP ${response.status}: ${response.statusText}`;

      throw new ApiError(errorMessage, response.status, errorBody);
    }

    return response.json() as Promise<T>;
  },
};

/**
 * Build a query string from an object
 */
export function buildQueryString(
  params: object
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export default api;
