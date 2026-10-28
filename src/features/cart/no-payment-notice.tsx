import { cn } from "cn";

/** Encadré vert « Pas de paiement initial requis », sur la page et dans le panier. */
export function NoPaymentNotice({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-start gap-2.5 rounded-[3px] border border-[#8fd19e] bg-[#f0faf2] px-3 py-2.5 text-left", className)}>
      <span
        aria-hidden
        className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-success text-xs leading-none font-bold text-white"
      >
        ✓
      </span>
      <p className="text-sm">
        <strong>Pas de paiement initial requis.</strong> Réservez maintenant : nous vous contactons sur WhatsApp pour
        confirmer, puis quand vos produits sont prêts.
      </p>
    </div>
  );
}
