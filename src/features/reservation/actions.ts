"use server";

import { MongoServerError, ObjectId } from "mongodb";
import type { z } from "zod";

import { findCompany } from "@/data/magzi-companies";
import { findProduct, MAX_QUANTITY } from "@/data/catalog";
import { COLLECTIONS, getDb } from "@/lib/db/mongo";
import { normalizePhone } from "@/lib/phone";

import {
  otherProductsSchema,
  productRequestSchema,
  reservationItemsSchema,
  reservationSchema,
  utmSchema,
  type ProductRequestInput,
  type ReservationInput,
  type ReservationItemInput,
} from "./schema";
import type { ProductRequestDoc, ReservationDoc, ReservationItem } from "./types";

type FieldErrors<T> = Partial<Record<keyof T, string>>;
type Failure<T> = { ok: false; error: string; fieldErrors?: FieldErrors<T> };

export type ReserveResult =
  | { ok: true; reservationId: string; fullName: string; phone: string; count: number; total: number }
  | Failure<ReservationInput>;

export type ProductRequestResult = { ok: true; fullName: string } | Failure<ProductRequestInput>;

export type OtherProductsResult = { ok: true } | { ok: false; error: string };

const UNAVAILABLE = "Le service est momentanément indisponible. Réessayez dans un instant.";

function fieldErrorsOf<T>(error: z.ZodError): FieldErrors<T> {
  const fieldErrors: FieldErrors<T> = {};
  for (const issue of error.issues) fieldErrors[issue.path[0] as keyof T] ??= issue.message;
  return fieldErrors;
}

function logFailure(action: string, error: unknown) {
  console.error(`[ezimarket] ${action} failed`, error instanceof MongoServerError ? error.code : (error as Error).name);
}

/**
 * Enregistre une réservation : coordonnées + contenu du panier. Aucun paiement n'est demandé ;
 * l'équipe recontacte la personne sur WhatsApp. Les prix viennent du catalogue, jamais du client.
 */
export async function reserve(
  input: ReservationInput,
  cart: ReservationItemInput[],
  utm?: z.input<typeof utmSchema>,
): Promise<ReserveResult> {
  const parsed = reservationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Vérifiez les champs signalés.", fieldErrors: fieldErrorsOf(parsed.error) };
  }
  const parsedCart = reservationItemsSchema.safeParse(cart);
  if (!parsedCart.success) return { ok: false, error: "Votre panier est vide." };

  const data = parsed.data;
  const items: ReservationItem[] = [];
  for (const { productId, quantity } of parsedCart.data) {
    const product = findProduct(productId);
    if (!product || quantity > MAX_QUANTITY) {
      return { ok: false, error: "Un produit de votre panier n’est plus disponible dans cette quantité. Vérifiez votre panier." };
    }
    items.push({
      productId: product.id,
      name: product.name,
      format: product.format,
      quantity,
      unitPrice: product.targetPrice,
      marketPrice: product.marketPrice,
    });
  }
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const phone = normalizePhone(data.phone)!;
  // Honeypot rempli : on simule un succès sans rien écrire.
  if (data.website) return { ok: true, reservationId: new ObjectId().toHexString(), fullName: data.fullName, phone, count, total };

  const company = findCompany(data.companyId);
  const parsedUtm = utmSchema.safeParse(utm);
  const source =
    parsedUtm.success && parsedUtm.data
      ? { utmSource: parsedUtm.data.source, utmMedium: parsedUtm.data.medium, utmCampaign: parsedUtm.data.campaign }
      : undefined;
  const now = new Date();

  try {
    const reservations = (await getDb()).collection<Omit<ReservationDoc, "_id">>(COLLECTIONS.reservations);
    const { insertedId } = await reservations.insertOne(
      {
        fullName: data.fullName,
        phone,
        companyId: company?.id ?? null,
        companyName: company?.name ?? data.companyName,
        magziZone: company?.zoneId ?? data.magziZone,
        items,
        total,
        status: "pending",
        consentAt: now,
        source,
        createdAt: now,
        updatedAt: now,
      },
      { ignoreUndefined: true },
    );
    return { ok: true, reservationId: insertedId.toHexString(), fullName: data.fullName, phone, count, total };
  } catch (error) {
    logFailure("reserve", error);
    return { ok: false, error: UNAVAILABLE };
  }
}

/** Réponse libre posée juste après la réservation : « Quels autres produits vous intéresseraient ? ». */
export async function saveOtherProducts(reservationId: string, text: string): Promise<OtherProductsResult> {
  const parsed = otherProductsSchema.safeParse(text);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  if (!ObjectId.isValid(reservationId)) return { ok: false, error: UNAVAILABLE };

  try {
    const reservations = (await getDb()).collection<ReservationDoc>(COLLECTIONS.reservations);
    await reservations.updateOne(
      { _id: new ObjectId(reservationId) },
      { $set: { otherProducts: parsed.data, updatedAt: new Date() } },
    );
    return { ok: true };
  } catch (error) {
    logFailure("saveOtherProducts", error);
    return { ok: false, error: UNAVAILABLE };
  }
}

/** « Vous ne trouvez pas ce que vous voulez ? » : produits souhaités + coordonnées. */
export async function requestProducts(input: ProductRequestInput): Promise<ProductRequestResult> {
  const parsed = productRequestSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Vérifiez les champs signalés.", fieldErrors: fieldErrorsOf(parsed.error) };
  }
  const data = parsed.data;
  if (data.website) return { ok: true, fullName: data.fullName };

  const now = new Date();
  try {
    const requests = (await getDb()).collection<Omit<ProductRequestDoc, "_id">>(COLLECTIONS.productRequests);
    await requests.insertOne({
      products: data.products,
      fullName: data.fullName,
      phone: normalizePhone(data.phone)!,
      consentAt: now,
      createdAt: now,
    });
    return { ok: true, fullName: data.fullName };
  } catch (error) {
    logFailure("requestProducts", error);
    return { ok: false, error: UNAVAILABLE };
  }
}
