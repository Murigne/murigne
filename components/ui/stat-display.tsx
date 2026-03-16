import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type OverviewCard } from "@/lib/mock-data";

const trendIcon = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: Minus,
} as const;

type StatDisplayProps = OverviewCard;

export function StatDisplay({
  label,
  value,
  description,
  delta,
  trend,
  tone,
}: StatDisplayProps): React.JSX.Element {
  const TrendIcon = trendIcon[trend];

  return (
    <Card className="murigne-card-pad" variant={tone}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="murigne-eyebrow text-muted-foreground">{label}</p>
          <p className="murigne-stat mt-4 font-semibold text-brand-navy">{value}</p>
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl",
            trend === "up" && "bg-success/10 text-success",
            trend === "down" && "bg-danger/10 text-danger",
            trend === "flat" && "bg-brand-blue/10 text-brand-blue",
          )}
        >
          <TrendIcon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">{description}</p>
      <div className="mt-4">
        <Badge tone={trend === "up" ? "success" : trend === "down" ? "danger" : "info"} variant="soft">
          {delta}
        </Badge>
      </div>
    </Card>
  );
}
