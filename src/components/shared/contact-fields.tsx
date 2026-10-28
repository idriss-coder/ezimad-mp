import type { FieldError as HookFieldError, UseFormRegisterReturn } from "react-hook-form";

import { describedBy, Field, FieldError, RequiredMark } from "./field";

type ContactField = "fullName" | "phone" | "consent" | "website";

/* Champs déjà enregistrés (`register("fullName")`…) : le composant sert aux deux formulaires, de types différents. */
type Props<K extends ContactField> = {
  fields: Record<K, UseFormRegisterReturn>;
  errors: Partial<Record<K, HookFieldError>>;
};

/** Nom & prénom + numéro WhatsApp, communs à la réservation et à la liste d'attente. */
export function NameAndPhoneFields({
  fields,
  errors,
  phoneHint,
}: Props<"fullName" | "phone" | "website"> & { phoneHint: string }) {
  return (
    <>
      <Field id="fullName" label="Nom & prénom" error={errors.fullName?.message}>
        <input
          id="fullName"
          autoComplete="name"
          className="text-input"
          aria-required
          aria-invalid={!!errors.fullName}
          aria-describedby={describedBy("fullName", errors.fullName?.message)}
          {...fields.fullName}
        />
      </Field>

      <Field id="phone" label="Numéro WhatsApp" hint={phoneHint} error={errors.phone?.message}>
        <div className="flex">
          <span
            aria-hidden
            className="inline-flex items-center rounded-l-[3px] border border-r-0 border-input bg-surface px-2.5 text-[0.9375rem]"
          >
            +237
          </span>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="6 70 12 34 56"
            className="text-input rounded-l-none"
            aria-required
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy("phone", errors.phone?.message, phoneHint)}
            {...fields.phone}
          />
        </div>
      </Field>

      {/* Honeypot anti-spam : invisible pour les humains. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Site web</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...fields.website} />
      </div>
    </>
  );
}

/** Case d'accord obligatoire, en bas des formulaires. */
export function ConsentField({ fields, errors }: Props<"consent">) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="consent" className="flex cursor-pointer items-start gap-2.5 text-sm">
        <input
          id="consent"
          type="checkbox"
          className="mt-0.5 size-5 shrink-0 accent-logo-blue"
          aria-required
          aria-invalid={!!errors.consent}
          aria-describedby={errors.consent ? "consent-error" : undefined}
          {...fields.consent}
        />
        <span>
          J’accepte qu’EZIMAD utilise ces informations pour traiter ma demande et me contacter sur WhatsApp. Elles ne
          sont ni vendues ni transmises.
          <RequiredMark />
        </span>
      </label>
      {errors.consent?.message && <FieldError id="consent-error">{errors.consent.message}</FieldError>}
    </div>
  );
}

/** Erreur générale du formulaire (service indisponible, panier modifié…). */
export function FormError({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="mt-5 rounded-[3px] border border-destructive px-3 py-2.5 text-sm text-destructive">
      {children}
    </p>
  );
}
