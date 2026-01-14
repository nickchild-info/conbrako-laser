"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Truck,
  Shield,
  Package,
  Ruler,
  Weight,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getProductBySlug, formatPrice, products } from "@/data/products";
import { Breadcrumbs } from "@/components/layout";
import { Button, Badge, StarRating } from "@/components/ui";
import { ProductCard } from "@/components/product";
import { useCart } from "@/lib/cart-context";
import { Variant } from "@/types";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = getProductBySlug(slug);
  const { addItem } = useCart();

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product?.variants[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) {
    notFound();
  }

  const isOnSale =
    selectedVariant?.compareAtPrice &&
    selectedVariant.compareAtPrice > selectedVariant.price;

  const savingsAmount = isOnSale
    ? selectedVariant.compareAtPrice! - selectedVariant.price
    : 0;

  const handleAddToCart = () => {
    if (selectedVariant) {
      addItem(product.id, selectedVariant.id, quantity);
    }
  };

  const relatedProducts = products
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-soot border-b border-smoke py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Fire Pits", href: "/collections/fire-pits" },
              { label: product.title },
            ]}
          />
        </div>
      </div>

      {/* Main product section */}
      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12">
            {/* Image gallery */}
            <div className="mb-8 lg:mb-0">
              {/* Main image */}
              <div className="relative aspect-square bg-soot border border-smoke overflow-hidden mb-4">
                {product.images[currentImageIndex] ? (
                  <Image
                    src={product.images[currentImageIndex].url}
                    alt={product.images[currentImageIndex].alt}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Flame className="h-24 w-24 text-steel-grey" />
                  </div>
                )}

                {/* Navigation arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === 0 ? product.images.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-charcoal/80 text-white-hot hover:bg-charcoal transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === product.images.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-charcoal/80 text-white-hot hover:bg-charcoal transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}

                {/* Badges */}
                {product.badges.length > 0 && (
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.badges.map((badge) => (
                      <Badge key={badge} badge={badge} />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnail images */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        "relative w-20 h-20 flex-shrink-0 border-2 transition-colors",
                        currentImageIndex === index
                          ? "border-ember"
                          : "border-smoke hover:border-steel-grey"
                      )}
                    >
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div>
              {/* Title and rating */}
              <h1 className="font-display text-4xl lg:text-5xl text-white-hot mb-2">
                {product.title}
              </h1>
              <p className="text-lg text-stone mb-4">{product.subtitle}</p>

              <div className="flex items-center gap-4 mb-6">
                <StarRating
                  rating={product.reviewSummary.ratingAvg}
                  count={product.reviewSummary.ratingCount}
                  size="md"
                />
                <span className="text-sm text-stone">
                  {product.reviewSummary.ratingCount} reviews
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-white-hot">
                    {formatPrice(selectedVariant?.price || 0)}
                  </span>
                  {isOnSale && (
                    <>
                      <span className="text-xl text-stone line-through">
                        {formatPrice(selectedVariant?.compareAtPrice || 0)}
                      </span>
                      <span className="px-2 py-0.5 bg-ember text-white-hot text-sm font-bold">
                        SAVE {formatPrice(savingsAmount)}
                      </span>
                    </>
                  )}
                </div>
                {product.variants.length > 1 && (
                  <p className="text-sm text-stone mt-1">
                    Starting from {formatPrice(product.variants[0].price)}
                  </p>
                )}
              </div>

              {/* Variant selector */}
              {product.variants.length > 1 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-white-hot mb-3">
                    Size: {selectedVariant?.name}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={cn(
                          "px-4 py-2 border text-sm font-medium transition-colors",
                          selectedVariant?.id === variant.id
                            ? "border-ember bg-ember text-white-hot"
                            : "border-steel-grey text-stone hover:border-white-hot hover:text-white-hot"
                        )}
                      >
                        {variant.name}
                        <span className="block text-xs mt-0.5 opacity-80">
                          {formatPrice(variant.price)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white-hot mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-steel-grey">
                    <button
                      onClick={() =>
                        setQuantity((prev) => Math.max(1, prev - 1))
                      }
                      className="p-3 text-stone hover:text-white-hot transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center text-white-hot">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="p-3 text-stone hover:text-white-hot transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-stone">
                    {selectedVariant && selectedVariant.inventoryQty > 0 ? (
                      <span className="text-success">
                        {selectedVariant.inventoryQty} in stock
                      </span>
                    ) : (
                      <span className="text-ember">Out of stock</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Add to cart */}
              <div className="space-y-3 mb-8">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={
                    !selectedVariant || selectedVariant.inventoryQty === 0
                  }
                >
                  Chuck It In The Bakkie
                </Button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-soot border border-smoke">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-ember flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white-hot">
                      Free Shipping
                    </p>
                    <p className="text-xs text-stone">Over R2,500</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-ember flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white-hot">
                      Built Tough
                    </p>
                    <p className="text-xs text-stone">Quality guaranteed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-ember flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white-hot">
                      Flat-Pack
                    </p>
                    <p className="text-xs text-stone">No tools needed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Flame className="h-5 w-5 text-ember flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white-hot">
                      Laser-Cut
                    </p>
                    <p className="text-xs text-stone">Premium steel</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product details */}
      <section className="py-12 bg-soot border-y border-smoke">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12">
            {/* Description */}
            <div className="mb-8 lg:mb-0">
              <h2 className="font-display text-2xl text-white-hot mb-4">
                About This Fire Pit
              </h2>
              <p className="text-stone leading-relaxed">{product.description}</p>
            </div>

            {/* Specs */}
            <div>
              <h2 className="font-display text-2xl text-white-hot mb-4">
                Specifications
              </h2>
              <dl className="space-y-4">
                <div className="flex items-center gap-4 py-3 border-b border-smoke">
                  <dt className="flex items-center gap-2 text-stone">
                    <Ruler className="h-4 w-4" />
                    Dimensions
                  </dt>
                  <dd className="ml-auto text-white-hot">
                    {selectedVariant
                      ? `${selectedVariant.dimensions.width} x ${selectedVariant.dimensions.depth} x ${selectedVariant.dimensions.height}mm`
                      : "Select size"}
                  </dd>
                </div>
                <div className="flex items-center gap-4 py-3 border-b border-smoke">
                  <dt className="flex items-center gap-2 text-stone">
                    <Weight className="h-4 w-4" />
                    Weight
                  </dt>
                  <dd className="ml-auto text-white-hot">
                    {selectedVariant ? `${selectedVariant.weight}kg` : "Select size"}
                  </dd>
                </div>
                <div className="flex items-center gap-4 py-3 border-b border-smoke">
                  <dt className="text-stone">Material</dt>
                  <dd className="ml-auto text-white-hot">{product.material}</dd>
                </div>
                <div className="flex items-center gap-4 py-3 border-b border-smoke">
                  <dt className="text-stone">Finish</dt>
                  <dd className="ml-auto text-white-hot">{product.finish}</dd>
                </div>
                <div className="flex items-center gap-4 py-3 border-b border-smoke">
                  <dt className="text-stone">Capacity</dt>
                  <dd className="ml-auto text-white-hot">
                    {product.seatsMin}-{product.seatsMax} people
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Related products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl text-white-hot mb-8">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onAddToCart={addItem} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
