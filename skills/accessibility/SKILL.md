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
- Never use div with onclick — always use button or a

## ARIA Usage

Use ARIA only when native HTML semantics are insufficient.
ARIA supplements HTML — it never replaces it.

### Required ARIA on Murigne components

Charts:
Every chart must have role="img" and aria-label describing the key insight.
Example: aria-label="Line chart showing GCB Bank NIM trend from 2019 to 2023.
NIM peaked at 8.2% in 2021 and declined to 7.1% in 2023."

Data tables:
Every th must have scope="col" or scope="row"
Complex tables with multi-level headers need aria-describedby

Loading states:
Skeleton loaders need aria-busy="true" on the container
aria-live="polite" on regions that update with new data

Tier gating:
Locked premium features need aria-disabled="true" and
aria-describedby pointing to the upgrade prompt

Navigation:
Main navigation: aria-label="Main navigation"
Breadcrumbs: nav aria-label="Breadcrumb" with aria-current="page" on current item
Tab panels: role="tablist", role="tab", role="tabpanel" with correct aria-controls

Modal dialogs:
role="dialog", aria-modal="true", aria-labelledby pointing to dialog title
Focus must be trapped inside the dialog while it is open
Focus must return to the trigger element when dialog closes

### Live Regions
Use aria-live for content that updates without page reload.
- aria-live="polite" for screener result count updates
- aria-live="polite" for filter applied confirmations
- aria-live="assertive" only for critical errors
- aria-live="off" for content that updates too frequently (real-time prices)

## Keyboard Navigation

Every interactive element must be reachable and operable by keyboard.

### Required keyboard support
Tab / Shift+Tab: navigate between interactive elements
Enter / Space: activate buttons and links
Arrow keys: navigate within components (tabs, dropdowns, sliders)
Escape: close modals, dropdowns, and tooltips
Home / End: jump to first / last item in lists and tables

### Focus Management Rules
Focus indicator must always be visible — never remove outline without replacement.
Use focus-visible CSS class to show focus only for keyboard users.
When a modal opens, focus moves to the first focusable element inside it.
When a modal closes, focus returns to the element that opened it.
When a filter is applied and results update, announce the result count via aria-live.

### Focus Indicator Styling
Never use outline: none without providing an alternative.
Minimum focus indicator: 2px solid with 3:1 contrast ratio against adjacent colors.

// In app/globals.css
:focus-visible {
    outline: 2px solid var(--murigne-navy);
    outline-offset: 2px;
    border-radius: 2px;
}

*:focus:not(:focus-visible) {
    outline: none;
}

## Color and Contrast

### Contrast Requirements (WCAG 2.1 AA)
Normal text (below 18px): minimum 4.5:1 contrast ratio
Large text (18px+ or 14px+ bold): minimum 3:1 contrast ratio
UI components and focus indicators: minimum 3:1 contrast ratio
Decorative elements: no requirement

### Murigne Color Pairs — Verified Contrast Ratios
Always use these verified pairs. Never invent new color combinations.
- Navy (#0F1B2D) on white (#FFFFFF): 16.8:1 — passes all levels
- Navy (#0F1B2D) on surface (#F7F9FC): 15.9:1 — passes all levels
- Slate (#4A5568) on white (#FFFFFF): 7.4:1 — passes AA
- Positive green (#16A34A) on white: 4.6:1 — passes AA (use for large text only)
- Negative red (#DC2626) on white: 4.5:1 — passes AA (use for large text only)
- Warning amber (#D97706) on white: 3.1:1 — passes AA large text only
- Gold (#C9A84C) on navy (#0F1B2D): 6.2:1 — passes AA

### Never Use Color Alone
Every status signal must pair color with another indicator.

// Wrong — color only
<span className="text-green-600">{value}</span>

// Correct — color plus icon plus text
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
Labels must be programmatically associated using htmlFor / id pairing.
Required fields must be indicated with both an asterisk and aria-required="true".
Error messages must be associated with their field using aria-describedby.

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
        aria-describedby="npl-filter-error"
        aria-invalid={hasError}
        min={0}
        max={100}
        step={0.1}
    />
    {hasError && (
        <p id="npl-filter-error" role="alert" className="text-red-600 text-sm">
            Please enter a value between 0 and 100
        </p>
    )}
</div>

## Charts and Data Visualisation

Charts are the most complex accessibility challenge on Murigne.
Every chart must have three layers of accessibility:

Layer 1 — ARIA label (always required)
Describe the chart type and key insight in 1-2 sentences.
aria-label="Radar chart showing GCB Bank CAMEL composite score of 2.1 (Satisfactory).
Strongest component: Capital Adequacy (1.8). Weakest: Asset Quality (2.6)."

Layer 2 — Data table alternative (required for all ratio charts)
Provide a visually hidden but accessible data table containing the chart data.
Toggle with a "View as table" button visible on focus and hover.

Layer 3 — Text summary (required for CAMEL radar and valuation charts)
Provide a plain text summary below the chart describing the key findings.
This summary is visible to all users, not just screen reader users.

// Chart accessibility pattern
<figure>
    <div
        ref={chartRef}
        role="img"
        aria-label={chartAriaLabel}
        aria-describedby="chart-summary"
    />
    <figcaption id="chart-summary" className="text-sm text-slate-600 mt-2">
        {chartSummary}
    </figcaption>
    <details className="mt-2">
        <summary className="text-sm text-murigne-navy cursor-pointer">
            View chart data as table
        </summary>
        <table>
            {/* accessible data table */}
        </table>
    </details>
</figure>

## Responsive and Mobile Accessibility

Touch targets must be minimum 44x44 pixels on mobile.
Never place interactive elements too close together on mobile.
Minimum 8px spacing between adjacent touch targets.
Zoom must not be disabled — never use user-scalable=no in viewport meta.

## Screen Reader Testing

Before marking any page complete, verify with a screen reader.
On macOS: VoiceOver (built in) — cmd+F5 to activate
On Windows: NVDA (free) — recommended for testing

Verification checklist:
- [ ] Page title is descriptive and unique
- [ ] Heading structure is logical (h1 > h2 > h3)
- [ ] All images have meaningful alt text or aria-label
- [ ] All charts have descriptive aria-label
- [ ] All interactive elements are reachable by keyboard
- [ ] All form fields have associated labels
- [ ] All error messages are announced
- [ ] Modal focus trap works correctly
- [ ] Live regions announce updates appropriately

## Accessibility Checklist (complete before every PR)
- [ ] All interactive elements keyboard navigable
- [ ] All charts have role="img" and descriptive aria-label
- [ ] All charts have "view as table" alternative
- [ ] Color never used as sole signal
- [ ] All form fields have visible labels with htmlFor association
- [ ] Error messages use role="alert" and aria-describedby
- [ ] Focus indicators visible on all interactive elements
- [ ] Touch targets minimum 44x44px on mobile
- [ ] Heading structure is logical with no skipped levels
- [ ] Contrast ratios verified against approved color pairs
- [ ] Screen reader tested on at least one key flow
