# Accessibility Skill — Murigne Platform

## Purpose
This skill guides all agents on accessibility requirements for Murigne.
Institutional users include people who use assistive technologies.
Accessibility is a legal requirement in many markets and a quality signal
that builds trust with professional users.

Target standard: WCAG 2.1 Level AA compliance across all pages.

## Core Principles
1. Every user can access every feature regardless of how they interact with it
2. Color is never the only signal — always pair with text or icon
3. Every interactive element is keyboard navigable
4. Every chart has a text alternative
5. Every form field has a visible label

## Radix UI and shadcn/ui
Murigne uses shadcn/ui built on Radix UI primitives.
Radix handles the following automatically — do not reimplement manually:
- Focus trapping in dialogs, sheets, and popovers
- Keyboard navigation in dropdowns, select menus, and tabs
- ARIA roles and attributes for all Radix-based components
- Focus return to trigger element when a dialog closes

Always use the shadcn/ui component for dialogs, dropdowns, tooltips,
tabs, and selects before reaching for a custom implementation.
Only build custom accessible components when shadcn/ui has no equivalent.
When building custom components, follow the patterns in this skill exactly.

## Skip Navigation
Every page must have a skip to main content link as the first focusable element.
This satisfies WCAG 2.4.1 (Bypass Blocks).

// In components/navigation/navigation-shell.tsx
// Must be the first element in the rendered output

    href="#main-content"
    className="sr-only focus-visible:not-sr-only focus-visible:absolute
               focus-visible:top-4 focus-visible:left-4 focus-visible:z-50
               focus-visible:px-4 focus-visible:py-2 focus-visible:bg-white
               focus-visible:text-murigne-navy focus-visible:rounded
               focus-visible:outline focus-visible:outline-2"
>
    Skip to main content
</a>

// The main content area must have id="main-content" and tabIndex={-1}
<main id="main-content" tabIndex={-1}>
    {children}
</main>

## Semantic HTML

Always use the correct HTML element for its semantic meaning.
Never use a div or span when a semantic element exists.

Correct usage:
- Page structure: header, main, nav, footer, aside, section, article
- Headings: h1 through h6 in logical order — never skip levels
- Tables: table, thead, tbody, tr, th (with scope), td
- Forms: form, label, input, select, textarea, button, fieldset, legend
- Navigation: nav with aria-label to distinguish multiple nav elements
- Lists: ul, ol, li for any list of items
- Buttons: button for actions, a for navigation
- Never use div with onClick — always use button or a

## ARIA Usage

Use ARIA only when native HTML semantics are insufficient.
ARIA supplements HTML — it never replaces it.

### Required ARIA on Murigne Components

Charts:
Every chart must have role="img" and aria-label describing the key insight.
Example:
  aria-label="Line chart showing GCB Bank NIM trend from 2019 to 2023.
  NIM peaked at 8.2% in 2021 and declined to 7.1% in 2023."

Data tables:
Every th must have scope="col" or scope="row".
Complex tables with multi-level headers need aria-describedby.

Loading states:
Skeleton loaders need aria-busy="true" on the container.
aria-live="polite" on regions that update with new data.

Tier gating:
Locked premium features need aria-disabled="true" and
aria-describedby pointing to the upgrade prompt.

Navigation:
Main navigation: aria-label="Main navigation"
Breadcrumbs: nav aria-label="Breadcrumb" with aria-current="page" on current
Tab panels: role="tablist", role="tab", role="tabpanel" with aria-controls
(If using shadcn/ui Tabs, Radix handles this automatically.)

Modal dialogs:
Use shadcn/ui Dialog — Radix handles role="dialog", aria-modal="true",
focus trapping, and focus return automatically.
Never build a custom modal without these properties.

### Live Regions
Use aria-live for content that updates without page reload.
- aria-live="polite" for screener result count updates
- aria-live="polite" for filter applied confirmations
- aria-live="assertive" only for critical errors
- aria-live="off" for content that updates too frequently (real-time prices)

## Keyboard Navigation

Every interactive element must be reachable and operable by keyboard.

### Required Keyboard Support
Tab / Shift+Tab: navigate between interactive elements
Enter / Space: activate buttons and links
Arrow keys: navigate within components (tabs, dropdowns, sliders)
Escape: close modals, dropdowns, and tooltips
Home / End: jump to first / last item in lists and tables

