Title: Hash refresh tokens in the database

Description
---
Do not store raw refresh token strings in the database. Store only a secure hash of each refresh token (bcrypt or argon2), and compare hashes when validating tokens.

Rationale
---
- If the database is compromised, raw refresh tokens give immediate access. Hashing prevents attackers from using tokens directly.

Files to update
---
- `src/auth/refresh-token/refresh-token.entity.ts` (column rename or comment)
- `src/auth/refresh-token/refresh-token.service.ts`

Acceptance criteria / Steps
---
1. Use a secure hashing algorithm (bcrypt with strong cost or argon2) to hash refresh tokens before saving.
2. `findOneByToken` should decode the token to get the ID, load the DB record by ID, then compare the provided token (raw) with the stored hash using `compare`.
3. Keep `select: false` on the column exposed by TypeORM.
4. Add tests covering hashing and verification.

Suggested labels
---
- security
- backend
- auth
