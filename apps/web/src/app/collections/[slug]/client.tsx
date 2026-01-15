"use client";

import { useState, useMemo, useEffect } from "react";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/data-service";
import { ProductCard, PromoTile } from "@/components/product";
import { Breadcrumbs } from "@/components/layout";
import { Button } from "@/components/ui";
import { useCart } from "@/lib/cart-context";
import { Product, Collection, PromoBlock, SortOption, FilterState } from "@/types";
import { trackViewItemList, toAnalyticsItem } from "@/lib/analytics";

interface CollectionPageClientProps {
  collection: Collection;
  initialProducts: Product[];
  promoBlocks: PromoBlock[];
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating_desc", label: "Top Rated" },
  { value: "newest", label: "Newest" },
];

const sizeOptions = [
  { value: "2-4", label: "2-4 People" },
  { value: "4-6", label: "4-6 People" },
  { value: "6-10", label: "6-10 People" },
];

export function CollectionPageClient({
  collection,
  initialProducts,
  promoBlocks,
}: CollectionPageClientProps) {
  const { addItem } = useCart();

  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [filters, setFilters] = useState<FilterState>({
    collections: [],
    size: [],
    priceRange: null,
    finish: [],
    inStock: false,
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Apply size filter
    if (filters.size.length > 0) {
      result = result.filter((product) => {
        return filters.size.some((size) => {
          const [min, max] = size.split("-").map(Number);
          return product.seatsMin <= max && product.seatsMax >= min;
        });
      });
    }

    // Apply in-stock filter
    if (filters.inStock) {
      result = result.filter((product) =>
        product.variants.some((v) => v.inventoryQty > 0)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "price_asc":
        result.sort((a, b) => a.variants[0].price - b.variants[0].price);
        break;
      case "price_desc":
        result.sort((a, b) => b.variants[0].price - a.variants[0].price);
        break;
      case "rating_desc":
        result.sort(
          (a, b) => b.reviewSummary.ratingAvg - a.reviewSummary.ratingAvg
        );
        break;
      case "newest":
        result.sort((a, b) => {
          const aIsNew = a.badges.includes("new") ? 1 : 0;
          const bIsNew = b.badges.includes("new") ? 1 : 0;
          return bIsNew - aIsNew;
        });
        break;
      default:
        // featured - keep original order
        break;
    }

    return result;
  }, [initialProducts, filters, sortBy]);

  // Insert promo tiles at specified positions
  const gridItems = useMemo(() => {
    const items: (Product | PromoBlock)[] = [...filteredProducts];
    promoBlocks.forEach((promo) => {
      if (promo.positionIndex <= items.length) {
        items.splice(promo.positionIndex, 0, promo);
      }
    });
    return items;
  }, [filteredProducts, promoBlocks]);

  const toggleSizeFilter = (size: string) => {
    setFilters((prev) => ({
      ...prev,
      size: prev.size.includes(size)
        ? prev.size.filter((s) => s !== size)
        : [...prev.size, size],
    }));
  };

  const clearFilters = () => {
    setFilters({
      collections: [],
      size: [],
      priceRange: null,
      finish: [],
      inStock: false,
    });
  };

  const activeFilterCount = filters.size.length + (filters.inStock ? 1 : 0);

  // Track view_item_list event on page load
  useEffect(() => {
    if (filteredProducts.length > 0) {
      const analyticsItems = filteredProducts.map((product) =>
        toAnalyticsItem(
          product.id,
          product.title,
          product.variants[0].price,
          1
        )
      );
      trackViewItemList(
        analyticsItems,
        collection.slug,
        collection.title
      );
    }
  }, [collection.slug]); // Track once per collection

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-soot border-b border-smoke py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: collection.title }]} />
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white-hot mt-4">
            {collection.title}
          </h1>
          <p className="text-lg text-stone mt-4 max-w-2xl">
            {collection.heroCopy ||
              "Premium laser-cut steel fire pits. Flat-pack design. Rugged construction."}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="sticky top-[104px] z-40 bg-charcoal border-b border-smoke">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Left: Filter toggle & product count */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 text-stone hover:text-white-hot transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ember"
                aria-label={`Open filters${activeFilterCount > 0 ? `, ${activeFilterCount} active` : ''}`}
                aria-expanded={mobileFiltersOpen}
                aria-controls="mobile-filters"
              >
                <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
                <span className="text-sm">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="h-5 w-5 rounded-full bg-ember text-xs text-white-hot flex items-center justify-center" aria-hidden="true">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <span className="text-sm text-stone" role="status" aria-live="polite">
                {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Right: Sort */}
            <div className="relative">
              <button
                onClick={() => setSortMenuOpen(!sortMenuOpen)}
                className="flex items-center gap-2 text-sm text-stone hover:text-white-hot transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ember"
                aria-expanded={sortMenuOpen}
                aria-haspopup="listbox"
                aria-label={`Sort by ${sortOptions.find((o) => o.value === sortBy)?.label}`}
              >
                Sort: {sortOptions.find((o) => o.value === sortBy)?.label}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    sortMenuOpen && "rotate-180"
                  )}
                  aria-hidden="true"
                />
              </button>
              {sortMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setSortMenuOpen(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-soot border border-smoke z-20" role="listbox" aria-label="Sort options">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setSortMenuOpen(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-inset",
                          sortBy === option.value
                            ? "bg-ember text-white-hot"
                            : "text-stone hover:bg-smoke hover:text-white-hot"
                        )}
                        role="option"
                        aria-selected={sortBy === option.value}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Desktop Filters sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-[176px] space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg text-white-hot">Filters</h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-ember hover:text-flame transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Size filter */}
              <div className="border-t border-smoke pt-6">
                <h3 className="text-sm font-medium text-white-hot mb-4">Size</h3>
                <div className="space-y-2">
                  {sizeOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={filters.size.includes(option.value)}
                        onChange={() => toggleSizeFilter(option.value)}
                        className="sr-only peer"
                      />
                      <div className="w-5 h-5 border border-steel-grey peer-checked:bg-ember peer-checked:border-ember transition-colors flex items-center justify-center">
                        {filters.size.includes(option.value) && (
                          <svg
                            className="w-3 h-3 text-white-hot"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-stone group-hover:text-white-hot transition-colors">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* In stock filter */}
              <div className="border-t border-smoke pt-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={() =>
                      setFilters((prev) => ({
                        ...prev,
                        inStock: !prev.inStock,
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-5 h-5 border border-steel-grey peer-checked:bg-ember peer-checked:border-ember transition-colors flex items-center justify-center">
                    {filters.inStock && (
                      <svg
                        className="w-3 h-3 text-white-hot"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-stone group-hover:text-white-hot transition-colors">
                    In Stock Only
                  </span>
                </label>
              </div>
            </div>
          </aside>

          {/* Product grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-stone mb-4">No products match your filters.</p>
                <Button variant="secondary" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridItems.map((item, index) =>
                  "ctaText" in item ? (
                    <PromoTile key={`promo-${item.id}`} promo={item} />
                  ) : (
                    <ProductCard
                      key={item.id}
                      product={item}
                      onAddToCart={addItem}
                    />
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filters drawer */}
      <>
        <div
          className={cn(
            "fixed inset-0 bg-charcoal/80 z-50 lg:hidden transition-opacity duration-300",
            mobileFiltersOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setMobileFiltersOpen(false)}
          aria-hidden="true"
        />
        <div
          id="mobile-filters"
          className={cn(
            "fixed left-0 top-0 h-full w-full max-w-sm bg-soot z-50 lg:hidden transform transition-transform duration-300",
            mobileFiltersOpen ? "translate-x-0" : "-translate-x-full"
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Filter products"
          aria-hidden={!mobileFiltersOpen}
        >
          <div className="flex items-center justify-between p-4 border-b border-smoke">
            <h2 className="font-display text-xl text-white-hot">Filters</h2>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="p-2 text-stone hover:text-white-hot transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ember"
              aria-label="Close filters"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="p-4 space-y-6 overflow-y-auto h-[calc(100%-140px)]">
            {/* Size filter */}
            <div>
              <h3 className="text-sm font-medium text-white-hot mb-4">Size</h3>
              <div className="space-y-2">
                {sizeOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={filters.size.includes(option.value)}
                      onChange={() => toggleSizeFilter(option.value)}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border border-steel-grey peer-checked:bg-ember peer-checked:border-ember transition-colors flex items-center justify-center">
                      {filters.size.includes(option.value) && (
                        <svg
                          className="w-3 h-3 text-white-hot"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-stone group-hover:text-white-hot transition-colors">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* In stock filter */}
            <div className="border-t border-smoke pt-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={() =>
                    setFilters((prev) => ({
                      ...prev,
                      inStock: !prev.inStock,
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-5 h-5 border border-steel-grey peer-checked:bg-ember peer-checked:border-ember transition-colors flex items-center justify-center">
                  {filters.inStock && (
                    <svg
                      className="w-3 h-3 text-white-hot"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-stone group-hover:text-white-hot transition-colors">
                  In Stock Only
                </span>
              </label>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-smoke bg-soot">
            <div className="flex gap-4">
              <Button variant="secondary" className="flex-1" onClick={clearFilters}>
                Clear
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => setMobileFiltersOpen(false)}
              >
                Apply ({filteredProducts.length})
              </Button>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
