import { Card } from "@/components/ui/card";
import { VintageLabel } from "@/components/ui/vintage-label";
import { type BankProfileResponse } from "@/lib/bank-profile";

type FixedIncomeEmptyStateProps = {
  profile: BankProfileResponse;
};

export function FixedIncomeEmptyState({ profile }: FixedIncomeEmptyStateProps): React.JSX.Element {
  return (
    <Card className="murigne-card-pad">
      <p className="murigne-eyebrow text-muted-foreground">GFIM coverage</p>
      <h2 className="mt-2 text-xl font-semibold text-brand-navy">
        This bank has no bonds listed on the Ghana Fixed Income Market.
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
        The fixed income module is still rendered because the roadmap reserves this panel for listed bank debt,
        duration views, and spread analysis when relevant securities are available.
      </p>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <p className="max-w-xl text-sm text-muted-foreground">
          Provenance note: absence of listed bonds is based on current mock GFIM coverage for the latest profile period.
        </p>
        <VintageLabel
          vintage={{
            bank: profile.bank.shortName,
            metric: "Fixed income coverage",
            period: profile.latestVintage.reportingPeriod,
            sourceLabel: profile.latestVintage.sourceLabel,
            auditStatus: profile.latestVintage.auditStatus === "audited" ? "Audited" : "Unaudited",
          }}
        />
      </div>
    </Card>
  );
}
