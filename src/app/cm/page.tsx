import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { connection } from "next/server";
import { Suspense } from "react";

import { SiteFooter } from "@/components/shared/site-footer";
import { SiteHeader } from "@/components/shared/site-header";
import { buttonVariants } from "@/components/ui/button";
import { PartnerSection } from "@/features/partner-leads/partner-section";
import { ProductGrid } from "@/features/product-interest/product-grid";
import { ProgressBoard } from "@/features/public-stats/progress-board";
import { getPublicStats } from "@/features/public-stats/queries";
import { getCurrentLead } from "@/features/registration/queries";
import { SignupFlow } from "@/features/registration/signup-flow";

export const metadata: Metadata = {
  title: { absolute: "EZIMAD — Prix préférentiels pour les salariés des zones MAGZI" },
  alternates: { canonical: "/cm" },
};

const STEPS = [
  { title: "Inscrivez-vous", body: "Prénom, WhatsApp et entreprise. C’est gratuit." },
  { title: "Choisissez vos produits", body: "Chaque choix compte dans la négociation." },
  { title: "Achetez moins cher", body: "Nous négocions les prix avec les producteurs MAGZI." },
];

const sectionTitle = "text-[clamp(1.75rem,3.2vw,2.5rem)] leading-[1.08] font-medium tracking-[-0.03em]";

export default function CmPage() {
  return (
    <>
      <SiteHeader />
      <main id="top" className="flex-1">
        <section className="mx-auto grid max-w-6xl gap-10 px-4 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-2 lg:gap-12 lg:pt-6">
          <div className="flex flex-col items-start justify-center gap-6 lg:py-16">
            <p className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground">
              Salariés des zones MAGZI
            </p>
            <h1 className="text-[clamp(2.5rem,5vw,3.75rem)] leading-[1.02] font-medium tracking-[-0.035em]">
              Les produits MAGZI à <span className="text-brand">prix préférentiels</span> pour les salariés.
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
              Inscrivez-vous gratuitement pour accéder aux offres négociées directement auprès des producteurs.
            </p>
            <a href="#inscription" className={buttonVariants({ size: "xl", className: "mt-2 w-full sm:w-auto" })}>
              Je m’inscris gratuitement <ArrowRight className="size-4" aria-hidden />
            </a>
          </div>
          <Suspense fallback={<ProgressBoard total={undefined} />}>
            <LiveProgressBoard />
          </Suspense>
        </section>

        <section id="produits" aria-labelledby="produits-title" className="mx-auto mt-24 max-w-6xl px-4 sm:mt-32 sm:px-6">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <h2 id="produits-title" className={sectionTitle}>
              Les produits à négocier
            </h2>
            <a href="#inscription" className="group inline-flex items-center gap-1.5 text-[0.9375rem] font-medium">
              Choisir mes produits
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </a>
          </div>
          <Suspense fallback={<ProductGrid counts={null} />}>
            <LiveProductGrid />
          </Suspense>
        </section>

        <section id="comment" aria-labelledby="comment-title" className="mx-auto mt-24 max-w-6xl px-4 sm:mt-32 sm:px-6">
          <h2 id="comment-title" className={sectionTitle}>
            Comment ça marche
          </h2>
          <ol className="mt-8 grid gap-8 sm:grid-cols-3 sm:gap-6">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex flex-col gap-1.5 border-t border-foreground pt-5">
                <span className="text-sm text-muted-foreground tabular-nums">{index + 1}</span>
                <h3 className="text-lg font-medium tracking-[-0.01em]">{step.title}</h3>
                <p className="text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          id="inscription"
          aria-labelledby="inscription-title"
          className="mx-auto mt-24 grid max-w-6xl gap-8 px-4 sm:mt-32 sm:px-6 lg:grid-cols-[1fr_1.35fr] lg:gap-16"
        >
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 id="inscription-title" className={sectionTitle}>
              Inscription gratuite
            </h2>
            <p className="mt-3 max-w-sm text-lg text-muted-foreground">Une minute, sans paiement ni engagement.</p>
            <p className="mt-6 hidden max-w-xs text-sm text-muted-foreground lg:block">
              Les producteurs ne voient que des totaux, jamais votre nom ni votre numéro.
            </p>
          </div>
          <Suspense fallback={<SignupSkeleton />}>
            <SignupSlot />
          </Suspense>
        </section>

        <div className="mt-24 sm:mt-32">
          <PartnerSection />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

/*
 * Les blocs chiffrés sont rendus à la requête (lecture du cache `getPublicStats`)
 * plutôt qu'au prerender : le driver MongoDB ne doit pas s'exécuter pendant un prerender.
 */
async function LiveProgressBoard() {
  await connection();
  const stats = await getPublicStats();
  return <ProgressBoard total={stats?.totalEmployees ?? null} />;
}

async function LiveProductGrid() {
  await connection();
  const stats = await getPublicStats();
  return <ProductGrid counts={stats?.interestsByProduct ?? null} />;
}

async function SignupSlot() {
  await connection();
  const [lead, stats] = await Promise.all([getCurrentLead(), getPublicStats()]);
  return <SignupFlow initialLead={lead} productCounts={stats?.interestsByProduct ?? null} />;
}

function SignupSkeleton() {
  return <div aria-busy className="h-[44rem] animate-pulse rounded-xl border border-border bg-surface" />;
}
