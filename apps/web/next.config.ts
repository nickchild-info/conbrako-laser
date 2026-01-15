import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization configuration
  images: {
    // Enable modern image formats for better performance
    formats: ["image/avif", "image/webp"],

    // Configure remote image domains (for product images from API/CDN)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],

    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Image sizes for Next.js Image component
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Minimize layout shift with proper aspect ratios
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Enable experimental optimizations
  experimental: {
    // Optimize packages for smaller bundles
    optimizePackageImports: ["lucide-react"],
  },

  // Production optimizations
  poweredByHeader: false, // Remove X-Powered-By header

  // Compression
  compress: true,

  // Static file caching headers
  async headers() {
    return [
      {
        // Cache static assets for 1 year
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache fonts for 1 year
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache Next.js static files
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
