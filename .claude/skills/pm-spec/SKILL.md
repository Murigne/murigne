# Product Manager Spec Skill — Murigne Platform

## Purpose
This skill guides the Mayor and any PM-role agent on how to:
1. Break down features into well-defined beads
2. Write acceptance criteria that engineering polecats can execute against
3. Define UI specifications that frontend polecats can implement without ambiguity
4. Prioritise features against the Murigne roadmap phases
5. Ensure every feature serves a specific user segment

## Gastown Context
In the Murigne workspace, the Mayor is the AI coordinator for the murigne rig.
The Mayor does not write code. The Mayor creates beads, assembles convoys,
and slings work to polecats. Polecats are the worker agents that execute beads.
The Refinery manages the merge queue — it processes polecat branches into main,
handling conflicts and ensuring code quality before changes land.

When a feature is complete and all acceptance criteria are verified:
- The polecat marks its bead done
- The Refinery merges the branch into main
- The Mayor is notified via the convoy

"Committed to main via refinery" means the Refinery has merged the work.
This is the final step in the definition of done.

## Core PM Principle
Never sling a vague bead to a polecat.
Every bead must have:
- A clear user story (who, what, why)
- Explicit acceptance criteria (done means done)
- A UI specification (what the user sees)
- An API contract (what data the frontend needs)
- A test specification (how to verify it works)

Ambiguity is the enemy. If a requirement is unclear, resolve it before
creating the bead. Do not sling an incomplete bead.

## User Story Format
Every feature must be written as:

As a [user segment],
I want to [action],
So that [outcome / value].

User segments for Murigne:
- Retail Investor: individual GSE investor, limited financial knowledge
- Institutional Investor: fund manager, pension fund, insurance company
- Equity Analyst: research desk at brokerage or investment bank
- Private Wealth Manager: advisor serving HNW clients
- Platform Admin: internal team managing data entry and quality

## Acceptance Criteria Format
Each bead must have 3 to 8 acceptance criteria.
Format: Given [context], When [action], Then [outcome].

Example:
Given I am on the bank profile page for GCB Bank,
When I view the CAMEL section,
Then I see the Capital Adequacy Ratio displayed as a percentage
  with the BoG benchmark of 13%, a green/red/amber indicator showing
  whether GCB is above, near, or below benchmark, and a vintage label
  showing the source document, reporting period, and audited flag.

## Bead Template
Copy this template exactly when creating a bead for a polecat.
A bead without all 7 sections is incomplete — do not sling it.

---
### Bead: [short title]

**User Story**
As a [user segment],
I want to [action],
So that [outcome].

**Acceptance Criteria**
1. Given [context], When [action], Then [outcome].
2. Given [context], When [action], Then [outcome].
3. Given [context], When [action], Then [outcome].
(3 to 8 criteria)

**UI Specification**
Page/Component: [name]
Location: [where it lives in the navigation]
Layout: [grid, card arrangement, component hierarchy]
Components used: [list exact component paths from components/]
Data displayed: [every piece of data shown]
Interactive elements: [every button, filter, slider, toggle]
Loading state: [describe the skeleton]
Error state: [describe the error display and retry behaviour]
Empty state: [describe what shows when no data exists]
Mobile behaviour: [how it adapts at 375px]

**API Contract**
Endpoint: GET /api/v1/[path]
Purpose: [what this endpoint does]
Request parameters: [query params, path params]
Response shape:
  [TypeScript interface — frontend agent defines this first]
Error cases: [possible errors and HTTP codes]
Caching: [how long this response can be cached]

**Test Specification**
Vitest unit tests:
- [list each computation or logic that needs a unit test]
- Each financial model test must use known inputs with expected outputs
  verified against manual CFA-standard calculations

Playwright E2E tests:
- [list each user flow that needs an E2E test]
- Each acceptance criterion should map to at least one E2E test

**References**
- Roadmap: docs/ROADMAP.md § [relevant section]
- Engineering standards: AGENTS.md § [relevant section]
- Skills: skills/[relevant skill(s)]
---

