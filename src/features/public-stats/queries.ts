import { cacheLife, cacheTag } from "next/cache";

import { COLLECTIONS, getDb } from "@/lib/db/mongo";

import { PUBLIC_STATS_TAG } from "./tags";

export type PublicStats = {
  totalEmployees: number;
  /** Nombre d'inscrits intéressés par catégorie (les cœurs de la liste). */
  interestsByCategory: Record<string, number>;
};

/**
 * Statistiques publiques calculées sur les données réelles.
 * Retourne `null` si la base est indisponible : l'UI n'affiche alors aucun chiffre.
 */
export async function getPublicStats(): Promise<PublicStats | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(PUBLIC_STATS_TAG);

  try {
    const employees = (await getDb()).collection(COLLECTIONS.employees);
    const [totalEmployees, interests] = await Promise.all([
      employees.countDocuments(),
      employees
        .aggregate<{ _id: string; count: number }>([
          { $unwind: "$categories" },
          { $group: { _id: "$categories", count: { $sum: 1 } } },
        ])
        .toArray(),
    ]);
    return {
      totalEmployees,
      interestsByCategory: Object.fromEntries(interests.map((row) => [row._id, row.count])),
    };
  } catch (error) {
    console.error("[ezimad] getPublicStats failed", (error as Error).name);
    return null;
  }
}
