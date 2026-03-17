# Testing Skill — Murigne Platform

## Purpose
This skill guides all agents on how to write tests for Murigne.
Financial platforms have zero tolerance for silent computation errors.
A wrong CAMEL score or valuation output displayed to an investor
is worse than no output at all.

Every feature must be tested before it is marked complete.
Tests are not optional and are never deferred to a later sprint.

## Testing Stack
Frontend: Vitest + @vitest/coverage-v8 for unit and component tests
Frontend: Playwright for E2E tests
Backend: pytest + pytest-asyncio + pytest-cov for unit and integration tests
All tests must pass in CI before any branch is merged via the Refinery.

## Test Environment Configuration

### Frontend — .env.test.local
Create .env.test.local for Vitest. Never use production credentials in tests.
Required variables:
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...   # Clerk test mode key
  CLERK_SECRET_KEY=sk_test_...                    # Clerk test mode key
  NEXT_PUBLIC_API_URL=http://localhost:8000

Clerk test mode provides magic email addresses that bypass OTP —
use these for Playwright auth flows. See Clerk docs for test mode setup.

### Backend — .env.test
Create .env.test for pytest. Never use production credentials in tests.
Required variables:
  DATABASE_URL=postgresql://murigne:murigne@localhost:5432/murigne_test
  REDIS_URL=redis://localhost:6379/1        # use DB index 1 for tests
  CLERK_JWKS_URL=https://clerk.murigne.com/.well-known/jwks.json
  PAYSTACK_SECRET_KEY=sk_test_...
  ALLOWED_ORIGINS=http://localhost:3000

Always add .env.test and .env.test.local to .gitignore.
Always add them to .env.example with empty values and a comment.
Never run tests against the production database or production Redis.

### Test Database
Use a separate PostgreSQL database: murigne_test.
Reset and reseed before each test run:
  cd murigne-api
  psql murigne_test < db/schema.sql
  psql murigne_test < db/seeds/banks.sql

Use pytest fixtures to manage test database state.
Use pytest-asyncio for all async database tests.

## Frontend Testing — Vitest

### Running Tests
# Development watch mode
npx vitest

# Single run with coverage
npx vitest run --coverage

# Coverage report
npx vitest run --coverage --reporter=html

### Coverage Configuration — vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'lcov'],
            include: ['lib/**', 'stores/**', 'components/**'],
            exclude: ['**/*.test.*', '**/*.spec.*'],
            thresholds: {
                lines: 80,
                functions: 80,
                branches: 80,
            },
        },
        environment: 'jsdom',
        setupFiles: ['tests/setup.ts'],
    },
})

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
import { describe, it, expect } from 'vitest'
import { computeCamelBand } from '@/lib/camel'

describe('computeCamelBand', () => {
    it('returns Strong for scores 1.00 to 1.50', () => {
        expect(computeCamelBand(1.00)).toBe('Strong')
        expect(computeCamelBand(1.50)).toBe('Strong')
    })

    it('returns Satisfactory for scores 1.51 to 2.50', () => {
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
2. Zero denominator: returns null, not NaN or Infinity
3. Negative values: returns null with explanation
4. Missing data: returns null with explanation, not a thrown error
5. Boundary values: test at exact benchmark thresholds

describe('computeNplRatio', () => {
    it('computes correctly: 50000 / 1000000 = 0.05', () => {
        expect(computeNplRatio(50000, 1000000)).toBe(0.05)
    })

    it('returns null when gross loans is zero', () => {
        expect(computeNplRatio(50000, 0)).toBeNull()
    })

    it('returns null when inputs are negative', () => {
        expect(computeNplRatio(-50000, 1000000)).toBeNull()
    })

    it('returns null when inputs are null', () => {
        expect(computeNplRatio(null, 1000000)).toBeNull()
        expect(computeNplRatio(50000, null)).toBeNull()
    })
})

### React Component Testing
Use @testing-library/react for component rendering.
Prefer accessible queries over data-testid — see Selector Priority below.

import { render, screen } from '@testing-library/react'
import { StatDisplay } from '@/components/ui/stat-display'

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
        expect(screen.getByRole('img', { name: /above benchmark/i }))
            .toBeInTheDocument()
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
                vintage={{
                    source: 'Annual Report 2023',
                    period: 'FY2023',
                    audited: true,
                }}
            />
        )
        expect(screen.getByText('Annual Report 2023')).toBeInTheDocument()
    })
})

## Frontend Testing — Playwright

### Running Tests
# Development — headed mode for debugging
npx playwright test --headed

# CI — headless
npx playwright test

# Single file
npx playwright test tests/e2e/screener.spec.ts

# Debug mode
npx playwright test --debug

