import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { FormulaTooltip } from "@/components/ui/formula-tooltip";
import { type BankHealthRatio } from "@/lib/mock-data";

type RatioDisplayProps = {
  ratio: BankHealthRatio;
};

export function RatioDisplay({ ratio }: RatioDisplayProps): React.JSX.Element {
  return (
    <Card variant={ratio.cardTone} className="murigne-card-pad">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="murigne-eyebrow">{ratio.category}</p>
          <h3 className="mt-3 text-lg font-semibold text-brand-navy">{ratio.name}</h3>
        </div>
        <FormulaTooltip
          definition={ratio.definition}
          formula={ratio.formula}
          source={ratio.source}
          title={ratio.name}
        />
      </div>
      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <p className="murigne-stat font-semibold text-brand-navy">{ratio.value}</p>
          <p className="mt-2 text-sm text-muted-foreground">{ratio.context}</p>
        </div>
        <Badge tone={ratio.statusTone} variant="soft">
          {ratio.status}
        </Badge>
      </div>
    </Card>
  );
}
