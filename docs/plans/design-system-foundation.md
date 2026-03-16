# Design System Foundation

## Goal

Build the first full Murigne design-system slice on top of the Phase 0 scaffold. The outcome is a reusable dashboard language for bank analysis, provenance-heavy data displays, and future admin workflows.

## Scope

- Tailwind v4 token foundation for Murigne colors, typography, spacing, and surface styles
- Reusable base components: badges, cards, buttons, stat displays, ratio displays, provenance labels, and data table
- A navigation shell that can host bank pages, admin tooling, and future screener views
- Mock data that demonstrates audited/unaudited vintage states and ratio-definition UX

## Constraints

- Keep Server Components as the default; only the navigation shell and TanStack Table implementation are client
- Do not introduce third-party component packages for shadcn-style pieces
- Preserve the roadmap requirement that ratios disclose formulas, definitions, and sources

## Follow-On Work Enabled

- Bank profile pages can reuse the shell, cards, ratio displays, and provenance labels
- The admin data-entry tool can share table, badge, and surface primitives
- Backend schema work can now target an explicit frontend vocabulary for vintage and formula metadata
