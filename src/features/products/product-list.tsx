import { CATEGORIES, PRODUCTS } from "@/data/catalog";

import { ProductCard } from "./product-card";

/**
 * Produits du quotidien en grille, comme une page de résultats Amazon : une rubrique par catégorie,
 * puis les fiches produits (voir `ProductCard`).
 */
export function ProductList() {
  const sections = CATEGORIES.map((category) => ({
    category,
    products: PRODUCTS.filter((product) => product.categoryId === category.id),
  })).filter((section) => section.products.length > 0);

  return (
    <div className="flex flex-col gap-9">
      {sections.map(({ category, products }) => (
        <section key={category.id} aria-labelledby={`rubrique-${category.id}`}>
          <h3
            id={`rubrique-${category.id}`}
            className="border-b border-border pb-1.5 text-lg leading-snug font-bold sm:text-xl"
          >
            {category.title}
          </h3>
          <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} eager={PRODUCTS.indexOf(product) < 4} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
