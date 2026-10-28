import type { ObjectId } from "mongodb";

export type ReservationItem = {
  productId: string;
  name: string;
  format: string;
  quantity: number;
  /** Prix EZIMAD unitaire au moment de la réservation (FCFA). */
  unitPrice: number;
  marketPrice: number;
};

export type ReservationDoc = {
  _id: ObjectId;
  fullName: string;
  phone: string;
  companyId: string | null;
  companyName: string;
  magziZone: string;
  items: ReservationItem[];
  /** Total au prix EZIMAD (FCFA). Rien n'est payé à la réservation. */
  total: number;
  /** Réponse libre « quels autres produits vous intéresseraient ? », posée après la réservation. */
  otherProducts?: string;
  status: "pending";
  consentAt: Date;
  source?: { utmSource?: string; utmMedium?: string; utmCampaign?: string };
  createdAt: Date;
  updatedAt: Date;
};

export type WaitlistDoc = {
  _id: ObjectId;
  productId: string;
  productName: string;
  fullName: string;
  phone: string;
  consentAt: Date;
  createdAt: Date;
  updatedAt: Date;
};
