"use client";

import { usePathname } from "next/navigation";
import CartModal from "./CartModal";
import { CartProvider } from "./CartContext";

const HIDDEN_PREFIXES = ["/admin", "/login", "/register"];

function shouldShowCart(pathname: string): boolean {
  return !HIDDEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export default function CartShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const showCart = shouldShowCart(pathname);

  return (
    <CartProvider>
      {children}
      {showCart && <CartModal />}
    </CartProvider>
  );
}
