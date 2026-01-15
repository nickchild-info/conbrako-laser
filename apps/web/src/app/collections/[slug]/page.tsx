import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCollectionBySlug, getProducts, formatPrice } from "@/lib/data-service";
import { CollectionPageClient } from "./client";
import { BreadcrumbJsonLd } from "@/components/seo";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://koosdoos.co.za";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCollectionBySlug(slug);

  if (!data) {
    return {
      title: "Collection Not Found | KoosDoos Fire Pits",
    };
  }

  const collectionUrl = `${BASE_URL}/collections/${slug}`;

  return {
    title: `${data.collection.title} - Steel Fire Pits`,
    description: data.collection.heroCopy,
    alternates: {
      canonical: collectionUrl,
    },
    openGraph: {
      title: `${data.collection.title} | KoosDoos Fire Pits`,
      description: data.collection.heroCopy,
      type: "website",
      url: collectionUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.collection.title} | KoosDoos Fire Pits`,
      description: data.collection.heroCopy,
    },
  };
}

// Server component that fetches data
export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getCollectionBySlug(slug);

  if (!data) {
    notFound();
  }

  // If collection has no products, fetch all products as fallback
  let products = data.collection.products;
  if (products.length === 0) {
    const allProducts = await getProducts();
    products = allProducts.products;
  }

  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: data.collection.title, href: `/collections/${slug}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <CollectionPageClient
        collection={data.collection}
        initialProducts={products}
        promoBlocks={data.promoBlocks}
      />
    </>
  );
}
