import { Badge } from "@/components/ui/badge";
import { type VintageHighlight } from "@/lib/mock-data";

type VintageLabelProps = {
  vintage: VintageHighlight;
};

export function VintageLabel({ vintage }: VintageLabelProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-end gap-2 text-right">
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
