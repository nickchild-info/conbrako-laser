import { Product } from "@/types";

interface ProductJsonLdProps {
  product: Product;
  url: string;
}

export function ProductJsonLd({ product, url }: ProductJsonLdProps) {
  const variant = product.variants[0];
  const price = variant?.price || 0;
  const compareAtPrice = variant?.compareAtPrice;
  const isOnSale = compareAtPrice && compareAtPrice > price;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.map((img) => img.url),
    sku: variant?.sku,
    brand: {
      "@type": "Brand",
      name: "KoosDoos",
    },
    offers: {
      "@type": "Offer",
      url: url,
      priceCurrency: "ZAR",
      price: price,
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      )
        .toISOString()
        .split("T")[0],
      availability:
        variant && variant.inventoryQty > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "KoosDoos Fire Pits",
      },
      ...(isOnSale && {
        priceSpecification: {
          "@type": "PriceSpecification",
          price: price,
          priceCurrency: "ZAR",
          valueAddedTaxIncluded: true,
        },
      }),
    },
    ...(product.reviewSummary && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.reviewSummary.ratingAvg,
        reviewCount: product.reviewSummary.ratingCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    material: product.material,
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Seats",
        value: `${product.seatsMin}-${product.seatsMax} people`,
      },
      {
        "@type": "PropertyValue",
        name: "Finish",
        value: product.finish,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
