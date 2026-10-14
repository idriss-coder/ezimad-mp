import { z } from "zod";

import { CATEGORY_IDS } from "@/data/catalog";
import { MAGZI_ZONE_IDS } from "@/data/magzi-companies";
import { normalizePhone } from "@/lib/phone";

const optionalTrimmed = (max: number) => z.string().trim().max(max).optional();

/** Schéma partagé client / serveur de l'inscription salarié (les deux étapes du dialogue). */
export const registrationSchema = z.object({
  firstName: z.string().trim().min(2, "Indiquez votre nom et prénom").max(100, "100 caractères maximum"),
  phone: z
    .string()
    .trim()
    .min(1, "Indiquez votre numéro WhatsApp")
    .refine((value) => normalizePhone(value) !== null, "Numéro invalide. Exemple : 6 70 12 34 56"),
  email: z.union([z.literal(""), z.email("Adresse email invalide").max(120)]).optional(),
  companyId: optionalTrimmed(80),
  companyName: z.string().trim().min(2, "Indiquez votre entreprise").max(120, "120 caractères maximum"),
  magziZone: z.enum(MAGZI_ZONE_IDS, { error: "Choisissez votre zone" }),
  categories: z.array(z.enum(CATEGORY_IDS)).min(1, "Cochez au moins une catégorie"),
  consent: z.boolean().refine((value) => value, "Votre accord est nécessaire pour vous inscrire"),
  /** Honeypot anti-spam : doit rester vide. */
  website: optionalTrimmed(200),
  utm: z
    .object({
      source: optionalTrimmed(100),
      medium: optionalTrimmed(100),
      campaign: optionalTrimmed(100),
    })
    .optional(),
});

export type RegistrationInput = z.input<typeof registrationSchema>;
export type RegistrationData = z.output<typeof registrationSchema>;

/** Champs validés par « Suivant » (étape 1). Les catégories et le consentement sont à l'étape 2. */
export const STEP1_FIELDS = [
  "firstName",
  "phone",
  "email",
  "companyName",
  "magziZone",
] as const satisfies readonly (keyof RegistrationInput)[];
