"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { describedBy, Field } from "@/components/shared/field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/data/catalog";
import { MAGZI_ZONES } from "@/data/magzi-companies";

import { registerEmployee, type RegisterResult } from "./actions";
import { CompanyCombobox } from "./company-combobox";
import { registrationSchema, type RegistrationData, type RegistrationInput } from "./schema";

type Success = Extract<RegisterResult, { ok: true }>;

const HINTS = {
  phone: "Pour vous prévenir à l’ouverture des offres.",
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

export function RegistrationForm({ onSuccess }: { onSuccess: (result: Success) => void }) {
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<RegistrationInput, unknown, RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: "",
      phone: "",
      email: "",
      companyId: "",
      companyName: "",
      categories: [],
      consent: false,
      website: "",
    },
  });

  const [companyId, companyName] = useWatch({ control, name: ["companyId", "companyName"] });

  const onSubmit = handleSubmit((data) => {
    setFormError(null);
    startTransition(async () => {
      const result = await registerEmployee({ ...data, utm: readUtm() });
      if (result.ok) return onSuccess(result);
      setFormError(result.error);
      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
        setError(field as keyof RegistrationInput, { message });
      }
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="firstName" label="Prénom" error={errors.firstName?.message}>
          <Input
            id="firstName"
            autoComplete="given-name"
            aria-invalid={!!errors.firstName}
            aria-describedby={describedBy("firstName", errors.firstName?.message)}
            {...register("firstName")}
          />
        </Field>
        <Field id="phone" label="Numéro WhatsApp" hint={HINTS.phone} error={errors.phone?.message}>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
              +237
            </span>
            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="6 70 12 34 56"
              className="pl-14"
              aria-invalid={!!errors.phone}
              aria-describedby={describedBy("phone", errors.phone?.message, HINTS.phone)}
              {...register("phone")}
            />
          </div>
        </Field>
      </div>

      <Field id="email" label="Email" optional error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={describedBy("email", errors.email?.message)}
          {...register("email")}
        />
      </Field>

      <Field id="company" label="Entreprise" error={errors.companyName?.message}>
        <CompanyCombobox
          id="company"
          value={{ companyId, companyName }}
          invalid={!!errors.companyName}
          describedBy={describedBy("company", errors.companyName?.message)}
          onChange={({ companyId, companyName, company }) => {
            setValue("companyId", companyId);
            setValue("companyName", companyName, { shouldValidate: true });
            if (company) setValue("magziZone", company.zoneId, { shouldValidate: true });
          }}
        />
      </Field>

      <fieldset className="flex flex-col gap-2" aria-describedby={errors.magziZone ? "zone-error" : undefined}>
        <legend className="mb-1.5 text-sm font-medium">Zone MAGZI</legend>
        <div className="flex flex-wrap gap-2">
          {MAGZI_ZONES.map((zone) => (
            <label key={zone.id} className="chip">
              <input type="radio" value={zone.id} className="sr-only" {...register("magziZone")} />
              {zone.label}
            </label>
          ))}
        </div>
        {errors.magziZone && (
          <p id="zone-error" role="alert" className="text-[0.8125rem] font-medium text-destructive">
            {errors.magziZone.message}
          </p>
        )}
      </fieldset>

      <fieldset className="flex flex-col gap-2" aria-describedby={errors.categories ? "categories-error" : undefined}>
        <legend className="mb-1.5 text-sm font-medium">Ce que vous achetez le plus</legend>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <label key={category.id} className="chip">
              <input type="checkbox" value={category.id} className="sr-only" {...register("categories")} />
              {category.label}
            </label>
          ))}
        </div>
        {errors.categories && (
          <p id="categories-error" role="alert" className="text-[0.8125rem] font-medium text-destructive">
            {errors.categories.message}
          </p>
        )}
      </fieldset>

      {/* Honeypot anti-spam : invisible pour les humains. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Site web</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-start gap-3">
          <Controller
            control={control}
            name="consent"
            render={({ field }) => (
              <Checkbox
                id="consent"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                aria-invalid={!!errors.consent}
                aria-describedby={errors.consent ? "consent-error" : undefined}
                className="mt-px size-5 bg-card"
              />
            )}
          />
          <label htmlFor="consent" className="text-sm leading-snug text-muted-foreground">
            J’accepte qu’EZIMAD utilise ces informations pour mesurer la demande et me contacter au sujet des offres.{" "}
            <a href="#confidentialite" className="text-foreground underline underline-offset-2">
              Confidentialité
            </a>
          </label>
        </div>
        {errors.consent && (
          <p id="consent-error" role="alert" className="text-[0.8125rem] font-medium text-destructive">
            {errors.consent.message}
          </p>
        )}
      </div>

      {formError && (
        <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3.5 py-3 text-sm text-destructive">
          {formError}
        </p>
      )}

      <Button type="submit" size="xl" disabled={pending} className="w-full sm:w-auto sm:self-start">
        {pending ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden /> Inscription…
          </>
        ) : (
          <>
            Valider mon inscription <ArrowRight className="size-4" aria-hidden />
          </>
        )}
      </Button>
    </form>
  );
}
