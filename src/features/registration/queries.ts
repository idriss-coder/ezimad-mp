import { ObjectId } from "mongodb";

import { COLLECTIONS, getDb } from "@/lib/db/mongo";
import { getLeadSession } from "@/lib/session";

import type { CurrentLead, EmployeeDoc } from "./types";

/** Salarié associé au cookie de session, ou `null`. */
export async function getCurrentLead(): Promise<CurrentLead | null> {
  const id = await getLeadSession();
  if (!id || !ObjectId.isValid(id)) return null;
  try {
    const db = await getDb();
    const lead = await db
      .collection<EmployeeDoc>(COLLECTIONS.employees)
      .findOne({ _id: new ObjectId(id) }, { projection: { firstName: 1, productInterests: 1 } });
    return lead ? { firstName: lead.firstName, productInterests: lead.productInterests ?? [] } : null;
  } catch {
    return null;
  }
}
