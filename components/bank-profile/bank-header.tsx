import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { type BankProfile } from "@/lib/bank-profile";

type BankHeaderProps = {
  profile: BankProfile;
};

function formatCompactCurrency(value: number): string {
  return new Intl.NumberFormat("en-GH", {
    maximumFractionDigits: 2,
    notation: "compact",
  }).format(value);
}

export function BankHeader({ profile }: BankHeaderProps): React.JSX.Element {
  return (
    <Card className="murigne-card-pad">
      <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <p className="murigne-eyebrow text-muted-foreground">Bank profile</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold text-brand-navy md:text-4xl">{profile.name}</h1>
            <Badge tone="gold" variant="soft">
              {profile.ticker}
            </Badge>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{profile.summary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Badge tone="info" variant="outline">
              Listed {profile.listingDate}
            </Badge>
            <Badge tone="success" variant="outline">
              {profile.latestVintage.reportingPeriod}
            </Badge>
            <Badge tone={profile.latestVintage.auditStatus === "Audited" ? "success" : "warning"} variant="soft">
              {profile.latestVintage.auditStatus}
            </Badge>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:min-w-[24rem] xl:max-w-[28rem] xl:flex-1">
          <div className="rounded-xl border border-border/80 bg-white px-4 py-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Market cap</p>
            <p className="mt-3 text-2xl font-semibold text-brand-navy">
              GHS {formatCompactCurrency(profile.marketCapGhs)}
            </p>
          </div>
          <div className="rounded-xl border border-border/80 bg-white px-4 py-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Last price</p>
            <p className="mt-3 text-2xl font-semibold text-brand-navy">
              GHS {profile.lastClosingPriceGhs.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
