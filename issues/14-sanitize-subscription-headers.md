Title: Sanitize GraphQL subscription connectionParams before copying to headers

Description
---
The guard copies `connectionParams` into request headers for websocket subscriptions. Validate and normalize keys and values before copying.

Rationale
---
- Prevents malformed or unexpected header values from being injected into requests and avoids security or type errors.

Files to update
---
- `src/auth/access-token/access-token-auth.guard.ts`

Acceptance criteria / Steps
---
1. Only allow a whitelist of header keys (e.g., `authorization`, `x-forwarded-for`) to be copied.
2. Normalize header names to lowercase and ensure values are strings.
3. Add tests covering GraphQL WS connectionParam handling.

Suggested labels
---
- security
- graphql
