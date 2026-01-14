export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  badges: Badge[];
  seatsMin: number;
  seatsMax: number;
  material: string;
  finish: string;
  variants: Variant[];
  images: ProductImage[];
  reviewSummary: ReviewSummary;
}

export interface Variant {
  id: string;
  productId: string;
  sku: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  inventoryQty: number;
  weight: number;
  dimensions: Dimensions;
}

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  sortOrder: number;
}

export interface ReviewSummary {
  ratingAvg: number;
  ratingCount: number;
}

export type Badge = "new" | "sale" | "best-seller" | "limited";

export interface Collection {
  id: string;
  slug: string;
  title: string;
  heroCopy: string;
  products: Product[];
}

export interface PromoBlock {
  id: string;
  collectionId: string;
  positionIndex: number;
  title: string;
  copy: string;
  ctaText: string;
  ctaUrl: string;
  imageUrl?: string;
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  product: Product;
  variant: Variant;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export type SortOption =
  | "featured"
  | "price_asc"
  | "price_desc"
  | "rating_desc"
  | "newest";

export interface FilterState {
  collections: string[];
  size: string[];
  priceRange: [number, number] | null;
  finish: string[];
  inStock: boolean;
}