## API Contract Ownership
The frontend agent defines the TypeScript response interface first,
as part of the bead. This is the contract.
The backend polecat implements the FastAPI endpoint to match that contract exactly.
The backend must not change the response shape without updating the bead
and notifying the Mayor.

Example response interface (frontend agent writes this):
  interface BankCamelRatios {
    bankId: string
    period: string
    source: string
    audited: boolean
    capital: {
      car: number | null
      tier1CapitalRatio: number | null
      leverageRatio: number | null
    }
    // ... etc
  }

The backend returns JSON that satisfies this interface.
TypeScript strict mode on the frontend will catch any mismatch at build time.

## Feature Prioritisation Framework

Phase 0 (foundation — build first):
- Project scaffold and design system
- Database schema and admin data entry tool
- Data collection for 7 listed banks

Phase 1 MVP (core product — build second):
- Bank profile pages with CAMEL ratios
- DDM and RI valuation models
- Sector dashboard
- Bank screener
- Public launch with free tier

Phase 2 (growth — build third):
- Bank comparison tool
- Stress testing tool
- Fixed income module
- Macro dashboard
- Premium tier and payments

Phase 3 and 4 (scale — build later):
- Automated PDF extraction
- VaR / CVaR tools
- Mobile app
- Non-bank companies
- Private wealth tools

When a new feature request comes in, always assign it to a phase before
creating a bead. Never sling a Phase 2 bead before Phase 1 is complete.

## Page Specifications

### Bank Profile Page — Full Spec

User story:
As an Equity Analyst,
I want to see a comprehensive profile of any GSE-listed bank,
So that I can assess its financial health, valuation, and credit quality
without manually computing ratios from annual reports.

Tabs: Overview | CAMEL | Valuation | Financials | Fixed Income

Overview tab layout:
- Header row: bank name, logo, listing date, market cap, last closing price,
  52-week high/low, shares outstanding
- Row 1: 4 stat cards — ROA, ROE, NIM, CAR
  (each with benchmark, YoY change, and vintage label)
- Row 2 left (60%): CAMEL radar chart with composite score and score band label
- Row 2 right (40%): 5Cs qualitative credit summary
  (Character, Capacity, Capital, Collateral, Conditions — short qualitative text each)
- Row 3 left (50%): DDM intrinsic value vs current market price
  (show discount / premium percentage)
- Row 3 right (50%): RI-implied P/B vs actual P/B
  (show overvalued / undervalued / fairly valued signal)
- Footer: data vintage summary — most recent data period, source, audited flag

CAMEL tab layout:
- 5 expandable sections (C, A, M, E, L)
- Each section: ratio table with columns:
  Ratio | Value | BoG Benchmark | vs Benchmark | Prior Year | YoY Change | Source | Period
- Trend sparkline for each ratio showing 5-year history
- Section composite score displayed at top of each section

Valuation tab layout:
- DDM section:
  - Input assumptions panel: Rf (auto-populated from BoG T-bill),
    Beta, Rm (auto-populated from GSE index), Dividend Payout Ratio, ROE
  - Computed outputs: r (required return), g (sustainable growth), intrinsic value
  - Sensitivity table: intrinsic value at different g and r combinations
- RI Model section:
  - Input assumptions panel: current BV per share, ROE, r, g
  - Computed outputs: residual income, intrinsic value, justified P/B
  - RI-implied P/B vs actual P/B (bar chart, ECharts, murigne theme)
- Disclaimer: "These are model estimates, not investment targets or advice."

Financials tab layout:
- Toggle: Income Statement | Balance Sheet | Cash Flow
- Common-size toggle: show as absolute values or % of total
- Year selector: show 1, 3, or 5 years
- TanStack Table with year columns and line-item rows
- Vintage labels on each year column header

Fixed Income tab layout:
- Only shown if bank has listed bonds
- Bond table: bond name, ISIN, maturity, coupon, YTM, duration,
  credit spread vs 91-day T-bill
- If no bonds listed: empty state — "This bank has no bonds listed
  on the Ghana Fixed Income Market."

