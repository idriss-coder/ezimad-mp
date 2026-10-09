"use client";

import { Check, Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { PRODUCTS, type ProductId } from "@/data/catalog";

import { saveProductInterests } from "./actions";

const formatter = new Intl.NumberFormat("fr-FR");

type Props = {
  initialInterests: ProductId[];
  /** Nombre réel d'intéressés par produit (null si les stats sont indisponibles). */
  counts: Record<string, number> | null;
  onSaved: (interests: ProductId[]) => void;
  onSessionLost: () => void;
};

export function InterestPicker({ initialInterests, counts, onSaved, onSessionLost }: Props) {
  // Sélection locale : rien n'est enregistré avant la validation.
  const [selection, setSelection] = useState<ProductId[]>(initialInterests);
  const [baseline] = useState(() => new Set(initialInterests));
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function toggle(id: ProductId) {
    setError(null);
    setSelection((current) => (current.includes(id) ? current.filter((p) => p !== id) : [...current, id]));
  }

  function submit() {
    if (selection.length === 0) return setError("Sélectionnez au moins un produit.");
    setError(null);
    startTransition(async () => {
      const result = await saveProductInterests(selection);
      if (result.ok) return onSaved(result.productInterests);
      setError(result.error);
      if (result.reason === "no-session") onSessionLost();
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <ul className="flex flex-col divide-y divide-border border-y border-border">
        {PRODUCTS.map((product) => {
          const selected = selection.includes(product.id);
          // Compteur réel issu de la base, ajusté du choix local pas encore enregistré.
          const count =
            counts === null
              ? null
              : (counts[product.id] ?? 0) - (baseline.has(product.id) ? 1 : 0) + (selected ? 1 : 0);
          return (
            <li key={product.id} className="flex items-center gap-3.5 py-3">
              <span className="relative size-14 shrink-0 overflow-hidden rounded-md bg-surface">
                <Image src={product.image} alt="" fill sizes="56px" className="object-cover" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <h3 className="text-[0.9375rem] leading-snug font-medium">{product.name}</h3>
                <p className="truncate text-sm text-muted-foreground">
                  {count !== null && count > 0
                    ? `${formatter.format(count)} ${count > 1 ? "intéressés" : "intéressé"}`
                    : product.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggle(product.id)}
                disabled={pending}
                aria-pressed={selected}
                aria-label={`${selected ? "Retirer" : "Je suis intéressé"} : ${product.name}`}
                className={cn(
                  "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg px-3.5 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60",
                  selected
                    ? "bg-foreground text-primary-foreground hover:bg-foreground/85"
                    : "bg-secondary text-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_6%)]",
                )}
              >
                {selected ? <Check className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />}
                <span className="hidden min-[400px]:inline">{selected ? "Intéressé" : "Je suis intéressé"}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div aria-live="polite" className="min-h-5 text-sm">
          {error ? (
            <p role="alert" className="text-destructive">
              {error}
            </p>
          ) : selection.length === 0 ? (
            <p className="text-muted-foreground">Aucun produit sélectionné.</p>
          ) : (
            <p className="text-muted-foreground">
              {selection.length} {selection.length > 1 ? "produits sélectionnés" : "produit sélectionné"}.
            </p>
          )}
        </div>
        <Button
          type="button"
          size="xl"
          onClick={submit}
          disabled={pending}
          aria-disabled={selection.length === 0 || undefined}
          className="w-full sm:w-auto aria-disabled:opacity-50"
        >
          {pending ? (
            <>
              <Loader2 className="size-5 animate-spin" aria-hidden /> Enregistrement…
            </>
          ) : (
            "Valider mes choix"
          )}
        </Button>
      </div>
    </div>
  );
}
