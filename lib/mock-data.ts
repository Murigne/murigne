import {
  BookOpen,
  Building2,
  Database,
  Files,
  LayoutDashboard,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";

import { computeValuation, type ComputedValuation, type ValuationInputs } from "@/lib/valuation";

export type OverviewCard = {
  id: string;
  label: string;
  value: string;
  description: string;
  delta: string;
  trend: "up" | "down" | "flat";
  tone: "default" | "soft" | "ice" | "sand" | "sun";
};

export type DashboardModule = {
  title: string;
  phase: string;
  description: string;
};

export type NavigationItem = {
  id: string;
  label: string;
  caption: string;
  icon: LucideIcon;
};

export type DataVintage = {
  period: string;
  sourceLabel: string;
  auditStatus: "Audited" | "Unaudited";
  sourceDetail: string;
};

export type BankHealthRatio = {
  id: string;
  name: string;
  category: string;
  value: string;
  context: string;
  formula: string;
  definition: string;
  source: string;
  status: string;
  statusTone: "info" | "success" | "warning" | "danger";
  cardTone: "ice" | "sand" | "sun" | "soft";
  vintage: DataVintage;
};

export type VintageHighlight = {
  bank: string;
  metric: string;
  period: string;
  sourceLabel: string;
  auditStatus: "Audited" | "Unaudited";
};

export type BankUniverseRow = {
  bank: string;
  ticker: string;
  capital: string;
  earnings: string;
  liquidity: string;
  rating: string;
  ratingTone: "success" | "warning" | "info";
};

export type TrendPoint = {
  period: string;
  label: string;
  value: number;
  displayValue: string;
  source: string;
  benchmark?: string;
};

export type TrendSeries = {
  id: string;
  title: string;
  subtitle: string;
  formula: string;
  definition: string;
  benchmark: string;
  values: TrendPoint[];
};

export type ValuationDriver = {
  label: string;
  value: string;
  formula: string;
  definition: string;
  source: string;
};

export type BankProfile = {
  name: string;
  ticker: string;
  exchange: string;
  overview: string;
  marketPrice: string;
  marketCap: string;
  priceDate: string;
  valuationVintage: DataVintage;
  financialVintage: DataVintage;
  valuationInputs: ValuationInputs;
  valuation: ComputedValuation;
  valuationDrivers: ValuationDriver[];
  bankHealthRatios: BankHealthRatio[];
  trends: TrendSeries[];
  universe: BankUniverseRow[];
};

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

function formatCurrency(value: number): string {
  return `GHS ${value.toFixed(2)}`;
}

function formatMultiple(value: number): string {
  return `${value.toFixed(2)}x`;
}

const valuationInputs: ValuationInputs = {
  riskFreeRate: 0.18,
  beta: 0.92,
  marketReturn: 0.255,
  returnOnEquity: 0.262,
  dividendPayoutRatio: 0.34,
  dividendPerShare: 1.85,
  bookValuePerShare: 9.4,
  earningsPerShare: 2.46,
  marketPrice: 7.85,
};

const valuation = computeValuation(valuationInputs);

if (valuation === null) {
  throw new Error("Mock valuation inputs must produce a valid valuation output.");
}

export const marketOverviewCards: OverviewCard[] = [
  {
    id: "banks",
    label: "Listed banks",
    value: "7",
    description: "Initial Phase 0 data-collection footprint for Ghanaian listed banks.",
    delta: "+2 sources mapped",
    trend: "up",
    tone: "ice",
  },
  {
    id: "framework",
    label: "CAMEL modules",
    value: "5",
    description: "Capital, Asset Quality, Management, Earnings, and Liquidity scoring tracks.",
    delta: "Formula spec ready",
    trend: "flat",
    tone: "soft",
  },
  {
    id: "valuation",
    label: "Valuation models",
    value: "3",
    description: "DDM, Residual Income, and relative P/B signals planned from the roadmap.",
    delta: "Server compute later",
    trend: "up",
    tone: "sand",
  },
  {
    id: "sources",
    label: "Core data sources",
    value: "8+",
    description: "GSE, GFIM, BoG, CSD, MoF, GSS, SEC Ghana, and audited bank reports.",
    delta: "Vintage labels enabled",
    trend: "up",
    tone: "sun",
  },
];

export const roadmapModules: DashboardModule[] = [
  {
    title: "Bank analysis module",
    phase: "MVP",
    description: "CAMEL ratio views, valuation models, and audited vintage-aware bank profiles.",
  },
  {
    title: "Sector dashboard",
    phase: "Phase 1",
    description: "Cross-bank rankings, macro overlays, and sector-level banking health indicators.",
  },
  {
    title: "Stress testing toolkit",
    phase: "Phase 2",
    description: "Scenario sliders and breach visualization for MPR, NPL, FX, and GDP shocks.",
  },
  {
    title: "Fixed income and macro",
    phase: "Phase 2",
    description: "Yield curves, sovereign bond views, CPI, FX, and monetary policy tracking.",
  },
];

export const primaryNavigation: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    caption: "Platform overview",
    icon: LayoutDashboard,
  },
  {
    id: "banks",
    label: "Bank analysis",
    caption: "CAMEL and valuation",
    icon: Building2,
  },
  {
    id: "vintages",
    label: "Data vintages",
    caption: "Audited timelines",
    icon: Database,
  },
  {
    id: "stress-testing",
    label: "Stress testing",
    caption: "Scenario analysis",
    icon: SlidersHorizontal,
  },
];

