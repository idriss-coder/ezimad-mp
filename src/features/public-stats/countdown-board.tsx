import { cn } from "cn";

const formatter = new Intl.NumberFormat("fr-FR");

/** 4 positions comme un afficheur : 124 → « 0124 ». */
const digits = (value: number) => String(value).padStart(4, "0");

/**
 * Compteur des inscrits, à la manière des pages « bientôt disponible » : un seul gros nombre rouge.
 * La valeur vient toujours de la base : `null` = base indisponible, `undefined` = chargement.
 */
export function CountdownBoard({ total }: { total: number | null | undefined }) {
  const loading = total === undefined;
  const known = typeof total === "number";

  return (
    <div aria-busy={loading || undefined}>
      <p className="sr-only">
        {loading
          ? "Chargement du compteur."
          : known
            ? `${formatter.format(total)} salariés inscrits.`
            : "Compteur momentanément indisponible."}
      </p>
      <div aria-hidden className="flex flex-col items-center">
        <span
          className={cn(
            "text-[clamp(3.25rem,14vw,5.5rem)] leading-[0.95] font-bold tabular-nums",
            known ? "text-heart" : "text-border",
          )}
        >
          {known ? digits(total) : "----"}
        </span>
        <span className="mt-2 text-xs font-bold tracking-[0.12em] uppercase">Inscrits</span>
      </div>
      {!known && !loading && <p className="mt-3 text-sm text-muted-foreground">Compteur momentanément indisponible.</p>}
    </div>
  );
}
