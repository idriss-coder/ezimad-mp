import { cn } from "cn";
import Image from "next/image";

import type { Product } from "@/data/catalog";

type Props = {
  product: Product;
  /** Côté de l'image en pixels, pour `next/image`. */
  size: number;
  sizes?: string;
  eager?: boolean;
  /** Image purement décorative : le nom du produit est déjà écrit à côté. */
  decorative?: boolean;
  className?: string;
};

/** Photo carrée du produit. */
export function ProductPhoto({ product, size, sizes, eager = false, decorative = false, className }: Props) {
  return (
    <Image
      src={product.image}
      alt={decorative ? "" : product.imageAlt}
      width={size}
      height={size}
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      className={cn("object-cover", className)}
    />
  );
}
