"use client";

import { ReactNode } from "react";
import { CartProvider, useCart } from "@/lib/cart-context";
import { Header, Footer } from "@/components/layout";
import { CartDrawer } from "@/components/cart";

function LayoutContent({ children }: { children: ReactNode }) {
  const { itemCount, toggleCart } = useCart();

  return (
    <>
      <Header cartItemCount={itemCount} onCartClick={toggleCart} />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CartDrawer />
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
