import { discountPercent, type CatalogProduct } from "@/data/catalog";

const fcfa = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XAF", maximumFractionDigits: 0 });

type Priced = Pick<CatalogProduct, "publicPrice" | "memberPrice" | "unit">;

/** Prix public barré + prix salarié. N'affiche rien tant que les deux prix réels ne sont pas connus. */
export function ProductPrice({ product }: { product: Priced }) {
  const { publicPrice, memberPrice, unit } = product;
  if (publicPrice === null || memberPrice === null) return null;
  return (
    <p className="flex flex-wrap items-baseline gap-x-2 text-sm tabular-nums">
      <span className="sr-only">Prix public :</span>
      <s className="text-muted-foreground">{fcfa.format(publicPrice)}</s>
      <span className="sr-only">Prix salarié :</span>
      <span className="font-medium">{fcfa.format(memberPrice)}</span>
      {unit && <span className="text-muted-foreground">/ {unit}</span>}
    </p>
  );
}

/** Pastille de remise posée sur la photo, comme une étiquette de rayon. */
export function DiscountBadge({ product }: { product: Pick<CatalogProduct, "publicPrice" | "memberPrice"> }) {
  const percent = discountPercent(product);
  if (percent === null) return null;
  return (
    <span className="absolute bottom-2.5 left-2.5 rounded-full bg-foreground px-2.5 py-1 text-xs font-medium text-white tabular-nums">
      −{percent} %
    </span>
  );
}
