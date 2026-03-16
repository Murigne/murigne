# Murigne UI Spec — Version B: Retail
# Clean, minimal, warm — retail investor friendly
# Version 1.0 | March 2026

---

## Design Philosophy
Murigne Retail makes institutional-grade financial data feel approachable.
It is clean, warm, and confidence-inspiring — the kind of platform a first-time
GSE investor opens and immediately understands, while still having the depth
a professional needs when they drill deeper.

Primary user: Retail Investor, Private Wealth Manager
Design references: Finexy, Fynix, CashFund, Linear.app

## Color System
Background: #F7F9FC (warm off-white — primary surface)
Sidebar: #FFFFFF (pure white)
Cards: #FFFFFF (white cards, subtle shadow)
Card shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)
Borders: #E8EDF5 (very light grey-blue)
Primary text: #0F1B2D (Murigne navy)
Secondary text: #6B7A99 (muted blue-grey)
Accent navy: #0F1B2D (primary CTAs, active states)
Accent gold: #C9A84C (highlights, premium signals, hover accents)
Positive: #16A34A (green — above benchmark)
Negative: #DC2626 (red — below benchmark)
Warning: #D97706 (amber — marginal)
Muted surface: #F0F4F8 (slightly darker off-white for alternating rows)
Tag background: #EEF2F8 (light blue-grey for neutral tags)

## Typography
Primary font: Inter throughout — no mono font for retail
Data values (CAR, ROE, NIM): Inter, 28px, weight 600, navy
Ratio labels: Inter, 12px, weight 500, secondary text
Body text: Inter, 15px, weight 400, primary text
Navigation labels: Inter, 14px, weight 400
Section headers: Inter, 18px, weight 600
Micro labels (vintage, source): Inter, 11px, secondary text

## Layout Shell

