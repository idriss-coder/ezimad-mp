import { z } from "zod";

import { normalizePhone } from "@/lib/phone";

const optionalText = (max: number) => z.string().trim().max(max, `${max} caractères maximum`).optional();

export const partnerLeadSchema = z.object({
  company: z.string().trim().min(2, "Indiquez le nom de l'entreprise").max(120),
  contactName: z.string().trim().min(2, "Indiquez le nom du contact").max(80),
  phone: z
    .string()
    .trim()
    .min(1, "Indiquez un numéro de téléphone")
    .refine((value) => normalizePhone(value) !== null, "Numéro invalide. Exemple : 6 70 12 34 56"),
  email: z.union([z.literal(""), z.email("Adresse email invalide").max(120)]).optional(),
  products: z.string().trim().min(3, "Décrivez les produits proposés").max(1000),
  publicPrice: optionalText(200),
  monthlyCapacity: optionalText(200),
  discount: optionalText(200),
  message: optionalText(2000),
  website: optionalText(200),
});

export type PartnerLeadInput = z.input<typeof partnerLeadSchema>;
