Title: Add global security middleware and validation in `main.ts`

Description
---
Enhance `src/main.ts` with common security and validation middlewares: `helmet`, `cookie-parser`, global `ValidationPipe`, CORS from config, and optional rate limiting for auth endpoints.

Rationale
---
- These middlewares provide baseline security (headers, input validation, cookie parsing) and help protect auth endpoints.

Files to update
---
- `src/main.ts`

Acceptance criteria / Steps
---
1. Add imports and registration for `helmet`, `cookie-parser`, and global `ValidationPipe({ whitelist: true, transform: true })`.
2. Enable CORS with allowed origins from config (e.g., `CORS_ORIGIN` env var).
3. Optionally add `express-rate-limit` for `/auth/login` and `/auth/refresh` routes.
4. Add unit or e2e tests to validate middleware is active (optional).

Suggested labels
---
- security
- backend