### Focus Management Rules
Focus indicator must always be visible — never remove outline without replacement.
When a modal opens, focus moves to the first focusable element inside it.
When a modal closes, focus returns to the element that opened it.
(shadcn/ui Dialog handles both automatically.)
When a filter is applied and results update, announce the result count
via aria-live="polite".

### Focus Indicator — Tailwind v4 Pattern
Never use outline: none without providing an alternative.
Minimum: 2px solid with 3:1 contrast ratio against adjacent colors.
Use Tailwind v4 focus-visible variants — never a custom CSS class named
"focus-visible" as that conflicts with the browser pseudo-class.

// In app/globals.css — global focus indicator
*:focus-visible {
    outline: 2px solid var(--murigne-navy);
    outline-offset: 2px;
    border-radius: 2px;
}

*:focus:not(:focus-visible) {
    outline: none;
}

// In Tailwind components, use focus-visible: variants:
// focus-visible:outline-2 focus-visible:outline-murigne-navy

## Reduced Motion

Always respect the user's prefers-reduced-motion setting.
Financial charts use ECharts animations and Framer Motion transitions.
Both must be disabled when the user has requested reduced motion.

### Framer Motion
import { useReducedMotion } from 'framer-motion'

const shouldReduceMotion = useReducedMotion()

<motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
/>

### ECharts
Disable animation when reduced motion is preferred:

const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

const chartOptions = {
    animation: !prefersReducedMotion,
    // ... rest of options
}

### CSS
// In app/globals.css
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

## Color and Contrast

### Contrast Requirements (WCAG 2.1 AA)
Normal text (below 18px regular or 14px bold): minimum 4.5:1
Large text (18px+ regular or 14px+ bold): minimum 3:1
UI components and focus indicators: minimum 3:1
Decorative elements: no requirement

### Murigne Color Pairs — Verified Contrast Ratios
Always use these verified pairs. Never invent new color combinations
without verifying contrast first at webaim.org/resources/contrastchecker.

