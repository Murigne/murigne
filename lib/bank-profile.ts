export type AuditStatus = "audited" | "unaudited";
export type HeadlineMetricKey = "roa" | "roe" | "nim" | "car";
export type CamelComponent = "capital" | "asset_quality" | "management" | "earnings" | "liquidity";
export type StatementView = "absolute" | "common_size";
export type StatementType = "income_statement" | "balance_sheet" | "cash_flow";

export interface VintageStamp {
  sourceLabel: string;
  reportingPeriod: string;
  auditStatus: AuditStatus;
  enteredAt?: string;
}

export interface BankProfileResponse {
  bank: {
    id: string;
    name: string;
    shortName: string;
    ticker: string;
    listingDate: string;
    sector: "Banking";
    marketCapGhs: number | null;
    lastClosingPriceGhs: number | null;
    priceChangePercent: number | null;
    week52LowGhs: number | null;
    week52HighGhs: number | null;
    sharesOutstanding: number | null;
    logoUrl: string | null;
  };
  latestVintage: VintageStamp;
  headlineMetrics: Array<{
    key: HeadlineMetricKey;
    label: string;
    value: number | null;
    unit: "percentage";
    priorValue: number | null;
    benchmarkValue: number | null;
    benchmarkLabel: string;
    benchmarkSource: string | null;
    vintage: VintageStamp;
  }>;
  camelComposite: {
    score: number | null;
    band: "Strong" | "Satisfactory" | "Fair" | "Marginal" | "Unsatisfactory" | null;
    peerPercentile: number | null;
    components: Array<{
      component: CamelComponent;
      score: number | null;
      peerPercentile: number | null;
    }>;
  };
  camelSections: Array<{
    component: CamelComponent;
    label: string;
    score: number | null;
    ratios: Array<{
      key: string;
      label: string;
      formula: string;
      definition: string;
      value: number | null;
      unit: "percentage" | "ratio" | "ghs";
      priorValue: number | null;
      yoyChange: number | null;
      benchmarkValue: number | null;
      benchmarkLabel: string | null;
      benchmarkSource: string | null;
      trend: Array<{ period: string; value: number | null }>;
      vintage: VintageStamp;
    }>;
  }>;
  creditAssessment: Array<{
    key: "character" | "capacity" | "capital" | "collateral" | "conditions";
    label: string;
    assessment: string;
    tone: "positive" | "warning" | "negative" | "neutral";
    sourceNote: string;
  }>;
  financialStatements: {
    availableViews: StatementView[];
    availableStatements: StatementType[];
    years: string[];
  };
  fixedIncome: {
    hasListedBonds: boolean;
    bonds: Array<{
      isin: string;
      name: string;
      maturityDate: string;
      couponPercent: number | null;
      yieldToMaturityPercent: number | null;
      durationYears: number | null;
      spreadVs91DayTbillBps: number | null;
      vintage: VintageStamp;
    }>;
  };
}

type StatementCell = {
  year: string;
  value: number | null;
  unit: "ghs" | "percentage";
  isRestated: boolean;
  vintage: VintageStamp;
};

type StatementRow = {
  statementType: StatementType;
  section: string;
  lineItemKey: string;
  lineItemLabel: string;
  values: Array<StatementCell>;
};

type MockBankProfile = BankProfileResponse & {
  statementRows: Record<StatementView, StatementRow[]>;
};

export type QuerySelection = {
  statementView: StatementView;
  years: 1 | 3 | 5;
  period: "latest" | string;
};

const annualVintage: VintageStamp = {
  sourceLabel: "GCB Bank Annual Report 2025",
  reportingPeriod: "FY2025",
  auditStatus: "audited",
  enteredAt: "2026-03-10T09:00:00Z",
};

const quarterlyVintage: VintageStamp = {
  sourceLabel: "BoG Banking Sector Report Q4 2025",
  reportingPeriod: "Q4 2025",
  auditStatus: "unaudited",
  enteredAt: "2026-03-11T14:30:00Z",
};

