import { cn } from "cn";

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
};

/**
 * Libellé + aide + erreur associés au champ (aria-describedby = `${id}-hint ${id}-error`).
 * Un champ non `optional` est requis : astérisque rouge après le libellé.
 */
export function Field({ id, label, hint, error, optional, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label htmlFor={id} className="text-sm font-bold">
        {label}
        {optional ? (
          <span className="ml-1 font-normal text-muted-foreground">(facultatif)</span>
        ) : (
          <RequiredMark />
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-[0.8125rem] text-muted-foreground">
          {hint}
        </p>
      )}
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}

/** Astérisque rouge des champs requis (le « requis » est annoncé via aria-required sur le champ). */
export function RequiredMark() {
  return (
    <span aria-hidden className="ml-0.5 text-destructive">
      *
    </span>
  );
}

/** Message d'erreur rouge précédé d'un « ! », comme sur les formulaires Amazon. */
export function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} role="alert" className="flex items-start gap-1.5 text-[0.8125rem] text-destructive">
      <span
        aria-hidden
        className="mt-px grid size-4 shrink-0 place-items-center rounded-full bg-destructive text-[0.6875rem] leading-none font-bold text-white"
      >
        !
      </span>
      {children}
    </p>
  );
}

export function describedBy(id: string, error?: string, hint?: string) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}
