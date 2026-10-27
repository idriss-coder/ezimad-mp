import { cn } from "cn";

import { DialogTrigger } from "@/components/ui/dialog";

/**
 * Bouton qui ouvre le dialogue d'inscription (doit être rendu à l'intérieur de `SignupDialog`).
 * `primary` : jaune Amazon (appels principaux) ; `buy` : orange « Acheter maintenant » (fiches produits).
 */
export function SignupButton({
  className,
  variant = "primary",
  children = "Je m’inscris",
}: {
  className?: string;
  variant?: "primary" | "buy";
  children?: React.ReactNode;
}) {
  return (
    <DialogTrigger className={cn(variant === "buy" ? "btn-buy" : "btn-primary", className)}>{children}</DialogTrigger>
  );
}
