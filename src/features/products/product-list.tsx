import { HeartIcon } from "lucide-react";
import Image from "next/image";

import { CATEGORIES, PRODUCTS, type Product } from "@/data/catalog";
import { SignupButton } from "@/features/registration/signup-button";

const formatter = new Intl.NumberFormat("fr-FR");

/** `undefined` = chargement, `null` = base indisponible. */
type Counts = Record<string, number> | null | undefined;

/**
 * Produits du quotidien en grille, comme une page de résultats Amazon : une rubrique par catégorie
 * (titre + cœur rouge et nombre réel d'intéressés), puis des fiches vignette, prix EZIMAD estimé,
 * prix du marché barré et bouton orange qui ouvre l'inscription.
 */
export function ProductList({ counts }: { counts: Counts }) {
  const sections = CATEGORIES.map((category) => ({
    category,
    products: PRODUCTS.filter((product) => product.categoryId === category.id),
  })).filter((section) => section.products.length > 0);

  return (
    <div className="flex flex-col gap-9">
      {sections.map(({ category, products }) => (
        <section key={category.id} aria-labelledby={`rubrique-${category.id}`}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border pb-1.5">
            <h3 id={`rubrique-${category.id}`} className="text-lg leading-snug font-bold sm:text-xl">
              {category.title}
            </h3>
            <InterestCount counts={counts} categoryId={category.id} />
          </div>
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

function ProductCard({ product, eager }: { product: Product; eager: boolean }) {
  const discount = Math.round((1 - product.targetPrice / product.marketPrice) * 100);

  return (
    <li className="flex flex-col border border-border bg-white p-2 sm:p-3">
      <Image
        src={product.image}
        alt={product.imageAlt}
        width={480}
        height={480}
        sizes="(min-width: 1024px) 200px, (min-width: 640px) 30vw, 46vw"
        loading={eager ? "eager" : "lazy"}
        className="aspect-square w-full object-cover"
      />
      <h4 className="mt-2.5 leading-snug font-bold">{product.name}</h4>
      <p className="text-sm leading-snug text-muted-foreground">{product.format}</p>

      <p className="mt-2.5 text-[0.8125rem] leading-tight font-bold text-success">Prix EZIMAD estimé</p>
      <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="rounded-[2px] bg-heart px-1.5 py-0.5 text-[0.8125rem] leading-none font-bold text-white">
          -{discount}&nbsp;%
        </span>
        <span className="leading-none whitespace-nowrap">
          <span className="text-[1.375rem] font-bold tabular-nums sm:text-2xl">
            {formatter.format(product.targetPrice)}
          </span>
          <span className="text-sm font-bold">&nbsp;FCFA</span>
        </span>
      </p>
      <p className="mt-1.5 text-[0.8125rem] leading-snug text-muted-foreground">
        Prix du marché&nbsp;: <s className="whitespace-nowrap">{formatter.format(product.marketPrice)}&nbsp;FCFA</s>
      </p>

      <div className="mt-auto pt-3">
        <SignupButton variant="buy" className="min-h-10 w-full px-2 text-sm">
          Je veux ce prix
        </SignupButton>
      </div>
    </li>
  );
}

function InterestCount({ counts, categoryId }: { counts: Counts; categoryId: string }) {
  const count = counts?.[categoryId] ?? 0;
  return (
    <p className="flex shrink-0 items-center gap-1.5 text-sm sm:text-base">
      <HeartIcon className="size-[1.125rem] shrink-0 fill-heart text-heart" aria-hidden />
      {counts === undefined ? (
        <span className="text-muted-foreground">…</span>
      ) : counts === null ? (
        <span className="text-muted-foreground">—</span>
      ) : (
        <span>
          <strong className="tabular-nums">{formatter.format(count)}</strong>{" "}
          {count > 1 ? "personnes intéressées" : "personne intéressée"}
        </span>
      )}
    </p>
  );
}
