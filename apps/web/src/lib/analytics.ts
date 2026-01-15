/**
 * Analytics event tracking utilities
 * Implements GA4 ecommerce events via dataLayer
 * Reference: https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
 */

// Type definitions for window with dataLayer
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
  }
}

// Product item type for GA4 ecommerce
export interface AnalyticsItem {
  item_id: string;
  item_name: string;
  item_brand?: string;
  item_category?: string;
  item_variant?: string;
  price: number;
  quantity?: number;
  index?: number;
}

// Order/purchase item type
export interface AnalyticsPurchaseItem extends AnalyticsItem {
  quantity: number;
}

/**
 * Push event to dataLayer
 */
function pushToDataLayer(event: Record<string, unknown>) {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);
  }
}

/**
 * Clear ecommerce object before pushing new ecommerce event
 * Best practice for GA4 enhanced ecommerce
 */
function clearEcommerce() {
  pushToDataLayer({ ecommerce: null });
}

/**
 * Track view_item event when user views a product detail page
 * @param item - Product details
 * @param value - Total value of item (price * quantity)
 */
export function trackViewItem(item: AnalyticsItem, value: number) {
  clearEcommerce();
  pushToDataLayer({
    event: "view_item",
    ecommerce: {
      currency: "ZAR",
      value,
      items: [item],
    },
  });
}

/**
 * Track view_item_list event when user views a product listing
 * @param items - Array of products
 * @param listId - Unique identifier for the list
 * @param listName - Name of the list (e.g., "Fire Pits", "Search Results")
 */
export function trackViewItemList(
  items: AnalyticsItem[],
  listId: string,
  listName: string
) {
  clearEcommerce();
  pushToDataLayer({
    event: "view_item_list",
    ecommerce: {
      currency: "ZAR",
      item_list_id: listId,
      item_list_name: listName,
      items: items.map((item, index) => ({
        ...item,
        index,
      })),
    },
  });
}

/**
 * Track select_item event when user clicks on a product in a list
 * @param item - Product clicked
 * @param listId - Identifier of the list
 * @param listName - Name of the list
 */
export function trackSelectItem(
  item: AnalyticsItem,
  listId: string,
  listName: string
) {
  clearEcommerce();
  pushToDataLayer({
    event: "select_item",
    ecommerce: {
      currency: "ZAR",
      item_list_id: listId,
      item_list_name: listName,
      items: [item],
    },
  });
}

/**
 * Track add_to_cart event when user adds a product to cart
 * @param item - Product added
 * @param value - Total value (price * quantity)
 */
export function trackAddToCart(item: AnalyticsItem, value: number) {
  clearEcommerce();
  pushToDataLayer({
    event: "add_to_cart",
    ecommerce: {
      currency: "ZAR",
      value,
      items: [item],
    },
  });
}

/**
 * Track remove_from_cart event when user removes a product from cart
 * @param item - Product removed
 * @param value - Total value (price * quantity)
 */
export function trackRemoveFromCart(item: AnalyticsItem, value: number) {
  clearEcommerce();
  pushToDataLayer({
    event: "remove_from_cart",
    ecommerce: {
      currency: "ZAR",
      value,
      items: [item],
    },
  });
}

/**
 * Track view_cart event when user views their cart
 * @param items - All items in cart
 * @param value - Total cart value
 */
export function trackViewCart(items: AnalyticsItem[], value: number) {
  clearEcommerce();
  pushToDataLayer({
    event: "view_cart",
    ecommerce: {
      currency: "ZAR",
      value,
      items,
    },
  });
}

/**
 * Track begin_checkout event when user initiates checkout
 * @param items - All items being purchased
 * @param value - Total checkout value
 */
export function trackBeginCheckout(items: AnalyticsItem[], value: number) {
  clearEcommerce();
  pushToDataLayer({
    event: "begin_checkout",
    ecommerce: {
      currency: "ZAR",
      value,
      items,
    },
  });
}

/**
 * Track add_shipping_info event when user adds shipping details
 * @param items - All items being purchased
 * @param value - Total checkout value
 * @param shippingTier - Shipping method name (e.g., "Standard", "Express")
 */
export function trackAddShippingInfo(
  items: AnalyticsItem[],
  value: number,
  shippingTier: string
) {
  clearEcommerce();
  pushToDataLayer({
    event: "add_shipping_info",
    ecommerce: {
      currency: "ZAR",
      value,
      shipping_tier: shippingTier,
      items,
    },
  });
}

/**
 * Track add_payment_info event when user adds payment details
 * @param items - All items being purchased
 * @param value - Total checkout value
 * @param paymentType - Payment method (e.g., "Credit Card", "EFT")
 */
export function trackAddPaymentInfo(
  items: AnalyticsItem[],
  value: number,
  paymentType: string
) {
  clearEcommerce();
  pushToDataLayer({
    event: "add_payment_info",
    ecommerce: {
      currency: "ZAR",
      value,
      payment_type: paymentType,
      items,
    },
  });
}

/**
 * Track purchase event when order is completed
 * @param transactionId - Unique order/transaction ID
 * @param items - All items purchased
 * @param value - Total order value
 * @param shipping - Shipping cost
 * @param tax - Tax amount (optional)
 */
export function trackPurchase(
  transactionId: string,
  items: AnalyticsPurchaseItem[],
  value: number,
  shipping: number,
  tax: number = 0
) {
  clearEcommerce();
  pushToDataLayer({
    event: "purchase",
    ecommerce: {
      transaction_id: transactionId,
      currency: "ZAR",
      value,
      tax,
      shipping,
      items,
    },
  });
}

/**
 * Track search event when user performs a search
 * @param searchTerm - The search query
 */
export function trackSearch(searchTerm: string) {
  pushToDataLayer({
    event: "search",
    search_term: searchTerm,
  });
}

/**
 * Track custom event
 * @param eventName - Name of the event
 * @param params - Additional event parameters
 */
export function trackCustomEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  pushToDataLayer({
    event: eventName,
    ...params,
  });
}

/**
 * Track page view (useful for SPA navigation)
 * @param pagePath - Page path
 * @param pageTitle - Page title
 */
export function trackPageView(pagePath: string, pageTitle: string) {
  pushToDataLayer({
    event: "page_view",
    page_path: pagePath,
    page_title: pageTitle,
  });
}

/**
 * Set user properties for GA4
 * @param userId - User identifier (optional)
 * @param properties - Additional user properties
 */
export function setUserProperties(
  userId?: string,
  properties?: Record<string, unknown>
) {
  pushToDataLayer({
    event: "user_properties",
    user_id: userId,
    ...properties,
  });
}

/**
 * Helper to convert cart item to analytics item format
 */
export function toAnalyticsItem(
  productId: string,
  productName: string,
  price: number,
  quantity: number = 1,
  variantName?: string,
  category?: string
): AnalyticsItem {
  return {
    item_id: productId,
    item_name: productName,
    item_brand: "KoosDoos",
    item_category: category || "Fire Pits",
    item_variant: variantName,
    price,
    quantity,
  };
}
