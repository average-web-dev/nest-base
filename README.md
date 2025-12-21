# nest-base

A small scaffolded NestJS project with GraphQL, TypeORM (Postgres) and JWT-based authentication (access + refresh tokens).

This repository is a convenient starting point for building a GraphQL API using NestJS 11, Apollo, and TypeORM.

## Quick Start

Install dependencies:

```bash
npm install
```

Copy or create your environment file (example variables below), then run in development:

```bash
# watch mode (recommended for dev)
npm run start:dev

# production (build then run)
npm run build
npm run start:prod
```

## Environment variables

The project uses `@nestjs/config` and validates env variables in `src/config/env.validation.ts`.
Common variables this project expects (adjust to your setup):

```text
NODE_ENV=development
PORT=3000
# Postgres connection (or DATABASE_URL)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=nest_base

# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```

Place secrets in a `.env` file or provide them through your environment (Docker, CI, etc.).

## Features

- NestJS 11 application structure
- GraphQL (Apollo) setup (`src/graphql`)
- TypeORM + Postgres (`src/database`, `typeorm` config)
- Authentication with access + refresh tokens (`src/auth`, `src/auth/access-token`, `src/auth/refresh-token`)
- Local strategy and guards for login flow

## Project structure (important files)

- `src/main.ts` — app entry
- `src/app.module.ts` — root module
- `src/graphql/graphql.module.ts` — GraphQL configuration
- `src/database` — database module/config
- `src/auth` — authentication (strategies, guards, resolvers, services)
- `src/users` — user entity, resolver, and service
- `gen/schema.gql` — generated GraphQL schema

Browse those files to understand how auth and tokens are wired into resolvers and guards.

## GraphQL

By default GraphQL is available at `/graphql` (check `src/graphql/graphql.module.ts`). The repo includes a generated `gen/schema.gql` file.

## Database

This project uses TypeORM with Postgres. Ensure your database is reachable and the environment variables are set. The `pg` driver is already included in `package.json`.

## Running tests

Run unit tests:

```bash
npm run test
```

Run e2e tests:

```bash
npm run test:e2e
```

Collect coverage:

```bash
npm run test:cov
```

## Docker

This repository contains a `docker-compose.yml` which can be used to stand up a Postgres service and the app (adjust as needed). Use `docker-compose up --build` to run the stack.

## Notes about auth

- Access and refresh token logic lives under `src/auth/access-token` and `src/auth/refresh-token`.
- Refresh tokens are persisted using `RefreshToken` entity (`src/auth/refresh-token/refresh-token.entity.ts`).
- Guards: see `local-auth.guard.ts`, `access-token/access-token-auth.guard.ts`.

- Asymmetric JWT support: the auth implementation can be configured to use asymmetric keys (e.g. RS256) for signing and verification. Place the public/private key files or values in your environment/config and update the JWT config in `src/auth/access-token/access-token.config.ts` (or the corresponding config utilities).

## Contributing

Contributions and improvements are welcome. Suggested workflow:

1. Fork the repo
2. Create a feature branch
3. Run tests locally and add/update tests for changes
4. Open a pull request

## License

This project is marked as `UNLICENSED` in `package.json`. Check `package.json` for licensing details before publishing or reusing code.

---

If you'd like, I can also add a minimal `.env.example` or a short developer guide for local Postgres setup — want that next?