### Sidebar (260px, collapsible to 64px)
Background: #FFFFFF
Border right: 1px solid #E8EDF5
Top section:
  - Murigne wordmark in navy (#0F1B2D), 16px, weight 700
  - Gold dot accent next to wordmark
  - Collapse toggle (chevron)

Coverage pills (below wordmark, horizontally arranged):
  Banks | Fixed Income | Macro
  Active: navy background, white text, rounded pill
  Inactive: transparent, secondary text

Navigation sections:
MAIN (no section label — just items with icons):
  Dashboard icon + "Dashboard" + "Overview" subtitle
  Building icon + "Banks" + "CAMEL & valuation" subtitle
  Chart icon + "Sector" + "Market overview" subtitle
  Filter icon + "Screener" + "Find opportunities" subtitle

TOOLS:
  Stress icon + "Stress testing" + "Scenario analysis" subtitle
  Bond icon + "Fixed income" + "Bonds & yields" subtitle
  Macro icon + "Macro" + "Economy" subtitle

REFERENCE:
  File icon + "Filings" + "Source documents" subtitle
  Book icon + "Methodology" + "How we calculate" subtitle

Active nav item: navy background (rounded, 8px radius), white text and icon
Hover: #F0F4F8 background

Bottom of sidebar:
  Upgrade card (free/investor users):
    "Upgrade to Investor" headline
    "Unlock full CAMEL data and valuation models"
    Gold CTA button
  User avatar + name + tier pill

### Top Bar (full width, 60px height)
Background: #FFFFFF
Border bottom: 1px solid #E8EDF5
Left: Hamburger menu (mobile only)
Center-left: Search input (380px, rounded, #F0F4F8 background)
  Placeholder: "Search banks, ratios, or filings..."
  Search icon left, CMD+K shortcut hint right
Right: Notifications bell (with count badge)
       User avatar with dropdown

### Main Content Area
Background: #F7F9FC
Padding: 32px
Max width: 1280px, centered

---

## Page Specifications

### 1. Dashboard — Home

Greeting row (full width, 72px):
"Good morning, Herbert" — 24px, weight 600, navy
"Ghana capital markets at a glance — Monday 16 March 2026" — 14px, secondary

Market summary strip (full width, 56px):
Background: #FFFFFF
Border: 1px solid #E8EDF5
Border radius: 12px
Padding: 0 24px
Items (separated by dividers):
  GSE Composite | value | daily change pill (green/red)
  BoG MPR | value | last change date
  GHS/USD | value | change
  GHS/GBP | value | change
  T-Bill 91-day | value
Values: 14px weight 500 navy, change pills: 12px rounded

Row 1 — 4 stat cards (equal width, 140px height):
Card: white background, 12px radius, subtle shadow
Each card:
  Top: label (12px uppercase secondary) + icon (right aligned, light navy)
  Middle: large value (28px weight 600 navy)
  Bottom: change indicator (green/red arrow + % + "vs last year")
          benchmark comparison ("Above BoG 13% benchmark")
Cards: Total Listed Banks | Sector Avg CAR | Sector Avg NPL | Sector Avg NIM

Row 2 — Main chart (65%) + Quick rankings (35%):
Left: Sector NIM trend card
  Card header: "Sector NIM Trend" + "5 Year" + time selector (1Y 3Y 5Y)
  TradingView chart: white background, navy line, gold MPR overlay
  Footer: data source + period + audited flag
  Height: 320px

Right: Bank rankings card
  Card header: "Banks by CAMEL Score"
  List of 7 banks ranked by score:
    Bank name + ticker | score badge | score number
  Score badges: color coded by band
  "View all →" link at bottom in gold

Row 3 — 2 cards side by side:
Left (50%): Recent data updates card
  List of latest data entries:
    Bank logo + name | data type | period | AUDITED/UNAUDITED badge | date added
  Shows last 5 updates

Right (50%): Sector NPL trend card
  TradingView chart: navy line on white
  Height: 220px

### 2. Bank Profile Page

Bank header card (full width, 100px):
Background: #FFFFFF
Border radius: 12px
Shadow: standard card shadow
Left: Bank logo (40px) + Bank name (20px weight 600) + ticker pill
      "Listed since 2004 · Banking sector"
Right: Last price (GHS X.XX, 24px weight 600)
       Daily change pill (green/red)
       Market cap | 52-week range
       "Add to watchlist" button (ghost, gold border)

Tab navigation (below header card):
Tab pills: Overview | CAMEL | Valuation | Financials | Fixed Income
Active: navy background, white text
Inactive: transparent, secondary text, hover: #F0F4F8
Thin border below tabs

OVERVIEW tab:

Row 1 — 4 stat cards (same pattern as dashboard stat cards)
ROA | ROE | NIM | CAR

Row 2 — 2 columns:
Left (55%): CAMEL health card
  Card header: "CAMEL Health Score" + score badge (large, color by band)
  ECharts radar chart: white background, navy fill, gold axis
  5 component labels around the radar
  Composite score: large number below chart + band label
  "What is CAMEL?" info link

Right (45%): Valuation signals card
  Card header: "Valuation"
  DDM row: "DDM Intrinsic Value" | GHS X.XX | "X% below market" badge
  RI row: "RI-implied P/B" | X.Xx | "Undervalued" badge
  Current P/B row: "Market P/B" | X.Xx
  Divider
  "View full valuation model →" gold link
  Disclaimer: "Estimates only. Not investment advice." 11px secondary

Row 3 — NIM trend card (full width):
Card header: "Net Interest Margin" + time selector
TradingView chart: white background, navy line
MPR overlay: dashed gold line
Height: 280px
Footer: source + period

Row 4 — 2 cards side by side:
Left (50%): 5Cs Credit Summary card
  Card header: "Credit Assessment (5Cs)"
  5 rows: Character | Capacity | Capital | Collateral | Conditions
  Each row: label + traffic light dot + one-sentence assessment
  "Based on FY2023 Annual Report" vintage note at bottom

Right (50%): Peer comparison card
  Card header: "Peer Comparison"
  Mini table: this bank vs sector median vs best in class
  Rows: CAR | NPL | ROE | NIM
  Simple color indicators

CAMEL tab:
5 collapsible sections (C A M E L)
Each section header:
  Component name (16px weight 600) + component score badge
  Expand/collapse chevron

Expanded section:
  Ratio cards in 2-column grid (not a dense table)
  Each ratio card (white, rounded, shadow):
    Ratio name (14px weight 500)
    Large value (24px weight 600 navy)
    Formula on hover (info icon)
    BoG benchmark comparison
    Vintage label (source · period · audited flag)
    YoY sparkline (5 bars, 40px wide)

VALUATION tab:
Card header: "Valuation Models" + disclaimer badge

DDM Model card:
  Input row (editable fields with labels):
    Risk-free rate (Rf) | Beta | Market return (Rm) | Payout ratio
  Computed row (read-only):
    Required return (r) | Growth rate (g) | Intrinsic value
  Visual: simple horizontal bar showing intrinsic vs market price
  Sensitivity table: 3x3 grid, pastel color coding

RI Model card (below DDM):
  Same input/output pattern
  RI-implied P/B vs actual P/B: simple bar chart (ECharts)

Disclaimer card: amber left border, light amber background
"These models are estimates based on publicly available data.
They are not investment advice or a recommendation to buy or sell."

FINANCIALS tab:
Toggle pills: Income Statement | Balance Sheet | Cash Flow
Common-size toggle: Absolute | % of Total
Year pills: 2019 2020 2021 2022 2023
TanStack Table: clean white rows, alternating #F7F9FC
Column headers: uppercase 11px secondary
Values: 14px weight 500 navy (Inter, not mono)
Vintage pill on each year column header

### 3. Screener Page

Page header:
"Bank Screener" — 24px weight 600
"Filter all GSE-listed banks by financial health metrics" — 14px secondary

Layout: Filter panel (300px left, white card) + Results (remaining width)

Filter panel:
Card background: white, rounded, shadow
Header: "Filters" + "Clear all" text button (gold)

Pre-built screens section:
Label: "QUICK SCREENS" — uppercase 11px secondary
Pill buttons (selectable):
  High CAMEL Score | Low NPL | ROE > Cost of Equity | Undervalued P/B
Active pill: navy background, white text
Inactive: #EEF2F8 background, navy text

Custom filters section:
Label: "CUSTOM FILTERS" — uppercase 11px secondary
Each filter: label + range slider or min/max inputs
Filters: CAMEL Score | CAR | NPL Ratio | ROE | ROA | NIM | P/B
Apply button: full width, navy background, white text, rounded

Results area:
Row count: "Showing 5 of 7 banks" — 14px secondary
Export button: ghost, gold border, right aligned

TanStack Table:
Header: white background, uppercase 11px secondary, sort arrows
Rows: white, 56px height, hover: #F7F9FC
Columns: Bank | CAMEL Score | CAR | NPL | ROE | ROA | NIM | P/B | P/E
Bank column: logo + name + ticker
CAMEL Score column: score badge (color by band) + number
All values: 14px weight 500 navy
"View →" action column: gold link

### 4. Sector Dashboard

Page header:
"Banking Sector" — 24px weight 600
"Sector-wide health indicators for GSE-listed banks" — 14px secondary

Market summary strip (same as dashboard)

Row 1 — 4 sector stat cards (same pattern)

Row 2 — 2 charts:
Left (50%): Sector NIM & MPR card
  TradingView: navy NIM line, dashed gold MPR line
  Time selector
  Height: 300px

Right (50%): Sector NPL & GDP card
  TradingView: red NPL line, dashed teal GDP line
  Time selector
  Height: 300px

Row 3 — Bank rankings card (full width):
Card header: "Sector Rankings" + sort by dropdown
TanStack Table: all 7 banks ranked by CAMEL score
Score band color coding
Compact rows (48px height)

Row 4 — Credit cycle card (full width):
Card header: "Credit Cycle — GDP Growth vs Sector Credit Growth"
ECharts grouped bar chart: navy bars (GDP), gold bars (credit growth)
5-year history
Height: 240px

### 5. Stress Testing Page

Page header:
"Stress Testing" — 24px weight 600
"Simulate macro shocks and see impact on bank capital and profitability" — 14px secondary

Layout: 2 columns

Left column (380px): Scenario builder card
  Section: "PRE-BUILT SCENARIOS"
  Radio select list:
    MPR +300bps | NPL Ratio +5pp | Cedi -30% | GDP -3% | All shocks combined
  Section: "CUSTOM SCENARIO"
  Sliders with current value display:
    MPR change: -500bps to +500bps
    NPL change: -5pp to +15pp
    FX change: -50% to +50%
    GDP change: -10% to +5%
  Run Scenario button: full width, navy, rounded

Right column: Results
  Traffic light grid card:
    Header: "Scenario Impact — [Scenario Name]"
    TanStack Table:
      Rows: all 7 banks
      Columns: Bank | CAR (before) | CAR (after) | ROE impact | Status
      Status column: SAFE (green badge) | WATCH (amber) | BREACH (red)
    Row click: expands detail below table

  Detail card (below grid, appears on row click):
    Selected bank name + scenario name
    2 stat cards side by side: CAR impact | ROE impact
    Text summary: plain English explanation of the impact

  Correlation matrix card (below detail):
    Header: "Bank Return Correlations"
    ECharts heatmap: cream-to-navy color scale (not gold-to-red — warmer)
    Bank tickers on axes
    Height: 300px

---

## Component Micro-patterns

### Stat Card
White background, 12px radius
Shadow: 0 1px 3px rgba(0,0,0,0.06)
Padding: 20px
Label: 12px uppercase weight 500 secondary
Value: 28px weight 600 navy
Change indicator: 13px, green arrow up / red arrow down + value
Benchmark note: 12px secondary

### Status Badges (retail — softer than Analytics OS)
All badges: 12px font, 6px padding horizontal, 3px padding vertical, 6px radius
CORE HOLDING: #FEF3C7 background, #92400E text (warm amber)
MONITORING: #FEE2E2 background, #991B1B text (light red)
STABLE: #F0F4F8 background, #374151 text (grey)
WATCHLIST: #FEE2E2 background, #DC2626 text
AUDITED: #DCFCE7 background, #166534 text (green)
UNAUDITED: #FEF9C3 background, #854D0E text (yellow)
Strong: #DCFCE7 background, #166534 text
Satisfactory: #DBEAFE background, #1E40AF text
Fair: #FEF9C3 background, #854D0E text
Marginal: #FFEDD5 background, #C2410C text
Unsatisfactory: #FEE2E2 background, #991B1B text

### Vintage Label (retail)
Format: "Source: Annual Report 2023 · FY2023 · Audited"
Font: Inter, 11px, #6B7A99
Displayed below each ratio value, always visible (not hover-only)

### Formula Tooltip (retail)
Trigger: ⓘ icon click (not hover — more accessible on mobile)
White card, rounded, shadow
Content: Ratio name | Formula in plain English | BoG benchmark
"What does this mean?" plain English explanation paragraph
Max width: 320px

### Tier Gate (retail)
Locked content: blurred behind frosted glass effect (#F7F9FC at 80% opacity)
Center card: white, rounded, shadow
Lock icon (gold)
"[Feature name] is available on the Investor plan"
"From GHS 49/month"
Gold CTA: "Upgrade to Investor"
Ghost button: "Learn more"

### Upgrade Card (sidebar bottom, free users only)
Background: linear gradient — very subtle navy to slightly lighter navy
Border: 1px solid #C9A84C (gold border)
Border radius: 12px
Padding: 16px
Star icon (gold)
"Upgrade to Investor" — 14px weight 600 white
"Full CAMEL data + valuation models" — 12px secondary
Gold button: "Upgrade — GHS 49/mo"

---

## Mobile Adaptation (375px)
Bottom navigation: 5 tabs (Dashboard, Banks, Sector, Screener, More)
Active tab: navy icon + gold dot indicator
Stat cards: 2 per row (2-column grid)
Charts: full width, 220px height
CAMEL tab: single column ratio cards (not 2-column grid)
Valuation inputs: stacked vertically with large touch targets
Filter panel: full screen bottom sheet (slides up)
Tables: horizontal scroll with sticky bank name column
Sidebar upgrade card: replaced by upgrade banner at top of screen