export const supportNavigation: NavigationItem[] = [
  {
    id: "filings",
    label: "Filings",
    caption: "Source library",
    icon: Files,
  },
  {
    id: "methodology",
    label: "Methodology",
    caption: "Definitions and models",
    icon: BookOpen,
  },
  {
    id: "compliance",
    label: "Governance",
    caption: "Trust controls",
    icon: ShieldCheck,
  },
];

export const bankHealthRatios: BankHealthRatio[] = [
  {
    id: "car",
    name: "Capital adequacy ratio",
    category: "Capital",
    value: "18.40%",
    context: "Above the BoG benchmark and supportive of further balance-sheet growth.",
    formula: "Regulatory capital / Risk-weighted assets",
    definition:
      "Measures the capital buffer available to absorb losses relative to risk-weighted assets.",
    source: "Source: 2025 Annual Report, prudential note 42 and BoG capital guideline",
    status: "Healthy buffer",
    statusTone: "success",
    cardTone: "ice",
    vintage: {
      period: "FY 2025",
      sourceLabel: "2025 Annual Report",
      auditStatus: "Audited",
      sourceDetail: "Audited annual report filed with GSE and BoG prudential disclosure.",
    },
  },
  {
    id: "npl",
    name: "Non-performing loan ratio",
    category: "Asset quality",
    value: "9.70%",
    context: "Still above the <5% benchmark, but improving against the prior year.",
    formula: "Non-performing loans / Gross loans and advances",
    definition: "Shows the share of gross loans that are impaired or in default under IFRS 9 Stage 3.",
    source: "Source: audited loan-quality note and BoG banking sector benchmark pack",
    status: "Watchlist",
    statusTone: "warning",
    cardTone: "sand",
    vintage: {
      period: "FY 2025",
      sourceLabel: "2025 Annual Report",
      auditStatus: "Audited",
      sourceDetail: "Stage 3 gross loans mapped from audited credit-risk disclosures.",
    },
  },
  {
    id: "roe",
    name: "Return on equity",
    category: "Earnings",
    value: "26.20%",
    context: "ROE remains above the estimated cost of equity, indicating value creation.",
    formula: "Net income / Average shareholder equity",
    definition: "Captures how efficiently common equity is converted into profit.",
    source: "Source: audited income statement and average equity bridge",
    status: "Value creating",
    statusTone: "success",
    cardTone: "soft",
    vintage: {
      period: "FY 2025",
      sourceLabel: "2025 Annual Report",
      auditStatus: "Audited",
      sourceDetail: "ROE computed from audited net income and average closing equity balances.",
    },
  },
  {
    id: "ldr",
    name: "Loan-to-deposit ratio",
    category: "Liquidity",
    value: "62.10%",
    context: "Within the target lending range and consistent with a conservative funding mix.",
    formula: "Net loans / Customer deposits",
    definition: "Indicates how aggressively deposits are deployed into the loan book.",
    source: "Source: audited balance sheet funding and loan book line items",
    status: "Conservative",
    statusTone: "info",
    cardTone: "sun",
    vintage: {
      period: "FY 2025",
      sourceLabel: "2025 Annual Report",
      auditStatus: "Audited",
      sourceDetail: "Deposits and net loans sourced from audited statement of financial position.",
    },
  },
];

