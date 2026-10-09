"use client";

import { CircleCheck, Info } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useState } from "react";
import { cn } from "cn";

import type { ProductId } from "@/data/catalog";
import { InterestPicker } from "@/features/product-interest/interest-picker";

import type { RegisterResult } from "./actions";
import { RegistrationForm } from "./registration-form";
import { SignupSuccess } from "./signup-success";
import type { CurrentLead } from "./types";

type Step2 = {
  firstName: string;
  interests: ProductId[];
  status: "created" | "updated" | "returning";
  done: boolean;
};

const MESSAGES: Record<Step2["status"], (name: string) => { title: string; body: string }> = {
  created: (name) => ({
    title: `Plus qu’une étape, ${name}.`,
    body: "Choisissez un ou plusieurs produits, puis validez.",
  }),
  updated: (name) => ({
    title: `${name}, vous étiez déjà inscrit.`,
    body: "Vos informations ont été mises à jour. Vérifiez vos produits, puis validez.",
  }),
  returning: (name) => ({
    title: `${name}, vos produits.`,
    body: "Modifiez vos choix, puis validez.",
  }),
};

export function SignupFlow({
  initialLead,
  productCounts,
}: {
  initialLead: CurrentLead | null;
  productCounts: Record<string, number> | null;
}) {
  const [step2, setStep2] = useState<Step2 | null>(
    initialLead
      ? { firstName: initialLead.firstName, interests: initialLead.productInterests, status: "returning", done: false }
      : null,
  );

  function handleSuccess(result: Extract<RegisterResult, { ok: true }>) {
    setStep2({ firstName: result.firstName, interests: result.productInterests, status: result.status, done: false });
    scrollToTop();
  }

  function handleSaved(interests: ProductId[]) {
    setStep2((current) => current && { ...current, interests, done: true });
    scrollToTop();
  }

  const message = step2 && MESSAGES[step2.status](step2.firstName);

  const step = step2 ? 2 : 1;
  const screen = step2?.done ? "success" : step2 ? "interests" : "register";

  return (
    <MotionConfig reducedMotion="user">
      <div className="rounded-xl border border-border bg-card p-5 sm:p-8">
        <div className="mb-7 flex items-center gap-4">
          <p className="shrink-0 text-sm text-muted-foreground" aria-live="polite">
            {step2?.done ? "Inscription terminée" : `Étape ${step} sur 2`}
          </p>
          <div aria-hidden className="grid flex-1 grid-cols-2 gap-1.5">
            <span className="h-1 rounded-full bg-foreground" />
            <span
              className={cn(
                "h-1 rounded-full transition-colors duration-500",
                step === 2 ? "bg-foreground" : "bg-border",
              )}
            />
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
            }}
            exit={{
              opacity: 0,
              y: -8,
              transition: { duration: 0.18, ease: "easeIn" },
            }}
          >
            {step2?.done ? (
              <SignupSuccess
                firstName={step2.firstName}
                interests={step2.interests}
                onEdit={() => setStep2({ ...step2, status: "returning", done: false })}
              />
            ) : step2 && message ? (
              <div className="flex flex-col gap-6">
                <div role="status" className="flex gap-3">
                  {step2.status === "updated" ? (
                    <Info className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
                  ) : (
                    <CircleCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden />
                  )}
                  <div>
                    <p className="font-medium">{message.title}</p>
                    <p className="text-sm text-muted-foreground">{message.body}</p>
                  </div>
                </div>
                <h3 className="text-[1.375rem] leading-tight font-medium tracking-[-0.02em]">
                  Quels produits souhaitez-vous acheter moins cher&nbsp;?
                </h3>
                <InterestPicker
                  initialInterests={step2.interests}
                  counts={productCounts}
                  onSaved={handleSaved}
                  onSessionLost={() => setStep2(null)}
                />
              </div>
            ) : (
              <RegistrationForm onSuccess={handleSuccess} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

function scrollToTop() {
  requestAnimationFrame(() => document.getElementById("inscription")?.scrollIntoView({ block: "start" }));
}
