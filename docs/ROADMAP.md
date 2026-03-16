# Murigne — Ghana Financial Data Platform
## Product Roadmap & Technical Plan
### Version 1.0 | March 2026

---

## 1. Vision

Murigne is Ghana's premier financial data and analytics platform — the Bloomberg of West Africa.
It aggregates, analyses, and visualises financial data from every major Ghanaian capital market
institution into a single, unified platform for investors, analysts, fund managers, and the general public.

Data sources covered:
- Ghana Stock Exchange (GSE) — equities, listings, price data
- Ghana Fixed Income Market (GFIM) — bonds, T-bills, yield curves
- Bank of Ghana (BoG) — monetary policy, FX rates, banking sector data
- Central Securities Depository (CSD) — settlement, custody, ownership data
- Ministry of Finance (MoF) — fiscal data, budget statements, debt management
- Ghana Statistical Service (GSS) — GDP, CPI, macro indicators
- Securities and Exchange Commission (SEC Ghana) — disclosures, prospectuses
- Individual bank annual reports — CAMEL analysis, financial statements

Inspired by: GuruFocus, Bloomberg Terminal, Refinitiv Eikon
Analytical framework: CFA Program (Levels 1, 2, and 3)

---

## 2. Target Audience

Retail Investors — Individual GSE investors, mobile trading users
Primary need: Simple CAMEL scores, ratio explanations, basic valuation

Institutional Investors — Fund managers, pension funds, insurance companies
Primary need: Deep data, peer benchmarking, risk-adjusted returns, stress tests

Equity Analysts — Research desks at brokerages and investment banks
Primary need: DDM/RI models, raw financials, sensitivity analysis

Private Wealth Managers — Advisors serving HNW clients in Ghana
Primary need: Asset allocation, after-tax returns, portfolio risk tools

Regulators and Academics — BoG-aligned researchers, university finance departments
Primary need: Systemic risk indicators, stress test outputs, sector aggregates

---

## 3. Phase 1 MVP — Bank Analysis Module

### 3.1 CAMEL Framework

C — Capital Adequacy (CFA L1 / L2)
- Capital Adequacy Ratio (CAR): Total Regulatory Capital / Risk-Weighted Assets — BoG benchmark >= 13%
- Tier 1 Capital Ratio: Core Equity Tier 1 / Risk-Weighted Assets — BoG benchmark >= 6.5%
- Leverage Ratio: Equity / Total Assets — Peer benchmarked
- DuPont ROE: Net Margin x Asset Turnover x Equity Multiplier — Trend analysis
- Retained Earnings Growth: YoY growth in retained earnings — Positive trend

A — Asset Quality (CFA L1 / L2)
- NPL Ratio: NPLs / Gross Loans and Advances — benchmark < 5%
- Loan Loss Provision Ratio: Loan Loss Provisions / Gross Loans — Peer compared
- Provision Coverage Ratio: Loan Loss Provisions / NPLs — benchmark >= 70%
- Loan-to-Deposit Ratio: Net Loans / Total Deposits — 60% to 80%
- Net Charge-Off Rate: Net Loan Write-offs / Average Loans — Low and declining
- Credit Concentration Risk: Top 10 Borrower Exposure / Total Loans — < 30%

5Cs Credit Analysis Framework (CFA L2):
- Character: Management track record, governance quality, loan repayment culture
- Capacity: Borrower cash flow sufficiency — debt service coverage ratios
- Capital: Borrower net worth and leverage — sector concentration data
- Collateral: Security backing the loan portfolio — collateral coverage ratios
- Conditions: Macro environment — Ghana MPR cycle, inflation, cedi depreciation

M — Management Quality (CFA L1 / L2)
- Cost-to-Income Ratio (CIR): Operating Expenses / Operating Income — benchmark < 60%
- Staff Cost Ratio: Staff Expenses / Operating Expenses — Peer compared
- Asset Utilisation Ratio: Total Revenue / Average Total Assets — Upward trend
- Dividend Payout Ratio: Dividends Paid / Net Income After Tax — Sustainable level

