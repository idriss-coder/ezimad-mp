"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import type { UseFormReturn } from "react-hook-form";

import { ConsentField, FormError, NameAndPhoneFields } from "@/components/shared/contact-fields";
import { describedBy, Field } from "@/components/shared/field";
import { ModalFooter } from "@/components/shared/modal";
import { MAGZI_COMPANIES, MAGZI_ZONES } from "@/data/magzi-companies";
import { formatFcfa } from "@/lib/format";
import { cartSummary, type CartItems } from "@/features/cart/cart-store";

import { reserve, type ReserveResult } from "./actions";
import type { ReservationData, ReservationInput } from "./schema";

export type ReservationForm = UseFormReturn<ReservationInput, unknown, ReservationData>;
export type Reserved = Extract<ReserveResult, { ok: true }>;

const PHONE_HINT = "Nous vous écrirons sur ce numéro pour confirmer votre réservation.";

function readUtm() {
  const params = new URLSearchParams(window.location.search);
  const utm = {
    source: params.get("utm_source") ?? undefined,
    medium: params.get("utm_medium") ?? undefined,
    campaign: params.get("utm_campaign") ?? undefined,
  };
  return utm.source || utm.medium || utm.campaign ? utm : undefined;
}

type Props = {
  form: ReservationForm;
  cart: CartItems;
  onBack: () => void;
  onDone: (reserved: Reserved) => void;
};

/**
 * Coordonnées demandées après « Réserver ». Les valeurs vivent dans `form` (porté par le dialogue du panier) :
 * elles survivent au retour vers le panier et à la fermeture.
 */
export function ReservationForm({ form, cart, onBack, onDone }: Props) {
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { count, total } = cartSummary(cart);

  const {
    register,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = form;

  useEffect(() => headingRef.current?.focus(), []);

  const submit = handleSubmit((data) => {
    setFormError(null);
    const items = Object.entries(cart).map(([productId, quantity]) => ({ productId, quantity }));
    startTransition(async () => {
      const result = await reserve(data, items, readUtm());
      if (result.ok) return onDone(result);
      setFormError(result.error);
      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
        setError(field as keyof ReservationInput, { message });
      }
    });
  });

  return (
    <form noValidate onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
        <h3 ref={headingRef} tabIndex={-1} data-step-heading className="text-lg leading-snug font-bold outline-none">
          Vos coordonnées
        </h3>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">
          {count} article{count > 1 ? "s" : ""} · <strong className="text-foreground">{formatFcfa(total)}</strong> ·
          aucun paiement maintenant.
        </p>

        <div className="flex flex-col gap-4">
          <NameAndPhoneFields
            fields={{ fullName: register("fullName"), phone: register("phone"), website: register("website") }}
            errors={errors}
            phoneHint={PHONE_HINT}
          />

          <Field id="companyName" label="Entreprise" error={errors.companyName?.message}>
            <input
              id="companyName"
              autoComplete="organization"
              list={MAGZI_COMPANIES.length > 0 ? "magzi-companies" : undefined}
              className="text-input"
              aria-required
              aria-invalid={!!errors.companyName}
              aria-describedby={describedBy("companyName", errors.companyName?.message)}
              {...register("companyName", {
                // Entreprise choisie dans la liste MAGZI : on retient son id et on préremplit sa zone.
                onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                  const name = event.target.value.trim().toLowerCase();
                  const company = MAGZI_COMPANIES.find((c) => c.name.toLowerCase() === name);
                  setValue("companyId", company?.id ?? "");
                  if (company) setValue("magziZone", company.zoneId, { shouldValidate: true });
                },
              })}
            />
            {MAGZI_COMPANIES.length > 0 && (
              <datalist id="magzi-companies">
                {MAGZI_COMPANIES.map((company) => (
                  <option key={company.id} value={company.name} />
                ))}
              </datalist>
            )}
          </Field>

          <Field id="magziZone" label="Zone MAGZI" error={errors.magziZone?.message}>
            <select
              id="magziZone"
              className="text-input"
              aria-required
              aria-invalid={!!errors.magziZone}
              aria-describedby={describedBy("magziZone", errors.magziZone?.message)}
              {...register("magziZone")}
            >
              <option value="">Choisissez votre zone</option>
              {MAGZI_ZONES.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.label}
                </option>
              ))}
            </select>
          </Field>

          <ConsentField fields={{ consent: register("consent") }} errors={errors} />
        </div>

        {formError && <FormError>{formError}</FormError>}
      </div>

      <ModalFooter>
        <button type="button" className="btn-secondary" disabled={pending} onClick={onBack}>
          ‹ Retour au panier
        </button>
        <button type="submit" className="btn-buy font-bold" disabled={pending}>
          {pending ? "Réservation en cours…" : "Confirmer ma réservation"}
        </button>
      </ModalFooter>
    </form>
  );
}
