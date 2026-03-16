# Testing Skill — Murigne Platform

## Purpose
This skill guides all agents on how to write tests for Murigne.
Financial platforms have zero tolerance for silent computation errors.
A wrong CAMEL score or valuation output displayed to an investor
is worse than no output at all.

Every feature must be tested before it is marked complete.
Tests are not optional and are never deferred to a later sprint.

## Testing Stack
Frontend: Vitest for unit and component tests
Frontend: Playwright for E2E tests
Backend: pytest for unit and integration tests
All tests must pass in CI before any branch is merged to main.

## Frontend Testing — Vitest

### What to Test with Vitest
- All utility functions in lib/
- All financial computation functions (ratio formatting, score banding)
- All Zustand store actions and state transitions
- All data transformation functions (API response to display format)
- All validation functions
- React components with complex logic or multiple states

### What NOT to Test with Vitest
- Simple presentational components with no logic
- Third-party library internals
- Static content that never changes

### Vitest File Conventions
Test files live next to the code they test.
Name: [filename].test.ts or [filename].test.tsx
Never put all tests in a single file.

### Vitest Test Structure
import { describe, it, expect, beforeEach } from 'vitest'

describe('computeCamelBand', () => {
  it('returns Strong for scores between 1.00 and 1.50', () => {
    expect(computeCamelBand(1.00)).toBe('Strong')
    expect(computeCamelBand(1.50)).toBe('Strong')
  })

  it('returns Satisfactory for scores between 1.51 and 2.50', () => {
    expect(computeCamelBand(1.51)).toBe('Satisfactory')
    expect(computeCamelBand(2.50)).toBe('Satisfactory')
  })

  it('returns Unsatisfactory for scores above 4.50', () => {
    expect(computeCamelBand(4.51)).toBe('Unsatisfactory')
    expect(computeCamelBand(5.00)).toBe('Unsatisfactory')
  })

  it('returns null for invalid scores', () => {
    expect(computeCamelBand(-1)).toBeNull()
    expect(computeCamelBand(6)).toBeNull()
    expect(computeCamelBand(NaN)).toBeNull()
  })
})

### Financial Computation Test Requirements
Every financial ratio computation function must have tests for:
1. Normal case: known inputs producing known outputs
2. Zero denominator: function returns null, not NaN or Infinity
3. Negative values: function handles correctly or returns null with explanation
4. Missing data: function returns null with explanation, not an error
5. Boundary values: test at exact benchmark thresholds

Example — testing NPL ratio computation:
describe('computeNplRatio', () => {
  it('computes correctly with valid inputs', () => {
    // NPL Ratio = NPLs / Gross Loans
    // 50,000 / 1,000,000 = 0.05 = 5%
    expect(computeNplRatio(50000, 1000000)).toBe(0.05)
  })

  it('returns null when gross loans is zero', () => {
    expect(computeNplRatio(50000, 0)).toBeNull()
  })

  it('returns null when inputs are negative', () => {
    expect(computeNplRatio(-50000, 1000000)).toBeNull()
  })

  it('returns null when inputs are missing', () => {
    expect(computeNplRatio(null, 1000000)).toBeNull()
    expect(computeNplRatio(50000, null)).toBeNull()
  })
})

### React Component Testing
Test components that have meaningful logic or multiple states.
Use @testing-library/react for component rendering.

import { render, screen } from '@testing-library/react'

describe('StatDisplay', () => {
  it('renders value with benchmark indicator when above benchmark', () => {
    render(
      <StatDisplay
        label="CAR"
        value={0.15}
        benchmark={0.13}
        format="percentage"
      />
    )
    expect(screen.getByText('15.00%')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /above benchmark/i })).toBeInTheDocument()
  })

  it('shows N/A when value is null', () => {
    render(<StatDisplay label="CAR" value={null} format="percentage" />)
    expect(screen.getByText('N/A')).toBeInTheDocument()
  })

  it('renders vintage label when source is provided', () => {
    render(
      <StatDisplay
        label="CAR"
        value={0.15}
        format="percentage"
        vintage={{ source: 'Annual Report 2023', period: 'FY2023', audited: true }}
      />
    )
    expect(screen.getByText('Annual Report 2023')).toBeInTheDocument()
  })
})

## Frontend Testing — Playwright

### What to Test with Playwright
- All critical user flows from the PM spec skill
- All interactive features (screener filters, stress test sliders)
- All authentication and tier-gating flows
- All data display pages (bank profile, sector dashboard)
- All error states and empty states
- Mobile viewports for all key pages

### Playwright File Conventions
Test files live in tests/e2e/
Name: [feature].spec.ts
Group by feature area, not by page.

### Playwright Test Structure
import { test, expect } from '@playwright/test'

test.describe('Bank Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/banks/gcb-bank')
  })

  test('displays CAMEL composite score with radar chart', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'GCB Bank' })).toBeVisible()
    await expect(page.getByTestId('camel-radar-chart')).toBeVisible()
    await expect(page.getByTestId('camel-composite-score')).toBeVisible()
    await expect(page.getByTestId('camel-score-band')).toBeVisible()
  })

  test('shows formula tooltip on hover for NPL ratio', async ({ page }) => {
    const nplRatio = page.getByTestId('ratio-npl-ratio')
    await nplRatio.hover()
    await expect(page.getByText('NPLs / Gross Loans and Advances')).toBeVisible()
  })

  test('shows vintage label for all ratio values', async ({ page }) => {
    const vintageLabels = page.getByTestId('vintage-label')
    await expect(vintageLabels.first()).toBeVisible()
  })

  test('works correctly on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await expect(page.getByTestId('camel-radar-chart')).toBeVisible()
    await expect(page.getByTestId('stat-display-roa')).toBeVisible()
  })
})

