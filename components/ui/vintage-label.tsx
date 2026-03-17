import { Badge } from "@/components/ui/badge";
import { type VintageHighlight } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type VintageLabelProps = {
  vintage: VintageHighlight;
  align?: "start" | "end";
  className?: string;
};

export function VintageLabel({
  vintage,
  align = "end",
  className,
}: VintageLabelProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        align === "end" ? "items-end text-right" : "items-start text-left",
        className,
      )}
    >
      <Badge tone={vintage.auditStatus === "Audited" ? "success" : "warning"} variant="soft">
        {vintage.auditStatus}
      </Badge>
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{vintage.period}</p>
        <p className="mt-1 text-sm font-medium text-brand-navy">{vintage.sourceLabel}</p>
      </div>
    </div>
  );
}
