import { useId } from "react";

const STAR = "M10 1.5l2.6 5.5 6 .7-4.5 4.1 1.2 5.9L10 14.8l-5.3 2.9 1.2-5.9L1.4 7.7l6-.7z";

/** Note en étoiles orange façon Amazon, arrondie à la demi-étoile, suivie de la valeur (« 4,5 »). */
export function Stars({ rating }: { rating: number }) {
  const id = useId();
  const rounded = Math.round(rating * 2) / 2;
  const label = rating.toLocaleString("fr-FR", { minimumFractionDigits: 1 });

  return (
    <p className="flex items-center gap-1 text-sm leading-none">
      <span className="sr-only">Note : {label} sur 5</span>
      <span aria-hidden className="text-muted-foreground">
        {label}
      </span>
      <svg aria-hidden viewBox="0 0 100 20" className="h-3.5 w-[4.375rem] shrink-0">
        <defs>
          {/* Masque de remplissage : la largeur couvre `rounded` étoiles sur 5. */}
          <clipPath id={id}>
            <rect width={rounded * 20} height="20" />
          </clipPath>
        </defs>
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={STAR} transform={`translate(${i * 20} 0)`} fill="#fff" stroke="#de7921" strokeWidth="1.2" />
        ))}
        <g clipPath={`url(#${id})`}>
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={STAR} transform={`translate(${i * 20} 0)`} fill="#ffa41c" stroke="#de7921" strokeWidth="1.2" />
          ))}
        </g>
      </svg>
    </p>
  );
}