E — Earnings and Profitability (CFA L1 / L2)
- Return on Assets (ROA): Net Income / Average Total Assets — benchmark > 1.5%
- Return on Equity (ROE): Net Income / Average Shareholders Equity — benchmark > 15%
- Net Interest Margin (NIM): Net Interest Income / Average Earning Assets — benchmark > 6% Ghana
- Non-Interest Income Ratio: Non-Interest Income / Total Operating Income — Diversification signal
- EPS Growth: YoY change in Earnings Per Share — Positive and accelerating
- Price-to-Earnings (P/E): Market Price per Share / EPS — Peer compared
- Price-to-Book (P/B): Market Price per Share / Book Value per Share — below 1 may signal undervalue

L — Liquidity (CFA L1 / L2)
- Liquidity Coverage Ratio (LCR): HQLA / Net Cash Outflows 30-day stress — BoG benchmark >= 100%
- Cash and Liquid Assets Ratio: Cash + Due from Banks / Total Assets — BoG benchmark >= 10%
- Loans-to-Assets Ratio: Net Loans / Total Assets — benchmark < 65%
- Deposit-to-Funding Ratio: Total Deposits / Total Funding — High = stable
- Interbank Borrowing Ratio: Interbank Borrowings / Total Liabilities — Low preferred

### 3.2 CAMEL Composite Score
- Each component scored 1 to 5 (1 = strongest, 5 = weakest) — aligned with BoG convention
- Score bands: 1.0-1.5 Strong | 1.5-2.5 Satisfactory | 2.5-3.5 Fair | 3.5-4.5 Marginal | 4.5-5.0 Unsatisfactory
- Displayed as radar chart and single numeric score
- Peer percentile rank shown for each component and composite

---

### 3.3 Bank Equity Valuation Models (CFA L2)

Dividend Discount Model (DDM) / Gordon Growth Model:
- Intrinsic Value = D1 / (r - g)
- r = required return on equity using CAPM: r = Rf + Beta x (Rm - Rf)
- Rf = BoG 91-day T-bill rate
- g = sustainable growth rate = ROE x (1 - Dividend Payout Ratio)
- Multistage DDM applied where high near-term growth transitions to stable long-run growth

Residual Income (RI) Model — preferred CFA L2 model for banks:
- Intrinsic Value = Book Value per Share + PV of Future Residual Income
- Residual Income = EPS - (r x BVt-1)
- Single-stage: V = B0 + [(ROE - r) x B0] / (r - g)
- Justified P/B = 1 + (ROE - r) / (r - g)
- RI-implied P/B vs actual market P/B displayed as over/undervaluation signal

Price-to-Book Relative Valuation:
- P/B vs ROE scatter plot across all GSE-listed banks
- Justified P/B = (ROE - g) / (r - g)
- Peer P/B percentile ranking across the GSE banking sector

### 3.4 Portfolio Management and Risk Tools (CFA L3)

Performance Metrics:
- Sharpe Ratio: (Rp - Rf) / sigma_p — risk-adjusted return vs 91-day T-bill
- Treynor Ratio: (Rp - Rf) / Beta_p — reward per unit of systematic risk
- Jensen Alpha: Actual return minus CAPM expected return — stock-picking performance
- Information Ratio: Active return / tracking error — fund manager benchmark

Stress Testing Scenarios:
- MPR +300bps
- NPL ratio +5pp
- Cedi depreciation 30%
- GDP contraction 3%
- Output: traffic-light dashboard showing which banks breach CAR minimum under each scenario

Risk Measures:
- VaR: 1-day, 5% confidence level computed from GSE price history
- CVaR / Expected Shortfall for tail risk
- Pairwise return correlation matrix across all GSE-listed banks

---

## 4. Platform Features

### 4.1 Bank Profile Pages
- Company overview, listing history, shareholding structure
- 5-year financial statements in common-size format (IS, BS, CF)
- Full CAMEL ratio display with YoY trend charts and BoG benchmarks
- DDM and Residual Income intrinsic value vs current market price
- CAMEL Composite Score as radar chart and numeric score
- 5Cs qualitative credit assessment summary
- Data vintage labels: source, reporting period, audited/unaudited flag

### 4.2 Bank Comparison Tool
- Side-by-side comparison of up to 4 GSE-listed banks
- Sector median benchmarks as reference line on all charts
- ROE vs cost of equity overlay
- Sharpe and Treynor ratio comparison
- Exportable comparison table to Excel/PDF

### 4.3 Sector Dashboard
- Aggregated banking sector: total assets, total loans, sector NIM, average NPL ratio
- Macro overlay: MPR, CPI, cedi rate alongside sector NIM trend
- GDP growth vs sector credit growth — credit cycle positioning
- Individual bank ranking tables by CAMEL metric and risk-adjusted return

