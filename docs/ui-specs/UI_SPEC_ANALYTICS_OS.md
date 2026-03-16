# Murigne UI Spec — Version A: Analytics OS
# Bloomberg-themed, institutional, analyst-first
# Version 1.0 | March 2026

---

## Design Philosophy
Analytics OS is the Bloomberg Terminal reimagined for West African capital markets.
It is data-dense, information-rich, and built for analysts who want everything
visible at once without clicking through layers of menus.

Primary user: Equity Analyst, Institutional Investor
Design references: Bloomberg Terminal, Refinitiv Eikon, current scaffold

## Color System
Background: #0A1628 (deep navy — primary surface)
Sidebar: #0F1B2D (slightly lighter navy)
Cards: #142033 (card surface)
Card hover: #1A2840
Borders: #1E3050 (subtle navy border)
Primary text: #E8EDF5 (near white)
Secondary text: #8A9BB5 (muted blue-grey)
Accent gold: #C9A84C (Murigne gold — CTAs, highlights, active states)
Accent orange: #E07B3A (warnings, watchlist badges)
Positive: #2ECC71 (green — above benchmark)
Negative: #E74C3C (red — below benchmark)
Warning: #F39C12 (amber — marginal)
Surface light: #1A2840 (slightly elevated surfaces)

## Typography
Primary font: Inter for data values, Inter for labels
Data values (CAR, ROE, NIM): Inter, 24px, weight 500
Ratio labels: Inter, 11px, weight 500, letter-spacing 0.08em, uppercase
Body text: Inter, 14px, weight 400
Navigation labels: Inter, 13px, weight 400
Section headers: Inter, 16px, weight 600
Micro labels (vintage, source): Inter, 10px, weight 400

## Layout Shell

