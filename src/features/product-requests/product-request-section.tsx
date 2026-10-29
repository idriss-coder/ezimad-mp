"use client";

import { useState } from "react";

import { ProductRequestDialog } from "./product-request-dialog";

/** Bas de la liste, juste avant le pied de page : invite à demander d'autres produits à prix réduit. */
export function ProductRequestSection() {
  const [open, setOpen] = useState(false);

  return (
    <section
      aria-labelledby="demande-title"
      className="mt-10 border border-border bg-surface px-4 py-6 text-center sm:px-6"
    >
      <h3 id="demande-title" className="text-lg leading-snug font-bold sm:text-xl">
        Vous ne trouvez pas le produit qui vous intéresse&nbsp;?
      </h3>
      <p className="mx-auto mt-1.5 max-w-md text-pretty text-muted-foreground">
        Dites-nous quels produits vous aimeriez voir à prix réduit. Nous vous préviendrons dès qu’ils arrivent.
      </p>
      <button type="button" className="btn-primary mt-4 w-full max-w-xs font-bold" onClick={() => setOpen(true)}>
        Demander d’autres produits
      </button>
      <ProductRequestDialog open={open} onOpenChange={setOpen} />
    </section>
  );
}
