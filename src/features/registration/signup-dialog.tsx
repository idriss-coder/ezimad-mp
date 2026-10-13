"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm, type DefaultValues } from "react-hook-form";

import { DialogClose, Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { RegistrationForm, type SignupDone, type SignupStep } from "./registration-form";
import { registrationSchema, type RegistrationData, type RegistrationInput } from "./schema";

const EMPTY: DefaultValues<RegistrationInput> = {
  firstName: "",
  phone: "",
  email: "",
  companyId: "",
  companyName: "",
  categories: [],
  consent: false,
  website: "",
};

/**
 * Racine du dialogue d'inscription. Elle enveloppe la page : chaque `SignupButton` placé dedans l'ouvre.
 * Placée dans le shell statique, elle n'est pas remontée par le rafraîchissement qui suit l'inscription.
 */
export function SignupDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<SignupStep>(1);
  const [done, setDone] = useState<SignupDone | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const form = useForm<RegistrationInput, unknown, RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: EMPTY,
  });

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      // Après une inscription réussie, le dialogue repart de zéro (téléphone partagé entre collègues).
      onOpenChangeComplete={(isOpen) => {
        if (isOpen || !done) return;
        form.reset(EMPTY);
        setStep(1);
        setDone(null);
      }}
    >
      {children}
      <DialogContent
        ref={popupRef}
        showCloseButton={false}
        initialFocus={() => popupRef.current?.querySelector<HTMLElement>("[data-step-heading]") ?? true}
        className="flex max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden p-0 text-base sm:max-w-lg"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-surface py-1.5 pr-1.5 pl-4 sm:pl-5">
          <DialogTitle className="text-base leading-normal font-bold">Inscription</DialogTitle>
          <DialogClose
            aria-label="Fermer"
            className="grid size-10 place-items-center rounded-[3px] text-muted-foreground hover:bg-white hover:text-foreground"
          >
            <XIcon className="size-5" aria-hidden />
          </DialogClose>
        </div>

        {done ? (
          <SignupSuccess done={done} />
        ) : (
          <RegistrationForm form={form} step={step} onStepChange={setStep} onDone={setDone} />
        )}
      </DialogContent>
    </Dialog>
  );
}

/** Confirmation volontairement brève : la demande du client est « inscription réussie », rien de plus. */
function SignupSuccess({ done }: { done: SignupDone }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), []);

  return (
    <div className="flex flex-col">
      <div role="status" className="flex items-start gap-3 px-4 py-6 sm:px-5">
        <span
          aria-hidden
          className="grid size-8 shrink-0 place-items-center rounded-full bg-success text-lg leading-none font-bold text-white"
        >
          ✓
        </span>
        <div>
          <h3 ref={headingRef} tabIndex={-1} data-step-heading className="text-lg font-bold text-success outline-none">
            {done.status === "updated" ? "Inscription mise à jour" : "Inscription réussie"}
          </h3>
          <p className="mt-1">
            Merci {done.firstName}, votre inscription a bien été {done.status === "updated" ? "mise à jour" : "enregistrée"}.
          </p>
        </div>
      </div>
      <div className="flex justify-end border-t border-border px-4 py-3 sm:px-5">
        <DialogClose className="btn-primary w-full sm:w-auto">Fermer</DialogClose>
      </div>
    </div>
  );
}
