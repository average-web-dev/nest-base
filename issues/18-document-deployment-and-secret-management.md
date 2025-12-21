Title: Document deployment and secret management recommendations

Description
---
Add documentation describing recommended secret management approaches (Vault, AWS Secrets Manager), key rotation procedures, and deployment notes for JWT keys.

Rationale
---
- Clear deployment guidance reduces the risk of misconfigured secrets and simplifies onboarding.

Files to update
---
- `README.md`
- `PROJECT-TODO.md`

Acceptance criteria / Steps
---
1. Add a `Secrets & Keys` section in README describing options to store keys and env variables in production.
2. Add a short key rotation runbook (generate key, publish public key, update signing config, wait for old tokens to expire, remove old key).
3. Provide sample commands for using a secrets manager or mounting keys in Docker.

Suggested labels
---
- docs
- infra
