Title: Add `kid` header support and key rotation strategy

Description
---
Add support for `kid` (key id) header in JWTs and implement a key rotation strategy so multiple keys can be supported and rotated without downtime.

Rationale
---
- A `kid` header allows the verifier to choose the correct public key when multiple keys exist. This enables safe key rotation.

Files to update
---
- JWT signing code (where `jwtService.sign` is called)
- Key loader and configuration: `src/auth/config.util.ts`, `src/auth/access-token/*`, `src/auth/refresh-token/*`

Acceptance criteria / Steps
---
1. Add support for adding a `kid` to JWT header when signing.
2. Maintain a key registry mapping `kid` → public key for verification.
3. Provide scripts/docs for rotating keys (generate new key pair, upload public key, update signer to use new kid, keep old keys for verification until expiry).

Suggested labels
---
- security
- infra
