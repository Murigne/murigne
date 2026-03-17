# Security Skill — Murigne Platform

## Purpose
This skill guides all agents on security requirements for Murigne.
Murigne handles investor data, tiered subscription access, financial model
outputs, and payment flows. A security breach would destroy user trust
and potentially expose sensitive financial information.

Security is not optional and is never deferred to a later sprint.
Every feature must be secure before it is marked complete.

## Authentication — Clerk

Murigne uses Clerk for authentication and access control.
Never build custom auth — always use Clerk.

### Tier Access Levels
Five tiers must be enforced on every protected route and API endpoint:

free: registered, basic bank profiles, 3-year data, limited CAMEL ratios
investor: full 5-year history, all CAMEL ratios, DDM/RI valuation, screener
professional: everything in investor plus stress testing, fixed income, data export
institutional: full API access, VaR/CVaR, portfolio attribution, data licensing
admin: internal team — data entry endpoints, all data, no financial gate

This list must match the tier definitions in skills/backend-api/SKILL.md exactly.
If tiers change, update both skills in the same commit.

### Route Protection Rules
- All pages except home, login, and public bank profiles require authentication
- Premium features require investor tier or above
- Admin data entry routes require admin tier
- API routes must verify the session server-side on every request
- Never trust client-side tier checks alone — always verify on the server
- Always return 401 for unauthenticated requests
- Always return 403 for authenticated but insufficient tier

### Clerk Implementation Pattern — Next.js
Use clerkMiddleware in middleware.ts to protect all non-public routes.
Use auth() in Server Components to check tier before rendering premium content.
Use auth() in API routes (if any) to verify session and tier server-side.

### CSRF
Next.js App Router with Server Actions includes built-in CSRF protection
via the SameSite cookie attribute managed by Clerk.
Do not build custom CSRF tokens — Clerk handles this.
Never expose Server Actions to unauthenticated callers without explicit
Clerk auth() verification inside the action.

## Input Validation

Input validation is split by layer. Use the right tool for each layer.

### Frontend and Next.js Layer — Zod
Use Zod for validating all form inputs and URL search parameters
in Next.js Server Components, Server Actions, and any Next.js API routes.

import { z } from 'zod'

const screenerSchema = z.object({
    nplMax: z.number().min(0).max(100).optional(),
    roeMin: z.number().min(-100).max(100).optional(),
    carMin: z.number().min(0).max(100).optional(),
}).strict()  // reject unexpected fields

const result = screenerSchema.safeParse(params)
if (!result.success) {
    return { error: result.error.flatten() }
}

Always use safeParse — never parse (throws on failure).
Always use .strict() to reject unexpected fields.
Always return 400 with error details on validation failure.

### Backend Layer — Pydantic v2
Use Pydantic v2 for validating all inputs to FastAPI endpoints.
See skills/backend-api/SKILL.md for Pydantic schema patterns.
Pydantic is the authoritative validator for all FastAPI routes —
never bypass it with raw request body access.

from pydantic import BaseModel, field_validator
from typing import Annotated
from fastapi import Query

class ScreenerParams(BaseModel):
    npl_max: Annotated[float | None, Query(ge=0, le=100)] = None
    roe_min: Annotated[float | None, Query(ge=-100, le=100)] = None
    car_min: Annotated[float | None, Query(ge=0, le=100)] = None

Never use int() or float() to parse user input directly.
Always validate numeric ranges explicitly.
Always validate enum inputs against an explicit list of allowed values.

## SQL Injection Prevention

All database queries use asyncpg parameterized queries with $1, $2 placeholders.
Never interpolate user input into SQL strings under any circumstance.
Never use string concatenation or f-strings to build SQL.

Safe pattern:
rows = await conn.fetch(
    "SELECT * FROM camel_ratios WHERE bank_id = $1 AND value <= $2",
    bank_id, validated_value
)

Never unsafe:
rows = await conn.fetch(f"SELECT * FROM camel_ratios WHERE bank_id = '{bank_id}'")

Dynamic column sorting — validate against a strict allowlist before use:
ALLOWED_SORT_COLUMNS = {'npl_ratio', 'car_ratio', 'roe', 'composite_score'}

if sort_column not in ALLOWED_SORT_COLUMNS:
    raise HTTPException(status_code=400, detail="Invalid sort column")

query = f"SELECT * FROM camel_ratios ORDER BY {sort_column} {direction}"
# Safe only because sort_column was validated against the allowlist above

## API Security

### Rate Limiting
Every API endpoint must have rate limiting via Upstash Ratelimit.
Standard endpoints: 100 requests per minute per user
Auth endpoints: 10 requests per minute per IP
Data export endpoints: 10 requests per hour per user
Always return 429 with a Retry-After header when rate limit is exceeded.

### CORS Configuration
CORS is configured in the FastAPI backend via the ALLOWED_ORIGINS
environment variable. See skills/backend-api/SKILL.md for the setup.

Two categories of endpoints require different CORS treatment:

