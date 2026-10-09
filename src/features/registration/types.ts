import type { ObjectId } from "mongodb";

import type { CategoryId, ProductId } from "@/data/catalog";

export type EmployeeDoc = {
  _id: ObjectId;
  firstName: string;
  phone: string;
  email?: string;
  companyId: string | null;
  companyName: string;
  magziZone: string;
  categories: CategoryId[];
  productInterests: ProductId[];
  consentAt: Date;
  source?: { utmSource?: string; utmMedium?: string; utmCampaign?: string };
  createdAt: Date;
  updatedAt: Date;
};

export type CurrentLead = {
  firstName: string;
  productInterests: ProductId[];
};
