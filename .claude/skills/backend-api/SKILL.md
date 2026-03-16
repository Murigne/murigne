# Backend API Skill — Murigne Platform

## Purpose
This skill guides all backend agents building the FastAPI service for Murigne.
It defines project structure, endpoint patterns, database access, caching,
financial model computation, and API contract conventions.

## Project Structure
The FastAPI backend lives in a separate directory from the Next.js frontend.

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
├── db/
│   ├── connection.py          -- PostgreSQL connection pool
│   ├── queries/               -- SQL query files per domain
│   └── migrations/            -- Alembic migration files
├── tests/
│   ├── test_camel.py          -- CAMEL computation unit tests
│   ├── test_valuation.py      -- Valuation model unit tests
│   └── test_api.py            -- API endpoint integration tests
├── requirements.txt
└── .env.example

## FastAPI Application Setup

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL")],
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

## Pydantic Schema Conventions

Every API response must use a Pydantic schema.
Never return raw database rows.
Never use dict as a return type.

### Standard Response Wrapper
from pydantic import BaseModel
from typing import TypeVar, Generic, Optional
from datetime import datetime

T = TypeVar("T")

class VintageLabel(BaseModel):
    source: str
    period: str
    audited: bool
    entry_date: datetime

class ApiResponse(BaseModel, Generic[T]):
    data: T
    vintage: Optional[VintageLabel] = None
    cached: bool = False
    generated_at: datetime

class PaginatedResponse(BaseModel, Generic[T]):
    data: list[T]
    total: int
    page: int
    page_size: int
    total_pages: int

### Bank Schema Example
class BankSummary(BaseModel):
    id: str
    name: str
    ticker: str
    listing_date: date
    market_cap_ghs: Decimal
    last_price_ghs: Decimal
    camel_score: Optional[Decimal]
    camel_band: Optional[str]

    model_config = ConfigDict(from_attributes=True)

## Endpoint Conventions

### Naming
GET /api/v1/banks — list all banks
GET /api/v1/banks/{bank_id} — single bank profile
GET /api/v1/banks/{bank_id}/camel — CAMEL ratios for a bank
GET /api/v1/banks/{bank_id}/camel/{year} — CAMEL ratios for specific year
GET /api/v1/banks/{bank_id}/valuation — DDM and RI valuation
GET /api/v1/banks/{bank_id}/financials — financial statements
GET /api/v1/screener — screener with filter params
GET /api/v1/sector — sector dashboard data
GET /api/v1/sector/trends — sector trend time series
POST /api/v1/stress/run — run stress test scenario
GET /api/v1/macro — macro dashboard data
POST /api/v1/admin/banks/{bank_id}/financials — admin data entry

### Router Pattern
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Annotated

router = APIRouter(prefix="/api/v1/banks", tags=["banks"])

@router.get("/{bank_id}/camel", response_model=ApiResponse[CamelRatios])
async def get_camel_ratios(
    bank_id: str,
    year: Annotated[int, Query(ge=2015, le=2030)] = None,
    db = Depends(get_db),
    cache = Depends(get_cache),
    user = Depends(verify_investor_tier),
):
    cache_key = f"camel:{bank_id}:{year}"
    cached = await cache.get(cache_key)
    if cached:
        return ApiResponse(data=cached, cached=True, generated_at=datetime.utcnow())

    ratios = await camel_service.compute_ratios(db, bank_id, year)
    if not ratios:
        raise HTTPException(status_code=404, detail=f"No CAMEL data for bank {bank_id}")

    await cache.set(cache_key, ratios, ttl=3600)
    return ApiResponse(data=ratios, cached=False, generated_at=datetime.utcnow())

## Database Access — postgres.js equivalent in Python

Use asyncpg for async PostgreSQL access.
Always use connection pooling — never create a new connection per request.
Always use parameterized queries — never f-strings in SQL.

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

### CAMEL Computation Rules
- Always check for division by zero before computing any ratio
- Return None with an explanation if a ratio cannot be computed
- Never return NaN or infinity — always handle gracefully
- Round all ratios to 4 decimal places before storing
- Round all displayed ratios to 2 decimal places

### Valuation Model Rules
- DDM: if r <= g, return None with explanation "growth rate exceeds required return"
- RI model: always return both intrinsic value and justified P/B
- VaR: require minimum 252 trading days of price history
- All model outputs must include the input assumptions used

### Example CAMEL Service
import numpy as np
from decimal import Decimal, ROUND_HALF_UP

def compute_car(regulatory_capital: Decimal, risk_weighted_assets: Decimal) -> Decimal | None:
    if risk_weighted_assets == 0:
        return None
    ratio = regulatory_capital / risk_weighted_assets
    return ratio.quantize(Decimal("0.0001"), rounding=ROUND_HALF_UP)

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

    score = sum(components[k] * weights[k] for k in weights)
    score = round(score, 2)

    if score <= 1.50:
        band = "Strong"
    elif score <= 2.50:
        band = "Satisfactory"
    elif score <= 3.50:
        band = "Fair"
    elif score <= 4.50:
        band = "Marginal"
    else:
        band = "Unsatisfactory"

    return {"score": score, "band": band}

## Caching Strategy — Redis

Cache all computed ratio sets and model outputs.
Never cache raw financial statement data — always recompute from source.

Cache TTL guidelines:
- CAMEL ratios: 24 hours (updated at most once per day)
- Valuation model outputs: 1 hour (depends on market price)
- Sector aggregates: 6 hours
- Screener results: 5 minutes (filters change frequently)
- Market prices: 15 minutes
- Macro data: 6 hours

Cache invalidation:
- When admin enters new financial data, invalidate all related bank caches
- When market prices update, invalidate valuation caches for affected banks
- Never serve stale valuation data without a staleness warning

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
BANK_NOT_FOUND: bank_id does not exist
DATA_NOT_AVAILABLE: data exists but not for requested period
INSUFFICIENT_TIER: user tier does not permit this endpoint
COMPUTATION_ERROR: financial model could not be computed with available data
VALIDATION_ERROR: request parameters failed validation

## API Versioning
All endpoints are prefixed with /api/v1/
When breaking changes are needed, create /api/v2/ routes
Never modify existing v1 endpoints in a breaking way
Deprecate with a warning header before removing

## Testing Requirements
Every router must have integration tests in tests/test_api.py
Every service must have unit tests with known financial inputs and expected outputs
Financial model tests must include:
- Normal case with expected output
- Edge case: division by zero
- Edge case: negative values
- Edge case: insufficient data
- Edge case: r <= g for DDM
