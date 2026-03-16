# Product Manager Spec Skill — Murigne Platform

## Purpose
This skill guides the Mayor and any PM-role agent on how to:
1. Break down features into well-defined user stories
2. Write acceptance criteria that engineering agents can execute against
3. Define UI specifications that frontend agents can implement without ambiguity
4. Prioritise features against the Murigne roadmap phases
5. Ensure every feature serves a specific user segment

## Core PM Principle
Never hand a vague requirement to an engineering agent.
Every feature handed to an agent must have:
- A clear user story (who, what, why)
- Explicit acceptance criteria (done means done)
- A UI specification (what the user sees)
- An API contract (what data is needed)
- A test specification (how to verify it works)

Ambiguity is the enemy of good software.
If a requirement is unclear, resolve it before creating the bead.

## User Story Format
Every feature must be written as:

As a [user segment],
I want to [action],
So that [outcome/value].

User segments for Murigne:
- Retail Investor: individual GSE investor, limited financial knowledge
- Institutional Investor: fund manager, pension fund, insurance company
- Equity Analyst: research desk at brokerage or investment bank
- Private Wealth Manager: advisor serving HNW clients
- Platform Admin: internal team managing data entry and quality

## Acceptance Criteria Format
Each user story must have 3 to 8 acceptance criteria.
Format: Given [context], When [action], Then [outcome].

Example:
Given I am on the bank profile page for GCB Bank,
When I view the CAMEL section,
Then I see the Capital Adequacy Ratio displayed as a percentage
  with the BoG benchmark of 13%, a green/red indicator showing
  whether GCB is above or below benchmark, and a vintage label
  showing the source and reporting period.

## UI Specification Format
Every frontend feature must include a UI spec with:

Page/Component: [name]
Location: [where it lives in the navigation]
Layout: [describe the grid, card arrangement, component hierarchy]
Data displayed: [list every piece of data shown]
Interactive elements: [list every button, filter, slider, toggle]
Loading state: [describe the skeleton]
Error state: [describe the error display]
Empty state: [describe what shows when no data exists]
Mobile behaviour: [describe how it adapts at 375px]

## API Contract Format
Every frontend feature must document the API it needs before backend work begins.

Format:
Endpoint: GET /api/v1/[path]
Purpose: [what this endpoint does]
Request parameters: [list query params, path params]
Response shape: [TypeScript interface]
Error cases: [list possible errors and HTTP codes]
Caching: [how long this response can be cached]

## Feature Prioritisation Framework
Use the Murigne roadmap phases as the primary prioritisation guide.

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
- VaR/CVaR tools
- Mobile app
- Non-bank companies
- Private wealth tools

When a new feature request comes in, always assign it to a phase before creating beads.
Never build Phase 2 features before Phase 1 is complete.

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
- Row 1: 4 stat cards — ROA, ROE, NIM, CAR (each with benchmark and YoY change)
- Row 2 left (60%): CAMEL radar chart with composite score and score band label
- Row 2 right (40%): 5Cs qualitative credit summary (Character, Capacity,
  Capital, Collateral, Conditions — each with a short qualitative assessment)
- Row 3 left (50%): DDM intrinsic value vs current market price
  (show discount/premium percentage)
- Row 3 right (50%): RI-implied P/B vs actual P/B
  (show overvalued/undervalued signal)
- Footer: data vintage summary — most recent data period, source, audited flag

CAMEL tab layout:
- 5 expandable sections (C, A, M, E, L)
- Each section: ratio table with columns:
  Ratio | Value | BoG Benchmark | vs Benchmark | Prior Year | YoY Change | Source | Period
- Trend sparkline for each ratio showing 5-year history
- Section composite score displayed at top of each section

Valuation tab layout:
- DDM section:
  - Input assumptions panel: Rf (auto-populated from BoG T-bill), Beta,
    Rm (auto-populated from GSE index), Dividend Payout Ratio, ROE
  - Computed outputs: r (required return), g (sustainable growth), intrinsic value
  - Sensitivity table: intrinsic value at different g and r combinations
- RI Model section:
  - Input assumptions panel: current BV per share, ROE, r, g
  - Computed outputs: residual income, intrinsic value, justified P/B
  - RI-implied P/B vs actual P/B chart (bar chart, ECharts)
- Disclaimer: clearly labelled as estimates, not targets or investment advice

Financials tab layout:
- Toggle: Income Statement | Balance Sheet | Cash Flow
- Common-size toggle: show as absolute values or % of total
- Year selector: show 1, 3, or 5 years
- TanStack Table with year columns and ratio rows
- Vintage labels on each year column header

Fixed Income tab layout:
- Only shown if bank has listed bonds
- Bond table: bond name, ISIN, maturity, coupon, YTM, duration,
  credit spread vs 91-day T-bill
- If no bonds listed: empty state explaining the bank has no listed bonds

### Screener Page — Full Spec

User story:
As an Institutional Investor,
I want to filter all GSE-listed banks by specific financial metrics,
So that I can identify investment candidates that meet my criteria
without manually reviewing each bank's annual report.

Layout:
- Left panel (280px, collapsible): filter controls
  - CAMEL composite score range slider
  - Individual ratio filters (min/max inputs for each ratio)
  - Pre-built screens dropdown: High CAMEL Score, Low NPL, ROE above Cost of Equity,
    Trading below RI-implied book value
  - Clear filters button
  - Save screen button (registered users only)
- Right panel: TanStack Table
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
  With vintage labels in a separate column.

### Sector Dashboard — Full Spec

User story:
As a Retail Investor,
I want to see an overview of the entire Ghanaian banking sector,
So that I can understand the overall health of the sector before
deciding which banks to research further.

Layout:
- Market summary strip (full width): GSE Composite Index, MPR, GHS/USD, GHS/GBP
  (updated daily)
- Row 1: 4 sector aggregate stat cards
  Total sector assets | Sector average CAR | Sector average NPL | Sector average NIM
- Row 2 left (60%): Sector NIM trend chart (TradingView, 5-year)
  with MPR overlay as a step line
- Row 2 right (40%): Sector NPL trend chart (TradingView, 5-year)
  with GDP growth overlay
- Row 3: Bank ranking table — all banks ranked by CAMEL composite score
  with color-coded score bands
- Row 4: Credit cycle chart — Ghana GDP growth vs sector credit growth (ECharts bar)

## How to Write a Bead for an Engineering Agent
When the Mayor creates a bead for a frontend or backend agent,
the bead description must include all of the following:

1. User story (who, what, why)
2. Acceptance criteria (Given/When/Then format, 3 to 8 criteria)
3. UI specification (layout, components, states)
4. API contract (endpoint, request, response, errors)
5. Test specification (what Vitest unit tests and Playwright E2E tests are needed)
6. Reference to relevant section in docs/ROADMAP.md
7. Reference to relevant section in AGENTS.md for stack and standards

A bead without all 7 elements is incomplete.
Do not sling an incomplete bead to an agent.

## Launch Readiness Checklist
Before any feature is considered ready for users:
- All acceptance criteria verified by QA agent
- All Playwright E2E tests passing
- All Vitest unit tests passing
- TypeScript strict mode passing
- Data vintage labels present on all financial data
- Formula tooltips present on all ratio displays
- Mobile responsive at 375px
- Empty, loading, and error states implemented
- No console errors or warnings
- Committed to main via refinery
