# Backend API Skill — Murigne Platform

## Purpose
This skill guides all backend agents building the FastAPI service for Murigne.
It defines project structure, endpoint patterns, database access, caching,
financial model computation, and API contract conventions.

## API Contract Ownership
The frontend agent defines the TypeScript response interface first, as part
of the bead. The backend implements the FastAPI endpoint to match that
contract exactly. Never change the response shape without updating the bead
and notifying the Mayor.

The Pydantic response schema must satisfy the TypeScript interface defined
in the bead. TypeScript strict mode on the frontend catches any mismatch
at build time.

## Python Version and Dependencies
- Python: 3.12+
- FastAPI: 0.111+
- Pydantic: v2 (use model_config = ConfigDict, not class Config)
- asyncpg: for async PostgreSQL access
- redis: for cache via Upstash
- numpy, scipy, pandas: for financial model computation
- alembic: for database migrations
- pytest, pytest-asyncio: for testing

Never use Pydantic v1 patterns (class Config, validator decorator).
Always use Pydantic v2 patterns (model_config, field_validator).

## Project Structure
The FastAPI backend lives in murigne-api/ at the repo root.

murigne-api/
├── main.py                    -- FastAPI app entry point
├── routers/
│   ├── banks.py               -- Bank profile endpoints
│   ├── camel.py               -- CAMEL ratio endpoints
│   ├── valuation.py           -- DDM, RI model endpoints
│   ├── screener.py            -- Screener and filter endpoints
│   ├── sector.py              -- Sector dashboard endpoints
│   ├── stress.py              -- Stress testing endpoints
│   ├── fixed_income.py        -- Fixed income endpoints
│   ├── macro.py               -- Macro dashboard endpoints
│   └── admin.py               -- Admin data entry endpoints
├── models/
│   ├── bank.py                -- Bank Pydantic schemas
│   ├── camel.py               -- CAMEL ratio schemas
│   ├── valuation.py           -- Valuation model schemas
│   └── common.py              -- Shared schemas (pagination, errors, vintage)
├── services/
│   ├── camel_service.py       -- CAMEL ratio computation
│   ├── valuation_service.py   -- DDM, RI, VaR computation
│   ├── stress_service.py      -- Stress testing computation
│   └── cache_service.py       -- Redis cache management
├── auth/
│   ├── clerk.py               -- Clerk JWT verification
│   └── dependencies.py        -- FastAPI auth dependencies per tier
├── db/
│   ├── connection.py          -- PostgreSQL connection pool
│   ├── queries/               -- SQL query files per domain
│   └── migrations/            -- Alembic migration files
├── tests/
│   ├── conftest.py            -- pytest fixtures
│   ├── test_camel.py          -- CAMEL computation unit tests
│   ├── test_valuation.py      -- Valuation model unit tests
│   └── test_api.py            -- API endpoint integration tests
├── requirements.txt
└── .env.example

## FastAPI Application Setup

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from datetime import UTC
import os
from db.connection import init_db, close_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_db()

app = FastAPI(
    title="Murigne API",
    version="1.0.0",
    lifespan=lifespan,
)

# Allow multiple origins for dev vs production
ALLOWED_ORIGINS = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

# .env.example must include:
# ALLOWED_ORIGINS=http://localhost:3000
# Production: ALLOWED_ORIGINS=https://murigne.com

## Authentication — Clerk + FastAPI

Murigne uses Clerk for authentication. Clerk issues JWTs that the frontend
sends as Bearer tokens. The backend verifies these tokens on every request.

### Tier Hierarchy
- unauthenticated: free tier data only (3-year history, limited ratios)
- free: registered, no subscription — same as unauthenticated plus saved screens
- investor: GHS 49/month — full 5-year history, all CAMEL ratios, DDM/RI
- professional: GHS 199/month — stress testing, Sharpe/Treynor, fixed income, export
- institutional: custom — full API, VaR/CVaR, attribution, private wealth tools
- admin: internal team — data entry endpoints, no financial gate

### Clerk JWT Verification
# auth/clerk.py
import httpx
from jose import jwt, JWTError
from fastapi import HTTPException, status

CLERK_JWKS_URL = os.getenv("CLERK_JWKS_URL")  # from Clerk dashboard

async def verify_clerk_token(token: str) -> dict:
    async with httpx.AsyncClient() as client:
        jwks = await client.get(CLERK_JWKS_URL)
    try:
        payload = jwt.decode(token, jwks.json(), algorithms=["RS256"])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

### Auth Dependencies Per Tier
# auth/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from auth.clerk import verify_clerk_token

bearer = HTTPBearer(auto_error=False)

async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
) -> dict | None:
    if not credentials:
        return None
    return await verify_clerk_token(credentials.credentials)

def require_tier(*tiers: str):
    async def dependency(user: dict | None = Depends(get_current_user)):
        if user is None:
            raise HTTPException(status_code=401, detail="Authentication required")
        user_tier = user.get("public_metadata", {}).get("tier", "free")
        if user_tier not in tiers and "admin" not in tiers:
            raise HTTPException(
                status_code=403,
                detail={"message": "Upgrade required", "code": "INSUFFICIENT_TIER"},
            )
        return user
    return dependency

