"use client";

import { ShoppingCartIcon } from "lucide-react";

import { formatFcfa } from "@/lib/format";

import { cartSummary, useCartItems } from "./cart-store";
import { useShop } from "./shop-provider";

/** Panier de l'en-tête, comme sur Amazon : icône, nombre d'articles en orange, libellé « Panier ». */
export function CartButton() {
  const { openCart } = useShop();
  const { count } = cartSummary(useCartItems());

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Panier, ${count} article${count > 1 ? "s" : ""}`}
      className="flex cursor-pointer items-end gap-1 rounded-[2px] px-1.5 py-1.5 outline-offset-0 hover:outline hover:outline-1 hover:outline-white"
    >
      <span className="relative">
        <ShoppingCartIcon className="size-8" strokeWidth={1.6} aria-hidden />
        <span
          aria-hidden
          className="absolute -top-1.5 left-1/2 -translate-x-[35%] text-base leading-none font-bold text-[#f08804] tabular-nums"
        >
          {count}
        </span>
      </span>
      <span aria-hidden className="text-sm font-bold">
        Panier
      </span>
    </button>
  );
}

/**
 * Barre fixée en bas de l'écran dès que le panier contient un article : sous-total et bouton « Réserver ».
 * Un espace de même hauteur est réservé en fin de page pour ne rien masquer.
 */
export function CartBar() {
  const { openCart } = useShop();
  const { count, total } = cartSummary(useCartItems());
  if (count === 0) return null;

  return (
    <>
      <div aria-hidden className="h-[4.5rem]" />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-input bg-white shadow-[0_-2px_6px_rgb(0_0_0/0.15)]">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-2.5">
          <p className="leading-tight">
            <span className="block text-sm text-muted-foreground">
              Sous-total ({count} article{count > 1 ? "s" : ""})
            </span>
            <strong className="text-lg whitespace-nowrap">{formatFcfa(total)}</strong>
          </p>
          <button type="button" onClick={openCart} className="btn-buy px-6 font-bold">
            Réserver
          </button>
        </div>
      </div>
    </>
  );
}
