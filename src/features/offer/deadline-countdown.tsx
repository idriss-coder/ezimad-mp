"use client";

import { cn } from "cn";
import { useSyncExternalStore } from "react";

import { OFFER_DEADLINE, OFFER_DEADLINE_LABEL } from "@/data/catalog";

const DEADLINE = new Date(OFFER_DEADLINE).getTime();

/* Horloge partagée, cadencée à la seconde. Côté serveur, aucune heure : le compteur s'affiche au montage. */
function subscribe(onTick: () => void) {
  const timer = window.setInterval(onTick, 1000);
  return () => window.clearInterval(timer);
}
const remaining = () => Math.max(0, Math.floor((DEADLINE - Date.now()) / 1000));
const noTime = () => null;

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Compte à rebours jusqu'à la fin des réductions, à la manière des pages « bientôt disponible » :
 * gros chiffres rouges séparés par « : », libellé sous chaque nombre.
 */
export function DeadlineCountdown() {
  const seconds = useSyncExternalStore(subscribe, remaining, noTime);
  const known = seconds !== null;
  const ended = seconds === 0;

  const units = known
    ? [
        { value: Math.floor(seconds / 86400), label: "jours" },
        { value: Math.floor(seconds / 3600) % 24, label: "heures" },
        { value: Math.floor(seconds / 60) % 60, label: "min" },
        { value: seconds % 60, label: "sec" },
      ]
    : ["jours", "heures", "min", "sec"].map((label) => ({ value: null, label }));

  return (
    <div>
      {/* Annonce unique, sans relire chaque seconde. */}
      <p className="sr-only">
        {known
          ? ended
            ? "Les réductions sont terminées."
            : `Réductions valables jusqu’au ${OFFER_DEADLINE_LABEL} : plus que ${units[0].value} jours.`
          : `Réductions valables jusqu’au ${OFFER_DEADLINE_LABEL}.`}
      </p>
      <div aria-hidden className="flex items-start justify-center gap-1.5 font-bold tabular-nums sm:gap-3">
        {units.map((unit, i) => (
          <div key={unit.label} className="flex items-start gap-1.5 sm:gap-3">
            {i > 0 && <span className="text-[clamp(2.25rem,10vw,4.5rem)] leading-[0.95] text-muted-foreground">:</span>}
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "text-[clamp(2.25rem,10vw,4.5rem)] leading-[0.95]",
                  unit.value === null ? "text-border" : "text-heart",
                )}
              >
                {unit.value === null ? "--" : pad(unit.value)}
              </span>
              <span className="mt-1.5 text-[0.6875rem] font-bold tracking-[0.12em] text-muted-foreground uppercase sm:text-xs">
                {unit.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
