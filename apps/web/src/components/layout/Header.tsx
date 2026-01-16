"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag, Search, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Fire Pits", href: "/collections/fire-pits" },
  { name: "Personalise", href: "/personalise", highlight: true },
  { name: "Best Sellers", href: "/collections/best-sellers" },
  { name: "About", href: "/pages/about" },
];

interface HeaderProps {
  cartItemCount?: number;
  onCartClick?: () => void;
}

export function Header({ cartItemCount = 0, onCartClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-charcoal/95 backdrop-blur-md border-b border-smoke shadow-lg shadow-black/20"
          : "bg-charcoal border-b border-smoke"
      )}
    >
      {/* Promo Bar */}
      <div className="bg-ember text-white-hot py-2.5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-ember via-flame to-ember opacity-50" />
        <div className="relative text-center text-sm font-bold tracking-wide">
          <span className="hidden sm:inline">
            FREE SHIPPING on orders over R2,500 | Ships within 2-3 business days
          </span>
          <span className="sm:hidden">FREE SHIPPING over R2,500</span>
        </div>
      </div>

      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between py-4">
          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="p-2 text-stone hover:text-ember transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ember"
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
            <Link href="/" className="flex items-center group">
              <Image
                src="/images/koosdoos-logo.png"
                alt="KoosDoos Fire Pits"
                width={160}
                height={45}
                className="h-10 sm:h-12 w-auto transition-transform group-hover:scale-105"
                priority
              />
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex lg:gap-x-10" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-bold transition-all uppercase tracking-widest focus:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal underline-hover py-2",
                  item.highlight
                    ? "text-ember hover:text-flame"
                    : "text-stone hover:text-white-hot"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side - Search and Cart */}
          <div className="flex flex-1 items-center justify-end gap-3">
            <button
              type="button"
              className="p-2.5 text-stone hover:text-white-hot hover:bg-smoke/50 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ember"
              aria-label="Search products"
            >
              <span className="sr-only">Search</span>
              <Search className="h-5 w-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={onCartClick}
              className="relative p-2.5 text-stone hover:text-white-hot hover:bg-smoke/50 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ember group"
              aria-label={`Shopping cart${cartItemCount > 0 ? `, ${cartItemCount} items` : ''}`}
            >
              <span className="sr-only">Cart{cartItemCount > 0 && `, ${cartItemCount} items`}</span>
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              {cartItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-ember text-xs font-bold text-white-hot flex items-center justify-center ember-pulse" aria-hidden="true">
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
            mobileMenuOpen ? "max-h-80 pb-6" : "max-h-0"
          )}
          aria-label="Mobile navigation"
          aria-hidden={!mobileMenuOpen}
        >
          <div className="space-y-1 pt-2" role="menu">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 py-4 text-base font-bold transition-all uppercase tracking-wider border-b border-smoke/50 last:border-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-inset",
                  item.highlight
                    ? "text-ember hover:text-flame"
                    : "text-stone hover:text-white-hot hover:pl-2"
                )}
                role="menuitem"
                tabIndex={mobileMenuOpen ? 0 : -1}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {item.highlight && <Flame className="h-4 w-4" />}
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </nav>
    </header>
  );
}
