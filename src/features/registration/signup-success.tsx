"use client";

import { motion, type Variants } from "motion/react";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { COMMUNITY_GOAL, PRODUCTS, type ProductId } from "@/data/catalog";

const formatter = new Intl.NumberFormat("fr-FR");

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

const rise: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.85 + i * 0.09, ease: EASE_OUT },
  }),
};

export function SignupSuccess({
  firstName,
  interests,
  onEdit,
}: {
  firstName: string;
  interests: ProductId[];
  onEdit: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const chosen = PRODUCTS.filter((p) => interests.includes(p.id));

  // Le focus suit le changement d'écran (lecteurs d'écran, clavier).
  useEffect(() => headingRef.current?.focus({ preventScroll: true }), []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center gap-6 py-4 text-center sm:py-8"
    >
      <motion.svg
        viewBox="0 0 52 52"
        className="size-16 text-success"
        aria-hidden
        variants={{
          hidden: { scale: 0.6, opacity: 0 },
          visible: {
            scale: [0.6, 1.08, 1],
            opacity: 1,
            transition: { duration: 0.5, times: [0, 0.6, 1], ease: EASE_OUT },
          },
        }}
      >
        <motion.circle
          cx="26"
          cy="26"
          r="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          transform="rotate(-90 26 26)"
          variants={{
            hidden: { pathLength: 0 },
            visible: {
              pathLength: 1,
              transition: { duration: 0.65, delay: 0.1, ease: EASE_IN_OUT },
            },
          }}
        />
        <motion.path
          d="M15 27l7.5 7.5L37 19.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: { duration: 0.38, delay: 0.65, ease: EASE_IN_OUT },
            },
          }}
        />
      </motion.svg>

      <motion.div variants={rise} custom={0} className="flex max-w-md flex-col gap-2">
        <h3
          ref={headingRef}
          tabIndex={-1}
          className="text-[1.5rem] leading-tight font-medium tracking-[-0.02em] outline-none"
        >
          C’est fait, {firstName}. Vous êtes inscrit.
        </h3>
        <p className="text-muted-foreground">
          À {formatter.format(COMMUNITY_GOAL)} inscrits, nous négocions les prix avec les producteurs MAGZI. Vous serez
          prévenu sur WhatsApp dès l’ouverture des offres.
        </p>
      </motion.div>

      {chosen.length > 0 && (
        <motion.ul variants={rise} custom={1} aria-label="Vos produits" className="flex flex-wrap justify-center gap-2">
          {chosen.map((product) => (
            <li
              key={product.id}
              className="inline-flex items-center gap-2 rounded-full bg-secondary py-1 pr-3.5 pl-1 text-sm"
            >
              <span className="relative size-7 shrink-0 overflow-hidden rounded-full bg-surface">
                <Image src={product.image} alt="" fill sizes="28px" className="object-cover" />
              </span>
              {product.name}
            </li>
          ))}
        </motion.ul>
      )}

      <motion.div variants={rise} custom={2}>
        <Button type="button" variant="ghost" size="lg" onClick={onEdit} className="text-muted-foreground">
          Modifier mes choix
        </Button>
      </motion.div>
    </motion.div>
  );
}
