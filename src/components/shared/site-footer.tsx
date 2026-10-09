import { Brand } from "./brand";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-3">
          <Brand />
          <p className="max-w-xs text-sm text-muted-foreground">Prix préférentiels pour les salariés des zones MAGZI.</p>
        </div>
        <div id="confidentialite" className="flex max-w-xl flex-col gap-2 text-sm">
          <h2 className="font-medium">Confidentialité</h2>
          <p className="text-muted-foreground">
            Vos informations servent uniquement à mesurer la demande et à vous prévenir de l’ouverture des offres. Elles
            ne sont ni vendues ni transmises : les producteurs ne reçoivent que des totaux. Pour les modifier ou les
            supprimer, répondez à l’un de nos messages WhatsApp.
          </p>
        </div>
      </div>
      <p className="mx-auto max-w-6xl px-4 pb-8 text-sm text-muted-foreground sm:px-6">© 2026 EZIMAD-MP</p>
    </footer>
  );
}
