Title: Add structured logging for auth events

Description
---
Add structured logging for authentication events (token creation, refresh, revoke, reuse detection) with minimal sensitive data.

Rationale
---
- Logging aids incident response and monitoring for suspicious activity.

Files to update
---
- `src/auth/*` services and resolvers (where tokens are created/revoked)

Acceptance criteria / Steps
---
1. Add a logging utility or use Nest's `Logger` to emit structured logs (JSON) with event names, user IDs, and non-sensitive context.
2. Avoid logging raw tokens or secrets.
3. Add example log format and map to monitoring/alerting rules.

Suggested labels
---
- observability
- backend
