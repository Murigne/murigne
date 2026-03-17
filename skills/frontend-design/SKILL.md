# Frontend Design Skill — Murigne Platform

## Purpose
This skill guides all frontend agents building UI for Murigne.
It defines the visual language, component patterns, layout conventions,
and interaction design standards for Ghana's premier financial data platform.

## Aesthetic Direction
Murigne is institutional, refined, and trustworthy — not flashy.
The visual language is clean, data-dense where needed, with generous
whitespace on landing and overview pages.

Primary references:
- Bloomberg Terminal: data density, information hierarchy
- Apple Finance app: clean typography, smooth transitions
- Linear.app: refined spacing, subtle surfaces

Design principles borrowed from the kms-web internal reference
(for human context only — agents cannot access kms-web directly):
- Dashboard cards use a flat surface with 1px --murigne-border border,
  no drop shadow, 12px border radius — never exceed 12px on any card surface
  The previous scaffold used ~28px (rounded-[1.75rem]) which is incorrect and must not be repeated
- Branded header: navy background, gold accent on active nav item,
  Geist Sans logo lockup at 18px / 500 weight
- Feature sections separated by 48px vertical spacing, not dividers
- Stat values use tabular numerals (font-variant-numeric: tabular-nums)
  so columns of numbers align without a monospace font

Never: garish colors, heavy drop shadows, gradient overload, decorative
elements that do not carry information.

## Dark Mode
Murigne is light mode only for Phase 1 and Phase 2.
Do not introduce dark mode CSS variables, dark: Tailwind variants,
or prefers-color-scheme media queries.
Dark mode will be evaluated for Phase 3.
Any agent that adds dark mode classes without explicit instruction
is introducing out-of-scope work.

## Color System
All colors are defined as CSS variables in app/globals.css.
Never hardcode hex values in components — always use CSS variables.

Primary palette:
- --murigne-navy: #0F1B2D — primary brand, headers, key CTAs
- --murigne-gold: #C9A84C — accent, highlights, premium tier signals
- --murigne-slate: #4A5568 — secondary text, muted labels
- --murigne-surface: #F7F9FC — page background
- --murigne-card: #FFFFFF — card surfaces
- --murigne-border: #E2E8F0 — borders, dividers

Semantic colors:
- --color-positive: #16A34A — positive returns, strong CAMEL scores
- --color-negative: #DC2626 — negative returns, weak CAMEL scores, breaches
- --color-warning: #D97706 — marginal scores, caution signals
- --color-neutral: #6B7280 — neutral data, N/A states

## ECharts Theme Configuration
The Murigne ECharts theme is defined in lib/echarts-theme.ts.
Always import and register this theme before initialising any ECharts instance.
Never pass inline color arrays to ECharts. Never use the default ECharts palette.

The theme maps the Murigne palette:
- color: [--murigne-navy, --murigne-gold, --color-positive,
          --color-warning, --color-negative, --murigne-slate]
- backgroundColor: 'transparent'
- textStyle: { fontFamily: 'Geist Sans, Inter, sans-serif', fontSize: 12 }
- axisLine and splitLine use --murigne-border

Import and register before use:
  import { murigne } from '@/lib/echarts-theme'
  echarts.registerTheme('murigne', murigne)
  const chart = echarts.init(el, 'murigne', { renderer: 'canvas' })

## Typography
- Primary font: Geist Sans — mirrors SF Pro optical weight and spacing
- Fallback: Inter
- Never use decorative or experimental fonts
- Always apply font-variant-numeric: tabular-nums on any element displaying
  numbers in columns or tables

Type scale:
- Display: 48px / 500 weight — hero headlines only
- H1: 32px / 500 weight — page titles
- H2: 24px / 500 weight — section headers
- H3: 18px / 500 weight — card headers, module titles
- Body: 16px / 400 weight — general content
- Small: 14px / 400 weight — labels, captions, table cells
- Micro: 12px / 400 weight — data vintage labels, footnotes, tooltips

## Layout System

### Page Shell
Every page uses:
  components/navigation/navigation-shell.tsx
Never create page-local navigation. Never nest navigation shells.

### Grid System
- Full page: 12-column grid, max-width 1440px, centered
- Dashboard pages: sidebar (240px fixed) + main content area
- Content pages (bank profiles): single column, max-width 960px
- Data tables: full width within content area

### Card Patterns
Four card types — use the correct one for each context:

1. Stat Card
   Component: components/ui/stat-display.tsx
   For: single KPI values (ROA, ROE, NIM, CAR)
   Contains: metric label, value, YoY change indicator, benchmark comparison
   Never put charts inside stat cards

2. Ratio Card
   Component: components/ui/ratio-display.tsx
   For: CAMEL ratios with formula context
   Contains: ratio name, value, formula tooltip, BoG benchmark, vintage label
   Always show formula on hover — never hide it

3. Chart Card
   Component: components/ui/chart-card.tsx
   For: time series, radar charts, scatter plots
   Contains: chart title, time range selector, data source label, chart canvas
   Always show data vintage in card footer

