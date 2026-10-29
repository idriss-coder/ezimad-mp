import { z } from "zod";

import { MAGZI_ZONE_IDS } from "@/data/magzi-companies";
import { normalizePhone } from "@/lib/phone";

const optionalTrimmed = (max: number) => z.string().trim().max(max).optional();

/** Champs communs à la réservation et à la liste d'attente. */
const contactFields = {
  fullName: z.string().trim().min(2, "Indiquez votre nom et prénom").max(100, "100 caractères maximum"),
  phone: z
    .string()
    .trim()
    .min(1, "Indiquez votre numéro WhatsApp")
    .refine((value) => normalizePhone(value) !== null, "Numéro invalide. Exemple : 6 70 12 34 56"),
  consent: z.boolean().refine((value) => value, "Votre accord est nécessaire pour continuer"),
  /** Honeypot anti-spam : doit rester vide. */
  website: optionalTrimmed(200),
};

/** Coordonnées saisies dans le dialogue du panier, après « Réserver ». */
export const reservationSchema = z.object({
  ...contactFields,
  companyId: optionalTrimmed(80),
  companyName: z.string().trim().min(2, "Indiquez votre entreprise").max(120, "120 caractères maximum"),
  magziZone: z.enum(MAGZI_ZONE_IDS, { error: "Choisissez votre zone" }),
});

export type ReservationInput = z.input<typeof reservationSchema>;
export type ReservationData = z.output<typeof reservationSchema>;

/** Panier envoyé au serveur : les prix sont recalculés côté serveur à partir du catalogue. */
export const reservationItemsSchema = z
  .array(z.object({ productId: z.string().max(80), quantity: z.number().int().min(1) }))
  .min(1, "Votre panier est vide")
  .max(50);

export type ReservationItemInput = z.input<typeof reservationItemsSchema>[number];

export const utmSchema = z
  .object({
    source: optionalTrimmed(100),
    medium: optionalTrimmed(100),
    campaign: optionalTrimmed(100),
  })
  .optional();

export const otherProductsSchema = z.string().trim().min(2, "Indiquez au moins un produit").max(1000, "1 000 caractères maximum");

/** Inscription sur la liste d'attente d'un produit épuisé. */
export const waitlistSchema = z.object(contactFields);

export type WaitlistInput = z.input<typeof waitlistSchema>;
export type WaitlistData = z.output<typeof waitlistSchema>;

/** Demande d'autres produits à prix réduit, en bas de la liste : produits souhaités puis coordonnées. */
export const productRequestSchema = z.object({ products: otherProductsSchema, ...contactFields });

export type ProductRequestInput = z.input<typeof productRequestSchema>;
export type ProductRequestData = z.output<typeof productRequestSchema>;
