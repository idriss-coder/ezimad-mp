import { CartButton } from "@/features/cart/cart-button";

import { Brand } from "./brand";

export function SiteHeader() {
  return (
    <header id="top">
      <div className="bg-nav text-white">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-3 px-3 sm:px-4">
          <a
            href="#top"
            aria-label="EZIMAD, haut de la page"
            className="rounded-[2px] px-1.5 py-2 outline-offset-0 hover:outline hover:outline-1 hover:outline-white"
          >
            <Brand />
          </a>
          <CartButton />
        </div>
      </div>
    </header>
  );
}
