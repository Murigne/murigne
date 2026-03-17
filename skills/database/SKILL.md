# Database Skill — Murigne Platform

## Purpose
This skill guides all agents on database design, schema conventions,
migrations, and query patterns for Murigne.
Murigne's PostgreSQL database is the single source of truth for all
financial data. It must be correct, versioned, and auditable.

## Core Principle — Data Integrity Above All
Financial data that is wrong is worse than no data.
Every design decision prioritises:
1. Data integrity — constraints enforce correctness at the database level
2. Auditability — every change is traceable to a source and timestamp
3. Versioning — restated financials are preserved, never overwritten
4. Queryability — indexes support the screener and dashboard query patterns

## Database Technology
PostgreSQL 16 with asyncpg for async Python access.
Alembic for schema migrations.
Never use an ORM for financial queries — write SQL directly for
full control over query plans and joins.
Use SQLAlchemy Core (not ORM) only for migration management.

## Row Level Security
Murigne does NOT use PostgreSQL Row Level Security (RLS).
Tier-based access control is enforced entirely at the FastAPI layer
via Clerk JWT verification and the require_tier() dependency.
See skills/backend-api/SKILL.md for the auth dependency pattern.
Do not introduce RLS policies without explicit instruction from the Mayor.

## Connection Pool Configuration
Use asyncpg's built-in connection pool. Configure per environment.

# db/connection.py
import asyncpg
import os

_pool: asyncpg.Pool | None = None

async def init_db():
    global _pool
    _pool = await asyncpg.create_pool(
        dsn=os.getenv("DATABASE_URL"),
        min_size=2,
        max_size=10,          # suitable for Railway/Render hobby tier
        max_inactive_connection_lifetime=300,
        command_timeout=30,
    )

async def close_db():
    if _pool:
        await _pool.close()

async def get_db() -> asyncpg.Pool:
    return _pool

# Environment sizing guidance:
# Development / Railway starter: min_size=2, max_size=5
# Production / Railway pro:      min_size=5, max_size=20
# Never set max_size above the PostgreSQL max_connections limit (100 default)

## Schema Design Conventions

### Naming Conventions
- Tables: snake_case, plural nouns (banks, camel_ratios, financial_statements)
- Columns: snake_case (bank_id, npl_ratio, reporting_period)
- Primary keys: always id UUID DEFAULT gen_random_uuid()
- Foreign keys: [referenced_table_singular]_id (bank_id, statement_id)
- Timestamps: created_at, updated_at — always present on every table
- Boolean flags: is_[adjective] (is_audited, is_latest, is_restated)
- Indexes: idx_[table]_[column(s)] (idx_camel_ratios_bank_id_period)

### Standard Columns (every table must have these)
id         UUID        PRIMARY KEY DEFAULT gen_random_uuid()
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

### updated_at Trigger
Every table must have this trigger applied to keep updated_at current.
Define the function once and apply to all tables.

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to each table:
CREATE TRIGGER trg_banks_updated_at
    BEFORE UPDATE ON banks
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Repeat for every table that has updated_at.
-- Every migration that creates a new table must also create its trigger.

### Soft Deletes
Never hard delete financial data.
Add is_deleted BOOLEAN NOT NULL DEFAULT FALSE where deletion is needed.
Filter with WHERE is_deleted = FALSE in all queries.

## Core Schema

