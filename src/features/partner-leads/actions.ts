"use server";

import { COLLECTIONS, getDb } from "@/lib/db/mongo";
import { normalizePhone } from "@/lib/phone";

import { partnerLeadSchema, type PartnerLeadInput } from "./schema";

export type PartnerLeadResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Partial<Record<keyof PartnerLeadInput, string>> };

export async function submitPartnerLead(input: PartnerLeadInput): Promise<PartnerLeadResult> {
  const parsed = partnerLeadSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof PartnerLeadInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof PartnerLeadInput;
      fieldErrors[key] ??= issue.message;
    }
    return { ok: false, error: "Vérifiez les champs signalés.", fieldErrors };
  }

  const { website, email, ...data } = parsed.data;
  if (website) return { ok: true };

  const optional = (value?: string) => (value ? value : undefined);

  try {
    const db = await getDb();
    await db.collection(COLLECTIONS.partnerLeads).insertOne({
      company: data.company,
      contactName: data.contactName,
      phone: normalizePhone(data.phone),
      email: optional(email?.toLowerCase()),
      products: data.products,
      publicPrice: optional(data.publicPrice),
      monthlyCapacity: optional(data.monthlyCapacity),
      discount: optional(data.discount),
      message: optional(data.message),
      createdAt: new Date(),
    }, { ignoreUndefined: true });
    return { ok: true };
  } catch (error) {
    console.error("[ezimad] submitPartnerLead failed", (error as Error).name);
    return { ok: false, error: "Le service est momentanément indisponible. Réessayez dans un instant." };
  }
}
