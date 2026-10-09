"use client";

import { ArrowRight, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { PartnerForm } from "./partner-form";

export function PartnerSection() {
  const [open, setOpen] = useState(false);

  return (
    <section id="partenaires" aria-labelledby="partenaires-title" className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <div className="rounded-xl bg-brand-ink px-6 py-12 text-white sm:px-10 sm:py-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <h2
              id="partenaires-title"
              className="text-[clamp(1.875rem,3.6vw,2.75rem)] leading-[1.05] font-medium tracking-[-0.03em]"
            >
              Vous produisez en zone MAGZI&nbsp;?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/75">
              Proposez vos produits à une communauté qualifiée de salariés et ouvrez un nouveau canal de distribution.
            </p>
          </div>
          {!open && (
            <Button
              size="xl"
              variant="inverse"
              className="self-start lg:self-auto"
              onClick={() => setOpen(true)}
              aria-controls="partner-form"
              aria-expanded={false}
            >
              Devenir partenaire <ArrowRight className="size-4" aria-hidden />
            </Button>
          )}
        </div>

        {open && (
          <div id="partner-form" className="mt-10 rounded-xl bg-card p-5 text-card-foreground sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h3 className="text-xl font-medium tracking-[-0.02em]">Demande de partenariat</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-secondary"
                aria-label="Fermer le formulaire partenaire"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <PartnerForm />
          </div>
        )}
      </div>
    </section>
  );
}