4. Table Card
   Component: components/ui/table-card.tsx
   For: comparison tables, screener results, bank universe
   Contains: title, filter controls, TanStack Table, export button
   Always use TanStack Table with row virtualisation — never plain HTML tables

## Component Conventions

### Market Summary Strip
Component: components/ui/market-strip.tsx
Displays: GSE Composite Index, BoG MPR, GHS/USD rate, GHS/GBP rate
Used on: Home / Dashboard page and Sector Dashboard page
Always import from this shared component — never build an inline market strip.
Always show the date of last update.

### Data Vintage Labels
Component: components/ui/vintage-label.tsx
Every piece of financial data must have a vintage label showing:
- Source (e.g. "Annual Report 2023")
- Period (e.g. "FY2023")
- Audited / Unaudited flag
Never build inline vintage displays — always use this component.

### Formula Tooltips
Component: components/ui/formula-tooltip.tsx
Every ratio display must show the formula on hover.
Format: "Net Income / Average Total Assets"
Never abbreviate formulas in tooltips.

### CAMEL Score Radar
The CAMEL composite score always displays as:
1. Radar chart (Apache ECharts, murigne theme) showing all 5 components
2. Numeric composite score below the chart
3. Score band label (Strong / Satisfactory / Fair / Marginal / Unsatisfactory)
4. Peer percentile rank
Never show CAMEL score as a bar chart or table only.
Never show fewer than all 5 CAMEL components on the radar.

### Loading States
Every data-fetching component must have three states:
1. Loading: skeleton placeholders matching the shape of the loaded content
2. Error: error message with retry button and data source reference
3. Empty: empty state with explanation of why no data exists
Never show a blank white area while data loads.

### Mobile Responsiveness
- All pages must work at 375px minimum width
- Dashboard sidebar collapses to bottom navigation on mobile
- Data tables scroll horizontally on mobile — never truncate columns
- Charts resize fluidly — never fixed pixel widths on chart containers

## Charting Rules

### TradingView Lightweight Charts
Use for: price charts, yield curves, NIM trend lines, any time series
- Always set autoSize: true
- Always show crosshair
- Always show data source and period in chart card footer
- Color scheme must use CSS variables — never hardcoded colors

### Apache ECharts
Use for: CAMEL radar, bar charts, scatter plots (P/B vs ROE),
         heatmaps, stress test outputs, correlation matrix
- Always use canvas renderer: { renderer: 'canvas' }
- Always handle resize with ResizeObserver
- Always initialise with the murigne theme (see ECharts Theme Configuration above)
- Radar charts: always show all 5 CAMEL components, never fewer

### D3.js
Use ONLY for: efficient frontier visualisation, custom bespoke layouts
that ECharts and TradingView cannot handle.
Never use D3 for bar charts, line charts, or radar charts.

## Page-by-Page Layout Guide

### Home / Dashboard
- Market summary strip (full width): components/ui/market-strip.tsx
- Row 1: 4 stat cards — total listed banks, sector average CAR,
  sector average NPL, sector average NIM
- Row 2: Bank universe table (TanStack Table) with CAMEL score column
- Row 3: Sector NIM trend chart (TradingView) + MPR overlay

### Bank Profile Page
- Header: bank name, logo, listing date, market cap, last price
- Tab navigation: Overview | CAMEL | Valuation | Financials | Fixed Income
- Overview tab:
  - Row 1: 4 stat cards (ROA, ROE, NIM, CAR)
  - Row 2: CAMEL radar chart + composite score + 5Cs qualitative summary
  - Row 3: DDM intrinsic value vs market price + RI-implied P/B signal
- CAMEL tab: full ratio table with YoY trends, BoG benchmarks, vintage labels
- Valuation tab: DDM inputs/outputs, RI model, justified P/B vs actual P/B
- Financials tab: common-size IS, BS, CF with 5-year history
- Fixed Income tab: bond listings, duration, credit spread vs sovereign

### Screener Page
- Filter panel (left, collapsible): ratio filters, CAMEL score filter, P/B filter
- Results table (right): TanStack Table, all CAMEL metrics, sortable columns
- Save screen button for registered users
- Export to CSV button

### Sector Dashboard
- Market summary strip (full width): components/ui/market-strip.tsx
- Row 1: 4 sector aggregate stat cards
- Row 2: Sector NIM trend + NPL trend (TradingView, side by side)
- Row 3: MPR overlay chart + GDP credit cycle chart
- Row 4: Bank ranking table by CAMEL composite score

### Stress Testing Page
- Scenario selector: pre-built scenarios dropdown + custom single-variable sliders
- Results: traffic-light grid — banks as rows, scenarios as columns,
  RAG status per cell (CAR breach = red, within 2pp = amber, clear = green)
- Detail panel: selected bank + selected scenario —
  CAR impact, ROE impact, net income impact
- Correlation matrix heatmap (ECharts, murigne theme) below the grid

## Accessibility
- All interactive elements must be keyboard navigable
- All charts must have accessible text alternatives
  (aria-label describing key data points — not just "chart")
- Color is never the only signal — always pair with icon or text label
- Minimum contrast ratio 4.5:1 for all text
- Focus indicators must be visible on all interactive elements
