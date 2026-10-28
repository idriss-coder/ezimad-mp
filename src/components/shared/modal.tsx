"use client";

import { XIcon } from "lucide-react";
import { useRef } from "react";

import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Appelé une fois l'animation d'ouverture ou de fermeture terminée. */
  onOpenChangeComplete?: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
};

/**
 * Boîte de dialogue « à l'ancienne » : bandeau gris avec titre et croix, contenu défilant.
 * À l'ouverture, le focus va sur l'élément `[data-step-heading]` du contenu s'il existe.
 */
export function Modal({ open, onOpenChange, onOpenChangeComplete, title, children }: ModalProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} onOpenChangeComplete={onOpenChangeComplete}>
      <DialogContent
        ref={popupRef}
        showCloseButton={false}
        initialFocus={() => popupRef.current?.querySelector<HTMLElement>("[data-step-heading]") ?? true}
        className="flex max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden p-0 text-base sm:max-w-lg"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-surface py-1.5 pr-1.5 pl-4 sm:pl-5">
          <DialogTitle className="text-base leading-normal font-bold">{title}</DialogTitle>
          <DialogClose
            aria-label="Fermer"
            className="grid size-10 place-items-center rounded-[3px] text-muted-foreground hover:bg-white hover:text-foreground"
          >
            <XIcon className="size-5" aria-hidden />
          </DialogClose>
        </div>
        {children}
      </DialogContent>
    </Dialog>
  );
}

/** Pied de dialogue : boutons alignés à droite, empilés sur mobile. */
export function ModalFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-border px-4 py-3 sm:flex-row sm:justify-end sm:px-5">
      {children}
    </div>
  );
}
