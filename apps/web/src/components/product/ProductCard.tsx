"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Plus, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/types";
import { formatPrice } from "@/data/products";
import { Badge, StarRating, Button } from "@/components/ui";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string, variantId: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const defaultVariant = product.variants[0];
  const hasMultipleVariants = product.variants.length > 1;
  const isOnSale =
    defaultVariant.compareAtPrice &&
    defaultVariant.compareAtPrice > defaultVariant.price;
  const savingsPercent = isOnSale
    ? Math.round(
        ((defaultVariant.compareAtPrice! - defaultVariant.price) /
          defaultVariant.compareAtPrice!) *
          100
      )
    : 0;

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart && !hasMultipleVariants) {
      onAddToCart(product.id, defaultVariant.id);
    }
  };

  return (
    <article
      className="group relative bg-soot border-2 border-smoke card-hover"
      aria-labelledby={`product-title-${product.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ember accent corner */}
      <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-b-[40px] border-b-ember opacity-0 group-hover:opacity-100 transition-opacity z-10" />

      {/* Image carousel */}
      <div className="relative aspect-square overflow-hidden bg-charcoal img-zoom">
        {/* Badges */}
        {(product.badges.length > 0 || isOnSale) && (
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {product.badges.map((badge) => (
              <Badge key={badge} badge={badge} />
            ))}
            {isOnSale && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold uppercase tracking-wider bg-ember text-white-hot">
                <Flame className="h-3 w-3" />
                {savingsPercent}% OFF
              </span>
            )}
          </div>
        )}

        {/* Clickable image area */}
        <Link
          href={`/products/${product.slug}`}
          className="block relative w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-inset"
          aria-label={`View ${product.title} - ${formatPrice(defaultVariant.price)}`}
        >
          {product.images[currentImageIndex] ? (
            <Image
              src={product.images[currentImageIndex].url}
              alt={product.images[currentImageIndex].alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-steel-grey">
              <Flame className="h-16 w-16 opacity-30" />
            </div>
          )}
          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* Image navigation - outside Link */}
        {product.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-charcoal/90 text-white-hot hover:bg-ember transition-all z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember",
                isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 focus-visible:opacity-100 focus-visible:translate-x-0"
              )}
              aria-label={`Previous image of ${product.title}`}
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              onClick={nextImage}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-charcoal/90 text-white-hot hover:bg-ember transition-all z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember",
                isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 focus-visible:opacity-100 focus-visible:translate-x-0"
              )}
              aria-label={`Next image of ${product.title}`}
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Image dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10" role="tablist" aria-label={`${product.title} image gallery`}>
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={cn(
                    "w-2.5 h-2.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white-hot",
                    index === currentImageIndex
                      ? "bg-ember scale-110"
                      : "bg-white-hot/50 hover:bg-white-hot"
                  )}
                  role="tab"
                  aria-selected={index === currentImageIndex}
                  aria-label={`View image ${index + 1} of ${product.images.length}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Product info */}
      <div className="p-5">
        {/* Title - clickable */}
        <Link
          href={`/products/${product.slug}`}
          className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ember"
        >
          <h3 id={`product-title-${product.id}`} className="font-display text-xl text-white-hot mb-1 group-hover:text-ember transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Subtitle */}
        <p className="text-sm text-stone mb-3 line-clamp-1">{product.subtitle}</p>

        {/* Rating */}
        <div className="mb-4">
          <StarRating
            rating={product.reviewSummary.ratingAvg}
            count={product.reviewSummary.ratingCount}
          />
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-xl font-bold text-white-hot">
            {formatPrice(defaultVariant.price)}
          </span>
          {isOnSale && (
            <span className="text-sm text-stone line-through">
              {formatPrice(defaultVariant.compareAtPrice!)}
            </span>
          )}
          {hasMultipleVariants && (
            <span className="text-xs text-ash">+</span>
          )}
        </div>

        {/* Add to cart / Choose options */}
        {hasMultipleVariants ? (
          <Link
            href={`/products/${product.slug}`}
            className="block w-full text-center px-4 py-3 bg-smoke/50 border-2 border-steel-grey text-white-hot text-sm font-bold uppercase tracking-wider hover:bg-ember hover:border-ember transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ember"
          >
            Choose Size
          </Link>
        ) : (
          <Button
            variant="primary"
            size="sm"
            className="w-full"
            onClick={handleAddToCart}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        )}
      </div>
    </article>
  );
}
