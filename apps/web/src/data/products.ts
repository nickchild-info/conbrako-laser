import { Product, Collection, PromoBlock } from "@/types";

export const products: Product[] = [
  {
    id: "1",
    slug: "koosdoos-small",
    title: "KoosDoos Small",
    subtitle: "Compact & portable | Perfect for 2-3 people",
    description:
      "The perfect starter fire pit for intimate gatherings or camping adventures. Our Small KoosDoos packs flat for easy transport and assembles in under 5 minutes with no tools. Laser-cut from premium South African steel with signature flame-pattern ventilation for optimal airflow.",
    badges: ["new"],
    seatsMin: 2,
    seatsMax: 3,
    material: "2.5mm Mild Steel",
    finish: "Raw Steel",
    variants: [
      {
        id: "v1",
        productId: "1",
        sku: "KDS-SM",
        name: "Small",
        price: 1299,
        inventoryQty: 25,
        weight: 8,
        dimensions: { width: 300, height: 350, depth: 300 },
      },
    ],
    images: [
      {
        id: "img1",
        url: "/images/products/elephant-fire-1.jpg",
        alt: "KoosDoos Small fire pit with active flames",
        sortOrder: 1,
      },
      {
        id: "img2",
        url: "/images/products/veld-flame-1.jpg",
        alt: "KoosDoos Small showing flame pattern cutouts",
        sortOrder: 2,
      },
    ],
    reviewSummary: {
      ratingAvg: 4.7,
      ratingCount: 89,
    },
  },
  {
    id: "2",
    slug: "koosdoos-medium",
    title: "KoosDoos Medium",
    subtitle: "Most popular size | Ideal for 4-6 people",
    description:
      "Our best-selling size, perfect for backyard braais and family gatherings. The Medium KoosDoos delivers serious heat output while remaining portable enough to move around your property. Features our signature laser-cut designs and assembles without tools.",
    badges: ["best-seller"],
    seatsMin: 4,
    seatsMax: 6,
    material: "3mm Mild Steel",
    finish: "Raw Steel",
    variants: [
      {
        id: "v2",
        productId: "2",
        sku: "KDS-MD",
        name: "Medium",
        price: 1999,
        compareAtPrice: 2299,
        inventoryQty: 18,
        weight: 15,
        dimensions: { width: 400, height: 450, depth: 400 },
      },
    ],
    images: [
      {
        id: "img3",
        url: "/images/products/elephant-fire-1.jpg",
        alt: "KoosDoos Medium fire pit at night",
        sortOrder: 1,
      },
      {
        id: "img4",
        url: "/images/products/elephant-fire-2.jpg",
        alt: "KoosDoos Medium showing steel patina",
        sortOrder: 2,
      },
      {
        id: "img5",
        url: "/images/products/veld-flame-1.jpg",
        alt: "KoosDoos Medium with flame cutouts",
        sortOrder: 3,
      },
    ],
    reviewSummary: {
      ratingAvg: 4.9,
      ratingCount: 234,
    },
  },
  {
    id: "3",
    slug: "koosdoos-large",
    title: "KoosDoos Large",
    subtitle: "Family favourite | Great for 6-8 people",
    description:
      "When you need more fire for bigger gatherings. The Large KoosDoos is perfect for entertaining, delivering impressive flames and heat output. Built from 3mm steel for durability, with our signature flat-pack design that assembles in minutes.",
    badges: [],
    seatsMin: 6,
    seatsMax: 8,
    material: "3mm Mild Steel",
    finish: "Raw Steel",
    variants: [
      {
        id: "v3",
        productId: "3",
        sku: "KDS-LG",
        name: "Large",
        price: 2799,
        inventoryQty: 12,
        weight: 22,
        dimensions: { width: 500, height: 550, depth: 500 },
      },
    ],
    images: [
      {
        id: "img6",
        url: "/images/products/elephant-fire-2.jpg",
        alt: "KoosDoos Large fire pit in backyard",
        sortOrder: 1,
      },
      {
        id: "img7",
        url: "/images/products/elephant-fire-3.jpg",
        alt: "KoosDoos Large showing construction detail",
        sortOrder: 2,
      },
    ],
    reviewSummary: {
      ratingAvg: 4.8,
      ratingCount: 156,
    },
  },
  {
    id: "4",
    slug: "koosdoos-xl",
    title: "KoosDoos XL",
    subtitle: "The beast | For 8-12 people",
    description:
      "Go big or go home. The XL KoosDoos is our largest fire pit, perfect for parties, events, and serious braai enthusiasts who want maximum fire. Built from heavy-duty 4mm steel for ultimate durability. A true centrepiece for any outdoor space.",
    badges: [],
    seatsMin: 8,
    seatsMax: 12,
    material: "4mm Mild Steel",
    finish: "Raw Steel",
    variants: [
      {
        id: "v4",
        productId: "4",
        sku: "KDS-XL",
        name: "Extra Large",
        price: 3999,
        compareAtPrice: 4499,
        inventoryQty: 6,
        weight: 35,
        dimensions: { width: 650, height: 650, depth: 650 },
      },
    ],
    images: [
      {
        id: "img8",
        url: "/images/products/elephant-fire-1.jpg",
        alt: "KoosDoos XL fire pit with roaring flames",
        sortOrder: 1,
      },
      {
        id: "img9",
        url: "/images/products/elephant-fire-3.jpg",
        alt: "KoosDoos XL top-down view",
        sortOrder: 2,
      },
    ],
    reviewSummary: {
      ratingAvg: 4.9,
      ratingCount: 67,
    },
  },
  {
    id: "5",
    slug: "koosdoos-personalised",
    title: "KoosDoos Personalised",
    subtitle: "Your design | Your fire pit",
    description:
      "Make it yours. Upload your own design or choose from our template library to create a one-of-a-kind fire pit. Perfect for businesses, sports clubs, family crests, or any custom artwork. Our team will review your design and laser-cut it into premium steel.",
    badges: ["new"],
    seatsMin: 4,
    seatsMax: 8,
    material: "3mm Mild Steel",
    finish: "Raw Steel",
    variants: [
      {
        id: "v5",
        productId: "5",
        sku: "KDS-PERS-MD",
        name: "Medium (Personalised)",
        price: 2999,
        inventoryQty: 99,
        weight: 15,
        dimensions: { width: 400, height: 450, depth: 400 },
      },
      {
        id: "v6",
        productId: "5",
        sku: "KDS-PERS-LG",
        name: "Large (Personalised)",
        price: 3799,
        inventoryQty: 99,
        weight: 22,
        dimensions: { width: 500, height: 550, depth: 500 },
      },
      {
        id: "v7",
        productId: "5",
        sku: "KDS-PERS-XL",
        name: "XL (Personalised)",
        price: 4999,
        inventoryQty: 99,
        weight: 35,
        dimensions: { width: 650, height: 650, depth: 650 },
      },
    ],
    images: [
      {
        id: "img10",
        url: "/images/products/elephant-fire-2.jpg",
        alt: "KoosDoos Personalised fire pit with custom design",
        sortOrder: 1,
      },
      {
        id: "img11",
        url: "/images/products/elephant-fire-1.jpg",
        alt: "Example of personalised laser-cut design",
        sortOrder: 2,
      },
    ],
    reviewSummary: {
      ratingAvg: 5.0,
      ratingCount: 23,
    },
  },
];