### Sidebar (240px, collapsible to 56px)
Background: #0F1B2D
Top section:
  - Murigne wordmark in gold (#C9A84C), 14px, weight 700
  - "Analytics OS" subtitle in secondary text, 11px
  - Collapse toggle button (chevron icon)

Coverage tabs (pill toggles, below wordmark):
  - Banks (active by default)
  - Fixed Income
  - Macro
  Active tab: gold background (#C9A84C), navy text
  Inactive: transparent, secondary text

PRIMARY section header: uppercase, 10px, letter-spacing 0.12em, #8A9BB5
Navigation items:
  - Dashboard — Platform overview
  - Bank analysis — CAMEL and valuation
  - Sector — Cross-bank rankings
  - Screener — Filter and compare
  - Data vintages — Audited timelines

SUPPORT section header: same style as PRIMARY
Navigation items:
  - Filings — Source library
  - Methodology — Definitions and models
  - Governance — Trust controls

Active nav item: left gold border (3px), gold text, #142033 background
Hover: #1A2840 background

Bottom of sidebar:
  - User avatar + name + tier badge
  - Settings icon

### Top Bar (full width, 52px height)
Background: #0A1628
Border bottom: 1px solid #1E3050
Left: Search input (300px) — "Search banks, ratios, or filings"
      Phase badge (PHASE 0 / PHASE 1 etc) — pill, gold border
Center: empty
Right: MOCK DATA MODE toggle (text button, gold)
       Notifications bell icon
       User avatar

### Main Content Area
Background: #0A1628
Padding: 24px
Max width: none — full width minus sidebar

---

## Page Specifications

### 1. Dashboard — Platform Overview

Layout: 3-column grid at 1440px

Row 1 — Market summary strip (full width, 40px height):
Background: #142033
Border: 1px solid #1E3050
Items (separated by 1px vertical dividers):
  GSE Composite Index | value | daily change %
  BoG MPR | value | last change date
  GHS/USD | value | daily change %
  GHS/GBP | value | daily change %
  T-Bill 91-day | value
All values in Inter, 13px

Row 2 — 4 stat cards (equal width, 160px height):
Card 1: Total Listed Banks — 7 — "+2 sources mapped" badge
Card 2: Sector Avg CAR — 18.4% — vs BoG benchmark 13%
Card 3: Sector Avg NPL — 8.2% — "Elevated" warning badge
Card 4: Sector Avg NIM — 7.8% — "+0.3pp YoY" indicator
Each card: dark navy surface, gold accent on label, mono font for value

Row 3 — Main content (60%) + Right panel (40%):
Left (60%): Bank universe table
  Columns: BANK | CAPITAL | ASSET QUALITY | ROE | LIQUIDITY | CAMEL SCORE | VIEW
  Each row: bank name + ticker, ratio values in mono font, CAMEL score badge
  Badge colors: CORE HOLDING (gold), MONITORING (orange), STABLE (grey), WATCHLIST (red)
  Row hover: #1A2840 background
  Click row: navigates to bank profile

Right (40%): Data vintages panel
  Header: "DATA PROVENANCE" in uppercase gold label
  List of banks with latest data status:
    Bank name | AUDITED/UNAUDITED badge | period | source document
  AUDITED badge: green pill
  UNAUDITED badge: amber pill
  Pending badge: grey pill

Row 4 — CAMEL ratio preview (full width):
2x2 grid of ratio cards (Capital, Asset Quality, Earnings, Liquidity)
Each card: component label in gold uppercase, ratio name, large mono value,
benchmark comparison text, status badge (HEALTHY BUFFER, OUTPERFORMING, etc)
Info icon: opens formula tooltip on hover

### 2. Bank Profile Page

Tab navigation (below bank header):
OVERVIEW | CAMEL | VALUATION | FINANCIALS | FIXED INCOME
Active tab: gold underline, gold text
Inactive: secondary text

Bank header (full width, 80px):
Background: #142033
Left: Bank name (20px, weight 600) + ticker (14px, secondary)
      Listing date | Market cap | Shares outstanding
Right: Last price (large mono) | 52-week range | Daily change badge

OVERVIEW tab layout:

Row 1 — 4 stat cards:
ROA | ROE | NIM | CAR
Same card pattern as dashboard stat cards
Each shows: value, benchmark, YoY change arrow, vintage label

Row 2 — 3 columns:
Left (40%): CAMEL radar chart (ECharts, canvas)
  Dark background, gold axis lines, teal fill
  Composite score displayed below chart as large mono number
  Score band badge below score

Center (35%): 5Cs qualitative summary
  5 rows: Character, Capacity, Capital, Collateral, Conditions
  Each row: label + one-sentence qualitative assessment
  Traffic light indicator per row

Right (25%): DDM and RI signals
  DDM intrinsic value vs market price
  RI-implied P/B vs actual P/B
  Overvalued/Undervalued/Fairly Valued badge
  All values in mono font

Row 3 — Full width: NIM trend chart (TradingView)
  5-year history, MPR overlay as step line
  Dark background, teal line, gold MPR step line
  Crosshair, time range selector (1Y 3Y 5Y)

CAMEL tab layout:
5 expandable accordion sections
Each section header: component name + component score badge
Expanded: full ratio table
Columns: RATIO | VALUE | BOG BENCHMARK | vs BENCHMARK | PRIOR YEAR | YoY | SOURCE | PERIOD
Sparkline column: 5-bar mini trend for each ratio
All values in Inter

VALUATION tab layout:
Left (50%): DDM section
  Input panel: Rf, Beta, Rm, g, Payout ratio — all editable
  Computed: r, intrinsic value, premium/discount to market
  Sensitivity table: 3x3 grid of intrinsic values at different r and g combinations

Right (50%): RI Model section
  Input panel: BV per share, ROE, r, g
  Computed: residual income, intrinsic value, justified P/B
  Chart: RI-implied P/B vs actual P/B bar chart (ECharts)

Disclaimer banner: "Model outputs are estimates only. Not investment advice."
Gold border, secondary text

FINANCIALS tab layout:
Toggle: Income Statement | Balance Sheet | Cash Flow
Common-size toggle: Absolute | % of Total
Year selector pills: 2019 2020 2021 2022 2023
TanStack Table with year columns and line item rows
Vintage label on each year column header
Restated figures shown with asterisk and tooltip

### 3. Screener Page

Layout: Filter panel (280px left) + Results (remaining width)

Filter panel background: #0F1B2D
Border right: 1px solid #1E3050
Header: "SCREEN" in gold uppercase
Pre-built screens dropdown:
  High CAMEL Score | Low NPL Banks | ROE Above Cost of Equity | Undervalued P/B

Filter groups (collapsible):
  CAMEL Score: range slider (1.0 to 5.0)
  Capital: CAR min input
  Asset Quality: NPL max input
  Earnings: ROE min, ROA min inputs
  Liquidity: LDR range inputs

Apply button: gold background, navy text
Clear filters: text button, secondary color

Results table:
Header row: dark navy, gold text, uppercase 11px
Data rows: alternating #0A1628 and #142033
Columns: BANK | CAMEL | CAR | NPL | ROE | ROA | NIM | P/B | P/E | ACTION
All values: Inter
ACTION column: "View →" link in gold
Sort indicators: gold chevron on sorted column
Row count: "Showing 5 of 7 banks" in secondary text
Export button: top right, ghost button with download icon

### 4. Sector Dashboard

Market summary strip (same as dashboard)

Row 1 — 4 sector aggregate stat cards (same pattern as dashboard)

Row 2 — 2 charts side by side:
Left (50%): Sector NIM trend (TradingView)
  5-year NIM with MPR overlay
Right (50%): Sector NPL trend (TradingView)
  5-year NPL with GDP growth overlay

Row 3 — Bank ranking table (full width):
Ranked by CAMEL composite score ascending
Score band color coding on the score column
Same column pattern as screener

Row 4 — Credit cycle chart (full width, ECharts):
Grouped bar: Ghana GDP growth vs Sector credit growth
5-year history
Gold bars for GDP, teal bars for credit growth

### 5. Stress Testing Page

Layout: Scenario panel (320px left) + Results (remaining width)

Scenario panel:
Pre-built scenarios (radio select):
  MPR +300bps | NPL +5pp | Cedi -30% | GDP -3% | All combined
Custom scenario (expandable):
  Individual sliders for MPR, NPL, FX, GDP
Run scenario button: gold background

Results — traffic light grid:
Rows: banks
Columns: CAR impact | ROE impact | Net income impact | BREACH status
Cell colors: green (no breach) | amber (approaching) | red (breach)
BREACH badge: red pill with "BREACH" text

Detail panel (below grid):
Selected bank + selected scenario
Bar chart showing before/after CAR and ROE
Text summary of impact

Correlation matrix (ECharts heatmap):
Full width below traffic light grid
Gold-to-red color scale
Bank tickers on both axes

---

## Component Micro-patterns

### Status Badges
All badges: 10px font, uppercase, 4px padding horizontal, 2px padding vertical, 4px border radius
CORE HOLDING: gold background (#C9A84C), navy text
MONITORING: orange background (#E07B3A), white text
STABLE: #1E3050 background, #8A9BB5 text
WATCHLIST: red background (#E74C3C), white text
AUDITED: #1B4332 background, #2ECC71 text
UNAUDITED: #3D2B0A background, #F39C12 text
HEALTHY BUFFER: #1B4332 background, #2ECC71 text
OUTPERFORMING: #1B4332 background, #2ECC71 text
CONSERVATIVE: #1E3050 background, #8A9BB5 text

### Vintage Label (compact)
Format: SOURCE · PERIOD · AUDITED/UNAUDITED
Font: Inter, 10px, #8A9BB5
Example: Annual Report 2023 · FY2023 · AUDITED

### Formula Tooltip
Trigger: info icon (ⓘ) hover
Background: #1A2840
Border: 1px solid #1E3050
Content: Ratio name | Formula | BoG benchmark | Definition
Font: Inter 12px

### Tier Gate
Locked content overlay: #0A1628 at 90% opacity
Center: lock icon + tier name required + Upgrade button (gold)

---

## Mobile Adaptation (375px)
Sidebar collapses to bottom navigation bar (5 icons)
Stat cards stack vertically (1 column)
Charts remain full width, height reduced to 200px
Tables scroll horizontally — no column truncation
CAMEL radar chart: 280px diameter minimum
