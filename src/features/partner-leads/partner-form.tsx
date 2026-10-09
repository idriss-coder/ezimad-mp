"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { describedBy, Field } from "@/components/shared/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { submitPartnerLead } from "./actions";
import { partnerLeadSchema, type PartnerLeadInput } from "./schema";

type TextField = Exclude<keyof PartnerLeadInput, "website">;

const FIELDS: {
  name: TextField;
  label: string;
  optional?: boolean;
  type?: string;
  placeholder?: string;
  multiline?: boolean;
  autoComplete?: string;
  wide?: boolean;
}[] = [
  { name: "company", label: "Entreprise", autoComplete: "organization" },
  { name: "contactName", label: "Nom du contact", autoComplete: "name" },
  { name: "phone", label: "Téléphone", type: "tel", placeholder: "6 70 12 34 56", autoComplete: "tel-national" },
  { name: "email", label: "Email", type: "email", optional: true, autoComplete: "email" },
  {
    name: "products",
    label: "Produits proposés",
    multiline: true,
    wide: true,
    placeholder: "Ex. : huile de palme raffinée en bidons de 5 L, savon de ménage…",
  },
  { name: "publicPrice", label: "Prix public / indicatif", optional: true, placeholder: "Si vous le connaissez" },
  { name: "monthlyCapacity", label: "Capacité mensuelle", optional: true, placeholder: "Ex. : 500 cartons / mois" },
  { name: "discount", label: "Remise envisageable", optional: true, placeholder: "Ex. : 10 % à partir de 200 unités", wide: true },
  { name: "message", label: "Message", optional: true, multiline: true, wide: true },
];

export function PartnerForm() {
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<PartnerLeadInput>({
    resolver: zodResolver(partnerLeadSchema),
    defaultValues: Object.fromEntries([...FIELDS.map((f) => [f.name, ""]), ["website", ""]]),
  });

  const onSubmit = handleSubmit((data) => {
    setFormError(null);
    startTransition(async () => {
      const result = await submitPartnerLead(data);
      if (result.ok) return setSent(true);
      setFormError(result.error);
      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
        setError(field as keyof PartnerLeadInput, { message });
      }
    });
  });

  if (sent) {
    return (
      <div role="status" className="flex gap-3">
        <CircleCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden />
        <div>
          <p className="font-medium">Demande envoyée.</p>
          <p className="text-sm text-muted-foreground">Nous vous rappelons pour vous présenter la demande des salariés.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-5 sm:grid-cols-2">
      {FIELDS.map((field) => {
        const id = `partner-${field.name}`;
        const error = errors[field.name]?.message;
        const common = {
          id,
          placeholder: field.placeholder,
          "aria-invalid": !!error,
          "aria-describedby": describedBy(id, error),
          ...register(field.name),
        };
        return (
          <Field
            key={field.name}
            id={id}
            label={field.label}
            optional={field.optional}
            error={error}
            className={field.wide ? "sm:col-span-2" : undefined}
          >
            {field.multiline ? (
              <Textarea rows={3} className="min-h-24 rounded-md px-3" {...common} />
            ) : (
              <Input type={field.type ?? "text"} autoComplete={field.autoComplete} {...common} />
            )}
          </Field>
        );
      })}

      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="partner-website">Site web</label>
        <input id="partner-website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      {formError && (
        <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3.5 py-3 text-sm text-destructive sm:col-span-2">
          {formError}
        </p>
      )}

      <div className="sm:col-span-2">
        <Button type="submit" size="xl" disabled={pending} className="w-full sm:w-auto">
          {pending ? (
            <>
              <Loader2 className="size-5 animate-spin" aria-hidden /> Envoi…
            </>
          ) : (
            "Envoyer ma demande"
          )}
        </Button>
      </div>
    </form>
  );
}