### 4.4 Screener
- Filter banks by any ratio (e.g. NPL < 5%, ROE > 20%, CAR > 15%)
- Pre-built screens: High CAMEL Score, Low NPL Banks, Banks with ROE above Cost of Equity
- Justified P/B screener: banks trading below RI-model intrinsic book value
- Save custom screens for registered users

### 4.5 Stress Testing Tool (CFA L3)
- Pre-built macro scenarios with single-variable sensitivity sliders
- Scenario output: traffic-light dashboard per bank per scenario
- Correlation matrix of GSE bank stock returns
- VaR and CVaR per bank stock

### 4.6 Fixed Income Module (CFA L1 / L2)
- BoG yield curve: 91-day, 182-day, 364-day T-bill plus 2Y, 5Y, 10Y GoG bond yields
- Corporate bond screener — yield, duration, credit spread vs sovereign
- Bond portfolio duration calculator

### 4.7 Macro Dashboard (CFA L1 / L2)
- BoG Monetary Policy Rate (MPR) tracker with historical chart
- CPI and core inflation overlay on bank ROA/ROE trend charts
- GHS/USD and GHS/GBP rate tracker
- Ghana GDP growth overlaid on sector NPL ratio
- Bank-level NIM sensitivity: estimated impact per 100bps MPR change

### 4.8 News and Disclosures Feed
- Aggregated news from Graphic Business, Citi Business News, GhanaWeb per bank
- Corporate action alerts: dividend announcements, rights issues, board changes
- BoG policy rate and banking sector report releases

---

## 5. Data Architecture

### 5.1 Data Sources
- Bank Annual Reports: Full financial statements — PDF extraction + manual validation
- GSE Official Website: Price data, corporate announcements — Web scraping + RSS monitoring
- Bank of Ghana Reports: MPR, sector banking stats, FX data — PDF/Excel download, quarterly entry
- Ghana Statistical Service: GDP, CPI, macro indicators — Public data download, quarterly update
- SEC Ghana: Insider disclosures, prospectuses — Manual monitoring and entry
- Bloomberg / Reuters (Phase 3+): Real-time prices, bond yields, FX — API licensing

### 5.2 Data Pipeline
- Stage 1 MVP: Manual data entry via admin dashboard — dual-entry validated before publishing
- Stage 2 (6-12 months): Semi-automated PDF extraction using AI-assisted OCR
- Stage 3 (12-24 months): Fully automated ingestion pipeline with anomaly detection
- All data stored in PostgreSQL with full versioning — restated financials tracked transparently

---

## 6. Roadmap and Timeline

Phase 0 (Months 1-2):
- Data collection for 7 listed banks
- Database schema with versioning
- Admin data entry tool
- Design system and brand

Phase 1 MVP (Months 3-5):
- Bank profile pages
- Full CAMEL ratios (CFA L1/L2)
- DDM and RI valuation (CFA L2)
- 5Cs credit assessment (CFA L2)
- Sector dashboard
- Public launch (free tier)

Phase 2 (Months 6-9):
- Bank comparison tool
- RI-implied P/B signal
- Stress testing tool (CFA L3)
- Sharpe/Treynor/Jensen metrics (CFA L3)
- Premium tier launch
- Fixed income module (CFA L1/L2)
- Macro dashboard (CFA L1/L2)

Phase 3 (Months 10-15):
- Semi-automated PDF extraction
- VaR and CVaR tools (CFA L3)
- Performance attribution (CFA L3)
- Portfolio correlation matrix (CFA L3)
- API access
- Mobile app

Phase 4 (Months 16-24):
- Expand to non-bank GSE companies
- Private wealth tools including after-tax returns and asset allocation (CFA L3)
- Distance-to-default for bond-issuing banks (CFA L2)
- Potential GSE/SEC partnership

---

## 7. Monetisation

Free (GHS 0):
- Basic bank profiles, 3-year data, limited CAMEL ratios, ads supported

Investor (GHS 49/month):
- Full 5-year history, all CAMEL ratios, DDM and RI valuation, screener, comparison tool, no ads

Professional (GHS 199/month):
- Everything in Investor plus stress testing, Sharpe/Treynor, fixed income, data export, email alerts, limited API

Institutional (Custom pricing):
- Full API, VaR/CVaR, portfolio attribution, private wealth tools, data licensing, white-label reports