### banks table
CREATE TABLE banks (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    ticker       VARCHAR(10)  NOT NULL UNIQUE,
    name         VARCHAR(255) NOT NULL,
    short_name   VARCHAR(50)  NOT NULL,
    listing_date DATE         NOT NULL,
    sector       VARCHAR(100) NOT NULL DEFAULT 'Banking',
    is_active    BOOLEAN      NOT NULL DEFAULT TRUE,
    logo_url     VARCHAR(500),
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_banks_ticker    ON banks(ticker);
CREATE INDEX idx_banks_is_active ON banks(is_active);

CREATE TRIGGER trg_banks_updated_at
    BEFORE UPDATE ON banks
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

### financial_statements table
Stores raw financial statement line items.
Every row is immutable once inserted — restatements add new rows.
Never UPDATE or DELETE a row in this table.

CREATE TABLE financial_statements (
    id                   UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_id              UUID         NOT NULL REFERENCES banks(id),
    statement_type       VARCHAR(20)  NOT NULL CHECK (
        statement_type IN ('income_statement', 'balance_sheet', 'cash_flow')
    ),
    line_item            VARCHAR(100) NOT NULL,
    value_ghs            NUMERIC(20, 2) NOT NULL,
    period_start         DATE         NOT NULL,
    period_end           DATE         NOT NULL,
    period_type          VARCHAR(10)  NOT NULL CHECK (
        period_type IN ('annual', 'semi_annual', 'quarterly')
    ),
    source               VARCHAR(255) NOT NULL,
    is_audited           BOOLEAN      NOT NULL DEFAULT FALSE,
    is_restated          BOOLEAN      NOT NULL DEFAULT FALSE,
    restatement_reason   TEXT,
    original_statement_id UUID        REFERENCES financial_statements(id),
    is_latest            BOOLEAN      NOT NULL DEFAULT TRUE,
    entered_by           VARCHAR(100) NOT NULL,
    entered_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_financial_statements_bank_id
    ON financial_statements(bank_id);
CREATE INDEX idx_financial_statements_period
    ON financial_statements(period_end DESC);
CREATE INDEX idx_financial_statements_latest
    ON financial_statements(bank_id, is_latest, period_end DESC);
CREATE INDEX idx_financial_statements_type
    ON financial_statements(statement_type, line_item);

CREATE TRIGGER trg_financial_statements_updated_at
    BEFORE UPDATE ON financial_statements
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

### camel_ratios table
Stores computed CAMEL ratios. Ratios are recomputed from financial_statements
and stored here for query performance.
-- NUMERIC(4,2) stores values 0.00 to 99.99 — sufficient for scores 1.00-5.00.
-- The CHECK constraint is the authoritative guard on valid score range.

CREATE TABLE camel_ratios (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_id             UUID        NOT NULL REFERENCES banks(id),
    period_end          DATE        NOT NULL,
    period_type         VARCHAR(10) NOT NULL,
    component           VARCHAR(20) NOT NULL CHECK (
        component IN ('capital', 'asset_quality', 'management', 'earnings', 'liquidity')
    ),
    ratio_name          VARCHAR(100) NOT NULL,
    value               NUMERIC(10, 4),
    bog_benchmark       NUMERIC(10, 4),
    bog_benchmark_source VARCHAR(255),
    component_score     NUMERIC(4, 2) CHECK (component_score BETWEEN 1 AND 5),
    composite_score     NUMERIC(4, 2) CHECK (composite_score BETWEEN 1 AND 5),
    score_band          VARCHAR(20) CHECK (
        score_band IN ('Strong', 'Satisfactory', 'Fair', 'Marginal', 'Unsatisfactory')
    ),
    is_latest           BOOLEAN     NOT NULL DEFAULT TRUE,
    source_statement_ids UUID[]     NOT NULL,
    computed_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_camel_ratios_bank_period
    ON camel_ratios(bank_id, period_end DESC);
CREATE INDEX idx_camel_ratios_latest
    ON camel_ratios(bank_id, is_latest, period_end DESC);
CREATE INDEX idx_camel_ratios_screener
    ON camel_ratios(ratio_name, value) WHERE is_latest = TRUE;

CREATE TRIGGER trg_camel_ratios_updated_at
    BEFORE UPDATE ON camel_ratios
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

### valuation_outputs table
CREATE TABLE valuation_outputs (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_id             UUID        NOT NULL REFERENCES banks(id),
    model_type          VARCHAR(20) NOT NULL CHECK (
        model_type IN ('ddm', 'residual_income', 'pb_relative')
    ),
    computed_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    period_end          DATE        NOT NULL,
    input_assumptions   JSONB       NOT NULL,
    intrinsic_value_ghs NUMERIC(10, 4),
    justified_pb        NUMERIC(10, 4),
    actual_pb           NUMERIC(10, 4),
    valuation_signal    VARCHAR(20) CHECK (
        valuation_signal IN ('undervalued', 'fairly_valued', 'overvalued', 'not_applicable')
    ),
    error_code          VARCHAR(50),
    error_message       TEXT,
    is_latest           BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_valuation_outputs_bank
    ON valuation_outputs(bank_id, is_latest, computed_at DESC);

CREATE TRIGGER trg_valuation_outputs_updated_at
    BEFORE UPDATE ON valuation_outputs
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

### market_prices table
CREATE TABLE market_prices (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_id          UUID        NOT NULL REFERENCES banks(id),
    price_date       DATE        NOT NULL,
    closing_price_ghs NUMERIC(10, 4) NOT NULL,
    volume           BIGINT,
    market_cap_ghs   NUMERIC(20, 2),
    source           VARCHAR(100) NOT NULL DEFAULT 'GSE',
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(bank_id, price_date)
);

CREATE INDEX idx_market_prices_bank_date
    ON market_prices(bank_id, price_date DESC);

### macro_data table
CREATE TABLE macro_data (
    id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    indicator      VARCHAR(100) NOT NULL,
    value          NUMERIC(15, 4) NOT NULL,
    period_date    DATE        NOT NULL,
    period_type    VARCHAR(20) NOT NULL,
    source         VARCHAR(255) NOT NULL,
    source_url     VARCHAR(500),
    is_preliminary BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(indicator, period_date)
);

CREATE INDEX idx_macro_data_indicator_date
    ON macro_data(indicator, period_date DESC);

### users table
Minimal user data — Clerk manages auth, we store subscription tier only.

CREATE TABLE users (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_id            VARCHAR(100) NOT NULL UNIQUE,
    tier                VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (
        tier IN ('free', 'investor', 'professional', 'institutional', 'admin')
    ),
    tier_updated_at     TIMESTAMPTZ,
    paystack_customer_id VARCHAR(100),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_clerk_id ON users(clerk_id);

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

## Versioning Pattern for Restated Financials

When a bank restates financial data, always wrap in a transaction
to prevent concurrent reads seeing an inconsistent is_latest state.

-- Always use a transaction for restatements
async with pool.acquire() as conn:
    async with conn.transaction():
        # Step 1: mark existing rows as no longer latest
        await conn.execute(
            """
            UPDATE financial_statements
            SET is_latest = FALSE
            WHERE bank_id = $1
            AND statement_type = $2
            AND period_end = $3
            AND is_latest = TRUE
            """,
            bank_id, statement_type, period_end,
        )
        # Step 2: insert restated rows (is_latest = TRUE by default)
        await conn.executemany(
            """
            INSERT INTO financial_statements (
                bank_id, statement_type, line_item, value_ghs,
                period_start, period_end, period_type, source,
                is_audited, is_restated, restatement_reason,
                original_statement_id, entered_by
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
            """,
            restated_rows,
        )
        # Step 3: recompute and store CAMEL ratios for affected period
        await camel_service.recompute_and_store(conn, bank_id, period_end)

Never perform restatement steps outside a transaction.
Never set is_latest = TRUE on a new row before setting it FALSE on the old row.

## Query Patterns

### Always filter by is_latest = TRUE for current data
SELECT * FROM camel_ratios
WHERE bank_id = $1
AND is_latest = TRUE
ORDER BY period_end DESC
LIMIT 1;

### Screener query pattern
SELECT
    b.ticker,
    b.name,
    cr_car.value       AS car_ratio,
    cr_npl.value       AS npl_ratio,
    cr_roe.value       AS roe,
    cr_composite.composite_score
FROM banks b
JOIN camel_ratios cr_car ON
    cr_car.bank_id = b.id
    AND cr_car.ratio_name = 'car_ratio'
    AND cr_car.is_latest = TRUE
JOIN camel_ratios cr_npl ON
    cr_npl.bank_id = b.id
    AND cr_npl.ratio_name = 'npl_ratio'
    AND cr_npl.is_latest = TRUE
JOIN camel_ratios cr_roe ON
    cr_roe.bank_id = b.id
    AND cr_roe.ratio_name = 'roe'
    AND cr_roe.is_latest = TRUE
JOIN camel_ratios cr_composite ON
    cr_composite.bank_id = b.id
    AND cr_composite.ratio_name = 'composite'
    AND cr_composite.is_latest = TRUE
WHERE b.is_active = TRUE
AND ($1::numeric IS NULL OR cr_npl.value <= $1)
AND ($2::numeric IS NULL OR cr_roe.value >= $2)
AND ($3::numeric IS NULL OR cr_car.value >= $3)
ORDER BY cr_composite.composite_score ASC;

## Migration Conventions

Use Alembic for all schema changes.
Never modify the database schema directly — always use migrations.

### Migration naming
Format: YYYYMMDDHHMI_[description].py (include time to avoid same-day collisions)
Example: 202603151430_add_stress_test_scenarios_table.py

Every migration must have:
- upgrade() that applies the change
- downgrade() that fully reverses it
- A comment at the top explaining why the change was made

Never drop a column in a migration.
Mark deprecated columns with a comment and a is_deprecated flag first.
Remove in a subsequent migration only after confirming no code references it.

## Seed Data
Maintain seed data for the 7 Phase 1 banks in db/seeds/banks.sql.
Seed data must be idempotent — safe to run multiple times.
Use INSERT ... ON CONFLICT DO NOTHING.

-- Phase 1 banks — canonical list, must match financial-data/SKILL.md exactly
INSERT INTO banks (ticker, name, short_name, listing_date, is_active)
VALUES
    ('GCB',    'GCB Bank Limited',                  'GCB',      '1997-04-22', TRUE),
    ('EGH',    'Ecobank Ghana Limited',              'Ecobank',  '2004-11-11', TRUE),
    ('SCB',    'Standard Chartered Bank Ghana',      'StanChart','1996-11-20', TRUE),
    ('ABSA',   'Absa Bank Ghana Limited',            'Absa',     '2005-07-07', TRUE),
    ('STANBIC','Stanbic Bank Ghana Limited',         'Stanbic',  '2004-08-12', TRUE),
    ('CAL',    'CalBank PLC',                        'CalBank',  '2004-06-17', TRUE),
    ('ACCESS', 'Access Bank Ghana Limited',          'Access',   '2015-11-06', TRUE)
ON CONFLICT (ticker) DO NOTHING;

-- Note: Stanbic Bank Ghana Limited (ticker: STANBIC) is a Phase 1 bank.
-- Societe Generale Ghana was acquired by Vista Bank and is NOT in Phase 1.
-- Always verify the active bank list against the GSE official listings
-- before adding or modifying seed data.
