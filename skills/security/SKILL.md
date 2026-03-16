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
Four tiers must be enforced on every protected route and API endpoint:

free: basic bank profiles, 3-year data, limited CAMEL ratios
investor: full 5-year history, all CAMEL ratios, DDM/RI valuation, screener
professional: everything in investor plus stress testing, fixed income, data export
institutional: full API access, VaR/CVaR, portfolio attribution, data licensing

### Route Protection Rules
- All pages except home, login, and public bank profiles require authentication
- Premium features require investor tier or above
- Admin data entry routes require a separate admin role
- API routes must verify the session server-side on every request
- Never trust client-side tier checks alone — always verify on the server

### Clerk Implementation Pattern
Use clerkMiddleware in middleware.ts to protect all non-public routes.
Use auth() in Server Components to check tier before rendering premium content.
Use auth() in API routes to verify session and tier server-side.
Always return 401 for unauthenticated requests and 403 for unauthorized tier.

## Input Validation — Zod

Every API endpoint must validate all inputs with Zod before processing.
Never trust any input from the client — validate everything server-side.

### Validation Rules
- All numeric inputs: validate min, max, and type
- All string inputs: validate length, pattern, and allowed values
- All date inputs: validate format and reasonable range
- All enum inputs: validate against allowed values explicitly
- Never use parseInt or parseFloat without Zod validation
- Reject requests with unexpected fields using z.object().strict()
- Always use safeParse and return 400 with error details on failure

## SQL Injection Prevention

All database queries must use parameterized queries.
Never interpolate user input into SQL strings under any circumstance.

Safe pattern: use tagged template literals with postgres.js
sql`SELECT * FROM banks WHERE npl_ratio < ${validatedValue}`

Never use sql.unsafe() or string concatenation to build queries.
Never use raw user input in ORDER BY, table names, or column names.
If dynamic column sorting is needed, validate against a strict allowlist of column names.

## API Security

### Rate Limiting
Every API endpoint must have rate limiting using Upstash Ratelimit.
Standard endpoints: 100 requests per minute per user.
Auth endpoints: 10 requests per minute per IP.
Data export endpoints: 10 requests per hour per user.
Always return 429 with a Retry-After header when rate limit is exceeded.

### CORS Configuration
Only allow requests from the Murigne domain.
Never use wildcard CORS in production.
Configure in next.config.ts headers for all /api/* routes.

### Security Headers
Add to next.config.ts for all responses:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()
- Content-Security-Policy: configured per environment

## Sensitive Data Rules

### Never Log
- User passwords or password hashes
- API keys, tokens, or session contents
- Payment card data or payment tokens
- User email addresses in error logs
- Financial model inputs that could identify trading strategies

### Environment Variables
All secrets must be in environment variables.
Never commit secrets to git.

Required environment variables:
CLERK_SECRET_KEY
CLERK_PUBLISHABLE_KEY
DATABASE_URL
REDIS_URL
PAYSTACK_SECRET_KEY
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY

Always maintain .env.example with all required keys but no values.
Always add .env and .env.local to .gitignore before first commit.

### API Response Rules
Never include in API responses:
- Internal database IDs beyond what the client needs
- Other users data
- Server file paths or internal system information
- Stack traces in production
- Unvalidated data from the database

## Payment Security — Paystack

Never handle raw card data — always use Paystack hosted fields.
Always verify payment webhooks server-side using HMAC SHA-512 signature
verification before granting any tier access.
Never upgrade a user tier based on client-side confirmation alone.
Always wait for webhook verification before updating user metadata in Clerk.

## Security Checklist (complete before every PR)
- [ ] All API routes verify authentication server-side
- [ ] All API routes enforce tier-based access control
- [ ] All inputs validated with Zod before processing
- [ ] All database queries use parameterized queries
- [ ] No secrets in code or git history
- [ ] .env.example updated with any new environment variables
- [ ] Rate limiting applied to all new endpoints
- [ ] No sensitive data in API responses
- [ ] No sensitive data in logs
- [ ] Security headers configured
- [ ] Paystack webhooks verified server-side
