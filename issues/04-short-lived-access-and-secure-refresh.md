Title: Short-lived access tokens & secure refresh handling

Description
---
Ensure access tokens are short-lived and refresh tokens are secured and rotated. Consider delivering refresh tokens via `HttpOnly`, `Secure` cookies for browser clients.

Rationale
---
- Short-lived access tokens reduce exposure from token theft. Cookies mitigate XSS exposure for refresh tokens.

Files to update
---
- `src/auth/access-token/access-token.config.ts`
- `src/auth/refresh-token/*`
- `src/main.ts` (cookie-parser and cookie handling)

Acceptance criteria / Steps
---
1. Default `ACCESS_TOKEN_EXPIRES_IN` to a short duration (e.g., `15m`) and document in `.env.example`.
2. Add cookie delivery option for refresh tokens with `HttpOnly`, `Secure`, `SameSite` attributes and rotate tokens on refresh.
3. Add tests and update README with recommended client-side usage.

Suggested labels
---
- security
- auth
- docs