function buildValues(values: Array<number | null>, years: string[], unit: "ghs" | "percentage"): StatementCell[] {
  return years.map((year, index) => ({
    year,
    value: values[index] ?? null,
    unit,
    isRestated: year === "2021",
    vintage: annualVintage,
  }));
}

const statementYears = ["2025", "2024", "2023", "2022", "2021"];

const gcbProfile: MockBankProfile = {
  bank: {
    id: "gcb-bank",
    name: "GCB Bank PLC",
    shortName: "GCB Bank",
    ticker: "GCB",
    listingDate: "1996-05-15",
    sector: "Banking",
    marketCapGhs: 6840000000,
    lastClosingPriceGhs: 7.28,
    priceChangePercent: 0.021,
    week52LowGhs: 5.42,
    week52HighGhs: 7.61,
    sharesOutstanding: 940000000,
    logoUrl: null,
  },
  latestVintage: annualVintage,
  headlineMetrics: [
    {
      key: "roa",
      label: "ROA",
      value: 0.034,
      priorValue: 0.031,
      unit: "percentage",
      benchmarkValue: 0.015,
      benchmarkLabel: "BoG > 1.5%",
      benchmarkSource: "BoG Banking Sector Report",
      vintage: annualVintage,
    },
    {
      key: "roe",
      label: "ROE",
      value: 0.286,
      priorValue: 0.251,
      unit: "percentage",
      benchmarkValue: 0.15,
      benchmarkLabel: "BoG > 15%",
      benchmarkSource: "BoG Banking Sector Report",
      vintage: annualVintage,
    },
    {
      key: "nim",
      label: "NIM",
      value: 0.081,
      priorValue: 0.076,
      unit: "percentage",
      benchmarkValue: 0.06,
      benchmarkLabel: "BoG > 6%",
      benchmarkSource: "BoG Banking Sector Report",
      vintage: annualVintage,
    },
    {
      key: "car",
      label: "CAR",
      value: 0.182,
      priorValue: 0.171,
      unit: "percentage",
      benchmarkValue: 0.13,
      benchmarkLabel: "BoG >= 13%",
      benchmarkSource: "BoG Capital Requirements Directive",
      vintage: quarterlyVintage,
    },
  ],
  camelComposite: {
    score: 1.84,
    band: "Satisfactory",
    peerPercentile: 82,
    components: [
      { component: "capital", score: 1.6, peerPercentile: 85 },
      { component: "asset_quality", score: 2.1, peerPercentile: 71 },
      { component: "management", score: 1.9, peerPercentile: 78 },
      { component: "earnings", score: 1.5, peerPercentile: 88 },
      { component: "liquidity", score: 2.0, peerPercentile: 74 },
    ],
  },
  camelSections: [
    {
      component: "capital",
      label: "Capital Adequacy",
      score: 1.6,
      ratios: [
        {
          key: "car",
          label: "Capital Adequacy Ratio",
          formula: "Total Regulatory Capital / Risk-Weighted Assets",
          definition: "Capital buffer available to absorb losses relative to risk-weighted assets.",
          value: 0.182,
          unit: "percentage",
          priorValue: 0.171,
          yoyChange: 0.011,
          benchmarkValue: 0.13,
          benchmarkLabel: "BoG minimum 13%",
          benchmarkSource: "BoG Capital Requirements Directive",
          trend: [
            { period: "2021", value: 0.154 },
            { period: "2022", value: 0.162 },
            { period: "2023", value: 0.168 },
            { period: "2024", value: 0.171 },
            { period: "2025", value: 0.182 },
          ],
          vintage: quarterlyVintage,
        },
        {
          key: "tier-1",
          label: "Tier 1 Capital Ratio",
          formula: "Core Equity Tier 1 / Risk-Weighted Assets",
          definition: "Core capital coverage before supplementary capital is considered.",
          value: 0.142,
          unit: "percentage",
          priorValue: 0.137,
          yoyChange: 0.005,
          benchmarkValue: 0.065,
          benchmarkLabel: "BoG minimum 6.5%",
          benchmarkSource: "BoG Capital Requirements Directive",
          trend: [
            { period: "2021", value: 0.121 },
            { period: "2022", value: 0.129 },
            { period: "2023", value: 0.133 },
            { period: "2024", value: 0.137 },
            { period: "2025", value: 0.142 },
          ],
          vintage: annualVintage,
        },
      ],
    },
    {
      component: "asset_quality",
      label: "Asset Quality",
      score: 2.1,
      ratios: [
        {
          key: "npl",
          label: "NPL Ratio",
          formula: "Non-Performing Loans / Gross Loans and Advances",
          definition: "Share of gross loans that are Stage 3 or credit impaired.",
          value: 0.071,
          unit: "percentage",
          priorValue: 0.084,
          yoyChange: -0.013,
          benchmarkValue: 0.05,
          benchmarkLabel: "BoG target < 5%",
          benchmarkSource: "BoG Banking Sector Report",
          trend: [
            { period: "2021", value: 0.116 },
            { period: "2022", value: 0.104 },
            { period: "2023", value: 0.092 },
            { period: "2024", value: 0.084 },
            { period: "2025", value: 0.071 },
          ],
          vintage: annualVintage,
        },
        {
          key: "coverage",
          label: "Provision Coverage Ratio",
          formula: "Loan Loss Provisions / NPLs",
          definition: "Coverage of impaired assets by expected credit loss reserves.",
          value: 0.79,
          unit: "percentage",
          priorValue: 0.74,
          yoyChange: 0.05,
          benchmarkValue: 0.7,
          benchmarkLabel: "BoG >= 70%",
          benchmarkSource: "BoG Prudential Guidelines",
          trend: [
            { period: "2021", value: 0.61 },
            { period: "2022", value: 0.67 },
            { period: "2023", value: 0.7 },
            { period: "2024", value: 0.74 },
            { period: "2025", value: 0.79 },
          ],
          vintage: annualVintage,
        },
      ],
    },
    {
      component: "management",
      label: "Management Quality",
      score: 1.9,
      ratios: [
        {
          key: "cir",
          label: "Cost-to-Income Ratio",
          formula: "Operating Expenses / Operating Income",
          definition: "Measures operating efficiency against operating revenue.",
          value: 0.472,
          unit: "percentage",
          priorValue: 0.489,
          yoyChange: -0.017,
          benchmarkValue: 0.6,
          benchmarkLabel: "BoG guidance < 60%",
          benchmarkSource: "BoG sector efficiency guidance",
          trend: [
            { period: "2021", value: 0.551 },
            { period: "2022", value: 0.523 },
            { period: "2023", value: 0.503 },
            { period: "2024", value: 0.489 },
            { period: "2025", value: 0.472 },
          ],
          vintage: annualVintage,
        },
        {
          key: "asset-utilisation",
          label: "Asset Utilisation Ratio",
          formula: "Total Revenue / Average Total Assets",
          definition: "Revenue generated from each cedi of average assets.",
          value: 0.132,
          unit: "percentage",
          priorValue: 0.121,
          yoyChange: 0.011,
          benchmarkValue: null,
          benchmarkLabel: "Peer trend",
          benchmarkSource: "Murigne peer set",
          trend: [
            { period: "2021", value: 0.094 },
            { period: "2022", value: 0.101 },
            { period: "2023", value: 0.112 },
            { period: "2024", value: 0.121 },
            { period: "2025", value: 0.132 },
          ],
          vintage: annualVintage,
        },
      ],
    },
    {
      component: "earnings",
      label: "Earnings and Profitability",
      score: 1.5,
      ratios: [
        {
          key: "roa",
          label: "Return on Assets",
          formula: "Net Income / Average Total Assets",
          definition: "Profitability earned on the average asset base.",
          value: 0.034,
          unit: "percentage",
          priorValue: 0.031,
          yoyChange: 0.003,
          benchmarkValue: 0.015,
          benchmarkLabel: "BoG > 1.5%",
          benchmarkSource: "BoG Banking Sector Report",
          trend: [
            { period: "2021", value: 0.021 },
            { period: "2022", value: 0.026 },
            { period: "2023", value: 0.029 },
            { period: "2024", value: 0.031 },
            { period: "2025", value: 0.034 },
          ],
          vintage: annualVintage,
        },
        {
          key: "roe",
          label: "Return on Equity",
          formula: "Net Income / Average Shareholders Equity",
          definition: "Measures profitability attributable to shareholders.",
          value: 0.286,
          unit: "percentage",
          priorValue: 0.251,
          yoyChange: 0.035,
          benchmarkValue: 0.15,
          benchmarkLabel: "BoG > 15%",
          benchmarkSource: "BoG Banking Sector Report",
          trend: [
            { period: "2021", value: 0.18 },
            { period: "2022", value: 0.217 },
            { period: "2023", value: 0.233 },
            { period: "2024", value: 0.251 },
            { period: "2025", value: 0.286 },
          ],
          vintage: annualVintage,
        },
      ],
    },
    {
      component: "liquidity",
      label: "Liquidity",
      score: 2.0,
      ratios: [
        {
          key: "cash-assets",
          label: "Cash and Liquid Assets Ratio",
          formula: "(Cash + Due from Banks) / Total Assets",
          definition: "Share of assets held in immediately liquid form.",
          value: 0.144,
          unit: "percentage",
          priorValue: 0.133,
          yoyChange: 0.011,
          benchmarkValue: 0.1,
          benchmarkLabel: "BoG >= 10%",
          benchmarkSource: "BoG Primary Reserve Requirement",
          trend: [
            { period: "2021", value: 0.107 },
            { period: "2022", value: 0.115 },
            { period: "2023", value: 0.121 },
            { period: "2024", value: 0.133 },
            { period: "2025", value: 0.144 },
          ],
          vintage: annualVintage,
        },
        {
          key: "loans-assets",
          label: "Loans-to-Assets Ratio",
          formula: "Net Loans / Total Assets",
          definition: "Concentration of the balance sheet in the loan book.",
          value: 0.563,
          unit: "percentage",
          priorValue: 0.578,
          yoyChange: -0.015,
          benchmarkValue: 0.65,
          benchmarkLabel: "Guidance < 65%",
          benchmarkSource: "BoG asset quality guidance",
          trend: [
            { period: "2021", value: 0.612 },
            { period: "2022", value: 0.598 },
            { period: "2023", value: 0.584 },
            { period: "2024", value: 0.578 },
            { period: "2025", value: 0.563 },
          ],
          vintage: annualVintage,
        },
      ],
    },
  ],
  creditAssessment: [
    {
      key: "character",
      label: "Character",
      assessment: "Management execution improved after a two-year deposit franchise rebuild and better risk discipline.",
      tone: "positive",
      sourceNote: "Board report and investor presentation commentary.",
    },
    {
      key: "capacity",
      label: "Capacity",
      assessment: "Core earnings cover credit costs comfortably, but sustained sovereign exposure still shapes revenue stability.",
      tone: "neutral",
      sourceNote: "Income statement and segment note review.",
    },
    {
      key: "capital",
      label: "Capital",
      assessment: "Regulatory buffers remain above BoG minimums with retained earnings supporting internal capital generation.",
      tone: "positive",
      sourceNote: "Capital adequacy disclosures and prudential filing.",
    },
    {
      key: "collateral",
      label: "Collateral",
      assessment: "Collateral coverage is improving, though recoveries remain slower in SME exposures than in corporate books.",
      tone: "warning",
      sourceNote: "Credit risk note and impaired loan commentary.",
    },
    {
      key: "conditions",
      label: "Conditions",
      assessment: "Macro volatility has eased from 2023 peaks, but funding costs still react quickly to policy-rate shifts.",
      tone: "neutral",
      sourceNote: "BoG MPR path and management outlook statement.",
    },
  ],
  financialStatements: {
    availableViews: ["absolute", "common_size"],
    availableStatements: ["income_statement", "balance_sheet", "cash_flow"],
    years: statementYears,
  },
  statementRows: {
    absolute: [
      {
        statementType: "income_statement",
        section: "Revenue",
        lineItemKey: "interest-income",
        lineItemLabel: "Interest income",
        values: buildValues([6720000000, 5980000000, 5240000000, 4380000000, 3710000000], statementYears, "ghs"),
      },
      {
        statementType: "income_statement",
        section: "Revenue",
        lineItemKey: "net-interest-income",
        lineItemLabel: "Net interest income",
        values: buildValues([2950000000, 2630000000, 2270000000, 1860000000, 1490000000], statementYears, "ghs"),
      },
      {
        statementType: "income_statement",
        section: "Profitability",
        lineItemKey: "profit-after-tax",
        lineItemLabel: "Profit after tax",
        values: buildValues([1480000000, 1240000000, 1010000000, 822000000, 615000000], statementYears, "ghs"),
      },
      {
        statementType: "balance_sheet",
        section: "Assets",
        lineItemKey: "total-assets",
        lineItemLabel: "Total assets",
        values: buildValues([43200000000, 40100000000, 34800000000, 30100000000, 27900000000], statementYears, "ghs"),
      },
      {
        statementType: "balance_sheet",
        section: "Assets",
        lineItemKey: "gross-loans",
        lineItemLabel: "Gross loans and advances",
        values: buildValues([25300000000, 23200000000, 20400000000, 18400000000, 17100000000], statementYears, "ghs"),
      },
      {
        statementType: "balance_sheet",
        section: "Liabilities",
        lineItemKey: "customer-deposits",
        lineItemLabel: "Customer deposits",
        values: buildValues([30900000000, 28100000000, 24600000000, 21900000000, 19800000000], statementYears, "ghs"),
      },
      {
        statementType: "cash_flow",
        section: "Operating cash flow",
        lineItemKey: "net-operating-cash",
        lineItemLabel: "Net cash from operating activities",
        values: buildValues([1960000000, 1720000000, 1430000000, 1180000000, 940000000], statementYears, "ghs"),
      },
      {
        statementType: "cash_flow",
        section: "Investing cash flow",
        lineItemKey: "net-investing-cash",
        lineItemLabel: "Net cash used in investing activities",
        values: buildValues([-820000000, -760000000, -690000000, -615000000, -540000000], statementYears, "ghs"),
      },
    ],
    common_size: [
      {
        statementType: "income_statement",
        section: "Revenue",
        lineItemKey: "interest-income",
        lineItemLabel: "Interest income",
        values: buildValues([1, 1, 1, 1, 1], statementYears, "percentage"),
      },
      {
        statementType: "income_statement",
        section: "Revenue",
        lineItemKey: "net-interest-income",
        lineItemLabel: "Net interest income",
        values: buildValues([0.439, 0.44, 0.433, 0.425, 0.402], statementYears, "percentage"),
      },
      {
        statementType: "income_statement",
        section: "Profitability",
        lineItemKey: "profit-after-tax",
        lineItemLabel: "Profit after tax",
        values: buildValues([0.22, 0.207, 0.193, 0.188, 0.166], statementYears, "percentage"),
      },
      {
        statementType: "balance_sheet",
        section: "Assets",
        lineItemKey: "total-assets",
        lineItemLabel: "Total assets",
        values: buildValues([1, 1, 1, 1, 1], statementYears, "percentage"),
      },
      {
        statementType: "balance_sheet",
        section: "Assets",
        lineItemKey: "gross-loans",
        lineItemLabel: "Gross loans and advances",
        values: buildValues([0.586, 0.579, 0.586, 0.611, 0.613], statementYears, "percentage"),
      },
      {
        statementType: "balance_sheet",
        section: "Liabilities",
        lineItemKey: "customer-deposits",
        lineItemLabel: "Customer deposits",
        values: buildValues([0.715, 0.701, 0.707, 0.727, 0.71], statementYears, "percentage"),
      },
      {
        statementType: "cash_flow",
        section: "Operating cash flow",
        lineItemKey: "net-operating-cash",
        lineItemLabel: "Net cash from operating activities",
        values: buildValues([0.287, 0.288, 0.273, 0.269, 0.253], statementYears, "percentage"),
      },
      {
        statementType: "cash_flow",
        section: "Investing cash flow",
        lineItemKey: "net-investing-cash",
        lineItemLabel: "Net cash used in investing activities",
        values: buildValues([-0.12, -0.127, -0.132, -0.14, -0.146], statementYears, "percentage"),
      },
    ],
  },
  fixedIncome: {
    hasListedBonds: false,
    bonds: [],
  },
};

