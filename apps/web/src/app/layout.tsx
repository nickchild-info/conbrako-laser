import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/layout";

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

export const metadata: Metadata = {
  title: {
    default: "KoosDoos Fire Pits | Built Tough. Burns Harder.",
    template: "%s | KoosDoos Fire Pits",
  },
  description:
    "Premium laser-cut steel fire pits for the serious braai enthusiast. Flat-pack design, rugged construction, and African artistry. Not for sissies.",
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
  authors: [{ name: "KoosDoos" }],
  openGraph: {
    type: "website",
    locale: "en_ZA",
    siteName: "KoosDoos Fire Pits",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${bebasNeue.variable} ${inter.variable} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
