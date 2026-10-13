import { cn } from "cn";

import { DialogTrigger } from "@/components/ui/dialog";

/** Bouton jaune qui ouvre le dialogue d'inscription (doit être rendu à l'intérieur de `SignupDialog`). */
export function SignupButton({ className, children = "Je m’inscris" }: { className?: string; children?: React.ReactNode }) {
  return <DialogTrigger className={cn("btn-primary", className)}>{children}</DialogTrigger>;
}
