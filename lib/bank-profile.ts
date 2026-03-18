export type Vintage = {
  period: string;
  sourceLabel: string;
  auditStatus: "Audited" | "Unaudited";
  reportingPeriod: string;
};

export type BankProfile = {
  id: string;
  name: string;
  ticker: string;
  listingDate: string;
  summary: string;
  marketCapGhs: number;
  lastClosingPriceGhs: number;
  latestVintage: Vintage;
  headlineMetrics: Array<{
    label: string;
    value: string;
    context: string;
  }>;
  camelComposite: {
    band: string;
    components: Array<{
      label: string;
      score: number;
      summary: string;
    }>;
  };
  camelSections: Array<{
    label: string;
    title: string;
    score: string;
    badgeTone: "success" | "warning" | "info";
    ratios: Array<{
      label: string;
      value: string;
      formula: string;
      definition: string;
    }>;
  }>;
  valuation: {
    ddmHeadline: string;
    ddmSummary: string;
    riHeadline: string;
    riSummary: string;
  };
  fixedIncomeSummary: string;
  financialRows: FinancialStatementRow[];
};

export type FinancialStatementRow = {
  label: string;
  fy2023: string;
  fy2024: string;
  fy2025: string;
};

export type BankProfileQuery = {
  statementView: "absolute" | "common_size";
  years: 1 | 3 | 5;
  period: string;
};