- Navy (#0F1B2D) on white (#FFFFFF): 16.8:1 — passes all levels
- Navy (#0F1B2D) on surface (#F7F9FC): 15.9:1 — passes all levels
- Slate (#4A5568) on white (#FFFFFF): 7.4:1 — passes AA
- Positive green (#16A34A) on white: 4.6:1 — passes AA normal text
- Negative red (#DC2626) on white: 4.5:1 — passes AA normal text
- Warning amber (#D97706) on white: 3.1:1 — large text only (18px+)
- Gold (#C9A84C) on navy (#0F1B2D): 6.2:1 — passes AA

### Warning Amber on Small Text
Amber (#D97706) at 3.1:1 on white does NOT pass AA for normal text.
For small warning labels (below 18px), use navy text with an amber
background or border instead of amber text on white:

// Wrong — amber text on white at small size fails AA
<span className="text-amber-600 text-sm">Marginal</span>

// Correct — navy text with amber background passes AA
<span className="bg-amber-100 text-murigne-navy text-sm px-2 py-0.5 rounded">
    Marginal
</span>

### Never Use Color Alone
Every status signal must pair color with another indicator.

// Wrong — color only
<span className="text-green-600">{value}</span>

// Correct — color plus icon plus screen reader text
<span className="text-green-600 flex items-center gap-1">
    <ArrowUpIcon aria-hidden="true" className="w-4 h-4" />
    <span>{value}</span>
    <span className="sr-only">above BoG benchmark</span>
</span>

CAMEL score bands must use color plus text label plus icon.
Never display only a colored dot for a score — always include the band name.

## Forms and Data Entry

### Label Requirements
Every input must have a visible label — never use placeholder as a substitute.
Labels must be associated using htmlFor / id pairing.
Required fields: asterisk plus aria-required="true".
Error messages: associated with field using aria-describedby.

// Correct form field pattern
<div>
    <label htmlFor="npl-filter" className="block text-sm font-medium">
        Maximum NPL Ratio (%)
        <span aria-hidden="true"> *</span>
    </label>
    <input
        id="npl-filter"
        type="number"
        aria-required="true"
        aria-describedby={hasError ? "npl-filter-error" : undefined}
        aria-invalid={hasError}
        min={0}
        max={100}
        step={0.1}
    />
    {hasError && (
        <p id="npl-filter-error" role="alert" className="text-red-600 text-sm mt-1">
            Please enter a value between 0 and 100
        </p>
    )}
</div>

## Charts and Data Visualisation

Charts are the most complex accessibility challenge on Murigne.
Every chart must have three layers of accessibility.

Layer 1 — ARIA label (always required)
Describe the chart type and key insight in 1-2 sentences.
aria-label="Radar chart showing GCB Bank CAMEL composite score of 2.1
(Satisfactory). Strongest: Capital Adequacy 1.8. Weakest: Asset Quality 2.6."

Layer 2 — Data table alternative (required for all ratio charts)
Provide an accessible data table containing the chart data.
Use a button toggle rather than details/summary — the details element
has inconsistent screen reader support across browsers and NVDA versions.

// Preferred toggle button pattern (better screen reader support than details)
const [showTable, setShowTable] = useState(false)

<figure>
    <div
        ref={chartRef}
        role="img"
        aria-label={chartAriaLabel}
        aria-describedby="chart-summary"
    />
    <figcaption id="chart-summary" className="text-sm text-murigne-slate mt-2">
        {chartSummary}
    </figcaption>
    <button
        onClick={() => setShowTable(v => !v)}
        className="text-sm text-murigne-navy underline mt-2
                   focus-visible:outline-2 focus-visible:outline-murigne-navy"
        aria-expanded={showTable}
        aria-controls="chart-data-table"
    >
        {showTable ? 'Hide data table' : 'View chart data as table'}
    </button>
    {showTable && (
        <table id="chart-data-table" className="mt-2 text-sm w-full">
            <thead>
                <tr>
                    {headers.map(h => (
                        <th key={h} scope="col">{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, i) => (
                    <tr key={i}>
                        {row.map((cell, j) => (
                            <td key={j}>{cell}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )}
</figure>

Layer 3 — Text summary (required for CAMEL radar and valuation charts)
Provide a plain text summary below the chart describing key findings.
This summary is visible to all users, not just screen reader users.

## Responsive and Mobile Accessibility

Touch targets must be minimum 44x44 pixels on mobile.
Never place interactive elements too close together on mobile.
Minimum 8px spacing between adjacent touch targets.
Never use user-scalable=no in the viewport meta tag — zoom must not be disabled.

## Cross-Reference with Definition of Done
The pm-spec skill definition of done requires all features to pass
the accessibility checklist below before a bead is marked complete.
The Refinery must not merge a branch that fails this checklist.

## Accessibility Checklist (required before every bead is marked done)
- [ ] Skip to main content link present and functional
- [ ] All interactive elements keyboard navigable
- [ ] All charts have role="img" and descriptive aria-label
- [ ] All charts have "view as table" toggle button alternative
- [ ] All charts have visible text summary (Layer 3)
- [ ] Color never used as sole signal — always paired with icon or text
- [ ] Warning amber only used on large text or with navy text on amber background
- [ ] All form fields have visible labels with htmlFor association
- [ ] Error messages use role="alert" and aria-describedby
- [ ] Focus indicators visible on all interactive elements
- [ ] prefers-reduced-motion respected in all animations
- [ ] Touch targets minimum 44x44px on mobile
- [ ] Heading structure logical with no skipped levels
- [ ] Contrast ratios verified against approved color pairs
- [ ] shadcn/ui components used for all dialogs, dropdowns, and tooltips
- [ ] Screen reader tested on at least one key user flow per page

## Screen Reader Testing

Before marking any page complete, verify with a screen reader.
On macOS: VoiceOver — cmd+F5 to activate
On Windows: NVDA (free, recommended) — nvaccess.org

Verification checklist:
- [ ] Page title is descriptive and unique
- [ ] Heading structure is logical
- [ ] All images and charts have meaningful labels
- [ ] All interactive elements are reachable and announced correctly
- [ ] All form fields have associated labels
- [ ] All error messages are announced
- [ ] Modal focus trap works correctly
- [ ] Live regions announce updates appropriately
