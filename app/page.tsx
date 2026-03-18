import { ArrowUpRight, Dot, Scale, ShieldCheck, TrendingUp } from "lucide-react";

import { NavigationShell } from "@/components/navigation/navigation-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { FormulaTooltip } from "@/components/ui/formula-tooltip";
import { RatioDisplay } from "@/components/ui/ratio-display";
import { StatDisplay } from "@/components/ui/stat-display";
import { VintageLabel } from "@/components/ui/vintage-label";
import { bankProfile, marketOverviewCards } from "@/lib/mock-data";

function TrendCard({
  title,
  subtitle,
  formula,
  definition,
  benchmark,
  values,
}: (typeof bankProfile.trends)[number]): React.JSX.Element {
  const maxValue = Math.max(...values.map((point) => point.value));

  return (
    <Card className="murigne-card-pad">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="murigne-eyebrow">Five-year trend</p>
          <h3 className="mt-2 text-xl font-semibold text-[var(--brand-navy)]">{title}</h3>
          <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">{subtitle}</p>
        </div>
        <FormulaTooltip
          definition={definition}
          formula={formula}
          source={benchmark}
          title={title}
        />
      </div>
      <div className="murigne-sparkline mt-8">
        {values.map((point) => (
          <div key={point.period} className="murigne-sparkbar">
            <div
              aria-hidden="true"
              className="murigne-sparkbar-fill"
              style={{ height: `${Math.max((point.value / maxValue) * 100, 12)}%` }}
            />
            <div>
              <p className="murigne-metric text-sm font-semibold text-[var(--brand-navy)]">
                {point.displayValue}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                {point.label}
              </p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">{point.source}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
        {benchmark}
      </p>
    </Card>
  );
}

export default function HomePage(): React.JSX.Element {
  const upsidePercent =
    bankProfile.valuation.upsidePercent === null
      ? "N/A"
      : `${(bankProfile.valuation.upsidePercent * 100).toFixed(2)}%`;

  const ddmValue =
    bankProfile.valuation.ddmIntrinsicValue === null
      ? "N/A"
      : `GHS ${bankProfile.valuation.ddmIntrinsicValue.toFixed(2)}`;

  const residualIncomeValue =
    bankProfile.valuation.residualIncomeValue === null
      ? "N/A"
      : `GHS ${bankProfile.valuation.residualIncomeValue.toFixed(2)}`;

  const justifiedPriceToBook =
    bankProfile.valuation.justifiedPriceToBook === null
      ? "N/A"
      : `${bankProfile.valuation.justifiedPriceToBook.toFixed(2)}x`;

  return (
    <NavigationShell>
      <section className="murigne-hero">
        <Card className="murigne-card-pad">
          <div className="flex flex-wrap items-center gap-3">
            <span className="murigne-pill">{bankProfile.exchange}</span>
            <Badge tone="gold" variant="soft">
              Bank profile Phase 1
            </Badge>
            <Badge tone="success" variant="soft">
              Mock data only
            </Badge>
          </div>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="murigne-eyebrow">Bank profile</p>
              <h1 className="murigne-title mt-3 font-semibold text-[var(--brand-navy)]">
                {bankProfile.name}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted-foreground)]">
                {bankProfile.overview}
              </p>
            </div>
            <VintageLabel vintage={bankProfile.financialVintage} />
          </div>
          <div className="murigne-grid murigne-grid-4 mt-8">
            {marketOverviewCards.map((card) => (
              <StatDisplay key={card.id} {...card} />
            ))}
          </div>
        </Card>

        <Card variant="soft" className="murigne-card-pad">
          <p className="murigne-eyebrow">Market context</p>
          <div className="mt-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">GSE closing price</p>
              <p className="murigne-stat mt-2 font-semibold text-[var(--brand-navy)]">
                {bankProfile.marketPrice}
              </p>
            </div>
            <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-navy)]">
              {bankProfile.ticker}
            </div>
          </div>
          <dl className="mt-6 space-y-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[var(--muted-foreground)]">Market cap</dt>
              <dd className="font-semibold text-[var(--brand-navy)]">{bankProfile.marketCap}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[var(--muted-foreground)]">Price date</dt>
              <dd className="font-semibold text-[var(--brand-navy)]">{bankProfile.priceDate}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[var(--muted-foreground)]">RI upside/downside</dt>
              <dd className="font-semibold text-[var(--brand-navy)]">{upsidePercent}</dd>
            </div>
          </dl>
          <p className="mt-6 text-sm leading-6 text-[var(--muted-foreground)]">
            Intrinsic value views below use CAPM cost of equity and audited FY 2025 fundamentals.
            They are estimates, not targets.
          </p>
        </Card>
      </section>

      <section className="murigne-section">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="murigne-eyebrow">Valuation outputs</p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--brand-navy)]">
              DDM, Residual Income, and P/B signal
            </h2>
          </div>
          <VintageLabel vintage={bankProfile.valuationVintage} />
        </div>
        <div className="murigne-grid murigne-grid-4 mt-6">
          <Card variant="ice" className="murigne-card-pad">
            <p className="murigne-eyebrow">DDM intrinsic value</p>
            <p className="murigne-stat mt-4 font-semibold text-[var(--brand-navy)]">{ddmValue}</p>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              Gordon Growth estimate using next dividend and CAPM cost of equity.
            </p>
          </Card>
          <Card variant="soft" className="murigne-card-pad">
            <p className="murigne-eyebrow">Residual Income value</p>
            <p className="murigne-stat mt-4 font-semibold text-[var(--brand-navy)]">
              {residualIncomeValue}
            </p>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              Preferred bank valuation view given book-value anchoring and excess ROE spread.
            </p>
          </Card>
          <Card variant="sand" className="murigne-card-pad">
            <p className="murigne-eyebrow">RI-implied P/B</p>
            <p className="murigne-stat mt-4 font-semibold text-[var(--brand-navy)]">
              {justifiedPriceToBook}
            </p>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              Actual P/B is {bankProfile.valuation.actualPriceToBook.toFixed(2)}x from the current market price.
            </p>
          </Card>
          <Card variant="sun" className="murigne-card-pad">
            <p className="murigne-eyebrow">Value creation spread</p>
            <p className="murigne-stat mt-4 font-semibold text-[var(--brand-navy)]">
              {(bankProfile.valuation.valueCreationSpread * 100).toFixed(2)}%
            </p>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              Positive spread means ROE exceeds the estimated cost of equity.
            </p>
          </Card>
        </div>
        <div className="murigne-grid murigne-grid-2 mt-6">
          <Card className="murigne-card-pad">
            <div className="flex items-center gap-3">
              <Scale className="h-5 w-5 text-[var(--brand-gold)]" />
              <h3 className="text-xl font-semibold text-[var(--brand-navy)]">Model inputs and formulas</h3>
            </div>
            <div className="mt-6 space-y-4">
              {bankProfile.valuationDrivers.map((driver) => (
                <div
                  key={driver.label}
                  className="flex items-start justify-between gap-4 rounded-xl border border-[var(--border)] bg-white p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-[var(--brand-navy)]">{driver.label}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                      {driver.definition}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                      {driver.source}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="murigne-metric text-lg font-semibold text-[var(--brand-navy)]">
                      {driver.value}
                    </p>
                    <FormulaTooltip
                      definition={driver.definition}
                      formula={driver.formula}
                      source={driver.source}
                      title={driver.label}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="murigne-card-pad">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-[var(--brand-teal)]" />
              <h3 className="text-xl font-semibold text-[var(--brand-navy)]">Intrinsic value vs market price</h3>
            </div>
            <div className="mt-6 grid gap-4">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-ice)] p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[var(--brand-navy)]">Residual Income signal</p>
                  <Badge tone="success" variant="soft">
                    Value creating
                  </Badge>
                </div>
                <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">
                  The stock trades below the RI estimate while ROE remains above the estimated required return.
                  That produces a justified P/B above the actual market multiple and suggests undervaluation on the
                  current mock assumptions.
                </p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--brand-navy)]">
                  <ShieldCheck className="h-4 w-4 text-[var(--brand-gold)]" />
                  Model guardrails
                </div>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted-foreground)]">
                  <li className="flex gap-2">
                    <Dot className="mt-1 h-4 w-4 shrink-0 text-[var(--brand-gold)]" />
                    DDM and RI outputs are estimates only and should not be shown as price targets.
                  </li>
                  <li className="flex gap-2">
                    <Dot className="mt-1 h-4 w-4 shrink-0 text-[var(--brand-gold)]" />
                    Every displayed output is anchored to an audited FY 2025 source label and an explicit formula.
                  </li>
                  <li className="flex gap-2">
                    <Dot className="mt-1 h-4 w-4 shrink-0 text-[var(--brand-gold)]" />
                    Backend computation will later replace the mock input pack without changing the UI contract.
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="murigne-section">
        <p className="murigne-eyebrow">CAMEL snapshot</p>
        <h2 className="mt-2 text-2xl font-semibold text-[var(--brand-navy)]">
          Ratio cards remain formula-linked and source-stamped
        </h2>
        <div className="murigne-grid murigne-grid-2 mt-6">
          {bankProfile.bankHealthRatios.map((ratio) => (
            <RatioDisplay key={ratio.id} ratio={ratio} />
          ))}
        </div>
      </section>

      <section className="murigne-section">
        <p className="murigne-eyebrow">Historical views</p>
        <h2 className="mt-2 text-2xl font-semibold text-[var(--brand-navy)]">
          Five-year trends required by the bank profile roadmap
        </h2>
        <div className="murigne-grid murigne-grid-3 mt-6">
          {bankProfile.trends.map((trend) => (
            <TrendCard key={trend.id} {...trend} />
          ))}
        </div>
      </section>

      <section className="murigne-section">
        <Card className="murigne-card-pad">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="murigne-eyebrow">Peer reference</p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--brand-navy)]">
                Relative sector context for Phase 1 review
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-sand)] px-4 py-2 text-sm font-semibold text-[var(--brand-navy)]">
              <ArrowUpRight className="h-4 w-4" />
              Actual P/B: {bankProfile.valuation.actualPriceToBook.toFixed(2)}x
            </div>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="murigne-table">
              <thead>
                <tr>
                  <th>Bank</th>
                  <th>Ticker</th>
                  <th>Capital</th>
                  <th>Earnings</th>
                  <th>Liquidity</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {bankProfile.universe.map((row) => (
                  <tr key={row.ticker}>
                    <td className="font-semibold text-[var(--brand-navy)]">{row.bank}</td>
                    <td>{row.ticker}</td>
                    <td>{row.capital}</td>
                    <td>{row.earnings}</td>
                    <td>{row.liquidity}</td>
                    <td>
                      <Badge tone={row.ratingTone} variant="soft">
                        {row.rating}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </NavigationShell>
  );
}
