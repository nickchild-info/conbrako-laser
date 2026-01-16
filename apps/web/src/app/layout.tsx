import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/layout";
import { OrganizationJsonLd } from "@/components/seo";
import { GoogleTagManager, GoogleTagManagerNoScript } from "@/components/analytics";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://koosdoos.co.za";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a1a1a",
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "KoosDoos Fire Pits | Cut from steel. Built to last.",
    template: "%s | KoosDoos Fire Pits",
  },
  description:
    "Premium laser-cut steel fire pits for the serious braai enthusiast. Flat-pack design, rugged construction, and African artistry.",
  keywords: [
    "fire pit",
    "fire boma",
    "braai",
    "fire box",
    "outdoor fire",
    "steel fire pit",
    "laser cut fire pit",
    "South Africa",
    "KoosDoos",
    "personalised fire pit",
    "custom fire pit",
  ],
  authors: [{ name: "KoosDoos Fire Pits" }],
  creator: "KoosDoos Fire Pits",
  publisher: "KoosDoos Fire Pits",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: BASE_URL,
    siteName: "KoosDoos Fire Pits",
    title: "KoosDoos Fire Pits | Cut from steel. Built to last.",
    description:
      "Premium laser-cut steel fire pits for the serious braai enthusiast. Flat-pack design, rugged construction, and African artistry.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "KoosDoos Fire Pits - Premium Steel Fire Pits",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KoosDoos Fire Pits | Cut from steel. Built to last.",
    description:
      "Premium laser-cut steel fire pits for the serious braai enthusiast. Flat-pack design, rugged construction.",
    images: ["/images/og-image.jpg"],
    creator: "@koosdoos",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  category: "ecommerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <GoogleTagManager />
        <OrganizationJsonLd />
      </head>
      <body className={`${bebasNeue.variable} ${inter.variable} antialiased`}>
        {/* Skip to main content link for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-ember focus:text-white-hot focus:px-4 focus:py-2 focus:font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white-hot"
        >
          Skip to main content
        </a>
        <GoogleTagManagerNoScript />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
