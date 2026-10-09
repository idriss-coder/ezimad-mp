"use server";

import { MongoServerError, type ObjectId } from "mongodb";
import { updateTag } from "next/cache";

import type { ProductId } from "@/data/catalog";
import { findCompany } from "@/data/magzi-companies";
import { COLLECTIONS, getDb } from "@/lib/db/mongo";
import { normalizePhone } from "@/lib/phone";
import { setLeadSession } from "@/lib/session";
import { PUBLIC_STATS_TAG } from "@/features/public-stats/tags";

import { registrationSchema, type RegistrationInput } from "./schema";
import type { EmployeeDoc } from "./types";

export type RegisterResult =
  | { ok: true; status: "created" | "updated"; firstName: string; productInterests: ProductId[] }
  | { ok: false; error: string; fieldErrors?: Partial<Record<keyof RegistrationInput, string>> };

export async function registerEmployee(input: RegistrationInput): Promise<RegisterResult> {
  const parsed = registrationSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof RegistrationInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof RegistrationInput;
      fieldErrors[key] ??= issue.message;
    }
    return { ok: false, error: "Vérifiez les champs signalés.", fieldErrors };
  }

  const data = parsed.data;
  // Honeypot rempli : on simule un succès sans rien écrire.
  if (data.website) {
    return { ok: true, status: "created", firstName: data.firstName, productInterests: [] };
  }

  const phone = normalizePhone(data.phone)!;
  const company = findCompany(data.companyId);
  const now = new Date();

  const set: Partial<EmployeeDoc> = {
    firstName: data.firstName,
    companyId: company?.id ?? null,
    companyName: company?.name ?? data.companyName,
    magziZone: company?.zoneId ?? data.magziZone,
    updatedAt: now,
  };
  // Un email vide ne doit pas effacer un email déjà connu.
  if (data.email) set.email = data.email.toLowerCase();

  const source = data.utm
    ? { utmSource: data.utm.source, utmMedium: data.utm.medium, utmCampaign: data.utm.campaign }
    : undefined;

  try {
    const db = await getDb();
    const employees = db.collection<EmployeeDoc>(COLLECTIONS.employees);

    const upsert = () =>
      employees.updateOne(
        { phone },
        {
          $set: set,
          $addToSet: { categories: { $each: data.categories } },
          $setOnInsert: { productInterests: [], consentAt: now, createdAt: now, ...(source && { source }) },
        },
        { upsert: true, ignoreUndefined: true },
      );

    let result;
    try {
      result = await upsert();
    } catch (error) {
      // Deux soumissions simultanées du même numéro : la seconde devient une mise à jour.
      if (error instanceof MongoServerError && error.code === 11000) result = await upsert();
      else throw error;
    }

    const lead = await employees.findOne({ phone }, { projection: { _id: 1, productInterests: 1 } });
    if (!lead) throw new Error("lead introuvable après upsert");

    await setLeadSession((lead._id as ObjectId).toHexString());
    updateTag(PUBLIC_STATS_TAG);

    return {
      ok: true,
      status: result.upsertedCount > 0 ? "created" : "updated",
      firstName: data.firstName,
      productInterests: lead.productInterests ?? [],
    };
  } catch (error) {
    console.error("[ezimad] registerEmployee failed", error instanceof MongoServerError ? error.code : (error as Error).name);
    return { ok: false, error: "Le service est momentanément indisponible. Réessayez dans un instant." };
  }
}
