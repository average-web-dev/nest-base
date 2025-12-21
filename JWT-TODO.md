# JWT Implementation TODOs and Best Practices

This file summarizes recommended tasks to complete and harden the JWT implementation in this repository. It references the current code under `src/auth` and provides actionable steps and rationale.

IMPORTANT: Many tasks below reference existing files such as `src/auth/access-token/*`, `src/auth/refresh-token/*`, and `src/auth/access-token/access-token.config.ts` (for asymmetric keys). Review and implement the items in order of priority for security.

## Current quick observations

- Access token config supports symmetric (`JWT_ACCESS_SECRET`) and asymmetric keys (`JWT_ACCESS_PRIVATE_KEY_PATH` / `JWT_ACCESS_PUBLIC_KEY_PATH`). See `src/auth/access-token/access-token.config.ts`.
- Refresh token config mirrors the above. See `src/auth/refresh-token/refresh-token.config.ts`.
- Refresh tokens are persisted in DB as raw tokens in `RefreshToken.token` column (`src/auth/refresh-token/refresh-token.entity.ts`). The column is stored with `select: false`, but the raw token is still saved.
- `RefreshTokenService.create` signs a refresh token and persists it. `findOneByToken` uses `jwtService.verify` to extract the id then loads by id.
- `AccessTokenStrategy` uses `publicKey` or `secret` from config for validation.

## Priority TODOs (implement these first)

1. Refresh-token rotation & reuse detection
   - Implement rotation: when a refresh token is used to obtain a new access token, issue a new refresh token and revoke the previous one (or mark rotated). This prevents refresh-token replay.
   - Detect reuse: if a presented refresh token is already revoked or the token string does not match the stored hashed value (see hashing task), treat as token compromise and revoke all tokens for the user and require re-authentication.
   - Files to update: `src/auth/refresh-token/refresh-token.service.ts`, auth resolver that handles refresh.

2. Hash stored refresh tokens (don't store raw tokens)
   - Replace storing raw token with a secure bcrypt/argon2 hash of the token string. Keep `select: false` and compare using `compare` during verification.
   - This prevents a DB leak from revealing usable refresh tokens.
   - Update: `RefreshToken.entity.ts` (no schema change needed beyond storing the hash), `RefreshTokenService.create`, `findOneByToken` logic (must verify token string against stored hash rather than using `jwtService.verify` to find id). Consider storing `jti` (token id) inside JWT payload and keep DB indexed by `id`.

3. Ensure JWT algorithm is validated when verifying
   - Configure `jwtService.verify` / Passport JWT strategy to require the expected algorithm. Right now algorithm comes from `signOptions`, but explicit check on verify helps prevent alg=none or algorithm downgrade attacks.
   - Files to update: `src/auth/access-token/access-token.strategy.ts`, `refresh-token` verification points.

4. Short-lived access tokens + secure refresh-token storage
   - Keep access tokens short (minutes). Refresh tokens should be long-lived and rotated.
   - Consider delivering refresh tokens via `HttpOnly`, `Secure` cookies to mitigate XSS if you serve browser clients. Add server-side cookie helpers and CSRF protections.

5. Add tests for token flows
   - Unit + integration tests for: login (access + refresh), refresh flow (rotation + reuse detection), revoke, token validation failures, asymmetric signing/verification.

## Best Practices and Additional Improvements

6. Use `kid` header + key rotation strategy
   - Add `kid` (key id) header to JWTs so verification can choose the correct public key. This makes rotating keys safe.
   - Provide a `keys` directory or secrets manager mapping and a rotation plan.

7. Use secure algorithms and sufficient key sizes
   - Prefer `RS256` or `ES256` when using asymmetric keys. If using symmetric HMAC, use at least HS256 but prefer migrating to asymmetric for better key management.

8. Protect refresh endpoints with rate limiting and monitoring
   - Rate-limit token endpoints (login, refresh) to mitigate brute-force and token stuffing.
   - Log suspicious activity and consider alerting for repeated failures or reuse detection.

9. Add refresh token expiry and sliding expiration considerations
   - Current code stores `expiresAt` from JWT `exp`. Consider sliding-expiry (extend `expiresAt` on rotation) or keep fixed expiry and force re-login after max lifetime.

10. Securely load keys from environment or secret manager
    - `loadKeys` currently loads from file paths. For production, prefer using a secrets manager (Vault, AWS Secrets Manager) or mount keys through secure volumes. Ensure file permissions are restrictive.

11. Minimize JWT payload and avoid sensitive data
    - Do not include sensitive data (passwords, PII) in the token payload. Keep payload minimal (e.g., `rtid`, `type`, `sub` if needed).

12. Implement revocation lists or token introspection for extra control
    - You already store refresh tokens which enables revocation. Consider centralizing revocation checks and caching them for performance.

13. Document secrets and deployment steps
    - Add `.env.example` with recommended env var names and placeholders for private/public key paths or values.

14. Add graceful handling for token verification failures
    - Standardize error messages and status codes for expired/invalid tokens. Avoid leaking reason details that could aid attackers.

## Suggested Implementation Steps (concrete)

1. Update `RefreshTokenService.create`:
   - Sign the JWT with a payload containing `id` and `type` (already done).
   - Compute a hash of the token string (bcrypt/argon2) and store the hash in DB, not the raw token. Keep `token` column name but store hashed value or rename to `tokenHash`.

2. Update `findOneByToken(tokenString)`:
   - Use `jwtService.decode` (without verification) to extract `id` (or `jti`) first.
   - Load refresh token DB row by `id`.
   - Verify JWT signature with `jwtService.verify` using correct options (algorithm check).
   - Compare provided token string with stored hash using `compare`.
   - If hash matches and token not revoked and not expired, proceed; else handle reuse/revocation.

3. Add a refresh endpoint flow:
   - Accept refresh token.
   - Validate token and DB hash.
   - If valid: create new refresh token (rotation), mark old one revoked (or rotated) and return new access + refresh tokens.
   - If invalid and DB entry shows token previously revoked: treat as reuse and revoke all tokens for user (security event).

4. Add tests for the flow and edge cases.

## Example environment variables to document

- `JWT_ACCESS_SECRET` (symmetric) or `JWT_ACCESS_PRIVATE_KEY_PATH` and `JWT_ACCESS_PUBLIC_KEY_PATH` (asymmetric)
- `JWT_ACCESS_ALGORITHM` (e.g. `RS256`)
- `JWT_REFRESH_SECRET` or `JWT_REFRESH_PRIVATE_KEY_PATH` and `JWT_REFRESH_PUBLIC_KEY_PATH`
- `JWT_REFRESH_ALGORITHM`
- `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`

## References to your files

- `src/auth/access-token/access-token.config.ts` — current config loader (supports asymmetric keys)
- `src/auth/access-token/access-token.service.ts` — access token generation
- `src/auth/access-token/access-token.strategy.ts` — passport strategy for access tokens
- `src/auth/refresh-token/refresh-token.service.ts` — creation and lookup of refresh tokens
- `src/auth/refresh-token/refresh-token.entity.ts` — refresh token DB model

---

If you'd like, I can:

- Implement the refresh-token rotation + hashing change in code with tests (I can open a PR-style patch), or
- Add a `.env.example` file and a short doc section in `README.md` showing an asymmetric key example, or
- Implement a small test suite for token flows.

Which of these would you like me to do next? 
