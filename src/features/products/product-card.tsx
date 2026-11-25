"use client";

import { savingsOf, unitPriceOf, type Product } from "@/data/catalog";
import { formatFcfa, formatNumber } from "@/lib/format";
import { setQuantity, useCartItems } from "@/features/cart/cart-store";
import { QuantityStepper } from "@/features/cart/quantity-stepper";

import { ProductPhoto } from "./product-photo";

/**
 * Fiche produit réduite à l'essentiel (demande client) : photo, nom, contenu du pack, prix du marché barré,
 * prix Ezimarket (avec le prix à l'unité) et économie, puis « Ajouter au panier » (qui devient un sélecteur de quantité).
 */
export function ProductCard({ product, eager }: { product: Product; eager: boolean }) {
  const quantity = useCartItems()[product.id] ?? 0;

  return (
    <li className="flex flex-col border border-border bg-white p-2 sm:p-3">
      <div className="relative">
        <ProductPhoto
          product={product}
          size={480}
          sizes="(min-width: 1024px) 200px, (min-width: 640px) 30vw, 46vw"
          eager={eager}
          className="aspect-square w-full"
        />
        {product.illustration && (
          <span className="absolute bottom-0 left-0 bg-white/90 px-1.5 py-0.5 text-[0.6875rem] leading-tight text-muted-foreground">
            Photo d’illustration
          </span>
        )}
      </div>
      <h3 className="mt-2.5 leading-snug font-bold">{product.name}</h3>
      <p className="text-sm leading-snug text-muted-foreground">{product.format}</p>

      {/* Les prix restent groupés en bas de la fiche : ils s'alignent d'une fiche à l'autre. */}
      <div className="mt-auto pt-3">
        <p className="text-[0.8125rem] leading-snug text-muted-foreground">
          Prix du marché&nbsp;: <s className="whitespace-nowrap">{formatFcfa(product.marketPrice)}</s>
        </p>
        <p className="mt-2 text-[0.8125rem] leading-tight font-bold text-success">Prix Ezimarket</p>
        <p className="mt-0.5 leading-none whitespace-nowrap">
          <span className="text-2xl font-bold tabular-nums">{formatNumber(product.targetPrice)}</span>
          <span className="text-sm font-bold">&nbsp;FCFA</span>
        </p>
        <p className="mt-1 text-[0.8125rem] leading-snug whitespace-nowrap text-muted-foreground">
          {formatFcfa(unitPriceOf(product))} / {product.unit}
        </p>
        <p className="mt-2.5 rounded-[2px] bg-savings px-1.5 py-1 text-center text-[0.8125rem] leading-tight font-bold text-white">
          Vous économisez <span className="whitespace-nowrap">{formatFcfa(savingsOf(product))}</span>
        </p>

        <div className="mt-3">
          {quantity > 0 ? (
            <QuantityStepper product={product} quantity={quantity} />
          ) : (
            <button type="button" className="btn-primary min-h-10 w-full px-2 text-sm" onClick={() => setQuantity(product.id, 1)}>
              Ajouter au panier
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
