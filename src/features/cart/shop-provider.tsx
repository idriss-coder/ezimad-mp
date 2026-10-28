"use client";

import { createContext, use, useMemo, useState } from "react";

import type { Product } from "@/data/catalog";
import { WaitlistDialog } from "@/features/waitlist/waitlist-dialog";

import { CartDialog } from "./cart-dialog";

type Shop = {
  openCart: () => void;
  openWaitlist: (product: Product) => void;
};

const ShopContext = createContext<Shop | null>(null);

export function useShop() {
  const shop = use(ShopContext);
  if (!shop) throw new Error("useShop doit être utilisé dans <ShopProvider>");
  return shop;
}

/**
 * Enveloppe la page : porte le dialogue du panier (panier → coordonnées → réservation enregistrée)
 * et celui de la liste d'attente des produits épuisés.
 */
export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlistProduct, setWaitlistProduct] = useState<Product | null>(null);

  const shop = useMemo<Shop>(
    () => ({
      openCart: () => setCartOpen(true),
      openWaitlist: (product) => {
        setWaitlistProduct(product);
        setWaitlistOpen(true);
      },
    }),
    [],
  );

  return (
    <ShopContext value={shop}>
      {children}
      <CartDialog open={cartOpen} onOpenChange={setCartOpen} />
      <WaitlistDialog product={waitlistProduct} open={waitlistOpen} onOpenChange={setWaitlistOpen} />
    </ShopContext>
  );
}
