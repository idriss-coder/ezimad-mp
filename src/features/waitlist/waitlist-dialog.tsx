"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm, type DefaultValues, type UseFormReturn } from "react-hook-form";

import { ConsentField, FormError, NameAndPhoneFields } from "@/components/shared/contact-fields";
import { Modal, ModalFooter } from "@/components/shared/modal";
import { DialogClose } from "@/components/ui/dialog";
import type { Product } from "@/data/catalog";
import { joinWaitlist, type WaitlistResult } from "@/features/reservation/actions";
import { waitlistSchema, type WaitlistData, type WaitlistInput } from "@/features/reservation/schema";

const PHONE_HINT = "Nous vous écrirons sur ce numéro dès que le produit revient.";

const EMPTY: DefaultValues<WaitlistInput> = { fullName: "", phone: "", consent: false, website: "" };

type Joined = Extract<WaitlistResult, { ok: true }>;

type Props = { product: Product | null; open: boolean; onOpenChange: (open: boolean) => void };

/** Liste d'attente d'un produit épuisé : nom + WhatsApp, puis confirmation. */
export function WaitlistDialog({ product, open, onOpenChange }: Props) {
  const [joined, setJoined] = useState<Joined | null>(null);

  const form = useForm<WaitlistInput, unknown, WaitlistData>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: EMPTY,
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Liste d’attente"
      onOpenChangeComplete={(isOpen) => {
        if (isOpen) return;
        setJoined(null);
        form.clearErrors();
      }}
    >
      {product &&
        (joined ? (
          <WaitlistDone product={product} joined={joined} />
        ) : (
          <WaitlistForm product={product} form={form} onDone={setJoined} />
        ))}
    </Modal>
  );
}

function ProductSummary({ product }: { product: Product }) {
  return (
    <div className="flex items-center gap-3 border border-border p-2">
      <Image src={product.image} alt="" width={64} height={64} className="size-14 shrink-0 object-cover" />
      <p className="leading-snug">
        <span className="font-bold">{product.name}</span>
        <span className="block text-[0.8125rem] text-muted-foreground">{product.format}</span>
        <span className="block text-[0.8125rem] font-bold text-heart">Épuisé</span>
      </p>
    </div>
  );
}

function WaitlistForm({
  product,
  form,
  onDone,
}: {
  product: Product;
  form: UseFormReturn<WaitlistInput, unknown, WaitlistData>;
  onDone: (joined: Joined) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = form;

  const submit = handleSubmit((data) => {
    setFormError(null);
    startTransition(async () => {
      const result = await joinWaitlist(product.id, data);
      if (result.ok) return onDone(result);
      setFormError(result.error);
      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
        setError(field as keyof WaitlistInput, { message });
      }
    });
  });

  return (
    <form noValidate onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
        <h3 tabIndex={-1} data-step-heading className="text-lg leading-snug font-bold outline-none">
          Prévenez-moi quand il revient
        </h3>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">
          Ce produit est épuisé au prix EZIMAD. Laissez votre numéro : les premiers de la liste seront servis en priorité.
        </p>
        <ProductSummary product={product} />
        <div className="mt-4 flex flex-col gap-4">
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
        <DialogClose type="button" className="btn-secondary" disabled={pending}>
          Annuler
        </DialogClose>
        <button type="submit" className="btn-primary font-bold" disabled={pending}>
          {pending ? "Inscription…" : "Rejoindre la liste d’attente"}
        </button>
      </ModalFooter>
    </form>
  );
}

function WaitlistDone({ product, joined }: { product: Product; joined: Joined }) {
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
        <div>
          <h3 ref={headingRef} tabIndex={-1} data-step-heading className="text-lg font-bold text-success outline-none">
            {joined.status === "updated" ? "Vous étiez déjà sur la liste" : "Vous êtes sur la liste d’attente"}
          </h3>
          <p className="mt-1">
            Merci {joined.fullName}. Nous vous préviendrons sur WhatsApp dès que «&nbsp;{product.name}&nbsp;» sera de
            nouveau disponible.
          </p>
        </div>
      </div>
      <ModalFooter>
        <DialogClose className="btn-primary w-full sm:w-auto">Continuer mes achats</DialogClose>
      </ModalFooter>
    </>
  );
}
