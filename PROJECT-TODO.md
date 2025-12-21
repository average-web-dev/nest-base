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
