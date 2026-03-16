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
    value: "18.4%",
    context: "Above the current internal benchmark for listed bank coverage.",
    formula: "Regulatory capital / Risk-weighted assets",
    definition:
      "Measures the capital buffer available to absorb losses relative to risk-weighted assets.",
    source: "Source: bank annual report + BoG prudential notes",
    status: "Healthy buffer",
    statusTone: "success",
    cardTone: "ice",
  },
  {
    id: "npl",
    name: "Non-performing loan ratio",
    category: "Asset quality",
    value: "9.7%",
    context: "Elevated but improving versus the prior reporting period.",
    formula: "Non-performing loans / Gross loans",
    definition: "Shows the share of gross loans that are impaired or in default.",
    source: "Source: note disclosures in audited bank reports",
    status: "Watchlist",
    statusTone: "warning",
    cardTone: "sand",
  },
  {
    id: "roe",
    name: "Return on equity",
    category: "Earnings",
    value: "26.2%",
    context: "Strong earnings power for a frontier-market bank basket.",
    formula: "Net income / Average shareholder equity",
    definition: "Captures how efficiently common equity is converted into profit.",
    source: "Source: income statement and statement of financial position",
    status: "Outperforming",
    statusTone: "success",
    cardTone: "soft",
  },
  {
    id: "ldr",
    name: "Loan-to-deposit ratio",
    category: "Liquidity",
    value: "62.1%",
    context: "Comfortable funding profile with room to re-accelerate credit.",
    formula: "Net loans / Customer deposits",
    definition: "Indicates how aggressively deposits are deployed into the loan book.",
    source: "Source: balance sheet funding and loan book line items",
    status: "Conservative",
    statusTone: "info",
    cardTone: "sun",
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
    capital: "18.4%",
    earnings: "31.2%",
    liquidity: "58.6%",
    rating: "Core holding",
    ratingTone: "success",
  },
  {
    bank: "Ecobank Ghana",
    ticker: "EGH",
    capital: "15.9%",
    earnings: "24.1%",
    liquidity: "65.4%",
    rating: "Monitoring",
    ratingTone: "warning",
  },
  {
    bank: "CalBank",
    ticker: "CAL",
    capital: "17.1%",
    earnings: "22.8%",
    liquidity: "60.9%",
    rating: "Stable",
    ratingTone: "info",
  },
];
