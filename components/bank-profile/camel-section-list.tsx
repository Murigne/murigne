import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { FormulaTooltip } from "@/components/ui/formula-tooltip";
import { VintageLabel } from "@/components/ui/vintage-label";
import { formatPercent, type BankProfileResponse } from "@/lib/bank-profile";
import { cn } from "@/lib/utils";

type CamelSectionListProps = {
  sections: BankProfileResponse["camelSections"];
  bankName: string;
};

export function CamelSectionList({ sections, bankName }: CamelSectionListProps): React.JSX.Element {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(sections.map((section) => [section.component, true])),
  );

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        const isOpen = openSections[section.component];

        return (
          <Card key={section.component} className="overflow-hidden">
            <button
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              onClick={() =>
                setOpenSections((current) => ({
                  ...current,
                  [section.component]: !current[section.component],
                }))
              }
              type="button"
            >
              <div>
                <p className="murigne-eyebrow text-muted-foreground">{section.component.replace("_", " ")}</p>
                <h3 className="mt-2 text-lg font-semibold text-brand-navy">{section.label}</h3>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone="info" variant="soft">
                  Score {section.score?.toFixed(2) ?? "N/A"}
                </Badge>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition", isOpen && "rotate-180")} />
              </div>
            </button>
            {isOpen ? (
              <div className="border-t border-border/70 px-5 py-4">
                <div className="space-y-4">
                  {section.ratios.map((ratio) => (
                    <div key={ratio.key} className="rounded-xl border border-border/70 bg-white px-4 py-4">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h4 className="text-base font-semibold text-brand-navy">{ratio.label}</h4>
                            <FormulaTooltip
                              definition={ratio.definition}
                              formula={ratio.formula}
                              source={ratio.benchmarkSource ?? ratio.vintage.sourceLabel}
                              title={ratio.label}
                            />
                          </div>
                          <p className="text-sm leading-6 text-muted-foreground">{ratio.definition}</p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 lg:w-[25rem]">
                          <Metric label="Value" value={formatRatioValue(ratio.value, ratio.unit)} />
                          <Metric label="Prior year" value={formatRatioValue(ratio.priorValue, ratio.unit)} />
                          <Metric
                            label="YoY change"
                            value={ratio.yoyChange === null ? "N/A" : `${ratio.yoyChange >= 0 ? "+" : ""}${(ratio.yoyChange * 100).toFixed(2)}pp`}
                          />
                          <Metric label="Benchmark" value={ratio.benchmarkLabel ?? "Peer reference"} />
                        </div>
                      </div>
                      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Trend placeholder</p>
                          <div
                            aria-label={`${ratio.label} trend from ${ratio.trend[0]?.period ?? "N/A"} to ${ratio.trend.at(-1)?.period ?? "N/A"}.`}
                            className="mt-2 flex min-h-[84px] items-end gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-3 py-4"
                            role="img"
                          >
                            {ratio.trend.map((point) => (
                              <div key={point.period} className="flex flex-1 flex-col items-center gap-2">
                                <div
                                  className="w-full rounded-t bg-brand-navy/70"
                                  style={{
                                    height: `${Math.max(16, Math.round((point.value ?? 0) * 280))}px`,
                                  }}
                                />
                                <span className="text-[11px] text-muted-foreground">{point.period}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <VintageLabel
                          vintage={{
                            bank: bankName,
                            metric: ratio.label,
                            period: ratio.vintage.reportingPeriod,
                            sourceLabel: ratio.vintage.sourceLabel,
                            auditStatus: ratio.vintage.auditStatus === "audited" ? "Audited" : "Unaudited",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </Card>
        );
      })}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/35 px-3 py-3">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm font-semibold text-brand-navy [font-variant-numeric:tabular-nums]">{value}</p>
    </div>
  );
}

function formatRatioValue(value: number | null, unit: "percentage" | "ratio" | "ghs"): string {
  if (value === null) {
    return "N/A";
  }
  if (unit === "percentage") {
    return formatPercent(value);
  }
  if (unit === "ghs") {
    return new Intl.NumberFormat("en-GH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
  return `${value.toFixed(2)}x`;
}
