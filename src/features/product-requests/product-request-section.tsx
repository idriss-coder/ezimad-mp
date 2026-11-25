"use client";

import { useState } from "react";

import { ProductRequestDialog } from "./product-request-dialog";

/** Bas de la liste, juste avant le pied de page : invite à proposer un produit. */
export function ProductRequestSection() {
  const [open, setOpen] = useState(false);

  return (
    <section
      aria-labelledby="demande-title"
      className="mt-10 border border-border bg-surface px-4 py-6 text-center sm:px-6"
    >
      <h3 id="demande-title" className="text-lg leading-snug font-bold sm:text-xl">
        Vous ne trouvez pas ce que vous voulez&nbsp;?
      </h3>
      <p className="mx-auto mt-1.5 max-w-md text-pretty text-muted-foreground">
        Dites-nous ce que vous cherchez.
      </p>
      <button type="button" className="btn-primary mt-4 w-full max-w-xs font-bold" onClick={() => setOpen(true)}>
        Proposer un produit
      </button>
      <ProductRequestDialog open={open} onOpenChange={setOpen} />
    </section>
  );
}
