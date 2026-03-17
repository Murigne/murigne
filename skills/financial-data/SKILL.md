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

## Accounting Standard
All Ghanaian listed banks report under IFRS as adopted in Ghana.
Key standards that affect ratio computation:

- IFRS 9 (Financial Instruments): governs loan loss provisioning.
  Expected Credit Loss (ECL) model — Stage 1, 2, 3 classification.
  NPL ratio uses Stage 3 (credit-impaired) loans as the numerator.
  Loan Loss Provisions = total ECL allowance per the IFRS 9 note.

- IFRS 16 (Leases): operating leases now on balance sheet as right-of-use assets.
  Lease liabilities are included in total liabilities — note the impact on
  leverage ratio and debt-based metrics.

- IAS 7 (Cash Flow Statements): interest paid may be classified as operating
  or financing; interest received as operating or investing.
  Always note the classification each bank uses when displaying cash flow ratios.
  Never compare cash flow ratios across banks without verifying classification
  alignment first.

- IFRS 7 (Financial Instruments Disclosures): primary source for off-balance-sheet
  exposures, collateral disclosures, and credit concentration data.

When a ratio is affected by an IFRS accounting policy choice, flag it in the
vintage label: "Note: [bank] classifies [item] as [classification] per IFRS [X]."

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
- CAR = Total Regulatory Capital / Risk-Weighted Assets
  BoG benchmark: >= 13%
  Source: BoG Capital Requirements Directive, December 2018
- Tier 1 Capital Ratio = Core Equity Tier 1 / Risk-Weighted Assets
  BoG benchmark: >= 6.5%
  Source: BoG Capital Requirements Directive, December 2018
- Leverage Ratio = Equity / Total Assets
  Benchmark: peer-compared — display peer median, no absolute BoG floor
- DuPont ROE = Net Profit Margin x Asset Turnover x Equity Multiplier
- Retained Earnings Growth = (Current Retained Earnings - Prior Retained Earnings)
  / Prior Retained Earnings

Asset Quality:
- NPL Ratio = Non-Performing Loans / Gross Loans and Advances
  NPL = Stage 3 loans per IFRS 9 classification
  Benchmark: < 5%
  Source: BoG Banking Sector Report (most recent edition)
- Loan Loss Provision Ratio = Loan Loss Provisions / Gross Loans
  Benchmark: peer-compared
- Provision Coverage Ratio = Loan Loss Provisions / NPLs
  Benchmark: >= 70%
  Source: BoG Prudential Guidelines on Loan Classification and Provisioning
- Loan-to-Deposit Ratio = Net Loans / Total Deposits
  Benchmark: 60% to 80%
  Source: BoG Liquidity Guidelines
- Net Charge-Off Rate = Net Loan Write-offs / Average Gross Loans
  Benchmark: low and declining — display 3-year trend, no absolute floor
- Credit Concentration Risk = Top 10 Borrower Exposure / Total Loans
  Benchmark: < 30%
  Source: BoG Single Obligor Limit guidelines

Management Quality:
- Cost-to-Income Ratio = Operating Expenses / Operating Income
  Benchmark: < 60%
  Source: BoG sector efficiency guidance
- Staff Cost Ratio = Staff Expenses / Operating Expenses
  Benchmark: peer-compared
- Asset Utilisation Ratio = Total Revenue / Average Total Assets
  Benchmark: upward trend — display 3-year trend
- Dividend Payout Ratio = Dividends Paid / Net Income After Tax
  Benchmark: sustainable level — display alongside g (growth rate) computation

Earnings and Profitability:
- ROA = Net Income / Average Total Assets
  Benchmark: > 1.5%
  Source: BoG Banking Sector Report
- ROE = Net Income / Average Shareholders Equity
  Benchmark: > 15%
  Source: BoG Banking Sector Report
- NIM = Net Interest Income / Average Earning Assets
  Benchmark: > 6% for Ghana
  Source: BoG Banking Sector Report (most recent edition)
- Non-Interest Income Ratio = Non-Interest Income / Total Operating Income
  Benchmark: revenue diversification signal — trend only, no absolute benchmark
- EPS Growth = (Current EPS - Prior EPS) / Prior EPS
  Benchmark: positive and accelerating — display 3-year trend
- P/E = Market Price per Share / EPS
  Benchmark: peer-compared — display peer median
- P/B = Market Price per Share / Book Value per Share
  Benchmark: display alongside justified P/B from RI model

Liquidity:
- LCR = HQLA / Net Cash Outflows over 30-day stress
  BoG benchmark: >= 100%
  Source: BoG Liquidity Coverage Ratio Directive, 2019
- Cash and Liquid Assets Ratio = (Cash + Due from Banks) / Total Assets
  BoG benchmark: >= 10%
  Source: BoG Primary Reserve Requirement
- Loans-to-Assets Ratio = Net Loans / Total Assets
  Benchmark: < 65%
  Source: BoG asset quality guidance
- Deposit-to-Funding Ratio = Total Deposits / Total Funding
  Benchmark: high = stable funding — display trend