# Usage in routers:
verify_investor_tier = require_tier("investor", "professional", "institutional", "admin")
verify_professional_tier = require_tier("professional", "institutional", "admin")
verify_admin = require_tier("admin")

## Pydantic Schema Conventions

Every API response must use a Pydantic schema.
Never return raw database rows. Never use dict as a return type.
Always use Pydantic v2 patterns.

### Standard Response Wrapper
from pydantic import BaseModel, ConfigDict
from typing import TypeVar, Generic
from datetime import datetime, UTC

T = TypeVar("T")

class VintageLabel(BaseModel):
    source: str
    period: str
    audited: bool
    entry_date: datetime

class ApiResponse(BaseModel, Generic[T]):
    data: T
    vintage: VintageLabel | None = None
    cached: bool = False
    generated_at: datetime = datetime.now(UTC)

class PaginatedResponse(BaseModel, Generic[T]):
    data: list[T]
    total: int
    page: int
    page_size: int
    total_pages: int

### Bank Schema Example
from decimal import Decimal
from datetime import date

class BankSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    ticker: str
    listing_date: date
    market_cap_ghs: Decimal
    last_price_ghs: Decimal
    camel_score: Decimal | None
    camel_band: str | None

## Endpoint Conventions

### URL Structure
GET  /api/v1/banks                          -- list all banks
GET  /api/v1/banks/{bank_id}                -- single bank profile
GET  /api/v1/banks/{bank_id}/camel          -- CAMEL ratios
GET  /api/v1/banks/{bank_id}/camel/{year}   -- CAMEL ratios for year
GET  /api/v1/banks/{bank_id}/valuation      -- DDM and RI valuation
GET  /api/v1/banks/{bank_id}/financials     -- financial statements
GET  /api/v1/screener                       -- screener with filter params
GET  /api/v1/sector                         -- sector dashboard data
GET  /api/v1/sector/trends                  -- sector trend time series
POST /api/v1/stress/run                     -- run stress test scenario
GET  /api/v1/macro                          -- macro dashboard data
POST /api/v1/admin/banks/{bank_id}/financials -- admin data entry

### Router Pattern
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Annotated
from datetime import datetime, UTC

router = APIRouter(prefix="/api/v1/banks", tags=["banks"])

@router.get("/{bank_id}/camel", response_model=ApiResponse[CamelRatios])
async def get_camel_ratios(
    bank_id: str,
    year: Annotated[int | None, Query(ge=2015, le=2030)] = None,
    db=Depends(get_db),
    cache=Depends(get_cache),
    user=Depends(verify_investor_tier),
):
    cache_key = f"camel:{bank_id}:{year}"
    cached = await cache.get(cache_key)
    if cached:
        return ApiResponse(data=cached, cached=True, generated_at=datetime.now(UTC))

    ratios = await camel_service.compute_ratios(db, bank_id, year)
    if not ratios:
        raise HTTPException(status_code=404, detail=f"No CAMEL data for {bank_id}")

    await cache.set(cache_key, ratios, ttl=3600)
    return ApiResponse(data=ratios, cached=False, generated_at=datetime.now(UTC))

## Database Access

Use asyncpg for async PostgreSQL access.
Always use connection pooling — never create a new connection per request.
Always use parameterized queries — never f-strings or string concatenation in SQL.

from asyncpg import Pool

