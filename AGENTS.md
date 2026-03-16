# Murigne — Project Engineering Standards
# Extends the global standards in ~/gt/AGENTS.md

## Project Purpose
Murigne is Ghana's premier financial data and analytics platform.
It is the Bloomberg of West Africa — covering GSE, GFIM, BoG, CSD,
Ministry of Finance, SEC Ghana, and individual bank data in one place.

Always read docs/ROADMAP.md before starting any task.
It is the single source of truth for what to build and why.

## Development Philosophy: Frontend First
- Build the UI against mock data first
- Document the exact API contract the UI needs
- Backend then fulfils that contract precisely
- Never start backend work until frontend step is complete

## Tech Stack — Frontend (strictly follow this, no deviations)
- Framework: Next.js v15, App Router
- Language: TypeScript v5, strict mode — zero use of any
- Styling: Tailwind CSS v4
- Components: shadcn/ui — copy-paste source, never npm install shadcn components
- State: Zustand v5 — no React Context for global state
- Data fetching: TanStack Query v5
- Tables: TanStack Table v8 with row virtualisation
- Animations: Framer Motion — client-side only
- Icons: Lucide React — tree-shakeable imports only
- Font: Geist Sans (primary), Inter (fallback)

## Charting — Canvas only, never SVG-based charting libraries
- Time series (price charts, yield curves, NIM trends): TradingView Lightweight Charts v5
- Radar, bar, scatter, heatmap (CAMEL, stress tests, correlation): Apache ECharts v5
- Bespoke only (efficient frontier, custom layouts): D3.js v7
- NEVER use Recharts or Highcharts — SVG rendering causes DOM pressure at financial data scale

## Tech Stack — Backend (strictly follow this, no deviations)
- Language: Python with FastAPI
- Financial models: numpy, scipy, pandas — all CFA model computation server-side
- Database: PostgreSQL 16 with full row versioning
- Cache: Redis via Upstash — cache all computed ratio sets and model outputs
- PDF extraction: AWS Textract + custom parser

## Auth and Payments
- Auth: Clerk — tiered access (free/investor/professional/institutional)
- Payments: Paystack — MTN MoMo, AirtelTigo, Vodafone Cash, Visa, Mastercard

## Infrastructure
- Frontend hosting: Vercel with edge caching and ISR
- Backend hosting: Railway or Render

## React Server Components Rule
- All bank profile pages, financial tables, CAMEL ratio displays: Server Components by default
- Only screener filters, stress-test sliders, chart tooltips, interactive controls: use client
- The use client boundary must be kept narrow and explicit — never mark a whole page as client

## Financial Data Rules
- Every ratio must display its formula, definition, and data source
- Every data point must be timestamped with source and reporting period
- Audited vs unaudited flag on all financial statement data
- Model outputs (DDM, RI valuation) must be clearly labelled as estimates, not targets
- Never display a computed value without showing the inputs that produced it

## Testing
- Unit tests: Vitest
- E2E tests: Playwright
- All financial model computations must have unit tests with known inputs and expected outputs
- E2E tests must cover all user flows before any feature is marked done

## Definition of Done
A task is ONLY complete when:
1. Feature works exactly as described in the bead
2. All Vitest unit tests pass
3. All Playwright E2E tests pass
4. TypeScript strict mode passes with zero errors
5. No console errors or warnings
6. React Server Component boundaries are correct
7. Financial data displays with source, formula, and vintage labels
8. Mobile responsive
