"use client";

import { cn } from "cn";
import Image from "next/image";

import { discountPercent, OFFER_DEADLINE_LABEL, type Product } from "@/data/catalog";
import { formatFcfa, formatNumber } from "@/lib/format";
import { setQuantity, useCartItems } from "@/features/cart/cart-store";
import { QuantityStepper } from "@/features/cart/quantity-stepper";
import { useShop } from "@/features/cart/shop-provider";

import { Stars } from "./stars";

/**
 * Fiche produit façon résultat de recherche Amazon : vignette, note, prix EZIMAD avec remise,
 * prix du marché barré, stock restant, puis « Ajouter au panier » (qui devient un sélecteur de quantité).
 * Produit épuisé : vignette grisée et bouton de liste d'attente.
 */
export function ProductCard({ product, eager }: { product: Product; eager: boolean }) {
  const { openWaitlist } = useShop();
  const quantity = useCartItems()[product.id] ?? 0;
  const soldOut = product.stock === 0;

  return (
    <li className="flex flex-col border border-border bg-white p-2 sm:p-3">
      <div className="relative">
        <Image
          src={product.image}
          alt={product.imageAlt}
          width={480}
          height={480}
          sizes="(min-width: 1024px) 200px, (min-width: 640px) 30vw, 46vw"
          loading={eager ? "eager" : "lazy"}
          className={cn("aspect-square w-full object-cover", soldOut && "opacity-45 grayscale")}
        />
        {soldOut && (
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-6 border-2 border-heart bg-white px-2.5 py-1 text-sm font-bold tracking-[0.08em] text-heart uppercase">
            Épuisé
          </span>
        )}
      </div>
      <h4 className="mt-2.5 leading-snug font-bold">{product.name}</h4>
      <p className="text-sm leading-snug text-muted-foreground">{product.format}</p>
      <div className="mt-1.5">
        <Stars rating={product.rating} />
      </div>

      <p className="mt-2.5 text-[0.8125rem] leading-tight font-bold text-success">Prix EZIMAD</p>
      <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="rounded-[2px] bg-heart px-1.5 py-0.5 text-[0.8125rem] leading-none font-bold text-white">
          -{discountPercent(product)}&nbsp;%
        </span>
        <span className="leading-none whitespace-nowrap">
          <span className="text-[1.375rem] font-bold tabular-nums sm:text-2xl">{formatNumber(product.targetPrice)}</span>
          <span className="text-sm font-bold">&nbsp;FCFA</span>
        </span>
      </p>
      <p className="mt-1.5 text-[0.8125rem] leading-snug text-muted-foreground">
        Prix du marché&nbsp;: <s className="whitespace-nowrap">{formatFcfa(product.marketPrice)}</s>
      </p>
      <p className="mt-0.5 text-[0.8125rem] leading-snug text-muted-foreground">
        Jusqu’au {OFFER_DEADLINE_LABEL} seulement
      </p>

      <p className="mt-2 text-sm leading-snug font-bold text-heart">
        {soldOut ? "Épuisé à ce prix" : `Plus que ${product.stock} en stock`}
      </p>

      <div className="mt-auto pt-3">
        {soldOut ? (
          <button type="button" className="btn-secondary min-h-10 w-full px-2 text-sm whitespace-normal" onClick={() => openWaitlist(product)}>
            Liste d’attente
          </button>
        ) : quantity > 0 ? (
          <QuantityStepper product={product} quantity={quantity} />
        ) : (
          <button
            type="button"
            className="btn-primary min-h-10 w-full px-2 text-sm"
            onClick={() => setQuantity(product.id, 1)}
          >
            Ajouter au panier
          </button>
        )}
      </div>
    </li>
  );
}
