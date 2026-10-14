import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

import { SiteFooter } from "@/components/shared/site-footer";
import { SiteHeader } from "@/components/shared/site-header";
import { CategoryList } from "@/features/categories/category-list";
import { CountdownBackdrop, CountdownBoard } from "@/features/public-stats/countdown-board";
import { getPublicStats } from "@/features/public-stats/queries";
import { SignupButton } from "@/features/registration/signup-button";
import { SignupDialog } from "@/features/registration/signup-dialog";

export const metadata: Metadata = {
  title: { absolute: "EZIMAD — Prix préférentiels pour les salariés des zones MAGZI" },
  alternates: { canonical: "/cm" },
};

/*
 * Page volontairement « à l'ancienne » (demande client) : le compteur en haut, la liste des catégories en dessous.
 * Toute l'inscription se fait dans le dialogue. La section entreprises partenaires est masquée
 * (code conservé dans `features/partner-leads`).
 */
export default function CmPage() {
  return (
    <SignupDialog>
      <SiteHeader />
      <main className="flex-1">
        <section
          aria-labelledby="compteur-title"
          className="relative isolate overflow-hidden border-b border-border px-4 py-10 text-center sm:py-14"
        >
          <CountdownBackdrop />
          <h1
            id="compteur-title"
            className="mx-auto max-w-3xl text-[clamp(1.375rem,4.2vw,2.125rem)] leading-tight font-bold text-balance"
          >
            Les produits des entreprises MAGZI, à prix préférentiels pour les salariés des zones industrielles.
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-pretty sm:text-lg">
            Inscrivez-vous gratuitement pour accéder prochainement aux offres négociées directement auprès des
            producteurs.
          </p>
          <div aria-hidden className="mx-auto mt-5 h-[3px] w-16 bg-heart" />
          <div className="mt-8">
            <Suspense fallback={<CountdownBoard total={undefined} />}>
              <LiveCountdown />
            </Suspense>
          </div>
          <p className="mt-9 text-sm font-bold tracking-[0.14em] uppercase">M’avertir à l’ouverture des offres</p>
          <SignupButton className="mt-3 w-full max-w-xs text-base font-bold" />
        </section>

        <section aria-labelledby="categories-title" className="mx-auto w-full max-w-4xl px-4 pt-8 pb-12 sm:pt-10">
          <h2 id="categories-title" className="border-b border-border pb-2 text-xl font-bold sm:text-2xl">
            Catégories de produits
          </h2>
          <Suspense fallback={<CategoryList counts={undefined} />}>
            <LiveCategoryList />
          </Suspense>
          <div className="mt-4 flex flex-col items-center gap-3 border-t border-border pt-8 text-center">
            <p className="font-bold">Une de ces catégories vous intéresse&nbsp;?</p>
            <SignupButton className="w-full max-w-xs text-base font-bold" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </SignupDialog>
  );
}

/*
 * Les blocs chiffrés sont rendus à la requête (lecture du cache `getPublicStats`)
 * plutôt qu'au prerender : le driver MongoDB ne doit pas s'exécuter pendant un prerender.
 */
async function LiveCountdown() {
  await connection();
  const stats = await getPublicStats();
  return <CountdownBoard total={stats?.totalEmployees ?? null} />;
}

async function LiveCategoryList() {
  await connection();
  const stats = await getPublicStats();
  return <CategoryList counts={stats?.interestsByCategory ?? null} />;
}
