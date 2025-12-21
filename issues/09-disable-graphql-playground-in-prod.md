Title: Make GraphQL playground / graphiql dev-only

Description
---
Disable `graphiql` and GraphQL introspection by default in production to avoid exposing schema and playground to attackers.

Rationale
---
- Playground and introspection can reveal types and operations that an attacker may use to enumerate API behavior.

Files to update
---
- `src/graphql/graphql.module.ts`

Acceptance criteria / Steps
---
1. Make `graphiql` and `introspection` toggles depend on `NODE_ENV !== 'production'` or a config flag (e.g., `GRAPHQL_PLAYGROUND=true` for dev only).
2. Document this behavior in README.

Suggested labels
---
- security
- backend