1. Standard API endpoints (/api/v1/*):
   Only allow requests from the Murigne frontend domain.
   Never use wildcard (*) CORS in production.
   ALLOWED_ORIGINS=https://murigne.com in production.
   ALLOWED_ORIGINS=http://localhost:3000 in development.

2. Paystack webhook endpoint (/api/v1/webhooks/paystack):
   Must be EXEMPT from CORS restrictions entirely.
   Paystack POSTs from its own servers, not from the Murigne frontend.
   Apply NO CORSMiddleware to this route — handle it in a separate router
   mounted before the CORSMiddleware is applied, or exclude it explicitly.

### Security Headers — Next.js
Add to next.config.ts for all responses:

const securityHeaders = [
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()'
    },
    {
        key: 'Content-Security-Policy',
        value: [
            "default-src 'self'",
            // Clerk auth
            "script-src 'self' 'unsafe-inline' https://clerk.murigne.com",
            // ECharts and TradingView use canvas — no additional script src needed
            // Geist font from Vercel
            "font-src 'self' https://fonts.gstatic.com",
            // Clerk hosted UI
            "frame-src https://clerk.murigne.com",
            // API calls to FastAPI backend
            "connect-src 'self' https://api.murigne.com wss://api.murigne.com",
            // Images: self plus GSE logos
            "img-src 'self' data: https:",
            "style-src 'self' 'unsafe-inline'",
        ].join('; ')
    },
]

// Apply in next.config.ts:
headers: async () => [
    {
        source: '/(.*)',
        headers: securityHeaders,
    },
]

// Note: 'unsafe-inline' in script-src is required by Clerk.
// Review and tighten the CSP when Clerk releases nonce support.
// Never add 'unsafe-eval' — ECharts and TradingView do not require it.

### HTTPS and TLS
Vercel enforces HTTPS automatically on all deployments — no configuration needed.
Railway requires TLS to be enabled explicitly in the service settings.
Never deploy the FastAPI backend on Railway without TLS enabled.
Never set ALLOWED_ORIGINS to an http:// URL in production.

## Sensitive Data Rules

### Never Log
- User passwords or password hashes
- API keys, tokens, or session contents
- Payment card data or payment tokens
- User email addresses in error logs
- Financial model inputs that could identify trading strategies
- Stack traces in production error responses

### Environment Variables
All secrets must be in environment variables.
Never commit secrets to git.

Required environment variables (keep .env.example current):
CLERK_SECRET_KEY
CLERK_PUBLISHABLE_KEY
CLERK_JWKS_URL
DATABASE_URL
ALLOWED_ORIGINS
REDIS_URL
PAYSTACK_SECRET_KEY
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY

Always maintain .env.example with all required keys and no values.
Always add .env and .env.local to .gitignore before first commit.

### API Response Rules
Never include in API responses:
- Internal database UUIDs beyond what the client needs for navigation
- Other users' data
- Server file paths or internal system information
- Stack traces in production
- Unvalidated data directly from the database

## Payment Security — Paystack

Never handle raw card data — always use Paystack hosted fields.

### Webhook Verification
Always verify Paystack webhook signatures server-side using HMAC SHA-512
before taking any action on a payment event.

import hmac
import hashlib

def verify_paystack_webhook(payload: bytes, signature: str) -> bool:
    secret = os.getenv("PAYSTACK_SECRET_KEY").encode()
    expected = hmac.new(secret, payload, hashlib.sha512).hexdigest()
    return hmac.compare_digest(expected, signature)

# In the webhook endpoint:
@router.post("/webhooks/paystack")
async def paystack_webhook(request: Request):
    payload = await request.body()
    signature = request.headers.get("x-paystack-signature", "")
    if not verify_paystack_webhook(payload, signature):
        raise HTTPException(status_code=400, detail="Invalid signature")
    # Only process after signature is verified
    event = json.loads(payload)
    # ...

Never upgrade a user tier based on client-side confirmation alone.
Always wait for webhook signature verification before updating
user metadata in Clerk.
Never process the same webhook event twice — store event IDs and
check for duplicates before acting.

## Security Checklist (required before every bead is marked done)
- [ ] All API routes verify authentication server-side via Clerk
- [ ] All API routes enforce tier-based access control (all 5 tiers)
- [ ] Frontend inputs validated with Zod
- [ ] Backend inputs validated with Pydantic v2
- [ ] All database queries use asyncpg parameterized queries
- [ ] Dynamic sort columns validated against allowlist
- [ ] No secrets in code or git history
- [ ] .env.example updated with any new environment variables
- [ ] Rate limiting applied to all new endpoints
- [ ] No sensitive data in API responses
- [ ] No sensitive data in logs or error messages
- [ ] Security headers configured in next.config.ts
- [ ] CSP does not include unsafe-eval
- [ ] Paystack webhook endpoint exempt from CORS
- [ ] Paystack webhooks verified via HMAC SHA-512
- [ ] Webhook event IDs checked for duplicate processing
- [ ] Railway TLS enabled for FastAPI backend
