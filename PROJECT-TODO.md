# Project TODOs and JWT Best Practices (consolidated)

This file consolidates project-wide TODOs and the JWT-specific TODOs into a single, prioritized list. It summarizes issues found across the repository and gives actionable steps and best practices to harden authentication, configuration, and app security.

## Quick observations

- The project supports both symmetric and asymmetric JWTs (see `src/auth/access-token/access-token.config.ts` and `src/auth/refresh-token/refresh-token.config.ts`). The key loader `src/auth/config.util.ts` derives algorithms from key types.
- Refresh tokens are persisted in the DB (`src/auth/refresh-token/refresh-token.entity.ts`) and currently stored as raw token strings (column has `select: false`).
- Access tokens are short-lived JWTs created by `src/auth/access-token/access-token.service.ts` and validated in `src/auth/access-token/access-token.strategy.ts`.

## High-priority tasks (security & correctness)

1. Refresh-token rotation & reuse detection
   - Implement rotation: when a refresh token is used to obtain a new access token, issue a new refresh token and revoke the previous one (or mark rotated). Prevent refresh-token replay.
   - Detect reuse: if a presented refresh token is already revoked or the presented token string doesn't match the stored (hashed) value, treat as token compromise and revoke all tokens for the user.
   - Files: `src/auth/refresh-token/refresh-token.service.ts`, auth resolver that handles refresh.

