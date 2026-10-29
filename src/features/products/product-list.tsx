import { PRODUCTS } from "@/data/catalog";

import { ProductCard } from "./product-card";

/** Produits du quotidien en une seule grille, comme une page de résultats Amazon (voir `ProductCard`). */
export function ProductList() {
  return (
    <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {PRODUCTS.map((product, index) => (
        <ProductCard key={product.id} product={product} eager={index < 4} />
      ))}
    </ul>
  );
}
