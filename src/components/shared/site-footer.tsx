import { Brand } from "./brand";

export function SiteFooter() {
  return (
    <footer className="mt-auto text-white">
      <a href="#top" className="block bg-nav-3 py-3.5 text-center text-sm hover:bg-[#485769]">
        Haut de la page
      </a>
      <div className="bg-nav-2">
        <div className="mx-auto grid max-w-4xl gap-6 px-4 py-8 sm:grid-cols-[1fr_2fr] sm:gap-10">
          <div>
            <Brand />
            <p className="mt-2 text-sm text-[#dddddd]">Prix préférentiels pour les salariés des zones MAGZI.</p>
          </div>
          <div id="confidentialite">
            <h2 className="font-bold">Confidentialité</h2>
            <p className="mt-1 text-sm text-[#dddddd]">
              Vos informations servent uniquement à mesurer la demande et à vous prévenir de l’ouverture des offres. Elles
              ne sont ni vendues ni transmises : les producteurs ne reçoivent que des totaux. Pour les modifier ou les
              supprimer, répondez à l’un de nos messages WhatsApp.
            </p>
          </div>
        </div>
      </div>
      <p className="bg-nav py-4 text-center text-xs text-[#dddddd]">© 2026 EZIMAD</p>
    </footer>
  );
}
