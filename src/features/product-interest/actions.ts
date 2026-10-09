"use server";

import { ObjectId } from "mongodb";
import { revalidateTag } from "next/cache";
import { z } from "zod";

import { PRODUCT_IDS, type ProductId } from "@/data/catalog";
import { COLLECTIONS, getDb } from "@/lib/db/mongo";
import { getLeadSession } from "@/lib/session";
import { PUBLIC_STATS_TAG } from "@/features/public-stats/tags";
import type { EmployeeDoc } from "@/features/registration/types";

const inputSchema = z.array(z.enum(PRODUCT_IDS)).min(1).max(PRODUCT_IDS.length);

export type InterestResult =
  | { ok: true; productInterests: ProductId[] }
  | {
      ok: false;
      error: string;
      reason: "invalid" | "no-session" | "unavailable";
    };

/** Remplace la liste complète des produits choisis (validation de l'étape 2). */
export async function saveProductInterests(productIds: ProductId[]): Promise<InterestResult> {
  const parsed = inputSchema.safeParse(productIds);
  if (!parsed.success)
    return {
      ok: false,
      reason: "invalid",
      error: "Sélectionnez au moins un produit.",
    };

  // L'identité vient uniquement du cookie signé, jamais du client.
  const leadId = await getLeadSession();
  if (!leadId || !ObjectId.isValid(leadId)) {
    return {
      ok: false,
      reason: "no-session",
      error: "Votre session a expiré. Inscrivez-vous à nouveau avec le même numéro.",
    };
  }

  try {
    const db = await getDb();
    const lead = await db.collection<EmployeeDoc>(COLLECTIONS.employees).findOneAndUpdate(
      { _id: new ObjectId(leadId) },
      {
        $set: {
          productInterests: [...new Set(parsed.data)],
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after", projection: { productInterests: 1 } },
    );

    if (!lead) {
      return {
        ok: false,
        reason: "no-session",
        error: "Inscription introuvable. Inscrivez-vous à nouveau avec le même numéro.",
      };
    }

    // Pas d'`updateTag` ici : il renverrait un nouveau rendu de la page dans la réponse,
    // ce qui remonte le parcours d'inscription (état perdu, écran de succès jamais affiché).
    // Le sélecteur ajuste déjà les compteurs localement ; le reste de la page suivra à la prochaine lecture.
    revalidateTag(PUBLIC_STATS_TAG, "max");
    return { ok: true, productInterests: lead.productInterests ?? [] };
  } catch (error) {
    console.error("[ezimad] saveProductInterests failed", (error as Error).name);
    return {
      ok: false,
      reason: "unavailable",
      error: "Enregistrement impossible pour le moment. Réessayez.",
    };
  }
}
