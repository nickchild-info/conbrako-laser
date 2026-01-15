import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, formatPrice } from "@/lib/data-service";
import { ProductPageClient } from "./client";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/seo";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://koosdoos.co.za";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | KoosDoos Fire Pits",
    };
  }

  const price = product.variants[0]?.price || 0;
  const productUrl = `${BASE_URL}/products/${slug}`;

  return {
    title: `${product.title} - Premium Steel Fire Pit`,
    description: product.description,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: `${product.title} | KoosDoos Fire Pits`,
      description: product.description,
      type: "website",
      url: productUrl,
      images: product.images[0]?.url
        ? [
            {
              url: product.images[0].url,
              width: 1200,
              height: 630,
              alt: product.images[0].alt,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | KoosDoos Fire Pits`,
      description: product.description,
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
    other: {
      "product:price:amount": String(price),
      "product:price:currency": "ZAR",
    },
  };
}

// Server component that fetches data
export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id, 4);
  const productUrl = `${BASE_URL}/products/${slug}`;

  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Fire Pits", href: "/collections/fire-pits" },
    { name: product.title, href: `/products/${slug}` },
  ];

  return (
    <>
      <ProductJsonLd product={product} url={productUrl} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ProductPageClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
