import { SignupButton } from "@/features/registration/signup-button";

import { Brand } from "./brand";

export function SiteHeader() {
  return (
    <header id="top">
      <div className="bg-nav text-white">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-4 px-3 sm:px-4">
          <a
            href="#top"
            aria-label="EZIMAD, haut de la page"
            className="rounded-[2px] px-1.5 py-2 outline-offset-0 hover:outline hover:outline-1 hover:outline-white"
          >
            <Brand />
          </a>
          <SignupButton className="min-h-10 px-4 text-sm font-bold">S’inscrire</SignupButton>
        </div>
      </div>
      <div className="bg-nav-2 text-white">
        <p className="mx-auto max-w-4xl px-3 py-2 text-sm sm:px-4">Prix préférentiels pour les salariés des zones MAGZI</p>
      </div>
    </header>
  );
}
