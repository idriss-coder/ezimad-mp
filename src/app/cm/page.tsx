import type { Metadata } from "next";

import { SiteFooter } from "@/components/shared/site-footer";
import { SiteHeader } from "@/components/shared/site-header";
import { CartBar } from "@/features/cart/cart-button";
import { NoPaymentNotice } from "@/features/cart/no-payment-notice";
import { ShopProvider } from "@/features/cart/shop-provider";
import { HeroBackdrop } from "@/features/offer/hero-backdrop";
import { ProductRequestSection } from "@/features/product-requests/product-request-section";
import { ProductList } from "@/features/products/product-list";

export const metadata: Metadata = {
  title: { absolute: "Ezimarket — Prix préférentiels pour les salariés des Zones Industrielles MAGZI de Douala" },
  alternates: { canonical: "/cm" },
};

/*
 * Page volontairement « à l'ancienne » (demande client) : le titre en haut, les produits en pack en dessous. On ajoute au panier, puis « Réserver » ouvre le dialogue du panier (coordonnées → confirmation).
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
          <HeroBackdrop />
          <h1
            id="offre-title"
            className="mx-auto max-w-3xl text-[clamp(1.375rem,4.2vw,2.125rem)] leading-tight font-bold text-balance"
          >
            Les produits des entreprises des Zones Industrielles MAGZI de Douala, à prix préférentiels pour les salariés.
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-pretty sm:text-lg">
            Réservez vos packs au prix Ezimarket et économisez sur chaque produit.
          </p>
          <NoPaymentNotice className="mx-auto mt-6 max-w-md" />
          <a href="#produits" className="btn-buy mt-5 w-full max-w-xs text-base font-bold">
            Voir les produits
          </a>
        </section>

        <section id="produits" aria-labelledby="produits-title" className="mx-auto w-full max-w-4xl scroll-mt-2 px-4 pt-8 pb-12 sm:pt-10">
          <h2 id="produits-title" className="mb-6 text-xl font-bold sm:text-2xl">
            Produits du quotidien
          </h2>
          <ProductList />
          <ProductRequestSection />
        </section>
      </main>
      <SiteFooter />
      <CartBar />
    </ShopProvider>
  );
}
