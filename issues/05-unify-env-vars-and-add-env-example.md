Title: Unify environment variable names and add `.env.example`

Description
---
Standardize environment variable names across the project and add a `.env.example` file documenting symmetric/asymmetric JWT setups and other required vars.

Rationale
---
- Inconsistent env names lead to misconfiguration. A `.env.example` helps onboarding and CI.

Files to update
---
- `src/config/env.validation.ts`
- `README.md`
- `src/database/database.config.ts` (env variable names)
- add `.env.example` at project root

Acceptance criteria / Steps
---
1. Decide on canonical names (recommend: `PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_*`).
2. Update `env.validation.ts` validation schema to use canonical names and examples.
3. Add `.env.example` with placeholders and short notes for keys, algorithms, and key paths.

Suggested labels
---
- docs
- infra