// Design templates for personalised fire pits
export interface DesignTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  previewUrl: string;
}

export const designTemplates: DesignTemplate[] = [
  {
    id: "t1",
    name: "Springbok",
    category: "Wildlife",
    description: "Iconic South African springbok silhouette",
    previewUrl: "/images/templates/springbok.svg",
  },
  {
    id: "t2",
    name: "Elephant",
    category: "Wildlife",
    description: "Majestic African elephant head design",
    previewUrl: "/images/templates/elephant.svg",
  },
  {
    id: "t3",
    name: "Lion",
    category: "Wildlife",
    description: "Powerful lion face silhouette",
    previewUrl: "/images/templates/lion.svg",
  },
  {
    id: "t4",
    name: "Protea",
    category: "Nature",
    description: "South Africa's national flower",
    previewUrl: "/images/templates/protea.svg",
  },
  {
    id: "t5",
    name: "Baobab Tree",
    category: "Nature",
    description: "Iconic African tree of life",
    previewUrl: "/images/templates/baobab.svg",
  },
  {
    id: "t6",
    name: "Rugby Ball",
    category: "Sports",
    description: "Perfect for rugby fans and clubs",
    previewUrl: "/images/templates/rugby.svg",
  },
  {
    id: "t7",
    name: "Soccer Ball",
    category: "Sports",
    description: "For the beautiful game enthusiasts",
    previewUrl: "/images/templates/soccer.svg",
  },
  {
    id: "t8",
    name: "Golf Club",
    category: "Sports",
    description: "Elegant golf club crossed design",
    previewUrl: "/images/templates/golf.svg",
  },
  {
    id: "t9",
    name: "Family Crest Frame",
    category: "Custom",
    description: "Ornate frame for your family name or crest",
    previewUrl: "/images/templates/crest.svg",
  },
  {
    id: "t10",
    name: "Business Logo Frame",
    category: "Custom",
    description: "Clean frame for company logos",
    previewUrl: "/images/templates/logo-frame.svg",
  },
  {
    id: "t11",
    name: "African Geometric",
    category: "Pattern",
    description: "Traditional African geometric patterns",
    previewUrl: "/images/templates/african-geo.svg",
  },
  {
    id: "t12",
    name: "Flame Pattern",
    category: "Pattern",
    description: "Dynamic flame cutout design",
    previewUrl: "/images/templates/flames.svg",
  },
];

export const collections: Collection[] = [
  {
    id: "col1",
    slug: "fire-pits",
    title: "Fire Pits",
    heroCopy:
      "Premium laser-cut steel fire pits. Flat-pack design. Rugged construction.",
    products: products,
  },
  {
    id: "col2",
    slug: "best-sellers",
    title: "Best Sellers",
    heroCopy: "Our most-loved fire pits. Tried, tested, and loved by real braai enthusiasts.",
    products: products.filter((p) => p.badges.includes("best-seller")),
  },
  {
    id: "col3",
    slug: "new-arrivals",
    title: "New Arrivals",
    heroCopy: "Fresh off the laser cutter. The latest additions to the KoosDoos family.",
    products: products.filter((p) => p.badges.includes("new")),
  },
  {
    id: "col4",
    slug: "personalised",
    title: "Personalised",
    heroCopy: "Create your own unique fire pit with custom designs or choose from our templates.",
    products: products.filter((p) => p.slug === "koosdoos-personalised"),
  },
];

export const promoBlocks: PromoBlock[] = [
  {
    id: "promo1",
    collectionId: "col1",
    positionIndex: 2,
    title: "Flat-Pack Fire",
    copy: "All our fire pits ship flat and assemble in minutes. No tools. No fuss. Just fire.",
    ctaText: "See How It Works",
    ctaUrl: "/pages/assembly",
  },
  {
    id: "promo2",
    collectionId: "col1",
    positionIndex: 5,
    title: "Make It Yours",
    copy: "Upload your own design or choose from our templates. Create a fire pit that's uniquely yours.",
    ctaText: "Personalise Now",
    ctaUrl: "/personalise",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

export function formatPrice(price: number): string {
  return `R${price.toLocaleString("en-ZA")}`;
}
