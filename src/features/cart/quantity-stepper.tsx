"use client";

import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { cn } from "cn";

import { maxQuantity, type Product } from "@/data/catalog";

import { setQuantity } from "./cart-store";

/**
 * Sélecteur de quantité du panier, comme sur Amazon mobile : corbeille à la place du « − » quand il reste 1 article.
 */
export function QuantityStepper({ product, quantity, className }: { product: Product; quantity: number; className?: string }) {
  const max = maxQuantity(product);
  const atMax = quantity >= max;

  return (
    <div
      role="group"
      aria-label={`Quantité de ${product.name}`}
      className={cn("flex h-10 items-stretch rounded-full border-2 border-[#f0c14b] bg-white", className)}
    >
      <button
        type="button"
        onClick={() => setQuantity(product.id, quantity - 1)}
        aria-label={quantity === 1 ? `Retirer ${product.name} du panier` : "Diminuer la quantité"}
        className="grid w-10 shrink-0 cursor-pointer place-items-center rounded-l-full hover:bg-surface"
      >
        {quantity === 1 ? <Trash2Icon className="size-4" aria-hidden /> : <MinusIcon className="size-4" aria-hidden />}
      </button>
      <output aria-live="polite" className="grid min-w-8 flex-1 place-items-center font-bold tabular-nums">
        {quantity}
      </output>
      <button
        type="button"
        onClick={() => setQuantity(product.id, quantity + 1)}
        disabled={atMax}
        aria-label={atMax ? `Quantité maximale atteinte (${max})` : "Augmenter la quantité"}
        className="grid w-10 shrink-0 cursor-pointer place-items-center rounded-r-full hover:bg-surface disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
      >
        <PlusIcon className="size-4" aria-hidden />
      </button>
    </div>
  );
}
