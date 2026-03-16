import {
  Activity,
  ArrowUpRight,
  Database,
  Landmark,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { BankUniverseTable } from "@/components/dashboard/bank-universe-table";
import { NavigationShell } from "@/components/navigation/navigation-shell";
import { RatioDisplay } from "@/components/ui/ratio-display";
import { StatDisplay } from "@/components/ui/stat-display";
import { VintageLabel } from "@/components/ui/vintage-label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type BankHealthRatio,
  type BankUniverseRow,
  type DashboardModule,
  type OverviewCard,
  type VintageHighlight,
} from "@/lib/mock-data";

type DashboardHomeProps = {
  title: string;
  subtitle: string;
  cards: OverviewCard[];
  modules: DashboardModule[];
  ratios: BankHealthRatio[];
  vintages: VintageHighlight[];
  bankRows: BankUniverseRow[];
};

const scaffoldPillars = [
  {
    title: "Institutional-quality surfaces",
    description: "Dashboard-first components designed for bank analysis, ranking, and audit trails.",
    icon: Landmark,
  },
  {
    title: "Formula-first analytics",
    description: "Ratio displays expose exact definitions and formulas before backend computation exists.",
    icon: Activity,
  },
  {
    title: "Vintage-aware disclosures",
    description: "Every data point carries source, reporting period, and audit context in the UI layer.",
    icon: Database,
  },
  {
    title: "Trust and access boundaries",
    description: "The design system leaves room for Clerk tiers and analyst-grade provenance signals.",
    icon: ShieldCheck,
  },
];

export function DashboardHome({
  title,
  subtitle,
  cards,
  modules,
  ratios,
  vintages,
  bankRows,
}: DashboardHomeProps): React.JSX.Element {
  return (
    <NavigationShell>
      <div className="murigne-content-animate flex flex-col murigne-section">
        <section className="murigne-card-soft murigne-dot-grid overflow-hidden">
          <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.45fr_0.95fr] lg:px-8 lg:py-10">
            <div>
              <p className="murigne-eyebrow">Murigne design system</p>
              <h1 className="murigne-display mt-5 max-w-4xl font-semibold text-brand-navy">
                {title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {subtitle}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button size="lg">Phase 0 design system</Button>
                <Button size="lg" variant="secondary">
                  Roadmap-aligned tokens
                </Button>
              </div>
            </div>

            <Card variant="sand" className="border-none shadow-none">
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle>Design system principles</CardTitle>
                    <CardDescription>
                      This slice establishes the common visual grammar for analytics views.
                    </CardDescription>
                  </div>
                  <span className="rounded-full bg-white/90 p-3 text-brand-orange">
                    <Sparkles className="h-5 w-5" />
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {scaffoldPillars.map((pillar) => {
                  const Icon = pillar.icon;

                  return (
                    <div key={pillar.title} className="flex gap-3 rounded-3xl bg-white/80 p-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-navy/6">
                        <Icon className="h-5 w-5 text-brand-blue" />
                      </div>
                      <div>
                        <p className="font-medium text-brand-navy">{pillar.title}</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {pillar.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-4 md:grid-cols-2">
          {cards.map((card) => (
            <StatDisplay key={card.id} {...card} />
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card variant="soft">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="murigne-eyebrow">Ratio displays</p>
                  <CardTitle className="mt-3">Formula-aware CAMEL metrics</CardTitle>
                  <CardDescription className="mt-3">
                    Every ratio component exposes the definition, formula, and source context the
                    roadmap requires.
                  </CardDescription>
                </div>
                <Badge tone="info">Frontend-first</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {ratios.map((ratio) => (
                <RatioDisplay key={ratio.id} ratio={ratio} />
              ))}
            </CardContent>
          </Card>

          <Card variant="ice">
            <CardHeader>
              <p className="murigne-eyebrow">Data provenance</p>
              <CardTitle className="mt-3">Vintage labels</CardTitle>
              <CardDescription className="mt-3">
                Source, reporting period, and audit state are visible even in compact surfaces.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {vintages.map((item) => (
                <div
                  key={`${item.bank}-${item.period}`}
                  className="rounded-3xl border border-white/80 bg-white/80 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-brand-navy">{item.bank}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.metric}</p>
                    </div>
                    <VintageLabel vintage={item} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Card variant="soft">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="murigne-eyebrow">Base table system</p>
                  <CardTitle className="mt-3">Bank universe preview</CardTitle>
                  <CardDescription className="mt-3">
                    Source-owned table styling is ready for TanStack Table-backed bank screens and
                    screeners.
                  </CardDescription>
                </div>
                <Badge tone="teal" variant="soft">
                  TanStack Table
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <BankUniverseTable data={bankRows} />
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <Card variant="sun">
              <CardHeader>
                <p className="murigne-eyebrow">Roadmap modules</p>
                <CardTitle className="mt-3">Platform building blocks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {modules.map((module) => (
                  <article key={module.title} className="rounded-3xl bg-white/80 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-base font-semibold text-brand-navy">{module.title}</h2>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {module.description}
                        </p>
                      </div>
                      <Badge tone="gold" variant="soft">
                        {module.phase}
                      </Badge>
                    </div>
                  </article>
                ))}
              </CardContent>
            </Card>

            <Card variant="default">
              <CardHeader>
                <CardTitle>What this foundation gives us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Reusable cards, badges, tables, and analytics displays",
                  "A branded shell for bank detail, sector, and admin pages",
                  "Explicit formula and vintage UX patterns before backend schema work",
                  "Tokenized typography and spacing for consistent product surfaces",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-muted/55 px-4 py-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-brand-orange/12">
                      <ArrowUpRight className="h-4 w-4 text-brand-orange" />
                    </span>
                    <span className="text-sm font-medium text-brand-navy">{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </NavigationShell>
  );
}