2. Hash stored refresh tokens (don't store raw tokens)
   - Use bcrypt/argon2 to store a hash of the refresh token instead of the raw token. Keep DB column `select: false` and rename to `tokenHash` or similar for clarity.
   - Update: `RefreshToken.entity.ts`, `RefreshTokenService.create`, and `findOneByToken` logic.

3. Validate JWT algorithm during verify
   - Explicitly validate the `alg` when verifying tokens to avoid algorithm downgrade or `alg=none` issues. Configure `jwtService.verify` and Passport strategy options accordingly.
   - Files: `src/auth/access-token/access-token.strategy.ts`, `refresh-token` verification code.

4. Short-lived access tokens + secure refresh-token handling
   - Use short access token lifetimes (minutes). Rotate refresh tokens and consider delivering refresh tokens via `HttpOnly`, `Secure` cookies for browser clients to mitigate XSS.

5. Env var name inconsistencies
   - Standardize environment variable names across the project. `src/config/env.validation.ts` expects `APP_PORT` while other parts use `PORT`. Unify to recommended names: `PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_*`.

6. Disable `synchronize` in production and add migrations
   - `src/database/database.config.ts` uses `synchronize: true`. Set it to `false` for production and add TypeORM migrations plus npm scripts for generating and running migrations.

7. Add global security middleware and validation
   - Enhance `src/main.ts` to register: global `ValidationPipe` (`whitelist: true`, `transform: true`), `helmet()`, `cookie-parser`, CORS configured from env, and optional rate-limiter on auth endpoints.

8. Fix `UsersService.findOneWithPassword` query builder
   - Use a proper alias and query text, e.g. `createQueryBuilder('user').where('user.id = :id', { id }).addSelect('user.password').getOne()`.

9. Make GraphQL playground / graphiql dev-only
   - In `src/graphql/graphql.module.ts`, enable `graphiql` and introspection only when `NODE_ENV !== 'production'`.

10. Typo: rename `curent-user.decorator.ts` to `current-user.decorator.ts`
    - Rename file and update imports to avoid confusion.

## Medium-priority recommendations (hardening & maintainability)

11. Use `kid` header + key rotation strategy
    - Add `kid` to JWT headers so the verifier can select the proper key when keys rotate. Maintain a key registry or use a secret manager.

12. Improve key loading and secrets management
    - `src/auth/config.util.ts` reads files; add support and documentation for loading keys from environment variables or secret managers (Vault, AWS Secrets Manager). Validate keys and provide clear error messages.

13. Avoid creating per-module `PubSub` instances
    - Provide a single `PubSub` provider and inject it into resolvers to keep subscription events consistent.

14. Sanitize GraphQL subscription header handling
    - In `src/auth/access-token/access-token-auth.guard.ts`, normalize and validate `connectionParams` before copying to headers.

15. Add structured logging for auth events
    - Log token create/revoke/rotation/reuse detection events with minimal sensitive data.

16. Add rate-limiting and monitoring for auth endpoints
    - Protect `login` and `refresh` endpoints from brute force and abuse.

17. Add tests for token flows
    - Unit + integration coverage for login, refresh rotation, reuse detection, revoke, and algorithm validation.

## Low-priority / nice-to-have

- Add `trusted proxy` configuration if running behind a load balancer.
- Commit generated schema assets in CI or create a generation/commit workflow.
- Provide a `docker-compose.dev.yml` with Postgres and a helper script for migrations.

## Concrete implementation steps (detailed)

1. Refresh-token storage & verification
   - Sign refresh JWT with payload containing `id` (jti) and `type`.
   - Store only a bcrypt/argon2 hash of the token in DB and keep `select: false`.
   - `findOneByToken(tokenString)` should: decode (without verify) to get `id`, load DB row, verify the JWT signature (algorithm check), then compare the raw token to stored hash. On mismatch or revoked token, handle reuse/revocation.

2. Rotation flow
   - When a refresh request is accepted: create new refresh token, save new hash, revoke old token (mark revoked and delete or keep as audit), return new tokens.
   - On detecting reuse (presented token revoked or hash mismatch but DB shows token present), revoke all user tokens and force re-login.

3. Algorithm validation
   - Configure `jwtService.verify` and Passport strategies to require the assigned algorithm (or validate `alg` in the header) and prefer asymmetric algorithms (RS256/ES256) for production.

4. Environment & key management
   - Add `.env.example` documenting symmetric and asymmetric setups (private/public key paths, or env var values) and recommended variable names. Document using a secrets manager for production.

5. `main.ts` hardening
   - Add the following (examples):

```ts
app.use(helmet());
app.enableCors({ origin: config.get('CORS_ORIGIN') });
app.use(cookieParser());
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
```

6. Migrations
   - Set `synchronize: false` in `database.config.ts` and add npm scripts for generating/running TypeORM migrations.

## Suggested environment variables

- `PORT`
- `NODE_ENV`
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_ACCESS_SECRET` or `JWT_ACCESS_PRIVATE_KEY_PATH` and `JWT_ACCESS_PUBLIC_KEY_PATH`
- `JWT_ACCESS_ALGORITHM` (e.g. `RS256`)
- `JWT_REFRESH_SECRET` or `JWT_REFRESH_PRIVATE_KEY_PATH` and `JWT_REFRESH_PUBLIC_KEY_PATH`
- `JWT_REFRESH_ALGORITHM`, `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`

## References to repository files

- JWT: `src/auth/access-token/*`, `src/auth/refresh-token/*`, `src/auth/config.util.ts`
- Config: `src/config/env.validation.ts`, `src/config/config.module.ts`
- Database: `src/database/database.config.ts`
- Main: `src/main.ts`
- GraphQL: `src/graphql/graphql.module.ts`
- Users: `src/users/*`

---

Next steps I can implement now (pick any):

- Create `.env.example` and unify env names across code & README.
- Patch `src/main.ts` to add global security middleware and validation.
- Implement refresh-token rotation + hashing (code + tests).
- Rename `curent-user.decorator.ts` and fix imports.

Which would you like me to do first?

# Project-wide TODOs and Best Practices (code review)

This file summarizes issues and recommended tasks I found when reviewing the rest of the codebase (beyond JWT). Each item is actionable and references code locations in the repository.

## High-priority issues (fix these first)

1. Env var name inconsistencies
   - Problem: `src/config/env.validation.ts` expects `APP_PORT`, while other code/readme refers to `PORT` or `NODE_ENV` / `PORT`. The README and `database` config also use different names (`DB_USER` vs `DB_USERNAME`). Inconsistent env names lead to confusion and misconfiguration.
   - Fix: Standardize env names (recommend `PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_*`). Update `env.validation.ts`, `README.md`, and `.env.example` accordingly.

2. TypeORM `synchronize: true` in production
   - Problem: `src/database/database.config.ts` enables `synchronize: true`. This auto-migrates the DB schema at runtime and is dangerous in production (can drop/modify columns unexpectedly).
   - Fix: Set `synchronize: false` by default, add migrations support, and provide a `npm run migration:generate` / `migration:run` workflow. Document migration process.

3. Minimal `main.ts` (missing security & global setup)
   - Problem: `src/main.ts` currently only bootstraps the app and listens. No global `ValidationPipe`, `helmet`, `cookie-parser`, `cors` setup, or rate-limiting is present.
   - Fix: Add global `ValidationPipe` with `whitelist: true`, `transform: true`, enable CORS with allowed origins from config, enable `helmet()` for headers, and `cookie-parser` if using cookies for refresh tokens. Optionally add `express-rate-limit` for auth endpoints.

4. `UsersService.findOneWithPassword` uses query builder incorrectly
   - Problem: `src/users/users.service.ts` uses `createQueryBuilder().setFindOptions({ take: 1 }).whereInIds(id).addSelect('User.password').getOne()` — using entity alias 'User' without setting it and `whereInIds` is awkward for single id.
   - Fix: Use `createQueryBuilder('user').where('user.id = :id', { id }).addSelect('user.password').getOne()` or use `findOne` with select options where supported.

5. GraphQL playground enabled in production
   - Problem: `src/graphql/graphql.module.ts` sets `graphiql: true`. Exposing the playground/GraphiQL in production can leak introspection and sensitive schemas.
   - Fix: Enable playground only when `NODE_ENV !== 'production'`. Consider disabling introspection in production as well.

6. Typo: `curent-user.decorator.ts`
   - Problem: File and symbol spelled `curent` instead of `current`. Small but worth fixing for clarity and to avoid confusion.
   - Fix: Rename file to `current-user.decorator.ts` and export symbol `CurrentUser` consistently.


## Medium-priority recommendations

7. Improve key loading and error handling
   - Problem: `src/auth/config.util.ts` reads key files and derives algorithm. If keys are malformed or missing, errors will bubble up without clear messages.
   - Fix: Add clear error messages, validate key type, and support loading keys from env values or secret managers.

8. Avoid creating per-module PubSub instances
   - Problem: `src/users/users.resolver.ts` constructs a `PubSub()` instance at file top-level. Multiple instances can fragment subscriptions.
   - Fix: Provide a single PubSub provider (DI) in the app and inject it where needed.

9. Limit GraphQL subscription headers handling
   - Problem: `access-token-auth.guard.ts` merges `connectionParams` into `request.headers` without normalization or validation.
   - Fix: Ensure keys are normalized and only expected headers are copied; validate types before assigning.

10. Use smaller JWT payloads and consistent claim names
    - Problem: Some tokens include `rtid` and `type`. Consider standardizing to `sub` for subject and include `jti` or `rtid` as token id for refresh tokens.
    - Fix: Use standard claims where applicable and keep payload minimal.

11. Add logging for security-relevant events
    - Problem: Token creation, refresh, revoke, reuse detection are not logged.
    - Fix: Add structured logging for these events (with minimal sensitive info), e.g. `auth.refresh.attempt`, `auth.refresh.reuse_detected`.

12. Tests and CI
    - Problem: No tests currently covering critical auth and user flows.
    - Fix: Add unit tests for `RefreshTokenService`, `AccessTokenService`, `AuthService` and integration tests for login/refresh flows. Add a CI job to run tests.


## Low-priority / nice-to-have

- Add configuration for `trusted proxies` if deploying behind a load balancer.
- Consider locking down GraphQL schema generation to CI (generate schema as part of build, commit `gen/schema.gql`).
- Add a small `docker-compose` development example that spins up Postgres and runs migrations.


## Concrete next steps I can implement for you

- Add `.env.example` and unify env var names across the repository and README.
- Patch `src/main.ts` to add global `ValidationPipe`, `helmet`, `cookie-parser`, `cors` and optionally `rate-limit` on auth endpoints.
- Patch `src/users/users.service.ts` to use a correct query builder and add tests.
- Disable `synchronize` and add a short README section explaining migrations.
- Rename `curent-user.decorator.ts` to `current-user.decorator.ts` and update imports.

Tell me which items you want me to implement first (I recommend: 1) unify env vars + `.env.example`, 2) `main.ts` security setup, 3) refresh-token rotation & hashing from `JWT-TODO.md`).