async def get_camel_ratios(pool: Pool, bank_id: str, year: int):
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT r.ratio_name, r.value, r.period, r.source, r.audited
            FROM camel_ratios r
            WHERE r.bank_id = $1
            AND EXTRACT(YEAR FROM r.period_end) = $2
            AND r.is_latest = true
            ORDER BY r.ratio_name
            """,
            bank_id,
            year,
        )
    return [dict(row) for row in rows]

## Financial Model Computation

All CFA financial model computations live in services/.
Never compute financial models inside routers.
All computations must handle edge cases explicitly.
See skills/financial-data/SKILL.md for the authoritative computation rules,
formulas, benchmarks, and edge case handling.

### Computation Rules
- Always check for division by zero before computing any ratio
- Return None with an explanation string if a ratio cannot be computed
- Never return NaN or infinity — always handle with None + explanation
- Round all ratios to 4 decimal places for storage (Decimal, ROUND_HALF_UP)
- Round to 2 decimal places for display (handled by the frontend)
- All model outputs must include the input assumptions used

### Example CAMEL Service
from decimal import Decimal, ROUND_HALF_UP

def compute_car(
    regulatory_capital: Decimal,
    risk_weighted_assets: Decimal,
) -> tuple[Decimal | None, str | None]:
    # Returns (value, error_message)
    if risk_weighted_assets == 0:
        return None, "Risk-weighted assets is zero — CAR cannot be computed"
    ratio = regulatory_capital / risk_weighted_assets
    return ratio.quantize(Decimal("0.0001"), rounding=ROUND_HALF_UP), None

def compute_camel_score(components: dict[str, float]) -> dict:
    weights = {
        "capital": 0.25,
        "asset_quality": 0.25,
        "management": 0.20,
        "earnings": 0.15,
        "liquidity": 0.15,
    }
    if not all(k in components for k in weights):
        return {"score": None, "band": None, "error": "incomplete components"}

    score = round(sum(components[k] * weights[k] for k in weights), 2)

    bands = [(1.50, "Strong"), (2.50, "Satisfactory"), (3.50, "Fair"),
             (4.50, "Marginal"), (5.00, "Unsatisfactory")]
    band = next(b for threshold, b in bands if score <= threshold)

    return {"score": score, "band": band, "error": None}

## Caching Strategy — Redis via Upstash

Cache all computed ratio sets and model outputs.
Never cache raw financial statement data — always recompute from source.

Cache TTL guidelines:
- CAMEL ratios: 24 hours (updated at most once per day)
- Valuation model outputs: 1 hour (depends on live market price)
- Sector aggregates: 6 hours
- Screener results: 5 minutes (filter state changes frequently)
- Market prices: 15 minutes
- Macro data: 6 hours

### Cache Invalidation on Admin Data Entry
When admin enters new financial data, invalidate all related caches
for that bank immediately. Pattern:

# cache_service.py
async def invalidate_bank_caches(cache, bank_id: str):
    patterns = [
        f"camel:{bank_id}:*",
        f"valuation:{bank_id}:*",
        f"financials:{bank_id}:*",
        f"sector:*",          # sector aggregates include this bank
        f"screener:*",        # screener results include this bank
    ]
    for pattern in patterns:
        keys = await cache.keys(pattern)
        if keys:
            await cache.delete(*keys)

# Call this at the end of every admin data entry endpoint:
await invalidate_bank_caches(cache, bank_id)

Never serve stale valuation data without a staleness warning in the response.

## Error Handling

Every endpoint must handle errors explicitly.
Never let unhandled exceptions reach the client in production.

from fastapi import HTTPException
from fastapi.responses import JSONResponse

class MurigneException(Exception):
    def __init__(self, message: str, code: str, status_code: int = 400):
        self.message = message
        self.code = code
        self.status_code = status_code

@app.exception_handler(MurigneException)
async def murigne_exception_handler(request, exc: MurigneException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"message": exc.message, "code": exc.code}},
    )

Standard error codes:
- BANK_NOT_FOUND: bank_id does not exist
- DATA_NOT_AVAILABLE: data exists but not for requested period
- INSUFFICIENT_TIER: user tier does not permit this endpoint
- COMPUTATION_ERROR: financial model could not be computed
- VALIDATION_ERROR: request parameters failed validation

## API Versioning
All endpoints are prefixed with /api/v1/
When breaking changes are needed, create /api/v2/ routes
Never modify existing v1 endpoints in a breaking way
Deprecate with a Deprecation response header before removing

## Testing

Run tests with:
  cd murigne-api
  pytest tests/ -v

### conftest.py Fixtures
# tests/conftest.py
import pytest
import pytest_asyncio
from httpx import AsyncClient
from main import app
from db.connection import get_db
from auth.dependencies import get_current_user

@pytest_asyncio.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

@pytest.fixture
def investor_user():
    return {"sub": "user_test", "public_metadata": {"tier": "investor"}}

@pytest.fixture
def admin_user():
    return {"sub": "user_admin", "public_metadata": {"tier": "admin"}}

@pytest.fixture
def override_investor(investor_user):
    app.dependency_overrides[get_current_user] = lambda: investor_user
    yield
    app.dependency_overrides.clear()

### Unit Test Pattern (financial models)
# tests/test_camel.py
from decimal import Decimal
from services.camel_service import compute_car, compute_camel_score

def test_car_normal():
    value, error = compute_car(Decimal("130000000"), Decimal("1000000000"))
    assert value == Decimal("0.1300")
    assert error is None

def test_car_division_by_zero():
    value, error = compute_car(Decimal("130000000"), Decimal("0"))
    assert value is None
    assert error is not None

def test_camel_score_strong():
    components = {
        "capital": 1.0, "asset_quality": 1.0,
        "management": 1.0, "earnings": 1.0, "liquidity": 1.0
    }
    result = compute_camel_score(components)
    assert result["score"] == 1.0
    assert result["band"] == "Strong"

def test_camel_score_incomplete():
    result = compute_camel_score({"capital": 1.0})
    assert result["score"] is None

### Integration Test Pattern (endpoints)
# tests/test_api.py
import pytest

@pytest.mark.asyncio
async def test_get_camel_ratios_requires_auth(client):
    response = await client.get("/api/v1/banks/gcb/camel")
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_get_camel_ratios_investor(client, override_investor):
    response = await client.get("/api/v1/banks/gcb/camel")
    assert response.status_code in (200, 404)  # 404 if test DB has no data
    if response.status_code == 200:
        data = response.json()
        assert "data" in data
        assert "vintage" in data

Every router must have integration tests.
Every service must have unit tests with known financial inputs and expected outputs.
Financial model tests must cover:
- Normal case with expected output
- Division by zero
- Negative values
- Insufficient data
- DDM edge case: r <= g
- RI edge case: r = g
