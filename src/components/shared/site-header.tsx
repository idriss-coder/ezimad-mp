import { buttonVariants } from "@/components/ui/button";

import { Brand } from "./brand";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 mx-auto w-full max-w-6xl px-2 pt-2 sm:px-6 sm:pt-3">
      <div className="flex h-14 items-center justify-between gap-4 rounded-xl border border-border bg-background/95 pr-2 pl-4 backdrop-blur-sm">
        <a href="#top" aria-label="EZIMAD, retour en haut">
          <Brand />
        </a>
        <nav aria-label="Navigation principale" className="flex items-center gap-2">
          <a href="#partenaires" className={buttonVariants({ variant: "soft", size: "lg", className: "px-3.5" })}>
            Entreprises
          </a>
          <a href="#inscription" className={buttonVariants({ size: "lg", className: "px-3.5" })}>
            S’inscrire
          </a>
        </nav>
      </div>
    </header>
  );
}
