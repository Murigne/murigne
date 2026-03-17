"use client";

import { useId, useState } from "react";

import { CamelSectionList } from "@/components/bank-profile/camel-section-list";
import { FinancialsTable } from "@/components/bank-profile/financials-table";
import { FixedIncomeEmptyState } from "@/components/bank-profile/fixed-income-empty-state";
import { MockChartCard } from "@/components/bank-profile/mock-chart-card";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StatDisplay } from "@/components/ui/stat-display";
import { VintageLabel } from "@/components/ui/vintage-label";
import {
  getHeadlineMetricSummary,
  hasFixedIncomeEmptyState,
  type BankProfileResponse,
} from "@/lib/bank-profile";
import { cn } from "@/lib/utils";

type BankProfileTabsProps = {
  profile: ReturnType<typeof import("@/lib/bank-profile").getBankProfile> extends infer T
    ? Exclude<T, null>
    : never;
};

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "camel", label: "CAMEL" },
  { id: "financials", label: "Financials" },
  { id: "fixed-income", label: "Fixed Income" },
  { id: "valuation", label: "Valuation" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function BankProfileTabs({ profile }: BankProfileTabsProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const tabListId = useId();

  return (
    <section className="space-y-6">
      <div className="overflow-x-auto">
        <div
          aria-label="Bank profile sections"
          className="inline-flex min-w-full gap-1.5 rounded-xl border border-border/80 bg-white p-1.5"
          role="tablist"
        >
          {tabs.map((tab) => {
            const selected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                aria-controls={`${tabListId}-${tab.id}-panel`}
                aria-selected={selected}
                className={cn(
                  "rounded-lg border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                  selected
                    ? "border-brand-navy/15 bg-brand-navy/8 text-brand-navy"
                    : "border-transparent text-muted-foreground hover:bg-muted/70 hover:text-brand-navy",
                )}
                id={`${tabListId}-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                type="button"
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          aria-busy="false"
          aria-labelledby={`${tabListId}-${tab.id}`}
          hidden={activeTab !== tab.id}
          id={`${tabListId}-${tab.id}-panel`}
          role="tabpanel"
          tabIndex={0}
        >
          {tab.id === "overview" ? <OverviewPanel profile={profile} /> : null}
          {tab.id === "camel" ? <CamelPanel profile={profile} /> : null}
          {tab.id === "financials" ? <FinancialsTable profile={profile} /> : null}
          {tab.id === "fixed-income" ? (
            hasFixedIncomeEmptyState(profile) ? (
              <FixedIncomeEmptyState profile={profile} />
            ) : (
              <Card className="murigne-card-pad">Listed bonds available.</Card>
            )
          ) : null}
          {tab.id === "valuation" ? <ValuationPlaceholder /> : null}
        </div>
      ))}
    </section>
  );
}

function OverviewPanel({ profile }: { profile: BankProfileResponse }): React.JSX.Element {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {profile.headlineMetrics.map((metric) => {
          const summary = getHeadlineMetricSummary(metric);

          return (
            <StatDisplay
              id={metric.key}
              key={metric.key}
              delta={`${summary.yoyLabel} · ${metric.vintage.reportingPeriod}`}
              description={`${summary.benchmarkLabel} · ${summary.benchmarkState === "above" ? "Above benchmark" : summary.benchmarkState === "below" ? "Below benchmark" : "Peer compared"}`}
              label={metric.label}
              tone={summary.benchmarkState === "above" ? "ice" : summary.benchmarkState === "below" ? "sand" : "soft"}
              trend={metric.value !== null && metric.priorValue !== null && metric.value > metric.priorValue ? "up" : metric.value === metric.priorValue ? "flat" : "down"}
              value={summary.valueLabel}
            />
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <MockChartCard
          band={profile.camelComposite.band}
          components={profile.camelComposite.components}
          percentile={profile.camelComposite.peerPercentile}
          score={profile.camelComposite.score}
        />
        <Card className="murigne-card-pad">
          <p className="murigne-eyebrow text-muted-foreground">5Cs qualitative summary</p>
          <h2 className="mt-2 text-xl font-semibold text-brand-navy">Credit context</h2>
          <div className="mt-6 space-y-4">
            {profile.creditAssessment.map((item) => (
              <div key={item.key} className="rounded-xl border border-border/70 bg-white px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-navy">{item.label}</h3>
                  <Badge tone={toneToBadge(item.tone)} variant="soft">
                    {item.tone}
                  </Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.assessment}</p>
                <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{item.sourceNote}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="murigne-card-pad">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="murigne-eyebrow text-muted-foreground">Data provenance</p>
            <h2 className="mt-2 text-xl font-semibold text-brand-navy">Latest reporting period</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              All headline metrics are timestamped to the latest available filing and benchmark reference. Ratios with
              missing histories display N/A rather than blank values so the provenance state remains explicit.
            </p>
          </div>
          <VintageLabel
            vintage={{
              bank: profile.bank.shortName,
              metric: "Profile provenance",
              period: profile.latestVintage.reportingPeriod,
              sourceLabel: profile.latestVintage.sourceLabel,
              auditStatus: profile.latestVintage.auditStatus === "audited" ? "Audited" : "Unaudited",
            }}
          />
        </div>
      </Card>
    </div>
  );
}

function CamelPanel({ profile }: { profile: BankProfileResponse }): React.JSX.Element {
  return <CamelSectionList bankName={profile.bank.shortName} sections={profile.camelSections} />;
}

function ValuationPlaceholder(): React.JSX.Element {
  return (
    <Card className="murigne-card-pad">
      <p className="murigne-eyebrow text-muted-foreground">Valuation architecture</p>
      <h2 className="mt-2 text-xl font-semibold text-brand-navy">Coming next: DDM and RI models</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
        This tab is reserved for the next Phase 1 deliverable so dividend discount and residual income outputs can land
        without restructuring the bank profile navigation.
      </p>
    </Card>
  );
}

function toneToBadge(tone: BankProfileResponse["creditAssessment"][number]["tone"]): "success" | "warning" | "danger" | "info" {
  if (tone === "positive") {
    return "success";
  }
  if (tone === "warning") {
    return "warning";
  }
  if (tone === "negative") {
    return "danger";
  }
  return "info";
}
