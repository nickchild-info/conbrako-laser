"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, ShoppingBag, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Fire Pits", href: "/collections/fire-pits" },
  { name: "Personalise", href: "/personalise" },
  { name: "Best Sellers", href: "/collections/best-sellers" },
  { name: "About", href: "/pages/about" },
];

interface HeaderProps {
  cartItemCount?: number;
  onCartClick?: () => void;
}

export function Header({ cartItemCount = 0, onCartClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-charcoal border-b border-smoke">
      {/* Promo Bar */}
      <div className="bg-ember text-white-hot text-center py-2 text-sm font-medium">
        <span className="hidden sm:inline">
          FREE SHIPPING on orders over R2,500 | Ships within 2-3 business days
        </span>
        <span className="sm:hidden">FREE SHIPPING over R2,500</span>
      </div>

      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="p-2 text-stone hover:text-white-hot transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ember"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <span className="sr-only">{mobileMenuOpen ? "Close menu" : "Open menu"}</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/koosdoos-logo.png"
                alt="KoosDoos Fire Pits"
                width={140}
                height={40}
                className="h-8 sm:h-10 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex lg:gap-x-8" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors uppercase tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal",
                  item.name === "Personalise"
                    ? "text-ember hover:text-flame"
                    : "text-stone hover:text-white-hot"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side - Search and Cart */}
          <div className="flex flex-1 items-center justify-end gap-4">
            <button
              type="button"
              className="p-2 text-stone hover:text-white-hot transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ember"
              aria-label="Search products"
            >
              <span className="sr-only">Search</span>
              <Search className="h-5 w-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={onCartClick}
              className="relative p-2 text-stone hover:text-white-hot transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ember"
              aria-label={`Shopping cart${cartItemCount > 0 ? `, ${cartItemCount} items` : ''}`}
            >
              <span className="sr-only">Cart{cartItemCount > 0 && `, ${cartItemCount} items`}</span>
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-ember text-xs font-bold text-white-hot flex items-center justify-center" aria-hidden="true">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <nav
          id="mobile-menu"
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            mobileMenuOpen ? "max-h-64 pb-4" : "max-h-0"
          )}
          aria-label="Mobile navigation"
          aria-hidden={!mobileMenuOpen}
        >
          <div className="space-y-1 pt-2" role="menu">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block py-3 text-base font-medium transition-colors uppercase tracking-wide border-b border-smoke last:border-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-inset",
                  item.name === "Personalise"
                    ? "text-ember hover:text-flame"
                    : "text-stone hover:text-white-hot"
                )}
                role="menuitem"
                tabIndex={mobileMenuOpen ? 0 : -1}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </nav>
    </header>
  );
}
