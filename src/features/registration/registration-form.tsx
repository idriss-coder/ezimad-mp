"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import type { UseFormReturn } from "react-hook-form";

import { describedBy, Field, FieldError, RequiredMark } from "@/components/shared/field";
import { CATEGORIES } from "@/data/catalog";
import { MAGZI_COMPANIES, MAGZI_ZONES } from "@/data/magzi-companies";

import { registerEmployee, type RegisterResult } from "./actions";
import { STEP1_FIELDS, type RegistrationData, type RegistrationInput } from "./schema";

export type SignupForm = UseFormReturn<RegistrationInput, unknown, RegistrationData>;
export type SignupStep = 1 | 2;
export type SignupDone = Pick<Extract<RegisterResult, { ok: true }>, "firstName" | "status">;

const PHONE_HINT = "Pour vous prévenir à l’ouverture des offres.";

const STEP_TITLES: Record<SignupStep, string> = {
  1: "Vos informations",
  2: "Quelles catégories vous intéressent ?",
};

function readUtm() {
  const params = new URLSearchParams(window.location.search);
  const utm = {
    source: params.get("utm_source") ?? undefined,
    medium: params.get("utm_medium") ?? undefined,
    campaign: params.get("utm_campaign") ?? undefined,
  };
  return utm.source || utm.medium || utm.campaign ? utm : undefined;
}

const isStep1Field = (field: string) => (STEP1_FIELDS as readonly string[]).includes(field);

type Props = {
  form: SignupForm;
  step: SignupStep;
  onStepChange: (step: SignupStep) => void;
  onDone: (done: SignupDone) => void;
};

/**
 * Inscription en deux étapes dans le dialogue.
 * L'étape 1 est validée localement ; tout est enregistré en une fois à la validation de l'étape 2.
 * Les valeurs vivent dans `form` (porté par le dialogue) : elles survivent au changement d'étape et à la fermeture.
 */
