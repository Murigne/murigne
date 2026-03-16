# Financial Data Skill — Murigne Platform

## Purpose
This skill guides all agents handling financial data entry, computation,
display, and validation for the Murigne platform.
It enforces CFA-standard analytical rigour and BoG regulatory alignment.

## Core Principle
Every number displayed on Murigne must be:
1. Traceable to a source document
2. Timestamped with reporting period
3. Flagged as audited or unaudited
4. Accompanied by its formula or definition
5. Compared against a benchmark where one exists

Never display a financial metric without its context.
A number without a source is not data — it is noise.

## Data Entry Standards

### Financial Statement Data
When entering or processing bank financial statements:
- Always record the reporting period (FY2023, H1 2024, Q3 2024)
- Always record the source (Annual Report 2023, Interim Report H1 2024)
- Always flag audited vs unaudited
- Always record the date the data was entered
- Never overwrite historical data — always add a new versioned record
- If a bank restates financials, keep the original and add the restated version
  with a restatement flag and explanation

### CAMEL Ratio Computation

Capital Adequacy:
- CAR = Total Regulatory Capital / Risk-Weighted Assets — BoG benchmark >= 13%
- Tier 1 Capital Ratio = Core Equity Tier 1 / Risk-Weighted Assets — BoG benchmark >= 6.5%
- Leverage Ratio = Equity / Total Assets
- DuPont ROE = Net Profit Margin x Asset Turnover x Equity Multiplier
- Retained Earnings Growth = (Current Retained Earnings - Prior Retained Earnings) / Prior Retained Earnings

Asset Quality:
- NPL Ratio = Non-Performing Loans / Gross Loans and Advances — benchmark < 5%
- Loan Loss Provision Ratio = Loan Loss Provisions / Gross Loans
- Provision Coverage Ratio = Loan Loss Provisions / NPLs — benchmark >= 70%
- Loan-to-Deposit Ratio = Net Loans / Total Deposits — 60% to 80%
- Net Charge-Off Rate = Net Loan Write-offs / Average Gross Loans
- Credit Concentration Risk = Top 10 Borrower Exposure / Total Loans — benchmark < 30%

Management Quality:
- Cost-to-Income Ratio = Operating Expenses / Operating Income — benchmark < 60%
- Staff Cost Ratio = Staff Expenses / Operating Expenses
- Asset Utilisation Ratio = Total Revenue / Average Total Assets
- Dividend Payout Ratio = Dividends Paid / Net Income After Tax

Earnings and Profitability:
- ROA = Net Income / Average Total Assets — benchmark > 1.5%
- ROE = Net Income / Average Shareholders Equity — benchmark > 15%
- NIM = Net Interest Income / Average Earning Assets — benchmark > 6% for Ghana
- Non-Interest Income Ratio = Non-Interest Income / Total Operating Income
- EPS Growth = (Current EPS - Prior EPS) / Prior EPS
- P/E = Market Price per Share / EPS
- P/B = Market Price per Share / Book Value per Share

Liquidity:
- LCR = HQLA / Net Cash Outflows over 30-day stress — BoG benchmark >= 100%
- Cash and Liquid Assets Ratio = (Cash + Due from Banks) / Total Assets — >= 10%
- Loans-to-Assets Ratio = Net Loans / Total Assets — benchmark < 65%
- Deposit-to-Funding Ratio = Total Deposits / Total Funding
- Interbank Borrowing Ratio = Interbank Borrowings / Total Liabilities

### CAMEL Composite Score Computation
- Score each component 1 to 5 (1 = strongest, 5 = weakest)
- Capital Adequacy weight: 25%
- Asset Quality weight: 25%
- Management Quality weight: 20%
- Earnings weight: 15%
- Liquidity weight: 15%
- Composite = weighted average of component scores
- Round to 2 decimal places
- Score bands:
  1.00 to 1.50 = Strong
  1.51 to 2.50 = Satisfactory
  2.51 to 3.50 = Fair
  3.51 to 4.50 = Marginal
  4.51 to 5.00 = Unsatisfactory

### Valuation Model Computation

Dividend Discount Model (DDM):
- Required return r = Rf + Beta x (Rm - Rf)
  where Rf = BoG 91-day T-bill rate (current)
  and Rm = GSE Composite Index average annual return (5-year)
- Sustainable growth rate g = ROE x (1 - Dividend Payout Ratio)
- Intrinsic Value = D1 / (r - g)
  where D1 = most recent annual dividend x (1 + g)
- If r <= g, DDM is not applicable — flag this explicitly, never divide by zero

Residual Income Model:
- Residual Income = EPS - (r x Book Value per Share prior year)
- Single-stage intrinsic value V = B0 + [(ROE - r) x B0] / (r - g)
- Justified P/B = 1 + (ROE - r) / (r - g)
- If ROE > r: bank is creating value, justified P/B > 1
- If ROE < r: bank is destroying value, justified P/B < 1
- Always display RI-implied P/B alongside actual market P/B

Risk Metrics:
- Sharpe Ratio = (Portfolio Return - Rf) / Portfolio Standard Deviation
- Treynor Ratio = (Portfolio Return - Rf) / Portfolio Beta
- Jensen Alpha = Actual Return - [Rf + Beta x (Rm - Rf)]
- VaR (1-day, 5%): compute from 252-day rolling price history
  Sort daily returns, take the 5th percentile
- CVaR = average of all returns below the VaR threshold

## Data Validation Rules
Before any computed ratio is saved or displayed:
- Check for division by zero — flag as N/A with explanation
- Check for negative denominators — flag and explain
- Cross-check computed ratios against published summaries where available
- Flag any ratio that deviates > 5% from published figures for manual review
- Never display a ratio with fewer than 2 years of history without a data warning

## Display Rules

### Numbers
- Percentages: always 2 decimal places (e.g. 14.73%)
- Ratios: always 2 decimal places (e.g. 1.23x)
- Currency (GHS): always 2 decimal places with thousands separator (e.g. GHS 1,234,567.89)
- Large numbers: use abbreviated format with full value in tooltip
  (e.g. GHS 12.4B — tooltip shows GHS 12,412,345,678)
- Never display NaN, undefined, or null — always show N/A with explanation

### Color Coding
- Values above BoG benchmark: --color-positive (green)
- Values below BoG benchmark: --color-negative (red)
- Values within 10% of benchmark: --color-warning (amber)
- No applicable benchmark: default text color
- Never use color as the only signal — always pair with icon or text

### Benchmark Comparisons
Every ratio display must show:
1. The computed value
2. The BoG benchmark or peer median (where applicable)
3. A visual indicator (above/below/at benchmark)
4. The trend vs prior period (up/down/flat arrow)

## Ghana-Specific Context

Currency: All monetary values in Ghana Cedis (GHS) unless otherwise stated.
Always show GHS/USD rate context when displaying absolute values.

Regulatory benchmarks are set by the Bank of Ghana.
Always reference the specific BoG circular or directive when displaying a benchmark.
Benchmarks may change — always timestamp the benchmark source.

Listed banks as of Phase 1 data collection:
1. GCB Bank Limited
2. Ecobank Ghana Limited
3. Standard Chartered Bank Ghana
4. Absa Bank Ghana Limited
5. Stanbic Bank Ghana Limited
6. CalBank PLC
7. Access Bank Ghana Limited

Reporting calendar:
- Full year results: typically published March to April
- Half year results: typically published August to September
- Always note if a bank has not yet published results for the current period
