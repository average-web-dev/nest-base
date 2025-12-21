Title: Rate-limit login and refresh endpoints

Description
---
Protect authentication endpoints (`/auth/login`, `/auth/refresh`) with rate-limiting middleware to prevent credential stuffing and brute-force attacks.

Rationale
---
- Rate limiting reduces the feasibility of automated attacks against auth endpoints.

Files to update
---
- `src/main.ts` (register middleware) or configure guard/middleware on auth routes

Acceptance criteria / Steps
---
1. Add `express-rate-limit` (or similar) and configure sensible defaults for auth endpoints (e.g., 5-10 attempts per minute per IP).
2. Add a configurable option via env variables for rate limits.
3. Add tests or manual verification steps.

Suggested labels
---
- security
- infra
