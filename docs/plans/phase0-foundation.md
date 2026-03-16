# Phase 0 Foundation Plan

## Scope

Start Murigne Phase 0 with the project scaffold only. This slice establishes the mandated Next.js 15 frontend foundation and documents the downstream boundaries for the design system, bank analysis schema, and admin data entry tool.

## Files To Create Or Modify

- `package.json`
- `tsconfig.json`
- `next.config.ts`
- `postcss.config.mjs`
- `vitest.config.ts`
- `playwright.config.ts`
- `components.json`
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `components/providers/providers.tsx`
- `components/dashboard/dashboard-scaffold.tsx`
- `components/dashboard/stat-card.tsx`
- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `lib/utils.ts`
- `lib/mock-data.ts`
- `stores/ui-store.ts`
- `tests/smoke.test.ts`
- `docs/api-contracts/admin-data-entry.md`

## Frontend Boundaries

- Use Next.js 15 App Router and React 19 Server Components by default.
- Keep client-only boundaries narrow: Query provider and Zustand-backed interactive controls only.
- Use mock data for the dashboard shell until the schema and admin APIs exist.

## Backend Dependencies

- The scaffold assumes future FastAPI endpoints for bank financial statements, CAMEL ratios, and admin ingestion.
- Database work comes after the frontend contract is defined and documented.

## Security Concerns

- Clerk-authenticated admin entry will be required before any real financial data write path exists.
- Financial statement and ratio values must be validated server-side before persistence.
- Audited vs unaudited state and data source metadata must be immutable audit fields at the persistence layer.

## Task Breakdown

- Frontend now: app scaffold, provider wiring, initial design token foundation, dashboard shell, mock cards, test/build configuration.
- Backend later: schema for banks, statements, ratios, vintages, ingestion sessions, and admin endpoints.
- QA later: unit and E2E coverage once the design system and admin tool are implemented.
