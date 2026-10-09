import { COMMUNITY_GOAL } from "@/data/catalog";

const formatter = new Intl.NumberFormat("fr-FR");

/**
 * Compteur public d'inscrits et jauge vers l'objectif.
 * Les valeurs viennent toujours de la base : `null` = base indisponible, `undefined` = chargement.
 */
export function ProgressBoard({ total }: { total: number | null | undefined }) {
  const loading = total === undefined;
  const known = typeof total === "number";
  const value = known ? total : 0;
  const reached = value >= COMMUNITY_GOAL;
  const ratio = Math.min(value / COMMUNITY_GOAL, 1);

  return (
    <section
      aria-label="Inscriptions"
      aria-busy={loading || undefined}
      className="flex flex-col justify-between gap-12 rounded-xl bg-brand-ink p-6 text-white sm:p-9 lg:min-h-[28rem]"
    >
      <p className="text-[0.9375rem] text-white/70">Salariés inscrits</p>

      <div>
        <p className="text-[clamp(4.5rem,12vw,7rem)] leading-[0.9] font-medium tracking-[-0.035em] tabular-nums">
          {loading ? <span className="text-white/30">0</span> : known ? formatter.format(value) : "—"}
        </p>
        <p className="mt-3 text-[0.9375rem] text-white/70">
          {loading
            ? "Chargement…"
            : !known
              ? "Compteur momentanément indisponible"
              : `sur ${formatter.format(COMMUNITY_GOAL)}`}
        </p>
      </div>

      <div>
        <div
          role="meter"
          aria-label="Inscrits par rapport à l’objectif"
          aria-valuemin={0}
          aria-valuemax={COMMUNITY_GOAL}
          aria-valuenow={value}
          aria-valuetext={known ? `${formatter.format(value)} inscrits sur ${formatter.format(COMMUNITY_GOAL)}` : "Indisponible"}
          className="h-2 overflow-hidden rounded-full bg-white/15"
        >
          {known && value > 0 && (
            <div className="meter-fill h-full rounded-full bg-white" style={{ width: `max(${ratio * 100}%, 0.5rem)` }} />
          )}
        </div>
        <p className="mt-3 flex justify-between gap-4 text-sm text-white/70 tabular-nums">
          <span>
            {reached
              ? "Objectif atteint : les premières offres arrivent."
              : `À ${formatter.format(COMMUNITY_GOAL)} inscrits, nous lançons les premières offres.`}
          </span>
          <span className="shrink-0">{Math.round(ratio * 100)}&nbsp;%</span>
        </p>
      </div>
    </section>
  );
}