### Playwright Configuration — playwright.config.ts
Must include:
- baseURL: 'http://localhost:3000'
- Mobile viewport project: { name: 'mobile', use: { viewport: { width: 375, height: 812 } } }
- Screenshot on failure: screenshot: 'only-on-failure'
- Video on failure: video: 'retain-on-failure'
- Retry on CI: retries: process.env.CI ? 2 : 0

### Selector Priority
Always prefer accessible selectors over data-testid.
Use data-testid only when no accessible selector is available.

Priority order (highest to lowest):
1. getByRole — preferred for all interactive elements and landmarks
2. getByLabel — preferred for form inputs
3. getByText — for visible text content
4. getByAltText — for images
5. data-testid — last resort only, when no accessible selector works

// Preferred
page.getByRole('button', { name: 'Apply filters' })
page.getByRole('heading', { name: 'GCB Bank' })
page.getByLabel('Maximum NPL Ratio (%)')

// Only when no accessible selector works
page.getByTestId('camel-radar-chart')  // charts have no accessible role alternative

When adding data-testid to a component, document why no accessible
selector was available.

### Playwright Auth Helper — tests/helpers/auth.ts
Clerk test mode provides magic email addresses that bypass OTP verification.
Define a reusable signInAs helper using Clerk test mode credentials.

// tests/helpers/auth.ts
import { Page } from '@playwright/test'

const TEST_USERS = {
    free: 'free+clerk_test@murigne.com',
    investor: 'investor+clerk_test@murigne.com',
    professional: 'professional+clerk_test@murigne.com',
    admin: 'admin+clerk_test@murigne.com',
}

export async function signInAs(page: Page, tier: keyof typeof TEST_USERS) {
    await page.goto('/sign-in')
    await page.getByLabel('Email address').fill(TEST_USERS[tier])
    await page.getByRole('button', { name: 'Continue' }).click()
    // Clerk test mode magic link — no OTP needed
    await page.waitForURL('/')
}

// Usage in tests:
// import { signInAs } from '../helpers/auth'
// await signInAs(page, 'investor')

### Playwright Test Structure

test.describe('Bank Profile Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/banks/gcb-bank')
    })

    test('displays CAMEL composite score with radar chart', async ({ page }) => {
        await expect(
            page.getByRole('heading', { name: 'GCB Bank' })
        ).toBeVisible()
        await expect(page.getByTestId('camel-radar-chart')).toBeVisible()
        await expect(
            page.getByRole('heading', { name: /camel composite/i })
        ).toBeVisible()
    })

    test('shows formula tooltip on hover for NPL ratio', async ({ page }) => {
        await page.getByText('NPL Ratio').hover()
        await expect(
            page.getByText('NPLs / Gross Loans and Advances')
        ).toBeVisible()
    })

    test('shows vintage label for all ratio values', async ({ page }) => {
        await expect(
            page.getByTestId('vintage-label').first()
        ).toBeVisible()
    })

    test('works correctly on mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 })
        await expect(page.getByTestId('camel-radar-chart')).toBeVisible()
        await expect(
            page.getByRole('region', { name: /return on assets/i })
        ).toBeVisible()
    })
})

test.describe('Screener', () => {
    test('filters banks by NPL ratio correctly', async ({ page }) => {
        await page.goto('/screener')
        await page.getByLabel('Maximum NPL Ratio (%)').fill('5')
        await page.getByRole('button', { name: 'Apply filters' }).click()
        const rows = page.getByRole('row', { name: /bank/i })
        const count = await rows.count()
        expect(count).toBeGreaterThan(0)
        for (let i = 0; i < count; i++) {
            const nplCell = rows.nth(i).getByTestId('cell-npl-ratio')
            const value = parseFloat(await nplCell.textContent() ?? '100')
            expect(value).toBeLessThanOrEqual(5)
        }
    })
})

test.describe('Tier Gating', () => {
    test('free user sees upgrade prompt on stress testing', async ({ page }) => {
        await signInAs(page, 'free')
        await page.goto('/stress-testing')
        await expect(
            page.getByRole('region', { name: /upgrade/i })
        ).toBeVisible()
    })

    test('investor user can access stress testing', async ({ page }) => {
        await signInAs(page, 'investor')
        await page.goto('/stress-testing')
        await expect(
            page.getByRole('main').getByText(/upgrade/i)
        ).not.toBeVisible()
    })
})

## Backend Testing — pytest

### Running Tests
# Development watch mode
cd murigne-api
ptw tests/                        # pytest-watch

# Single run with coverage
pytest tests/ --cov=. --cov-report=html -v

# Single file
pytest tests/test_camel.py -v

### Coverage Configuration — pyproject.toml
[tool.pytest.ini_options]
asyncio_mode = "auto"
env_files = [".env.test"]

[tool.coverage.run]
source = ["services", "routers", "auth", "db"]
omit = ["tests/*", "migrations/*"]

