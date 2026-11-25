"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm, type DefaultValues } from "react-hook-form";

import { Modal, ModalFooter } from "@/components/shared/modal";
import { DialogClose } from "@/components/ui/dialog";
import { isPriced } from "@/data/catalog";
import { formatFcfa } from "@/lib/format";
import { ProductPhoto } from "@/features/products/product-photo";
import { ReservationDone } from "@/features/reservation/reservation-done";
import { ReservationForm, type Reserved } from "@/features/reservation/reservation-form";
import { reservationSchema, type ReservationData, type ReservationInput } from "@/features/reservation/schema";

import { cartSummary, clearCart, useCartItems } from "./cart-store";
import { NoPaymentNotice } from "./no-payment-notice";
import { QuantityStepper } from "./quantity-stepper";

type Step = "cart" | "details" | "done";

const TITLES: Record<Step, string> = { cart: "Panier", details: "Réservation", done: "Réservation" };

const EMPTY: DefaultValues<ReservationInput> = {
  fullName: "",
  phone: "",
  companyId: "",
  companyName: "",
  consent: false,
  website: "",
};

/** Dialogue du panier, à la manière du panier Amazon : panier → « Réserver » → coordonnées → confirmation. */
export function CartDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [step, setStep] = useState<Step>("cart");
  const [reserved, setReserved] = useState<Reserved | null>(null);
  const cart = useCartItems();

  const form = useForm<ReservationInput, unknown, ReservationData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: EMPTY,
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={TITLES[step]}
      // Une fois fermé, le dialogue rouvre sur le panier. Les coordonnées restent saisies pour une prochaine réservation.
      onOpenChangeComplete={(isOpen) => {
        if (isOpen) return;
        setStep("cart");
        setReserved(null);
      }}
    >
      {step === "done" && reserved ? (
        <ReservationDone reserved={reserved} />
      ) : step === "details" && Object.keys(cart).length > 0 ? (
        <ReservationForm
          form={form}
          cart={cart}
          onBack={() => setStep("cart")}
          onDone={(result) => {
            setReserved(result);
            setStep("done");
            clearCart();
          }}
        />
      ) : (
        <CartView focusOnMount={step !== "cart"} onReserve={() => setStep("details")} />
      )}
    </Modal>
  );
}

function CartView({ onReserve, focusOnMount }: { onReserve: () => void; focusOnMount: boolean }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { lines, count, total, savings, unpriced } = cartSummary(useCartItems());

  // Retour depuis les coordonnées : le focus revient sur le titre (à l'ouverture, c'est le dialogue qui le place).
  useEffect(() => {
    if (focusOnMount) headingRef.current?.focus();
  }, [focusOnMount]);

  const heading = (
    <h3 ref={headingRef} tabIndex={-1} data-step-heading className="text-lg leading-snug font-bold outline-none">
      {lines.length === 0 ? "Votre panier est vide" : "Votre panier"}
    </h3>
  );

  if (lines.length === 0) {
    return (
      <>
        <div className="px-4 py-5 sm:px-5">
          {heading}
          <p className="mt-1">Ajoutez des produits pour les réserver au prix Ezimarket.</p>
        </div>
        <ModalFooter>
          <DialogClose className="btn-primary w-full sm:w-auto">Voir les produits</DialogClose>
        </ModalFooter>
      </>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
        {heading}
        <ul className="mt-2">
          {lines.map(({ product, quantity }) => (
            <li key={product.id} className="flex gap-3 border-b border-border py-3">
              <ProductPhoto
                product={product}
                size={80}
                decorative
                className="size-16 shrink-0 border border-border sm:size-20"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="leading-snug">
                  <span className="font-bold">{product.name}</span>
                  <span className="block text-[0.8125rem] text-muted-foreground">{product.format}</span>
                </p>
                <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                  <QuantityStepper product={product} quantity={quantity} className="w-32" />
                  <p className="text-right leading-tight">
                    {isPriced(product) ? (
                      <>
                        <strong className="block whitespace-nowrap">{formatFcfa(product.targetPrice * quantity)}</strong>
                        <s className="text-[0.8125rem] whitespace-nowrap text-muted-foreground">
                          {formatFcfa(product.marketPrice * quantity)}
                        </s>
                      </>
                    ) : (
                      <strong className="block whitespace-nowrap">Prix à confirmer</strong>
                    )}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-right text-lg">
          Sous-total ({count} pack{count > 1 ? "s" : ""})&nbsp;: <strong className="whitespace-nowrap">{total > 0 ? formatFcfa(total) : "prix à confirmer"}</strong>
        </p>
        {savings > 0 && (
          <p className="text-right text-sm font-bold text-success">Vous économisez {formatFcfa(savings)}</p>
        )}
        {unpriced > 0 && (
          <p className="text-right text-sm text-muted-foreground">
            {unpriced} pack{unpriced > 1 ? "s" : ""} hors sous-total&nbsp;: prix confirmé sur WhatsApp avant tout paiement.
          </p>
        )}

        <NoPaymentNotice className="mt-4" />
      </div>
      <ModalFooter>
        <DialogClose className="btn-secondary">Continuer mes achats</DialogClose>
        <button type="button" className="btn-buy font-bold" onClick={onReserve}>
          Réserver
        </button>
      </ModalFooter>
    </>
  );
}