- Interbank Borrowing Ratio = Interbank Borrowings / Total Liabilities
  Benchmark: low preferred — display peer median

### Benchmark Source Maintenance
Benchmarks reference specific BoG directives or reports and change over time.
When entering or updating ratio data:
- Verify the benchmark is still current against the most recent BoG publication
- If a benchmark has changed: update the value, add a note with the effective
  date of the new benchmark, and flag affected historical comparisons
- Timestamp every benchmark with its source document and effective date
- Never display a benchmark without its source reference

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
  Rf = BoG 91-day T-bill rate from most recent weekly auction
       Source: BoG weekly T-bill auction results
  Rm = GSE Composite Index average annual total return, 5-year trailing
       Source: GSE monthly market statistics report
       If fewer than 5 years of GSE Composite data are available, display a
       data warning and use available history — state the period used
       If fewer than 3 years are available, DDM is not applicable — flag explicitly
  Beta = computed from 252-day rolling regression of bank daily return vs
         GSE Composite daily return
         Minimum 126 trading days required
         If insufficient price history, display N/A with explanation
- Sustainable growth rate g = ROE x (1 - Dividend Payout Ratio)
- D1 = most recent annual dividend per share x (1 + g)
- Intrinsic Value = D1 / (r - g)
- If r <= g: display "DDM N/A: growth rate equals or exceeds required return.
  This may indicate unsustainable growth assumptions."
  Never divide by zero. Never display a result without flagging this condition.
- If bank has not paid a dividend in the most recent 2 fiscal years:
  display "DDM N/A: insufficient dividend history"

Residual Income Model:
- Residual Income = EPS - (r x Book Value per Share prior year end)
- Single-stage intrinsic value V = B0 + [(ROE - r) x B0] / (r - g)
- Justified P/B = 1 + (ROE - r) / (r - g)
- If ROE > r: bank is creating value — justified P/B > 1
- If ROE < r: bank is destroying value — justified P/B < 1
- If r = g: RI model not applicable — flag explicitly, never divide by zero
- Always display RI-implied P/B alongside actual market P/B
- Always show value creation / destruction signal with plain-language explanation

Risk Metrics:
- Sharpe Ratio = (Portfolio Return - Rf) / Portfolio Standard Deviation
- Treynor Ratio = (Portfolio Return - Rf) / Portfolio Beta
- Jensen Alpha = Actual Return - [Rf + Beta x (Rm - Rf)]
- VaR (1-day, 5%): computed from 252-day rolling daily log return history
  Sort returns ascending, take the 5th percentile value
  Minimum 126 trading days required — display N/A with explanation if insufficient
- CVaR = arithmetic mean of all daily returns at or below the VaR threshold
- All risk metrics require a minimum of 126 trading days of price history
  Display a data warning if using fewer than 252 days

## Data Validation Rules
Before any computed ratio is saved or displayed:
- Check for division by zero — flag as N/A with explanation
- Check for negative denominators — flag and explain
- Cross-check computed ratios against published summaries where available
- Flag any ratio that deviates > 5% from published figures for manual review
- Never display a ratio with fewer than 2 years of history without a data warning
- All financial model computations must have Vitest unit tests with known inputs
  and expected outputs verified against manual CFA-standard calculations

## Display Rules

### Numbers
- Percentages: always 2 decimal places (e.g. 14.73%)
- Ratios: always 2 decimal places (e.g. 1.23x)
- Currency (GHS): always 2 decimal places with thousands separator
  (e.g. GHS 1,234,567.89)
- Large numbers: abbreviated with full value in tooltip
  (e.g. GHS 12.4B — tooltip shows GHS 12,412,345,678)
- Always show GHS/USD rate context when displaying absolute monetary values
- Never display NaN, undefined, or null — always show N/A with explanation

### Color Coding
- Values meeting or exceeding BoG benchmark: --color-positive (green)
- Values below BoG benchmark: --color-negative (red)
- Values within 10% of benchmark (below): --color-warning (amber)
- No applicable benchmark: default text color
- Never use color as the only signal — always pair with icon or text label

### Benchmark Comparisons
Every ratio display must show:
1. The computed value
2. The BoG benchmark or peer median with source reference
3. A visual indicator (above / below / at benchmark) — icon plus color
4. The trend vs prior period (up / down / flat arrow)

## Ghana-Specific Context

Currency: All monetary values in Ghana Cedis (GHS) unless otherwise stated.
Always show GHS/USD rate context when displaying absolute values.

Regulatory authority: Bank of Ghana (BoG).
All benchmarks reference BoG directives or sector reports and must be
timestamped with their source and effective date.

Listed banks covered in Phase 1 data collection:
1. GCB Bank Limited
2. Ecobank Ghana Limited
3. Standard Chartered Bank Ghana
4. Absa Bank Ghana Limited
5. Stanbic Bank Ghana Limited
6. CalBank PLC
7. Access Bank Ghana Limited

Reporting calendar:
- Full year audited results: typically published March to April following year end
- Half year unaudited results: typically published August to September
- Always flag if a bank has not yet published results for the current period
- Always flag interim results as unaudited