const gcbBankProfile: BankProfile = {
  id: "gcb-bank",
  name: "GCB Bank PLC",
  ticker: "GCB",
  listingDate: "1996",
  summary:
    "GCB Bank remains one of the core listed Ghanaian banks, with capital, liquidity, and profitability metrics tracked against BoG thresholds and peer benchmarks.",
  marketCapGhs: 7450000000,
  lastClosingPriceGhs: 7.42,
  latestVintage: {
    period: "FY 2025",
    sourceLabel: "2025 Annual Report",
    auditStatus: "Audited",
    reportingPeriod: "FY 2025",
  },
  headlineMetrics: [
    {
      label: "ROA",
      value: formatPercentage(0.034),
      context: "Above the 1.5% profitability benchmark with stronger asset utilization.",
    },
    {
      label: "ROE",
      value: formatPercentage(0.286),
      context: "Equity returns remain comfortably above the internal Ghana banking hurdle.",
    },
    {
      label: "NIM",
      value: formatPercentage(0.082),
      context: "Margin expansion continues as funding costs stabilize versus the prior year.",
    },
    {
      label: "CAR",
      value: formatPercentage(0.184),
      context: "Regulatory capital remains above the BoG prudential benchmark.",
    },
  ],
  camelComposite: {
    band: "Satisfactory",
    components: [
      { label: "Capital", score: 1.8, summary: "Capital buffers remain above BoG minimums." },
      { label: "Asset Quality", score: 2.4, summary: "NPL pressure is easing but still monitored." },
      { label: "Management", score: 2.1, summary: "Operating efficiency trend improved year over year." },
      { label: "Earnings", score: 1.7, summary: "Profitability remains a relative strength." },
      { label: "Liquidity", score: 2.0, summary: "Deposit funding remains stable and diversified." },
    ],
  },
  camelSections: [
    {
      label: "Capital",
      title: "Capital adequacy",
      score: "1.8 / 5",
      badgeTone: "success",
      ratios: [
        {
          label: "Capital adequacy ratio",
          value: formatPercentage(0.184),
          formula: "Regulatory capital / Risk-weighted assets",
          definition: "Measures the available capital buffer against risk-weighted assets.",
        },
        {
          label: "Tier 1 capital ratio",
          value: formatPercentage(0.141),
          formula: "Core equity Tier 1 / Risk-weighted assets",
          definition: "Shows the highest-quality loss-absorbing capital coverage.",
        },
      ],
    },
    {
      label: "Asset quality",
      title: "Credit quality",
      score: "2.4 / 5",
      badgeTone: "warning",
      ratios: [
        {
          label: "NPL ratio",
          value: formatPercentage(0.097),
          formula: "Non-performing loans / Gross loans",
          definition: "Tracks the share of the gross loan book classified as impaired.",
        },
        {
          label: "Provision coverage",
          value: formatPercentage(0.731),
          formula: "Loan loss provisions / Non-performing loans",
          definition: "Indicates how much of the impaired book is already provisioned.",
        },
      ],
    },
    {
      label: "Earnings",
      title: "Profitability",
      score: "1.7 / 5",
      badgeTone: "success",
      ratios: [
        {
          label: "Return on assets",
          value: formatPercentage(0.034),
          formula: "Net income / Average total assets",
          definition: "Measures profitability generated from the average asset base.",
        },
        {
          label: "Return on equity",
          value: formatPercentage(0.286),
          formula: "Net income / Average shareholders' equity",
          definition: "Measures profitability attributable to shareholders.",
        },
      ],
    },
    {
      label: "Liquidity",
      title: "Funding and liquidity",
      score: "2.0 / 5",
      badgeTone: "info",
      ratios: [
        {
          label: "Cash and liquid assets",
          value: formatPercentage(0.144),
          formula: "(Cash + Due from banks) / Total assets",
          definition: "Shows the share of the balance sheet kept in immediately liquid assets.",
        },
        {
          label: "Loans-to-assets",
          value: formatPercentage(0.563),
          formula: "Net loans / Total assets",
          definition: "Shows how concentrated the asset base is in the loan book.",
        },
      ],
    },
  ],
  valuation: {
    ddmHeadline: "Intrinsic value remains above the last market close",
    ddmSummary:
      "A stable-growth DDM using a 91-day T-bill-linked cost of equity still implies modest upside versus the current trading price.",
    riHeadline: "Residual income model points to undervaluation on P/B",
    riSummary:
      "The RI view continues to show positive spread between forecast ROE and cost of equity, supporting an above-market justified P/B.",
  },
  fixedIncomeSummary:
    "No listed bond inventory is exposed yet for this mocked profile. The widened layout keeps the empty-state panel aligned with the rest of the profile shell.",
  financialRows: [
    { label: "Interest income", fy2023: "GHS 5.24bn", fy2024: "GHS 5.98bn", fy2025: "GHS 6.72bn" },
    { label: "Net interest income", fy2023: "GHS 2.27bn", fy2024: "GHS 2.63bn", fy2025: "GHS 2.95bn" },
    { label: "Profit after tax", fy2023: "GHS 1.01bn", fy2024: "GHS 1.24bn", fy2025: "GHS 1.48bn" },
    { label: "Total assets", fy2023: "GHS 34.8bn", fy2024: "GHS 40.1bn", fy2025: "GHS 43.2bn" },
  ],
};

const profiles: Record<string, BankProfile> = {
  gcb: gcbBankProfile,
  "gcb-bank": gcbBankProfile,
};

export function getBankProfile(bankId: string): BankProfile | null {
  return profiles[bankId] ?? null;
}

export function formatPercentage(value: number | null): string {
  if (value === null) {
    return "N/A";
  }

  return `${(value * 100).toFixed(2)}%`;
}

export function parseBankProfileQuery(params: Record<string, string | string[] | undefined>): BankProfileQuery {
  const statementView = params.statementView === "common_size" ? "common_size" : "absolute";
  const yearsValue = params.years;
  const years = yearsValue === "1" || yearsValue === "3" || yearsValue === "5" ? Number(yearsValue) as 1 | 3 | 5 : 5;
  const period = typeof params.period === "string" ? params.period : "latest";

  return {
    statementView,
    years,
    period,
  };
}

export function getFinancialStatementRows(profile: BankProfile): FinancialStatementRow[] {
  return profile.financialRows;
}