[tool.coverage.report]
fail_under = 90

### Test Token Fixtures — tests/conftest.py
Generate test JWTs signed with a test secret. Never use production Clerk keys.

import pytest
import pytest_asyncio
import jwt
from datetime import datetime, UTC, timedelta
from httpx import AsyncClient
from main import app
from auth.dependencies import get_current_user

TEST_SECRET = "test-secret-not-for-production"

def make_test_token(tier: str) -> str:
    payload = {
        "sub": f"user_{tier}_test",
        "public_metadata": {"tier": tier},
        "exp": datetime.now(UTC) + timedelta(hours=1),
    }
    return jwt.encode(payload, TEST_SECRET, algorithm="HS256")

@pytest.fixture
def free_token():
    return make_test_token("free")

@pytest.fixture
def investor_token():
    return make_test_token("investor")

@pytest.fixture
def professional_token():
    return make_test_token("professional")

@pytest.fixture
def admin_token():
    return make_test_token("admin")

@pytest_asyncio.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

@pytest.fixture
def override_investor(investor_token):
    user = {"sub": "user_investor_test", "public_metadata": {"tier": "investor"}}
    app.dependency_overrides[get_current_user] = lambda: user
    yield
    app.dependency_overrides.clear()

### Financial Model Test Requirements
Every valuation function must have tests with realistic inputs.
Use publicly available GCB Bank 2023 annual report figures as fixtures.
Store in tests/fixtures/gcb_bank_2023.json.
Real-world fixtures catch regressions that synthetic data misses.

import pytest
from decimal import Decimal
from services.valuation_service import compute_ddm, compute_ri_model

class TestDDM:
    def test_valid_inputs(self):
        result = compute_ddm(
            last_dividend=Decimal("0.12"),
            roe=Decimal("0.18"),
            payout_ratio=Decimal("0.40"),
            risk_free_rate=Decimal("0.28"),
            beta=Decimal("0.85"),
            market_return=Decimal("0.32"),
        )
        assert result.intrinsic_value is not None
        assert result.intrinsic_value > 0
        assert result.required_return > result.growth_rate
        assert result.error is None

    def test_growth_exceeds_required_return(self):
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

    def test_zero_dividend_history(self):
        result = compute_ddm(
            last_dividend=Decimal("0"),
            roe=Decimal("0.18"),
            payout_ratio=Decimal("0"),
            risk_free_rate=Decimal("0.28"),
            beta=Decimal("0.85"),
            market_return=Decimal("0.32"),
        )
        assert result.intrinsic_value is None
        assert result.error == "insufficient_dividend_history"

### API Integration Test Pattern
Always use AsyncClient with pytest-asyncio — never TestClient.
TestClient is synchronous and incompatible with asyncpg.

import pytest

@pytest.mark.asyncio
async def test_camel_ratios_requires_auth(client):
    response = await client.get("/api/v1/banks/gcb/camel")
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_camel_ratios_investor_tier(client, override_investor):
    response = await client.get("/api/v1/banks/gcb/camel")
    assert response.status_code in (200, 404)
    if response.status_code == 200:
        data = response.json()
        assert "data" in data
        assert "vintage" in data
        assert "audited" in data["vintage"]

@pytest.mark.asyncio
async def test_camel_ratios_free_tier_rejected(client):
    user = {"sub": "free_user", "public_metadata": {"tier": "free"}}
    app.dependency_overrides[get_current_user] = lambda: user
    response = await client.get("/api/v1/banks/gcb/camel")
    app.dependency_overrides.clear()
    assert response.status_code == 403

## Test Data Management

### Fixtures Directory
tests/fixtures/
├── gcb_bank_2023.json        -- GCB Bank 2023 annual report figures
├── ecobank_2023.json         -- Ecobank 2023 annual report figures
└── sector_averages_2023.json -- Sector aggregate figures

All fixture values must be sourced from published annual reports.
Document the source and page number in a comment inside each fixture file.

## Coverage Requirements
Frontend (Vitest):
- lib/: minimum 80% line, function, and branch coverage
- stores/: minimum 80% line, function, and branch coverage
- Financial computation functions: 100% branch coverage

Backend (pytest):
- services/: minimum 90% coverage
- routers/: minimum 90% coverage
- Financial model functions: 100% branch coverage

E2E (Playwright):
All critical user flows defined in pm-spec/SKILL.md must have
a corresponding Playwright test. No flow is marked done without one.

## CI Test Execution Order
1. pytest — fastest, runs first, catches backend regressions early
2. vitest run — medium speed
3. tsc --noEmit — TypeScript strict mode check
4. next build — catches build errors
5. playwright test — slowest, runs last

If any step fails, subsequent steps do not run.
Never merge to main via the Refinery with failing tests.
