"use client";

import { createContext, use, useMemo, useState } from "react";

import { CartDialog } from "./cart-dialog";

type Shop = {
  openCart: () => void;
};

const ShopContext = createContext<Shop | null>(null);

export function useShop() {
  const shop = use(ShopContext);
  if (!shop) throw new Error("useShop doit être utilisé dans <ShopProvider>");
  return shop;
}

/** Enveloppe la page : porte le dialogue du panier (panier → coordonnées → réservation enregistrée). */
export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const shop = useMemo<Shop>(() => ({ openCart: () => setCartOpen(true) }), []);

  return (
    <ShopContext value={shop}>
      {children}
      <CartDialog open={cartOpen} onOpenChange={setCartOpen} />
    </ShopContext>
  );
}
