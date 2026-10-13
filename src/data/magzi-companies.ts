/**
 * Source unique des zones et entreprises MAGZI.
 *
 * ⚠️ La liste officielle des entreprises n'a pas encore été fournie.
 * Remplacer `MAGZI_COMPANIES` par la liste validée (id stable + nom + zone).
 * Les entrées `temporary: true` servent uniquement à tester l'UI et sont
 * masquées en production. Le salarié peut toujours saisir son entreprise librement.
 */

export type MagziZone = {
  id: string;
  label: string;
};

/** Les deux zones MAGZI couvertes. */
export const MAGZI_ZONES = [
  { id: "douala-bassa", label: "Bassa" },
  { id: "douala-bonaberi", label: "Bonabéri" },
] as const satisfies readonly MagziZone[];

export type MagziZoneId = (typeof MAGZI_ZONES)[number]["id"];

export const MAGZI_ZONE_IDS = MAGZI_ZONES.map((z) => z.id) as [MagziZoneId, ...MagziZoneId[]];

export type MagziCompany = {
  id: string;
  name: string;
  zoneId: MagziZoneId;
  temporary?: boolean;
};

const ALL_COMPANIES: MagziCompany[] = [
  { id: "tmp-entreprise-1", name: "Entreprise test 1 (temporaire)", zoneId: "douala-bassa", temporary: true },
  { id: "tmp-entreprise-2", name: "Entreprise test 2 (temporaire)", zoneId: "douala-bonaberi", temporary: true },
];

export const MAGZI_COMPANIES: MagziCompany[] =
  process.env.NODE_ENV === "production" ? ALL_COMPANIES.filter((c) => !c.temporary) : ALL_COMPANIES;

export function findCompany(id: string | undefined) {
  return id ? MAGZI_COMPANIES.find((c) => c.id === id) : undefined;
}

export function zoneLabel(id: string) {
  return MAGZI_ZONES.find((z) => z.id === id)?.label ?? id;
}