### Screener E2E Tests
test.describe('Screener', () => {
  test('filters banks by NPL ratio correctly', async ({ page }) => {
    await page.goto('/screener')
    await page.getByTestId('filter-npl-max').fill('5')
    await page.getByTestId('apply-filters').click()
    const rows = page.getByTestId('screener-row')
    const count = await rows.count()
    expect(count).toBeGreaterThan(0)
    // verify all displayed NPL ratios are below 5%
    for (let i = 0; i < count; i++) {
      const nplCell = rows.nth(i).getByTestId('cell-npl-ratio')
      const value = parseFloat(await nplCell.textContent() ?? '100')
      expect(value).toBeLessThanOrEqual(5)
    }
  })
})

### Authentication E2E Tests
test.describe('Tier Gating', () => {
  test('free user sees upgrade prompt on stress testing page', async ({ page }) => {
    // sign in as free tier user
    await signInAs(page, 'free-user@test.com')
    await page.goto('/stress-testing')
    await expect(page.getByTestId('upgrade-prompt')).toBeVisible()
    await expect(page.getByText('Upgrade to Investor')).toBeVisible()
  })

  test('investor user can access stress testing page', async ({ page }) => {
    await signInAs(page, 'investor-user@test.com')
    await page.goto('/stress-testing')
    await expect(page.getByTestId('stress-testing-tool')).toBeVisible()
    await expect(page.getByTestId('upgrade-prompt')).not.toBeVisible()
  })
})

### Playwright Configuration
playwright.config.ts must include:
- baseURL pointing to localhost:3000
- Mobile viewport preset (375x812) as a named project
- Screenshot on failure
- Video recording on failure
- Retry twice on CI

## Backend Testing — pytest

### What to Test with pytest
- All financial ratio computation functions
- All valuation model computations
- All stress testing computations
- All database query functions (with test database)
- All API endpoints (integration tests)
- All cache service functions

### pytest File Conventions
Test files live in tests/
Name: test_[module].py
Use fixtures for shared setup (database connection, test data)

### Financial Model Test Requirements
Every valuation function must have tests with real-world inputs.
Use actual published GCB Bank 2023 figures as test fixtures.
This catches regressions that synthetic data would miss.

import pytest
from decimal import Decimal
from services.valuation_service import compute_ddm, compute_ri_model

class TestDDM:
    def test_computes_correctly_with_valid_inputs(self):
        # GCB Bank 2023 approximate figures for illustration
        result = compute_ddm(
            last_dividend=Decimal("0.12"),
            roe=Decimal("0.18"),
            payout_ratio=Decimal("0.40"),
            risk_free_rate=Decimal("0.28"),  # BoG 91-day T-bill
            beta=Decimal("0.85"),
            market_return=Decimal("0.32"),
        )
        assert result.intrinsic_value is not None
        assert result.intrinsic_value > 0
        assert result.required_return > result.growth_rate

    def test_returns_none_when_growth_exceeds_required_return(self):
        result = compute_ddm(
            last_dividend=Decimal("0.12"),
            roe=Decimal("0.50"),
            payout_ratio=Decimal("0.10"),
            risk_free_rate=Decimal("0.05"),
            beta=Decimal("0.50"),
            market_return=Decimal("0.10"),
        )
        assert result.intrinsic_value is None
        assert result.error == "growth_rate_exceeds_required_return"

    def test_returns_none_for_zero_dividend(self):
        result = compute_ddm(
            last_dividend=Decimal("0"),
            roe=Decimal("0.18"),
            payout_ratio=Decimal("0"),
            risk_free_rate=Decimal("0.28"),
            beta=Decimal("0.85"),
            market_return=Decimal("0.32"),
        )
        assert result.intrinsic_value is None

### API Integration Test Pattern
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_bank_camel_ratios_returns_correct_structure():
    response = client.get(
        "/api/v1/banks/gcb-bank/camel",
        headers={"Authorization": f"Bearer {test_investor_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert "vintage" in data
    assert data["vintage"]["audited"] in [True, False]
    assert "capital" in data["data"]
    assert "asset_quality" in data["data"]

def test_get_bank_camel_ratios_returns_403_for_free_tier():
    response = client.get(
        "/api/v1/banks/gcb-bank/camel",
        headers={"Authorization": f"Bearer {test_free_token}"}
    )
    assert response.status_code == 403

## Test Data Management

### Fixtures
Maintain a set of realistic test fixtures based on publicly available
Ghanaian bank data. Store in tests/fixtures/.

Required fixtures:
- gcb_bank_2023.json: GCB Bank 2023 annual report figures
- ecobank_2023.json: Ecobank 2023 annual report figures
- sector_averages_2023.json: Sector aggregate figures

### Test Database
Use a separate PostgreSQL database for tests.
Never run tests against the production database.
Reset the test database before each test run using fixtures.
Use pytest-asyncio for async database tests.

## Coverage Requirements
Frontend (Vitest): minimum 80% coverage on lib/ and stores/
Backend (pytest): minimum 90% coverage on services/
E2E (Playwright): all critical user flows from the PM spec skill must be covered
Financial models: 100% branch coverage on all computation functions

## CI Test Execution Order
1. Backend pytest — fast, runs first
2. Frontend Vitest — medium speed
3. TypeScript typecheck — catches type errors
4. Next.js build — catches build errors
5. Playwright E2E — slowest, runs last

If any step fails, subsequent steps do not run.
Never merge to main with failing tests.