const profiles: Record<string, MockBankProfile> = {
  "gcb-bank": gcbProfile,
  gcb: gcbProfile,
};

export function getBankProfile(bankId: string): MockBankProfile | null {
  return profiles[bankId] ?? null;
}

export function getCamelScoreBand(score: number | null): BankProfileResponse["camelComposite"]["band"] {
  if (score === null || Number.isNaN(score) || score < 1 || score > 5) {
    return null;
  }
  if (score <= 1.5) {
    return "Strong";
  }
  if (score <= 2.5) {
    return "Satisfactory";
  }
  if (score <= 3.5) {
    return "Fair";
  }
  if (score <= 4.5) {
    return "Marginal";
  }
  return "Unsatisfactory";
}

export function getBenchmarkState(
  value: number | null,
  benchmarkValue: number | null,
): "above" | "below" | "neutral" {
  if (value === null || benchmarkValue === null) {
    return "neutral";
  }
  return value >= benchmarkValue ? "above" : "below";
}

export function formatPercent(value: number | null): string {
  if (value === null) {
    return "N/A";
  }
  return `${(value * 100).toFixed(2)}%`;
}

export function formatCurrency(value: number | null): string {
  if (value === null) {
    return "N/A";
  }
  return new Intl.NumberFormat("en-GH", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatCompactCurrency(value: number | null): string {
  if (value === null) {
    return "N/A";
  }
  return new Intl.NumberFormat("en-GH", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatInteger(value: number | null): string {
  if (value === null) {
    return "N/A";
  }
  return new Intl.NumberFormat("en-GH", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function getHeadlineMetricSummary(
  metric: BankProfileResponse["headlineMetrics"][number],
): {
  valueLabel: string;
  yoyLabel: string;
  benchmarkLabel: string;
  benchmarkState: "above" | "below" | "neutral";
} {
  const yoyChange =
    metric.value !== null && metric.priorValue !== null ? metric.value - metric.priorValue : null;

  return {
    valueLabel: formatPercent(metric.value),
    yoyLabel: yoyChange === null ? "YoY N/A" : `${yoyChange >= 0 ? "+" : ""}${(yoyChange * 100).toFixed(2)}pp YoY`,
    benchmarkLabel:
      metric.benchmarkValue === null
        ? metric.benchmarkLabel
        : `${formatPercent(metric.benchmarkValue)} benchmark`,
    benchmarkState: getBenchmarkState(metric.value, metric.benchmarkValue),
  };
}

export function parseBankProfileQuery(params: Record<string, string | string[] | undefined>): QuerySelection {
  const statementView = params.statementView;
  const years = params.years;
  const period = params.period;

  const parsedView = statementView === "common_size" ? "common_size" : "absolute";
  const parsedYears = years === "1" || years === "3" || years === "5" ? Number(years) as 1 | 3 | 5 : 5;
  const parsedPeriod =
    typeof period === "string" && /^\d{4}-\d{2}-\d{2}$/.test(period) ? period : "latest";

  return {
    statementView: parsedView,
    years: parsedYears,
    period: parsedPeriod,
  };
}

export function getFinancialStatementRows(
  profile: MockBankProfile,
  statementType: StatementType,
  statementView: StatementView,
  years: 1 | 3 | 5,
): StatementRow[] {
  const selectedYears = profile.financialStatements.years.slice(0, years);

  return profile.statementRows[statementView]
    .filter((row) => row.statementType === statementType)
    .map((row) => ({
      ...row,
      values: row.values.filter((cell) => selectedYears.includes(cell.year)),
    }));
}

export function hasFixedIncomeEmptyState(profile: BankProfileResponse): boolean {
  return !profile.fixedIncome.hasListedBonds || profile.fixedIncome.bonds.length === 0;
}
