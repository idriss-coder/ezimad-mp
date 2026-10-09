import { ArrowDownRight } from "lucide-react";

export function Brand() {
  return (
    <span className="flex items-center gap-2">
      <span aria-hidden className="grid size-7 place-items-center rounded-full bg-brand text-white">
        <ArrowDownRight className="size-4" strokeWidth={2.5} />
      </span>
      <span className="text-[1.1875rem] font-semibold tracking-[-0.03em]">ezimad</span>
    </span>
  );
}