export const vintageHighlights: VintageHighlight[] = [
  {
    bank: "GCB Bank",
    metric: "CAR and NPL metrics synced to the audited annual report source pack.",
    period: "FY 2025",
    sourceLabel: "2025 Annual Report",
    auditStatus: "Audited",
  },
  {
    bank: "Ecobank Ghana",
    metric: "Quarterly profitability inputs available for preview-only internal review.",
    period: "Q3 2025",
    sourceLabel: "Q3 Management Accounts",
    auditStatus: "Unaudited",
  },
  {
    bank: "CalBank",
    metric: "Funding structure metrics mapped to disclosure note vintage.",
    period: "H1 2025",
    sourceLabel: "Half-Year Statement",
    auditStatus: "Unaudited",
  },
];

export const bankUniverseRows: BankUniverseRow[] = [
  {
    bank: "GCB Bank",
    ticker: "GCB",
    capital: "18.40%",
    earnings: "31.20%",
    liquidity: "58.60%",
    rating: "Core holding",
    ratingTone: "success",
  },
  {
    bank: "Ecobank Ghana",
    ticker: "EGH",
    capital: "15.90%",
    earnings: "24.10%",
    liquidity: "65.40%",
    rating: "Monitoring",
    ratingTone: "warning",
  },
  {
    bank: "CalBank",
    ticker: "CAL",
    capital: "17.10%",
    earnings: "22.80%",
    liquidity: "60.90%",
    rating: "Stable",
    ratingTone: "info",
  },
];