export function RegistrationForm({ form, step, onStepChange, onDone }: Props) {
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstStepRender = useRef(true);

  const {
    register,
    setValue,
    setError,
    trigger,
    handleSubmit,
    formState: { errors },
  } = form;

  // Le focus suit le changement d'étape (clavier, lecteurs d'écran). À l'ouverture, c'est le dialogue qui le place.
  useEffect(() => {
    if (firstStepRender.current) {
      firstStepRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  async function goToStep2() {
    if (await trigger([...STEP1_FIELDS], { shouldFocus: true })) {
      setFormError(null);
      onStepChange(2);
    }
  }

  const submit = handleSubmit(
    (data) => {
      setFormError(null);
      startTransition(async () => {
        const result = await registerEmployee({ ...data, utm: readUtm() });
        if (result.ok) return onDone({ firstName: result.firstName, status: result.status });
        setFormError(result.error);
        const fieldErrors = Object.entries(result.fieldErrors ?? {});
        for (const [field, message] of fieldErrors) setError(field as keyof RegistrationInput, { message });
        if (fieldErrors.some(([field]) => isStep1Field(field))) onStepChange(1);
      });
    },
    // Une erreur sur un champ de l'étape 1 (masquée) ramène à l'étape 1.
    (invalid) => {
      if (Object.keys(invalid).some(isStep1Field)) onStepChange(1);
    },
  );

  return (
    <form
      noValidate
      onSubmit={(event) => {
        if (step === 2) return submit(event);
        event.preventDefault();
        void goToStep2();
      }}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
        <p className="text-[0.8125rem] text-muted-foreground">Étape {step} sur 2</p>
        <h3
          ref={headingRef}
          tabIndex={-1}
          data-step-heading
          className="mb-4 text-lg leading-snug font-bold outline-none"
        >
          {STEP_TITLES[step]}
        </h3>

        {step === 1 ? (
          <div className="flex flex-col gap-4">
            <Field id="firstName" label="Prénom" error={errors.firstName?.message}>
              <input
                id="firstName"
                autoComplete="given-name"
                className="text-input"
                aria-required
                aria-invalid={!!errors.firstName}
                aria-describedby={describedBy("firstName", errors.firstName?.message)}
                {...register("firstName")}
              />
            </Field>

            <Field id="phone" label="Numéro WhatsApp" hint={PHONE_HINT} error={errors.phone?.message}>
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
                  aria-describedby={describedBy("phone", errors.phone?.message, PHONE_HINT)}
                  {...register("phone")}
                />
              </div>
            </Field>

            <Field id="email" label="Email" optional error={errors.email?.message}>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="text-input"
                aria-invalid={!!errors.email}
                aria-describedby={describedBy("email", errors.email?.message)}
                {...register("email")}
              />
            </Field>

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

            {/* Honeypot anti-spam : invisible pour les humains. */}
            <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="website">Site web</label>
              <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <fieldset aria-describedby={errors.categories ? "categories-error" : "categories-hint"}>
              <legend className="sr-only">Catégories de produits</legend>
              <p id="categories-hint" className="mb-2.5 text-sm text-muted-foreground">
                Cochez une ou plusieurs catégories.
                <RequiredMark />
              </p>
              <div className="flex flex-col gap-2">
                {CATEGORIES.map((category) => (
                  <label
                    key={category.id}
                    className="flex cursor-pointer items-center gap-3 rounded-[3px] border border-border p-2.5 hover:border-input has-checked:border-[#e77600] has-checked:bg-[#fef8f2]"
                  >
                    <input
                      type="checkbox"
                      value={category.id}
                      className="size-5 shrink-0 accent-[#e77600]"
                      {...register("categories")}
                    />
                    <Image
                      src={category.image}
                      alt=""
                      width={56}
                      height={56}
                      // L'étape 2 n'est montée qu'à la demande : pas de vignette vide le temps du lazy-loading.
                      loading="eager"
                      className="size-14 shrink-0 border border-border object-cover"
                    />
                    <span className="flex min-w-0 flex-col">
                      <span className="leading-snug font-bold">{category.title}</span>
                      <span className="text-[0.8125rem] leading-snug text-muted-foreground">{category.products}</span>
                    </span>
                  </label>
                ))}
              </div>
              {errors.categories?.message && (
                <div className="mt-2">
                  <FieldError id="categories-error">{errors.categories.message}</FieldError>
                </div>
              )}
            </fieldset>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="consent" className="flex cursor-pointer items-start gap-2.5 text-sm">
                <input
                  id="consent"
                  type="checkbox"
                  className="mt-0.5 size-5 shrink-0 accent-[#e77600]"
                  aria-required
                  aria-invalid={!!errors.consent}
                  aria-describedby={errors.consent ? "consent-error" : undefined}
                  {...register("consent")}
                />
                <span>
                  J’accepte qu’EZIMAD utilise ces informations pour mesurer la demande et me contacter au sujet des
                  offres. Elles ne sont ni vendues ni transmises.
                  <RequiredMark />
                </span>
              </label>
              {errors.consent?.message && <FieldError id="consent-error">{errors.consent.message}</FieldError>}
            </div>
          </div>
        )}

        {formError && (
          <p role="alert" className="mt-5 rounded-[3px] border border-destructive px-3 py-2.5 text-sm text-destructive">
            {formError}
          </p>
        )}
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-border px-4 py-3 sm:flex-row sm:justify-end sm:px-5">
        {step === 2 && (
          <button type="button" className="btn-secondary" disabled={pending} onClick={() => onStepChange(1)}>
            ‹ Retour
          </button>
        )}
        <button type="submit" className="btn-primary" disabled={pending}>
          {step === 1 ? "Suivant ›" : pending ? "Inscription en cours…" : "Valider mon inscription"}
        </button>
      </div>
    </form>
  );
}
