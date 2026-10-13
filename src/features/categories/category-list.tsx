import { HeartIcon } from "lucide-react";
import Image from "next/image";

import { CATEGORIES } from "@/data/catalog";

const formatter = new Intl.NumberFormat("fr-FR");

/**
 * Liste des catégories en colonne, comme une page de résultats Amazon :
 * vignette, titre, produits de la catégorie, puis cœur rouge + nombre réel d'intéressés.
 * `counts` : `undefined` = chargement, `null` = base indisponible.
 */
export function CategoryList({ counts }: { counts: Record<string, number> | null | undefined }) {
  return (
    <ul className="divide-y divide-border">
      {CATEGORIES.map((category, index) => {
        const count = counts?.[category.id] ?? 0;
        return (
          <li key={category.id} className="flex gap-4 py-5 sm:gap-6">
            <Image
              src={category.image}
              alt={category.imageAlt}
              width={160}
              height={160}
              sizes="(min-width: 640px) 160px, 96px"
              loading={index < 2 ? "eager" : "lazy"}
              className="size-24 shrink-0 border border-border object-cover sm:size-40"
            />
            <div className="flex min-w-0 flex-col gap-1 sm:pt-1">
              <h3 className="text-lg leading-snug font-bold sm:text-xl">
                {index + 1}. {category.title}
              </h3>
              <p className="leading-snug sm:text-lg">{category.products}</p>
              <p className="mt-1 flex items-center gap-1.5">
                <HeartIcon className="size-5 shrink-0 fill-heart text-heart" aria-hidden />
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
            </div>
          </li>
        );
      })}
    </ul>
  );
}
