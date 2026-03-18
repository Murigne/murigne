"use client";

import { useId, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/ui/table";
import { VintageLabel } from "@/components/ui/vintage-label";
import {
  formatPercentage,
  getFinancialStatementRows,
  type BankProfile,
  type FinancialStatementRow,
} from "@/lib/bank-profile";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "camel", label: "CAMEL" },
  { id: "financials", label: "Financials" },
  { id: "fixed-income", label: "Fixed Income" },
  { id: "valuation", label: "Valuation" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const financialColumns: DataTableColumn<FinancialStatementRow>[] = [
  {
    accessorKey: "label",
    header: "Line item",
  },
  {
    accessorKey: "fy2023",
    header: "FY2023",
  },
  {
    accessorKey: "fy2024",
    header: "FY2024",
  },
  {
    accessorKey: "fy2025",
    header: "FY2025",
  },
];

export function BankProfileTabs({ profile }: { profile: BankProfile }): React.JSX.Element {
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
          aria-labelledby={`${tabListId}-${tab.id}`}
          hidden={activeTab !== tab.id}
          id={`${tabListId}-${tab.id}-panel`}
          role="tabpanel"
          tabIndex={0}
        >
          {tab.id === "overview" ? <OverviewPanel profile={profile} /> : null}
          {tab.id === "camel" ? <CamelPanel profile={profile} /> : null}
          {tab.id === "financials" ? <FinancialsPanel profile={profile} /> : null}
          {tab.id === "fixed-income" ? <FixedIncomePanel profile={profile} /> : null}
          {tab.id === "valuation" ? <ValuationPanel profile={profile} /> : null}
        </div>
      ))}
    </section>
  );
}

function OverviewPanel({ profile }: { profile: BankProfile }): React.JSX.Element {
  const latestVintage = {
    auditStatus: profile.latestVintage.auditStatus,
    bank: profile.name,
    metric: "Latest reporting vintage",
    period: profile.latestVintage.period,
    sourceLabel: profile.latestVintage.sourceLabel,
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {profile.headlineMetrics.map((metric) => (
          <Card key={metric.label} className="murigne-card-pad">
            <p className="murigne-eyebrow text-muted-foreground">{metric.label}</p>
            <p className="murigne-stat mt-4 font-semibold text-brand-navy">{metric.value}</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{metric.context}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Card className="murigne-card-pad">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="murigne-eyebrow text-muted-foreground">CAMEL composite</p>
              <h2 className="mt-2 text-xl font-semibold text-brand-navy">Scoring overview</h2>
            </div>
            <Badge tone="success" variant="soft">
              {profile.camelComposite.band}
            </Badge>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {profile.camelComposite.components.map((component) => (
              <div key={component.label} className="rounded-xl border border-border/80 bg-white px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-navy">
                    {component.label}
                  </h3>
                  <span className="text-lg font-semibold text-brand-blue">{component.score.toFixed(1)}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{component.summary}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="murigne-card-pad">
          <p className="murigne-eyebrow text-muted-foreground">Data provenance</p>
          <h2 className="mt-2 text-xl font-semibold text-brand-navy">Latest reporting period</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Every displayed ratio shows a source, reporting period, and audit status. This page is
            widened to use more of the shell while keeping the content centered.
          </p>
          <div className="mt-6 rounded-xl border border-border/80 bg-white px-4 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-brand-navy">{profile.name}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{profile.latestVintage.sourceLabel}</p>
              </div>
              <VintageLabel vintage={latestVintage} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function CamelPanel({ profile }: { profile: BankProfile }): React.JSX.Element {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {profile.camelSections.map((section) => (
        <Card key={section.label} className="murigne-card-pad">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="murigne-eyebrow text-muted-foreground">{section.label}</p>
              <h2 className="mt-2 text-xl font-semibold text-brand-navy">{section.title}</h2>
            </div>
            <Badge tone={section.badgeTone} variant="soft">
              {section.score}
            </Badge>
          </div>
          <div className="mt-5 space-y-3">
            {section.ratios.map((ratio) => (
              <div key={ratio.label} className="rounded-xl border border-border/80 bg-white px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-brand-navy">{ratio.label}</h3>
                  <span className="text-sm font-semibold text-brand-blue">{ratio.value}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{ratio.definition}</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Formula: {ratio.formula}
                </p>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function FinancialsPanel({ profile }: { profile: BankProfile }): React.JSX.Element {
  return (
    <Card className="murigne-card-pad">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="murigne-eyebrow text-muted-foreground">Financial statements</p>
          <h2 className="mt-2 text-xl font-semibold text-brand-navy">Three-year preview</h2>
        </div>
        <Badge tone="info" variant="outline">
          Common-size and absolute views next
        </Badge>
      </div>
      <div className="mt-6">
        <DataTable columns={financialColumns} data={getFinancialStatementRows(profile)} />
      </div>
    </Card>
  );
}

function FixedIncomePanel({ profile }: { profile: BankProfile }): React.JSX.Element {
  return (
    <Card className="murigne-card-pad">
      <p className="murigne-eyebrow text-muted-foreground">Fixed income</p>
      <h2 className="mt-2 text-xl font-semibold text-brand-navy">Bond coverage status</h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {profile.fixedIncomeSummary}
      </p>
    </Card>
  );
}

function ValuationPanel({ profile }: { profile: BankProfile }): React.JSX.Element {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card className="murigne-card-pad">
        <p className="murigne-eyebrow text-muted-foreground">Dividend discount model</p>
        <h2 className="mt-2 text-xl font-semibold text-brand-navy">{profile.valuation.ddmHeadline}</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{profile.valuation.ddmSummary}</p>
      </Card>
      <Card className="murigne-card-pad">
        <p className="murigne-eyebrow text-muted-foreground">Residual income</p>
        <h2 className="mt-2 text-xl font-semibold text-brand-navy">{profile.valuation.riHeadline}</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{profile.valuation.riSummary}</p>
      </Card>
    </div>
  );
}
