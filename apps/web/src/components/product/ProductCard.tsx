"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
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
    <article className="group relative bg-soot border border-smoke hover:border-steel-grey transition-colors">
      <Link
        href={`/products/${product.slug}`}
        className="block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image carousel */}
        <div className="relative aspect-square overflow-hidden bg-charcoal">
          {/* Badges */}
          {product.badges.length > 0 && (
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
              {product.badges.map((badge) => (
                <Badge key={badge} badge={badge} />
              ))}
              {isOnSale && (
                <span className="inline-block px-2 py-0.5 text-xs font-bold uppercase tracking-wider bg-ember text-white-hot">
                  {savingsPercent}% OFF
                </span>
              )}
            </div>
          )}

          {/* Image */}
          <div className="relative w-full h-full">
            {product.images[currentImageIndex] ? (
              <Image
                src={product.images[currentImageIndex].url}
                alt={product.images[currentImageIndex].alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-steel-grey">
                <span className="font-display text-2xl">CONBRAKO</span>
              </div>
            )}
          </div>

          {/* Image navigation */}
          {product.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className={cn(
                  "absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-charcoal/80 text-white-hot hover:bg-charcoal transition-all",
                  isHovered ? "opacity-100" : "opacity-0"
                )}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-charcoal/80 text-white-hot hover:bg-charcoal transition-all",
                  isHovered ? "opacity-100" : "opacity-0"
                )}
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Image dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      index === currentImageIndex
                        ? "bg-ember"
                        : "bg-white-hot/50 hover:bg-white-hot/80"
                    )}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Product info */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-display text-xl text-white-hot mb-1">
            {product.title}
          </h3>

          {/* Subtitle */}
          <p className="text-sm text-stone mb-2">{product.subtitle}</p>

          {/* Rating */}
          <div className="mb-3">
            <StarRating
              rating={product.reviewSummary.ratingAvg}
              count={product.reviewSummary.ratingCount}
            />
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-white-hot">
              {formatPrice(defaultVariant.price)}
            </span>
            {isOnSale && (
              <span className="text-sm text-stone line-through">
                {formatPrice(defaultVariant.compareAtPrice!)}
              </span>
            )}
            {hasMultipleVariants && (
              <span className="text-xs text-stone">+</span>
            )}
          </div>

          {/* Add to cart / Choose options */}
          <Button
            variant={hasMultipleVariants ? "secondary" : "primary"}
            size="sm"
            className="w-full"
            onClick={handleAddToCart}
          >
            {hasMultipleVariants ? (
              "Choose Options"
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </Link>
    </article>
  );
}
