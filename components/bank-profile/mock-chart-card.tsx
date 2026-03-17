import { Card } from "@/components/ui/card";
import { type CamelComponent } from "@/lib/bank-profile";

type MockChartCardProps = {
  score: number | null;
  band: string | null;
  percentile: number | null;
  components: Array<{
    component: CamelComponent;
    score: number | null;
  }>;
};

export function MockChartCard({
  score,
  band,
  percentile,
  components,
}: MockChartCardProps): React.JSX.Element {
  return (
    <Card className="murigne-card-pad">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="murigne-eyebrow text-muted-foreground">CAMEL composite</p>
          <h2 className="mt-2 text-xl font-semibold text-brand-navy">Composite radar container</h2>
        </div>
        <div className="rounded-full border border-brand-gold/40 bg-brand-gold/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-navy">
          {band ?? "N/A"}
        </div>
      </div>
      <div
        aria-label={`Radar placeholder showing all five CAMEL components. Composite score ${score ?? "N/A"} and peer percentile ${percentile ?? "N/A"}.`}
        className="mt-6 flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-border bg-[radial-gradient(circle_at_center,_rgba(15,27,45,0.06)_0,_transparent_62%)] p-6"
        role="img"
      >
        <div className="grid w-full max-w-sm grid-cols-2 gap-3 text-sm text-muted-foreground sm:grid-cols-3">
          {components.map((item) => (
            <div key={item.component} className="rounded-xl border border-border/70 bg-white/90 px-3 py-2">
              <p className="text-xs uppercase tracking-[0.18em]">{item.component.replace("_", " ")}</p>
              <p className="mt-2 font-semibold text-brand-navy [font-variant-numeric:tabular-nums]">
                {item.score?.toFixed(2) ?? "N/A"}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Numeric score</p>
          <p className="mt-2 text-2xl font-semibold text-brand-navy [font-variant-numeric:tabular-nums]">
            {score?.toFixed(2) ?? "N/A"}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Peer percentile</p>
          <p className="mt-2 text-2xl font-semibold text-brand-navy [font-variant-numeric:tabular-nums]">
            {percentile ?? "N/A"}
          </p>
        </div>
      </div>
    </Card>
  );
}
