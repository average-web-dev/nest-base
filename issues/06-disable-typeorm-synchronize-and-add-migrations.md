Title: Disable TypeORM `synchronize` in production and add migrations

Description
---
Set `synchronize: false` for production and integrate TypeORM migrations into the project's workflow.

Rationale
---
- `synchronize: true` can modify schema at runtime and cause data loss or unexpected changes in production.

Files to update
---
- `src/database/database.config.ts`
- `package.json` scripts (add migration generate/run scripts)

Acceptance criteria / Steps
---
1. Change `synchronize` to be driven by env (e.g., `SYNCHRONIZE=true` for dev, default false).
2. Add npm scripts: `migration:generate`, `migration:run`, and document usage in README.
3. Add example commands for generating and running migrations locally and in CI.

Suggested labels
---
- infra
- database
