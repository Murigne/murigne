import { Info } from "lucide-react";

import { cn } from "@/lib/utils";

type FormulaTooltipProps = {
  title: string;
  formula: string;
  definition: string;
  source: string;
  className?: string;
};

export function FormulaTooltip({
  title,
  formula,
  definition,
  source,
  className,
}: FormulaTooltipProps): React.JSX.Element {
  return (
    <div className={cn("group relative inline-flex", className)}>
      <button
        aria-label={`Show formula for ${title}`}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-white/90 text-brand-blue transition hover:border-brand-blue/30 hover:bg-brand-blue/5"
        type="button"
      >
        <Info className="h-4 w-4" />
      </button>
      <div className="pointer-events-none absolute right-0 top-10 z-20 w-72 translate-y-1 rounded-3xl border border-border/80 bg-white p-4 text-left opacity-0 shadow-[0_20px_50px_-26px_rgba(8,34,78,0.32)] transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange">
          {title}
        </p>
        <p className="mt-3 text-sm font-semibold text-brand-navy">{formula}</p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{definition}</p>
        <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">{source}</p>
      </div>
    </div>
  );
}
