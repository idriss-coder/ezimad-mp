import Image from "next/image";

import { PRODUCTS } from "@/data/catalog";

import { DiscountBadge, ProductPrice } from "./product-price";

const formatter = new Intl.NumberFormat("fr-FR");

/**
 * Vitrine des produits à négocier.
 * `counts` : nombre réel d'intéressés par produit (`null` = indisponible ou chargement).
 */
export function ProductGrid({ counts }: { counts: Record<string, number> | null }) {
  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
      {PRODUCTS.map((product, index) => {
        const count = counts?.[product.id] ?? 0;
        return (
          <li key={product.id} className="flex flex-col gap-3">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-surface">
              <Image
                src={product.image}
                alt={product.imageAlt}
                fill
                sizes="(min-width: 1152px) 270px, (min-width: 1024px) 23vw, 46vw"
                loading={index < 4 ? "eager" : "lazy"}
                className="object-cover"
              />
              <DiscountBadge product={product} />
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-[0.9375rem] leading-snug font-medium">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.description}</p>
              <ProductPrice product={product} />
              <p className="min-h-5 text-sm text-brand tabular-nums">
                {count > 0 && `${formatter.format(count)} ${count > 1 ? "intéressés" : "intéressé"}`}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
