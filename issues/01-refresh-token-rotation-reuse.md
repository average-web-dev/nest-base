Title: Refresh token rotation and reuse detection

Description
---
Implement refresh-token rotation and reuse detection to prevent replay attacks and detect compromised tokens.

Rationale
---
- Without rotation, a stolen refresh token can be reused indefinitely until it expires.
- Detecting reuse of rotated or revoked tokens allows the system to revoke all tokens for a user and force re-authentication.

Files to update
---
- `src/auth/refresh-token/refresh-token.service.ts`
- The resolver/controller that handles the `refresh` endpoint (not present or locate where refresh handled)

Acceptance criteria / Steps
---
1. When a refresh token is presented and validated, issue a new refresh token and new access token.
2. Mark the old refresh token as revoked (or rotated) and store the new refresh token (hashed) in DB.
3. If a refresh token is presented that is already revoked or fails verification against the stored hash, treat this as reuse and revoke all refresh tokens for the user.
4. Add unit/integration tests for rotation, normal refresh, and reuse detection.

Suggested labels
---
- security
- backend
- auth
