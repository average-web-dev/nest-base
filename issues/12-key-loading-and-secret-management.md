Title: Improve key loading and secret management

Description
---
Provide clearer key loading, validation, and support for secret managers (env values, Vault, AWS Secrets Manager) instead of file-only loading.

Rationale
---
- Production environments typically use secret managers. File-based keys may be OK for dev but need secure handling and clear errors for production.

Files to update
---
- `src/auth/config.util.ts`
- `README.md` and `.env.example`

Acceptance criteria / Steps
---
1. Add optional loading from environment variables (e.g., `JWT_ACCESS_PRIVATE_KEY`, `JWT_ACCESS_PUBLIC_KEY`) and from secret manager hooks.
2. Add validation and clear error messages when keys are malformed or unsupported.
3. Document recommended secret storage approaches in README.

Suggested labels
---
- infra
- security
