"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  formatCurrency,
  formatPercent,
  getFinancialStatementRows,
  type BankProfileResponse,
  type StatementType,
  type StatementView,
} from "@/lib/bank-profile";
import { cn } from "@/lib/utils";

type FinancialsTableProps = {
  profile: ReturnType<typeof import("@/lib/bank-profile").getBankProfile> extends infer T
    ? Exclude<T, null>
    : never;
};

const statementOptions: Array<{ label: string; value: StatementType }> = [
  { label: "Income Statement", value: "income_statement" },
  { label: "Balance Sheet", value: "balance_sheet" },
  { label: "Cash Flow", value: "cash_flow" },
];

const viewOptions: Array<{ label: string; value: StatementView }> = [
  { label: "Absolute", value: "absolute" },
  { label: "% of Total", value: "common_size" },
];

const yearOptions: Array<1 | 3 | 5> = [1, 3, 5];

export function FinancialsTable({ profile }: FinancialsTableProps): React.JSX.Element {
  const [statementType, setStatementType] = useState<StatementType>("income_statement");
  const [statementView, setStatementView] = useState<StatementView>("absolute");
  const [yearCount, setYearCount] = useState<1 | 3 | 5>(5);

  const rows = getFinancialStatementRows(profile, statementType, statementView, yearCount);
  const years = profile.financialStatements.years.slice(0, yearCount);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-border/70 px-5 py-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="murigne-eyebrow text-muted-foreground">Financials</p>
            <h2 className="mt-2 text-xl font-semibold text-brand-navy">5-year common-size-ready table</h2>
          </div>
          <Badge tone="info" variant="outline">
            Sticky first column on mobile
          </Badge>
        </div>
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Financial statement">
            {statementOptions.map((option) => (
              <Button
                key={option.value}
                aria-pressed={statementType === option.value}
                className={cn(statementType !== option.value && "shadow-none")}
                onClick={() => setStatementType(option.value)}
                type="button"
                variant={statementType === option.value ? "default" : "outline"}
              >
                {option.label}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {viewOptions.map((option) => (
              <Button
                key={option.value}
                aria-pressed={statementView === option.value}
                onClick={() => setStatementView(option.value)}
                type="button"
                variant={statementView === option.value ? "secondary" : "outline"}
              >
                {option.label}
              </Button>
            ))}
            {yearOptions.map((option) => (
              <Button
                key={option}
                aria-pressed={yearCount === option}
                onClick={() => setYearCount(option)}
                type="button"
                variant={yearCount === option ? "secondary" : "outline"}
              >
                {option}Y
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full border-collapse">
          <thead className="bg-muted/55">
            <tr>
              <th
                className="sticky left-0 z-10 min-w-[15rem] border-r border-border/70 bg-muted/55 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                scope="col"
              >
                Line item
              </th>
              {years.map((year) => (
                <th
                  key={year}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                  scope="col"
                >
                  <div>{year}</div>
                  <div className="mt-1 text-[11px] normal-case tracking-normal text-muted-foreground">
                    {profile.latestVintage.auditStatus === "audited" ? "Audited" : "Unaudited"}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.lineItemKey} className="border-t border-border/60">
                <th
                  className="sticky left-0 z-10 border-r border-border/60 bg-white px-4 py-4 text-left align-top"
                  scope="row"
                >
                  <div className="text-sm font-semibold text-brand-navy">{row.lineItemLabel}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">{row.section}</div>
                </th>
                {row.values.map((cell) => (
                  <td key={`${row.lineItemKey}-${cell.year}`} className="px-4 py-4 align-top text-sm text-brand-navy">
                    <div className="[font-variant-numeric:tabular-nums]">{formatCell(cell.value, cell.unit)}</div>
                    <div className="mt-2 text-[11px] text-muted-foreground">{cell.vintage.reportingPeriod}</div>
                    {cell.isRestated ? (
                      <div className="mt-1 text-[11px] font-medium text-brand-orange">Restated</div>
                    ) : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function formatCell(value: number | null, unit: "ghs" | "percentage"): string {
  if (unit === "percentage") {
    return formatPercent(value);
  }
  return `GHS ${formatCurrency(value)}`;
}
