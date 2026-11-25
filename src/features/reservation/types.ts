import type { ObjectId } from "mongodb";

export type ReservationItem = {
  productId: string;
  name: string;
  format: string;
  quantity: number;
  /** Prix Ezimarket d’un pack au moment de la réservation (FCFA) ; `null` : prix à confirmer. */
  unitPrice: number | null;
  marketPrice: number | null;
};

export type ReservationDoc = {
  _id: ObjectId;
  fullName: string;
  phone: string;
  companyId: string | null;
  companyName: string;
  magziZone: string;
  items: ReservationItem[];
  /** Total au prix Ezimarket (FCFA). Rien n'est payé à la réservation. Hors produits au prix à confirmer. */
  total: number;
  /** Réponse libre « quels autres produits vous intéresseraient ? », posée après la réservation. */
  otherProducts?: string;
  status: "pending";
  consentAt: Date;
  source?: { utmSource?: string; utmMedium?: string; utmCampaign?: string };
  createdAt: Date;
  updatedAt: Date;
};

export type ProductRequestDoc = {
  _id: ObjectId;
  /** Produits souhaités, saisis librement. */
  products: string;
  fullName: string;
  phone: string;
  consentAt: Date;
  createdAt: Date;
};
