import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Cookie signé HMAC qui associe le navigateur au salarié inscrit.
 * L'étape « intérêts produits » ne fait confiance qu'à ce cookie.
 */
const COOKIE_NAME = "ezimad_lead";
const MAX_AGE = 60 * 60 * 24 * 180;

function secret() {
  const value = process.env.EZIMAD_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("EZIMAD_SESSION_SECRET manquant ou trop court (32+ caractères)");
  return value;
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export async function setLeadSession(leadId: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, `${leadId}.${sign(leadId)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function getLeadSession(): Promise<string | null> {
  const raw = (await cookies()).get(COOKIE_NAME)?.value;
  if (!raw) return null;
  const [id, signature] = raw.split(".");
  if (!id || !signature) return null;
  const expected = Buffer.from(sign(id));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;
  return id;
}
