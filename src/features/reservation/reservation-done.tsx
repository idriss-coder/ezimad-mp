"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { FormError } from "@/components/shared/contact-fields";
import { FieldError } from "@/components/shared/field";
import { ModalFooter } from "@/components/shared/modal";
import { DialogClose } from "@/components/ui/dialog";
import { formatFcfa } from "@/lib/format";

import { saveOtherProducts } from "./actions";
import type { Reserved } from "./reservation-form";

/** « +237 6 70 12 34 56 » à partir du numéro E.164. */
const displayPhone = (phone: string) => phone.replace(/^\+237(\d)(\d{2})(\d{2})(\d{2})(\d{2})$/, "+237 $1 $2 $3 $4 $5");

/**
 * Après la réservation : on explique la suite (WhatsApp, pas de paiement), puis on demande librement
 * quels autres produits intéresseraient la personne.
 */
export function ReservationDone({ reserved }: { reserved: Reserved }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => headingRef.current?.focus(), []);

  function send(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await saveOtherProducts(reserved.reservationId, text);
      if (result.ok) setSent(true);
      else setError(result.error);
    });
  }

  const tooShort = error !== null && text.trim().length < 2;

  return (
    <form noValidate onSubmit={send} className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-5">
        <div role="status" className="flex items-start gap-3">
          <span
            aria-hidden
            className="grid size-8 shrink-0 place-items-center rounded-full bg-success text-lg leading-none font-bold text-white"
          >
            ✓
          </span>
          <div>
            <h3 ref={headingRef} tabIndex={-1} data-step-heading className="text-lg font-bold text-success outline-none">
              Réservation enregistrée
            </h3>
            <p className="mt-1">
              Merci {reserved.fullName}. Vos {reserved.count} article{reserved.count > 1 ? "s" : ""} (
              {formatFcfa(reserved.total)}) sont réservés au prix EZIMAD.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-[3px] border border-[#8fd19e] bg-[#f0faf2] px-3 py-2.5 text-sm">
          <p>
            <strong>Aucun paiement n’est demandé maintenant.</strong> Nous vous contacterons sur WhatsApp au{" "}
            <strong className="whitespace-nowrap">{displayPhone(reserved.phone)}</strong> pour confirmer votre
            réservation, puis à nouveau dès que vos produits seront prêts.
          </p>
        </div>

        <div className="mt-6 border-t border-border pt-5">
          {sent ? (
            <p role="status" className="font-bold text-success">
              Merci, c’est noté. Nous vous préviendrons si ces produits arrivent sur EZIMAD.
            </p>
          ) : (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="otherProducts" className="font-bold">
                Quels autres produits aimeriez-vous trouver sur EZIMAD&nbsp;?
              </label>
              <p id="otherProducts-hint" className="text-[0.8125rem] text-muted-foreground">
                Marques, formats… écrivez librement.
              </p>
              <textarea
                id="otherProducts"
                rows={3}
                maxLength={1000}
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Ex. : farine, café, lessive en poudre 5 kg…"
                className="text-input h-auto min-h-24 py-2"
                aria-invalid={tooShort || undefined}
                aria-describedby={tooShort ? "otherProducts-error" : "otherProducts-hint"}
              />
              {tooShort && <FieldError id="otherProducts-error">{error}</FieldError>}
            </div>
          )}
          {error && !tooShort && <FormError>{error}</FormError>}
        </div>
      </div>

      <ModalFooter>
        {sent ? (
          <DialogClose className="btn-primary w-full sm:w-auto">Continuer mes achats</DialogClose>
        ) : (
          <>
            <DialogClose className="btn-secondary">Non merci</DialogClose>
            <button type="submit" className="btn-primary" disabled={pending}>
              {pending ? "Envoi…" : "Envoyer"}
            </button>
          </>
        )}
      </ModalFooter>
    </form>
  );
}
