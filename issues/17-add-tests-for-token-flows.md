Title: Add unit and integration tests for token flows

Description
---
Add tests for access and refresh token flows: login, refresh rotation, reuse detection, revoke, and algorithm validation.

Rationale
---
- Tests prevent regressions and verify security behaviors.

Files/Areas to test
---
- `src/auth/access-token/*`
- `src/auth/refresh-token/*`
- `src/auth/auth.service.ts`

Acceptance criteria / Steps
---
1. Unit tests for `AccessTokenService.generateToken`, `RefreshTokenService.create`, and `findOneByToken` behaviors.
2. Integration tests for login → refresh → revoke flows (use an in-memory or test Postgres instance).
3. Tests for JWT algorithm rejection.

Suggested labels
---
- tests
- backend
