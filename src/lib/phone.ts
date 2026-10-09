import { parsePhoneNumberFromString } from "libphonenumber-js/min";

/** Normalise un numéro (camerounais par défaut) en E.164, ou `null` s'il est invalide. */
export function normalizePhone(input: string): string | null {
  const parsed = parsePhoneNumberFromString(input.trim(), "CM");
  return parsed?.isValid() ? parsed.number : null;
}