Additional revenue:
- Sponsored research reports
- Data licensing to BoG/SEC
- CFA exam-prep partnerships
- Paystack mobile money billing for retail investors

---

## 8. Recommended Technology Stack

### 8.1 Frontend
- Next.js v15 App Router: SSR/SSG/ISR flexibility, built-in image optimisation
- React v19 Server Components: Eliminates client bundle weight for all static content
- TypeScript v5 strict mode: Strict typing on financial models prevents silent calculation errors
- Tailwind CSS v4 CSS-native: No PostCSS build step, faster compilation, smaller output
- shadcn/ui: Copy-pasted source, zero runtime cost, full ownership, Radix accessibility primitives
- Zustand v5: 1.1kb, no provider boilerplate, no Context re-render cascades
- TanStack Table v8: Headless, row virtualisation at 60fps for screener with 36 banks x 50 columns
- TanStack Query v5: Server state with background refetch, stale-while-revalidate, optimistic updates
- Framer Motion: Apple-style page transitions, drawer animations, metric card count-up animations
- Lucide React: Clean, tree-shakeable SF Symbols-inspired icon set
- Geist / Inter: Primary typeface — mirrors SF Pro optical weight and spacing

### 8.2 Charting — Canvas-based only, never SVG
- TradingView Lightweight Charts v5: Price charts, yield curves, NIM trend lines
  Purpose-built for financial time-series, 60fps on years of daily data, MIT licensed, 40kb gzipped
- Apache ECharts v5: CAMEL radar charts, bar charts, scatter plots, stress test outputs, correlation heatmap
  Canvas renderer with hardware acceleration, smooth animations, significantly lighter than Highcharts
- D3.js v7 (selective only): Yield curve shape, efficient frontier, bespoke visualisations
  Used ONLY where ECharts or TradingView cannot achieve the required custom layout

Why NOT Recharts or Highcharts:
- Recharts renders to SVG — each data point becomes a DOM node, smooth animation impossible at scale
- Highcharts requires commercial licence and ships at ~300kb gzipped
- TradingView Lightweight Charts is purpose-built, MIT licensed, 40kb gzipped
- ECharts achieves equivalent output at MIT licence and half the bundle size

### 8.3 Backend
- Python FastAPI: Natural language for DDM, RI model, CAPM, VaR, CVaR, efficient frontier, attribution
- numpy, scipy, pandas: Server-side computation of all CFA financial models
- PostgreSQL 16: Relational with full row versioning — essential for data vintage tracking
- Redis via Upstash: Caches computed ratio sets, model outputs, sector aggregates — serverless
- AWS Textract + custom parser: AI-powered table extraction from bank annual report PDFs

### 8.4 Auth, Payments and Infrastructure
- Clerk: Tiered subscription auth — handles free/investor/professional/institutional access levels
- Paystack: Leading payment gateway in Ghana — MTN MoMo, AirtelTigo, Vodafone Cash, Visa, Mastercard
- Vercel: Native Next.js deployment with edge caching, automatic ISR for bank profile pages
- Railway or Render: Low DevOps overhead for FastAPI service and background workers

---

## 9. Risks and Mitigations

- Data availability (High): Build IR relationships, monitor GSE announcements, display data vintage
- Data accuracy (High): Dual-entry validation, cross-check computed ratios against published summaries
- Model risk (High): Prominently disclose model assumptions, label outputs as estimates not targets
- Low willingness-to-pay (Medium): Strong free tier, target institutional users first, B2B2C via brokers
- Regulatory sensitivity (Low): Publish only publicly available information, comply with CFA L1 Standard I

---

## 10. Success Metrics

Phase 1 (Months 1-6):
- 7 GSE-listed banks with complete 5-year CAMEL data, DDM, and RI valuation published
- 500+ registered users within 3 months of launch
- 20+ paying subscribers (Investor tier or above)
- Average session duration > 4 minutes
- Data accuracy >= 98% validated against source documents

Phase 2 (Months 6-12):
- 2,000+ registered users
- 150+ paying subscribers
- At least 1 institutional data licensing agreement
- Stress testing tool active and used by > 30 professional/institutional accounts
- GSE Insight cited in at least 3 published analyst reports or media articles
- Monthly Recurring Revenue (MRR) of GHS 25,000+

---

CFA Institute does not endorse, promote, or warrant the accuracy or quality of this product.
Confidential — For Internal Use Only
