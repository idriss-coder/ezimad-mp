"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm, type DefaultValues, type UseFormReturn } from "react-hook-form";

import { ConsentField, FormError, NameAndPhoneFields } from "@/components/shared/contact-fields";
import { describedBy, Field } from "@/components/shared/field";
import { Modal, ModalFooter } from "@/components/shared/modal";
import { DialogClose } from "@/components/ui/dialog";
import { requestProducts, type ProductRequestResult } from "@/features/reservation/actions";
import {
  productRequestSchema,
  type ProductRequestData,
  type ProductRequestInput,
} from "@/features/reservation/schema";

const PHONE_HINT = "Nous vous écrirons sur ce numéro dès que ces produits seront proposés à prix réduit.";

const EMPTY: DefaultValues<ProductRequestInput> = { products: "", fullName: "", phone: "", consent: false, website: "" };

type Requested = Extract<ProductRequestResult, { ok: true }>;
type RequestForm = UseFormReturn<ProductRequestInput, unknown, ProductRequestData>;

type Props = { open: boolean; onOpenChange: (open: boolean) => void };

/** Demande d'autres produits : produits souhaités → coordonnées → confirmation. */
export function ProductRequestDialog({ open, onOpenChange }: Props) {
  const [step, setStep] = useState<"products" | "contact">("products");
  const [requested, setRequested] = useState<Requested | null>(null);

  const form = useForm<ProductRequestInput, unknown, ProductRequestData>({
    resolver: zodResolver(productRequestSchema),
    defaultValues: EMPTY,
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Demander d’autres produits"
      onOpenChangeComplete={(isOpen) => {
        if (isOpen) return;
        // Demande envoyée : on repart de zéro (coordonnées conservées). Sinon on garde la saisie.
        if (requested) {
          form.reset({ ...form.getValues(), products: "", consent: false });
          setStep("products");
        }
        setRequested(null);
        form.clearErrors();
      }}
    >
      {requested ? (
        <RequestDone requested={requested} products={form.getValues("products")} />
      ) : step === "products" ? (
        <ProductsStep form={form} onNext={() => setStep("contact")} />
      ) : (
        <ContactStep form={form} onBack={() => setStep("products")} onDone={setRequested} />
      )}
    </Modal>
  );
}

function ProductsStep({ form, onNext }: { form: RequestForm; onNext: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const {
    register,
    trigger,
    formState: { errors },
  } = form;

  useEffect(() => headingRef.current?.focus(), []);

  async function next(event: React.FormEvent) {
    event.preventDefault();
    if (await trigger("products")) onNext();
  }

  return (
    <form noValidate onSubmit={next} className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
        <h3 ref={headingRef} tabIndex={-1} data-step-heading className="text-lg leading-snug font-bold outline-none">
          Quels produits aimeriez-vous voir à prix réduit&nbsp;?
        </h3>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">Étape 1 sur 2 · marques, formats… écrivez librement.</p>
        <Field id="products" label="Produits souhaités" error={errors.products?.message}>
          <textarea
            id="products"
            rows={4}
            maxLength={1000}
            placeholder="Ex. : riz 25 kg, café, lessive en poudre 5 kg…"
            className="text-input h-auto min-h-28 py-2"
            aria-required
            aria-invalid={!!errors.products}
            aria-describedby={describedBy("products", errors.products?.message)}
            {...register("products")}
          />
        </Field>
      </div>
      <ModalFooter>
        <DialogClose type="button" className="btn-secondary">
          Annuler
        </DialogClose>
        <button type="submit" className="btn-primary font-bold">
          Suivant ›
        </button>
      </ModalFooter>
    </form>
  );
}

function ContactStep({
  form,
  onBack,
  onDone,
}: {
  form: RequestForm;
  onBack: () => void;
  onDone: (requested: Requested) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = form;

  useEffect(() => headingRef.current?.focus(), []);

  const submit = handleSubmit((data) => {
    setFormError(null);
    startTransition(async () => {
      const result = await requestProducts(data);
      if (result.ok) return onDone(result);
      setFormError(result.error);
      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
        setError(field as keyof ProductRequestInput, { message });
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
          Étape 2 sur 2 · pour vous prévenir dès que ces produits arrivent.
        </p>
        <div className="flex flex-col gap-4">
          <NameAndPhoneFields
            fields={{ fullName: register("fullName"), phone: register("phone"), website: register("website") }}
            errors={errors}
            phoneHint={PHONE_HINT}
          />
          <ConsentField fields={{ consent: register("consent") }} errors={errors} />
        </div>
        {formError && <FormError>{formError}</FormError>}
      </div>
      <ModalFooter>
        <button type="button" className="btn-secondary" disabled={pending} onClick={onBack}>
          ‹ Retour
        </button>
        <button type="submit" className="btn-primary font-bold" disabled={pending}>
          {pending ? "Envoi…" : "Valider"}
        </button>
      </ModalFooter>
    </form>
  );
}

function RequestDone({ requested, products }: { requested: Requested; products: string }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), []);

  return (
    <>
      <div role="status" className="flex items-start gap-3 px-4 py-6 sm:px-5">
        <span
          aria-hidden
          className="grid size-8 shrink-0 place-items-center rounded-full bg-success text-lg leading-none font-bold text-white"
        >
          ✓
        </span>
        <div className="min-w-0">
          <h3 ref={headingRef} tabIndex={-1} data-step-heading className="text-lg font-bold text-success outline-none">
            Demande enregistrée
          </h3>
          <p className="mt-1">
            Merci {requested.fullName}. Vous serez prévenu(e) sur WhatsApp dès que ces produits seront disponibles à
            prix réduit sur EZIMAD&nbsp;:
          </p>
          <p className="mt-2 border-l-[3px] border-border pl-3 text-sm break-words whitespace-pre-line text-muted-foreground">
            {products}
          </p>
        </div>
      </div>
      <ModalFooter>
        <DialogClose className="btn-primary w-full sm:w-auto">Continuer mes achats</DialogClose>
      </ModalFooter>
    </>
  );
}
