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
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="gold" variant="soft">
              {bank.ticker}
            </Badge>
            <Badge tone="info" variant="outline">
              Banking
            </Badge>
          </div>
          <div>
            <p className="murigne-eyebrow text-muted-foreground">Bank profile</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand-navy">{bank.name}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Listed on {new Date(bank.listingDate).toLocaleDateString("en-GB", { dateStyle: "long" })}. Latest
              profile snapshot is built against the current mock contract for Phase 1.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Stat label="Last close" value={`GHS ${formatCurrency(bank.lastClosingPriceGhs)}`} />
            <Stat label="Market cap" value={`GHS ${formatCompactCurrency(bank.marketCapGhs)}`} />
            <Stat
              label="52-week range"
              value={`GHS ${formatCurrency(bank.week52LowGhs)} - ${formatCurrency(bank.week52HighGhs)}`}
            />
            <Stat label="Shares outstanding" value={formatInteger(bank.sharesOutstanding)} />
          </div>
        </div>

        <div className="space-y-4 lg:w-[18rem]">
          <div className="flex flex-wrap gap-3">
            <Button type="button">
              <Star className="mr-2 h-4 w-4" />
              Watchlist
            </Button>
            <Button type="button" variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              Filings
            </Button>
          </div>
          <div className="rounded-xl border border-border/80 bg-muted/45 p-4">
            <p className="text-sm font-semibold text-brand-navy">Latest vintage summary</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Closing price move: <span className="font-medium text-brand-navy">{formatPercent(bank.priceChangePercent)}</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Entered at <span className="font-medium text-brand-navy">{latestVintage.enteredAt ?? "N/A"}</span>
            </p>
            <div className="mt-4 flex items-start justify-between gap-3">
              <VintageLabel
                vintage={{
                  bank: bank.shortName,
                  metric: "Latest profile vintage",
                  period: latestVintage.reportingPeriod,
                  sourceLabel: latestVintage.sourceLabel,
                  auditStatus: latestVintage.auditStatus === "audited" ? "Audited" : "Unaudited",
                }}
              />
              <ArrowUpRight className="h-5 w-5 text-brand-gold" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="rounded-xl border border-border/70 bg-white px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-base font-semibold text-brand-navy [font-variant-numeric:tabular-nums]">{value}</p>
    </div>
  );
}
