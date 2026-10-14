import { cn } from "cn";

import { COMMUNITY_GOAL } from "@/data/catalog";

const formatter = new Intl.NumberFormat("fr-FR");

/** 4 positions comme un afficheur : 124 → « 0124 ». */
const digits = (value: number) => String(value).padStart(4, "0");

/**
 * Compteur des inscrits, à la manière des pages « bientôt disponible » : nombre d'inscrits / total attendu.
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
            ? `${formatter.format(total)} salariés inscrits sur ${formatter.format(COMMUNITY_GOAL)} attendus.`
            : "Compteur momentanément indisponible."}
      </p>
      <div aria-hidden className="flex flex-col items-center">
        <p className="flex items-baseline gap-2 font-bold tabular-nums sm:gap-3">
          <span
            className={cn(
              "text-[clamp(3.25rem,14vw,5.5rem)] leading-[0.95]",
              known ? "text-heart" : "text-border",
            )}
          >
            {known ? digits(total) : "----"}
          </span>
          <span className="text-[clamp(1.5rem,6vw,2.5rem)] leading-none text-muted-foreground">
            /&nbsp;{digits(COMMUNITY_GOAL)}
          </span>
        </p>
        <span className="mt-2 text-xs font-bold tracking-[0.12em] uppercase">Inscrits / attendus</span>
      </div>
      {!known && !loading && <p className="mt-3 text-sm text-muted-foreground">Compteur momentanément indisponible.</p>}
    </div>
  );
}

/**
 * Courbes de niveau « topographiques » : anneaux organiques concentriques, lissés en courbes de Bézier.
 * Calculées une fois au chargement du module (déterministe, rendu serveur).
 */
function contour(radius: number, phase: number) {
  const points = Array.from({ length: 36 }, (_, i) => {
    const angle = (i / 36) * Math.PI * 2;
    const r =
      radius * (1 + 0.11 * Math.sin(3 * angle + phase) + 0.05 * Math.sin(5 * angle - phase * 1.7) + 0.03 * Math.sin(2 * angle));
    return [200 + r * Math.cos(angle), 200 + r * Math.sin(angle)] as const;
  });
  const at = (i: number) => points[(i + points.length) % points.length];
  const round = (n: number) => Math.round(n * 10) / 10;
  // Catmull-Rom fermé → segments cubiques.
  let d = `M${round(at(0)[0])} ${round(at(0)[1])}`;
  for (let i = 0; i < points.length; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${round(c1[0])} ${round(c1[1])} ${round(c2[0])} ${round(c2[1])} ${round(p2[0])} ${round(p2[1])}`;
  }
  return `${d}Z`;
}

const RINGS = Array.from({ length: 9 }, (_, i) => contour(26 + i * 21, 0.4 + i * 0.22));

function Contours({ className }: { className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 400 400" className={cn("absolute size-[22rem] sm:size-[30rem]", className)}>
      <g fill="none" stroke="currentColor" strokeWidth="1">
        {RINGS.map((d) => (
          <path key={d} d={d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  );
}

/**
 * Relief discret derrière la section du compteur : deux reliefs topographiques dans les coins opposés,
 * effacés au centre par un masque pour ne jamais gêner la lecture du titre et du compteur.
 */
export function CountdownBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 text-border [mask-image:radial-gradient(ellipse_55%_75%_at_50%_50%,transparent_45%,black_95%)]"
    >
      <Contours className="-top-40 -left-32 sm:-top-48 sm:-left-24" />
      <Contours className="-right-32 -bottom-40 rotate-180 sm:-right-24 sm:-bottom-48" />
    </div>
  );
}