### Screener Page — Full Spec

User story:
As an Institutional Investor,
I want to filter all GSE-listed banks by specific financial metrics,
So that I can identify investment candidates that meet my criteria
without manually reviewing each bank's annual report.

Layout:
- Left panel (280px, collapsible): filter controls
  - CAMEL composite score range slider
  - Individual ratio filters (min / max inputs for each ratio)
  - Pre-built screens dropdown: High CAMEL Score, Low NPL,
    ROE above Cost of Equity, Trading below RI-implied book value
  - Clear filters button
  - Save screen button (registered users only — Clerk auth gate)
- Right panel: TanStack Table with row virtualisation
  - Columns: Bank | CAMEL Score | CAR | NPL Ratio | ROE | ROA | NIM | P/B | P/E
  - All columns sortable
  - Column visibility toggle
  - Export to CSV button
  - Row count showing filtered results vs total

Acceptance criteria:
- Given I set NPL Ratio filter to less than 5%,
  When the table updates,
  Then only banks with NPL Ratio below 5% are shown,
  And the row count reflects the filtered number.
- Given I click Export to CSV,
  When the download completes,
  Then the CSV contains all visible columns for all filtered rows,
  With a vintage label column showing source and period for each bank.
- Given I am not logged in and click Save Screen,
  When the auth modal appears,
  Then I am prompted to register or log in via Clerk.

### Sector Dashboard — Full Spec

User story:
As a Retail Investor,
I want to see an overview of the entire Ghanaian banking sector,
So that I can understand the overall health of the sector before
deciding which banks to research further.

Layout:
- Market summary strip (full width): components/ui/market-strip.tsx
  GSE Composite Index | BoG MPR | GHS/USD | GHS/GBP — updated daily
- Row 1: 4 sector aggregate stat cards
  Total sector assets | Sector average CAR | Sector average NPL | Sector average NIM
- Row 2 left (60%): Sector NIM trend chart (TradingView, 5-year)
  with MPR overlay as a step line
- Row 2 right (40%): Sector NPL trend chart (TradingView, 5-year)
  with GDP growth overlay
- Row 3: Bank ranking table — all banks ranked by CAMEL composite score
  with color-coded score band labels
- Row 4: Credit cycle chart — Ghana GDP growth vs sector credit growth
  (ECharts bar, murigne theme)

### Stress Testing Page — Full Spec

User story:
As an Institutional Investor,
I want to apply macro stress scenarios to all GSE-listed banks,
So that I can identify which banks are most vulnerable to economic shocks
before making portfolio allocation decisions.

Layout:
- Scenario selector: pre-built scenarios dropdown
  (MPR +300bps | NPL +5pp | Cedi -30% | GDP contraction -3%)
  plus custom single-variable sliders for each input
- Results: traffic-light grid
  Rows: banks | Columns: scenarios
  Cell values: CAR under scenario — red if breach < 13%, amber if within 2pp,
  green if clear
- Detail panel: selected bank + selected scenario
  CAR impact (pp change) | ROE impact (pp change) | Net income impact (GHS)
- Correlation matrix heatmap (ECharts, murigne theme) below the grid
  showing pairwise return correlations across all 7 banks

## Definition of Done
A bead is ONLY complete when all of the following are true:
1. Feature works exactly as described in the bead
2. All Vitest unit tests pass
3. All Playwright E2E tests pass
4. TypeScript strict mode passes with zero errors
5. No console errors or warnings
6. React Server Component boundaries are correct
7. Financial data displays with source, formula, and vintage labels
8. Mobile responsive at 375px minimum
9. Loading, error, and empty states all implemented
10. Merged to main via the Refinery

## Launch Readiness Checklist
Before any feature is visible to users:
- All acceptance criteria verified
- All Playwright E2E tests passing
- All Vitest unit tests passing
- TypeScript strict mode passing with zero errors
- Data vintage labels present on all financial data
- Formula tooltips present on all ratio displays
- Mobile responsive at 375px
- Loading, error, and empty states implemented
- No console errors or warnings
- Merged to main via the Refinery
