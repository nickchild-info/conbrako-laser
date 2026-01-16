import { Metadata } from "next";
import { getFeaturedProducts } from "@/lib/data-service";
import { HomePageClient } from "./home-client";

export const metadata: Metadata = {
  title: "KoosDoos Fire Pits | Cut from steel. Built to last.",
  description:
    "Premium laser-cut steel fire pits. Flat-pack design. Rugged as hell. Proudly South African. Free shipping on orders over R2,500.",
  openGraph: {
    title: "KoosDoos Fire Pits | Cut from steel. Built to last.",
    description:
      "Premium laser-cut steel fire pits. Flat-pack design. Rugged as hell. Proudly South African.",
    type: "website",
  },
};

// Server component that fetches data
export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return <HomePageClient featuredProducts={featuredProducts} />;
}
