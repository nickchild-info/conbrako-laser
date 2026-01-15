"use client";

import { ReactNode, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { CartProvider, useCart } from "@/lib/cart-context";
import { Header, Footer, CookieConsentBanner } from "@/components/layout";
import { CartDrawer } from "@/components/cart";

function LayoutContent({ children }: { children: ReactNode }) {
  const { itemCount, toggleCart } = useCart();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Admin pages have their own layout - don't wrap with site chrome
  const isAdminPage = pathname?.startsWith("/admin");

  // For admin pages, return just children - admin layout handles everything
  if (isAdminPage) {
    return <>{children}</>;
  }

  // Always render the same initial structure for non-admin pages
  // Cart drawer and cookie banner only render after mount
  return (
    <>
      <Header cartItemCount={mounted ? itemCount : 0} onCartClick={mounted ? toggleCart : () => {}} />
      <main id="main-content" className="min-h-screen" role="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      {mounted && <CartDrawer />}
      {mounted && <CookieConsentBanner />}
    </>
  );
}

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <LayoutContent>{children}</LayoutContent>
    </CartProvider>
  );
}
