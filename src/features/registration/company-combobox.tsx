"use client";

import { Building2, Check, ChevronsUpDown, Plus } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "cn";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MAGZI_COMPANIES, zoneLabel, type MagziCompany } from "@/data/magzi-companies";

type Props = {
  id: string;
  value: { companyId?: string; companyName: string };
  onChange: (value: { companyId: string; companyName: string; company?: MagziCompany }) => void;
  invalid?: boolean;
  describedBy?: string;
};

/** Combobox searchable : liste MAGZI centralisée + saisie libre si l'entreprise n'y figure pas. */
export function CompanyCombobox({ id, value, onChange, invalid, describedBy }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const query = search.trim();
  const exactMatch = MAGZI_COMPANIES.some((c) => c.name.toLowerCase() === query.toLowerCase());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={cn(
          "flex h-11 w-full items-center justify-between gap-2 rounded-md border border-input bg-card px-3 text-left text-base outline-none",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        )}
      >
        <span className={cn("flex min-w-0 items-center gap-2", !value.companyName && "text-muted-foreground")}>
          <Building2 className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <span className="truncate">{value.companyName || "Rechercher votre entreprise"}</span>
        </span>
        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      </PopoverTrigger>
      <PopoverContent align="start" initialFocus={inputRef} className="w-(--anchor-width) min-w-72 p-0">
        <Command>
          <CommandInput
            ref={inputRef}
            placeholder="Nom de l’entreprise…"
            value={search}
            onValueChange={setSearch}
            className="text-base sm:text-sm"
          />
          <CommandList>
            <CommandEmpty className="px-3 py-4 text-left text-sm text-muted-foreground">
              {query ? "Aucune entreprise de la liste ne correspond." : "Tapez le nom de votre entreprise."}
            </CommandEmpty>
            {MAGZI_COMPANIES.length > 0 && (
              <CommandGroup heading="Entreprises des zones MAGZI">
                {MAGZI_COMPANIES.map((company) => (
                  <CommandItem
                    key={company.id}
                    value={company.name}
                    onSelect={() => {
                      onChange({ companyId: company.id, companyName: company.name, company });
                      setSearch("");
                      setOpen(false);
                    }}
                    className="py-2"
                  >
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate">{company.name}</span>
                      <span className="text-xs text-muted-foreground">{zoneLabel(company.zoneId)}</span>
                    </span>
                    <Check
                      className={cn("ml-auto", value.companyId === company.id ? "opacity-100" : "opacity-0")}
                      aria-hidden
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {query.length >= 2 && !exactMatch && (
              <CommandGroup heading="Pas dans la liste ?" forceMount>
                <CommandItem
                  value={`__free__${query}`}
                  forceMount
                  onSelect={() => {
                    onChange({ companyId: "", companyName: query });
                    setSearch("");
                    setOpen(false);
                  }}
                  className="py-2"
                >
                  <Plus aria-hidden />
                  <span className="truncate">
                    Utiliser « <strong>{query}</strong> »
                  </span>
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
