import { ArrowUpRight, Eye, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VintageLabel } from "@/components/ui/vintage-label";
import {
  formatCompactCurrency,
  formatCurrency,
  formatInteger,
  formatPercent,
  type BankProfileResponse,
} from "@/lib/bank-profile";

type BankHeaderProps = {
  profile: BankProfileResponse;
};

export function BankHeader({ profile }: BankHeaderProps): React.JSX.Element {
  const { bank, latestVintage } = profile;

  return (
    <Card className="murigne-card-pad">
      <div className="flex flex-col gap-6 xl:grid xl:grid-cols-[minmax(0,1.2fr)_20rem] xl:gap-8">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge tone="gold" variant="soft">
              {bank.ticker}
            </Badge>
            <Badge tone="info" variant="outline">
              Banking
            </Badge>
          </div>
          <div>
            <p className="murigne-eyebrow text-muted-foreground">Bank profile</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand-navy sm:text-[2.15rem]">{bank.name}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Listed on {new Date(bank.listingDate).toLocaleDateString("en-GB", { dateStyle: "long" })}. Latest
              profile snapshot is built against the current mock contract for Phase 1.
            </p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-xl border border-border/80 bg-border/80 sm:grid-cols-2 xl:grid-cols-4">
            <Stat label="Last close" value={`GHS ${formatCurrency(bank.lastClosingPriceGhs)}`} />
            <Stat label="Market cap" value={`GHS ${formatCompactCurrency(bank.marketCapGhs)}`} />
            <Stat
              label="52-week range"
              value={`GHS ${formatCurrency(bank.week52LowGhs)} - ${formatCurrency(bank.week52HighGhs)}`}
            />
            <Stat label="Shares outstanding" value={formatInteger(bank.sharesOutstanding)} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 xl:justify-end">
            <Button type="button">
              <Star className="mr-2 h-4 w-4" />
              Watchlist
            </Button>
            <Button type="button" variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              Filings
            </Button>
          </div>
          <div className="rounded-xl border border-border/80 bg-white p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="murigne-eyebrow text-muted-foreground">Latest vintage summary</p>
                <p className="mt-2 text-base font-semibold text-brand-navy">Current reporting snapshot</p>
              </div>
              <ArrowUpRight className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold" />
            </div>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p>
                Closing price move:{" "}
                <span className="font-medium text-brand-navy">{formatPercent(bank.priceChangePercent)}</span>
              </p>
              <p>
                Entered at <span className="font-medium text-brand-navy">{latestVintage.enteredAt ?? "N/A"}</span>
              </p>
            </div>
            <div className="mt-4 border-t border-border/70 pt-4">
              <VintageLabel
                align="start"
                className="gap-2.5"
                vintage={{
                  bank: bank.shortName,
                  metric: "Latest profile vintage",
                  period: latestVintage.reportingPeriod,
                  sourceLabel: latestVintage.sourceLabel,
                  auditStatus: latestVintage.auditStatus === "audited" ? "Audited" : "Unaudited",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="bg-white px-4 py-3.5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-base font-semibold text-brand-navy [font-variant-numeric:tabular-nums]">{value}</p>
    </div>
  );
}
