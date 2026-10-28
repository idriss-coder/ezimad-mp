import type { Metadata } from "next";

import { SiteFooter } from "@/components/shared/site-footer";
import { SiteHeader } from "@/components/shared/site-header";
import { OFFER_DEADLINE_LABEL } from "@/data/catalog";
import { CartBar } from "@/features/cart/cart-button";
import { NoPaymentNotice } from "@/features/cart/no-payment-notice";
import { ShopProvider } from "@/features/cart/shop-provider";
import { CountdownBackdrop } from "@/features/offer/countdown-backdrop";
import { DeadlineCountdown } from "@/features/offer/deadline-countdown";
import { ProductList } from "@/features/products/product-list";

export const metadata: Metadata = {
  title: { absolute: "EZIMAD — Prix préférentiels pour les salariés des zones MAGZI" },
  alternates: { canonical: "/cm" },
};

/*
 * Page volontairement « à l'ancienne » (demande client) : le compte à rebours des réductions en haut,
 * les produits en dessous. On ajoute au panier, puis « Réserver » ouvre le dialogue du panier (coordonnées → confirmation).
 * La section entreprises partenaires est masquée (code conservé dans `features/partner-leads`).
 */
export default function CmPage() {
  return (
    <ShopProvider>
      <SiteHeader />
      <main className="flex-1">
        <section
          aria-labelledby="offre-title"
          className="relative isolate overflow-hidden border-b border-border px-4 py-10 text-center sm:py-14"
        >
          <CountdownBackdrop />
          <h1
            id="offre-title"
            className="mx-auto max-w-3xl text-[clamp(1.375rem,4.2vw,2.125rem)] leading-tight font-bold text-balance"
          >
            Les produits des entreprises MAGZI, à prix préférentiels pour les salariés des zones industrielles.
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-pretty sm:text-lg">
            Réservez avant le <strong>{OFFER_DEADLINE_LABEL}</strong> pour bénéficier des réductions affichées.
          </p>
          <div aria-hidden className="mx-auto mt-5 h-[3px] w-16 bg-heart" />
          <p className="mt-6 text-[0.625rem] font-bold tracking-[0.12em] uppercase">Fin des réductions dans</p>
          <div className="mt-3">
            <DeadlineCountdown />
          </div>
          <NoPaymentNotice className="mx-auto mt-8 max-w-md" />
          <a href="#produits" className="btn-buy mt-5 w-full max-w-xs text-base font-bold">
            Voir les produits
          </a>
        </section>

        <section id="produits" aria-labelledby="produits-title" className="mx-auto w-full max-w-4xl scroll-mt-2 px-4 pt-8 pb-12 sm:pt-10">
          <h2 id="produits-title" className="text-xl font-bold sm:text-2xl">
            Produits du quotidien
          </h2>
          <p className="mt-2 mb-6 border-l-[3px] border-heart pl-3 text-sm sm:text-base">
            Commandez avant le <strong>{OFFER_DEADLINE_LABEL}</strong> pour bénéficier des réductions affichées. Stocks
            limités au prix EZIMAD.
          </p>
          <ProductList />
        </section>
      </main>
      <SiteFooter />
      <CartBar />
    </ShopProvider>
  );
}
