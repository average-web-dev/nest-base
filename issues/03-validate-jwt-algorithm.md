Title: Validate JWT algorithm during verification

Description
---
Ensure JWT verification enforces the expected algorithm to avoid algorithm downgrade or `alg=none` attacks.

Rationale
---
- Explicitly checking allowed algorithms during verify limits token forgery attempts and misconfiguration.

Files to update
---
- `src/auth/access-token/access-token.strategy.ts`
- places where `jwtService.verify` is called (e.g., `src/auth/refresh-token/refresh-token.service.ts`)

Acceptance criteria / Steps
---
1. Configure Passport JWT strategy with `algorithms` option or validate the token header `alg` before accepting tokens.
2. Update any `verify` calls to pass `algorithms: [expectedAlgorithm]`.
3. Add tests that reject tokens with unexpected `alg` headers.

Suggested labels
---
- security
- auth