export const bankProfile: BankProfile = {
  name: "GCB Bank PLC",
  ticker: "GCB",
  exchange: "Ghana Stock Exchange",
  overview:
    "Phase 1 profile combines audited CAMEL diagnostics with valuation views required by the roadmap, keeping every output traceable to source documents and mock market assumptions.",
  marketPrice: formatCurrency(valuationInputs.marketPrice),
  marketCap: "GHS 2.06B",
  priceDate: "18 Mar 2026",
  valuationVintage: {
    period: "FY 2025",
    sourceLabel: "Phase 1 Mock Valuation Pack",
    auditStatus: "Audited",
    sourceDetail:
      "Valuation inputs use FY 2025 audited fundamentals with mock market assumptions for T-bill, beta, and market return.",
  },
  financialVintage: {
    period: "FY 2025",
    sourceLabel: "2025 Annual Report",
    auditStatus: "Audited",
    sourceDetail: "Audited profile metrics mapped from annual report disclosures and GSE price sheet.",
  },
  valuationInputs,
  valuation,
  valuationDrivers: [
    {
      label: "Required return (r)",
      value: formatPercent(valuation.costOfEquity),
      formula: "Rf + Beta x (Rm - Rf)",
      definition: "CAPM-derived cost of equity using the mock 91-day T-bill, bank beta, and GSE market return.",
      source: "Source: Phase 1 mock market assumptions pack",
    },
    {
      label: "Sustainable growth (g)",
      value: formatPercent(valuation.sustainableGrowthRate),
      formula: "ROE x (1 - Dividend payout ratio)",
      definition: "Long-run growth implied by profitability and the reinvestment rate.",
      source: "Source: audited ROE and dividend payout inputs",
    },
    {
      label: "Next dividend (D1)",
      value: formatCurrency(valuation.nextDividend),
      formula: "D0 x (1 + g)",
      definition: "Forward dividend used in the Gordon Growth DDM.",
      source: "Source: FY 2025 dividend per share, grown by sustainable growth",
    },
    {
      label: "Actual P/B",
      value: formatMultiple(valuation.actualPriceToBook),
      formula: "Market price / Book value per share",
      definition: "Observed market multiple against current book value per share.",
      source: "Source: GSE closing price and audited book value per share",
    },
  ],
  bankHealthRatios,
  trends: [
    {
      id: "roe-trend",
      title: "Return on equity trend",
      subtitle: "Five-year profitability progression versus the >15% frontier-market benchmark.",
      formula: "Net income / Average shareholder equity",
      definition: "Shows whether earnings power is compounding above the bank's cost of equity.",
      benchmark: "Benchmark: > 15.00%",
      values: [
        { period: "FY 2021", label: "2021", value: 0.166, displayValue: "16.60%", source: "2021 Annual Report" },
        { period: "FY 2022", label: "2022", value: 0.189, displayValue: "18.90%", source: "2022 Annual Report" },
        { period: "FY 2023", label: "2023", value: 0.215, displayValue: "21.50%", source: "2023 Annual Report" },
        { period: "FY 2024", label: "2024", value: 0.239, displayValue: "23.90%", source: "2024 Annual Report" },
        { period: "FY 2025", label: "2025", value: 0.262, displayValue: "26.20%", source: "2025 Annual Report" },
      ],
    },
    {
      id: "nim-trend",
      title: "Net interest margin trend",
      subtitle: "Five-year NIM history against the Ghana banking >6% benchmark.",
      formula: "Net interest income / Average earning assets",
      definition: "Tracks asset pricing strength through the rate cycle.",
      benchmark: "Benchmark: > 6.00%",
      values: [
        { period: "FY 2021", label: "2021", value: 0.071, displayValue: "7.10%", source: "2021 Annual Report" },
        { period: "FY 2022", label: "2022", value: 0.074, displayValue: "7.40%", source: "2022 Annual Report" },
        { period: "FY 2023", label: "2023", value: 0.078, displayValue: "7.80%", source: "2023 Annual Report" },
        { period: "FY 2024", label: "2024", value: 0.081, displayValue: "8.10%", source: "2024 Annual Report" },
        { period: "FY 2025", label: "2025", value: 0.084, displayValue: "8.40%", source: "2025 Annual Report" },
      ],
    },
    {
      id: "book-value-trend",
      title: "Book value per share trend",
      subtitle: "Five-year book compounding used directly in the Residual Income framework.",
      formula: "Closing common equity / Shares outstanding",
      definition: "Measures whether retained capital is compounding in support of intrinsic value growth.",
      benchmark: "Benchmark: Positive compounding with ROE > cost of equity",
      values: [
        { period: "FY 2021", label: "2021", value: 5.3, displayValue: "GHS 5.30", source: "2021 Annual Report" },
        { period: "FY 2022", label: "2022", value: 6.1, displayValue: "GHS 6.10", source: "2022 Annual Report" },
        { period: "FY 2023", label: "2023", value: 7.0, displayValue: "GHS 7.00", source: "2023 Annual Report" },
        { period: "FY 2024", label: "2024", value: 8.1, displayValue: "GHS 8.10", source: "2024 Annual Report" },
        { period: "FY 2025", label: "2025", value: 9.4, displayValue: "GHS 9.40", source: "2025 Annual Report" },
      ],
    },
  ],
  universe: bankUniverseRows,
};
