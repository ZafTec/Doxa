# Doxa

Doxa is a watch storefront composed of a NestJS API and a Next.js web application. Bun is the only supported package manager and runtime.

## Applications

| Workspace | Purpose | Local URL |
| --- | --- | --- |
| `nest-backend` | NestJS, Prisma, and PostgreSQL catalog API | `http://localhost:3000` |
| `web` | Next.js storefront | `http://localhost:3001` |

## Local setup

1. Copy `nest-backend/.env.example` to `nest-backend/.env`.
2. Copy `web/.env.example` to `web/.env.local`.
3. Ensure PostgreSQL is running and matches `DATABASE_URL`.
4. Install all workspace dependencies from the repository root:

```bash
bun install
```

5. Apply migrations and seed the development catalog:

```bash
bun run db:setup
```

The seed clears existing catalog data before inserting fixtures. Do not run it against a database containing data you need to keep.

6. Start both applications:

```bash
bun run dev
```

## Root commands

| Command | Description |
| --- | --- |
| `bun run dev` | Start the API and storefront together |
| `bun run dev:api` | Start only the NestJS API |
| `bun run dev:web` | Start only the Next.js storefront |
| `bun run build` | Build both workspaces |
| `bun run lint` | Check both workspaces without modifying files |
| `bun run lint:fix` | Apply lint fixes in both workspaces |
| `bun run test` | Run backend unit tests |
| `bun run test:e2e` | Run backend e2e tests |
| `bun run check` | Run lint, tests, and builds |
| `bun run db:setup` | Apply committed migrations and seed fixtures |
| `bun run db:migrate` | Create and apply a development migration |
| `bun run db:migrate:deploy` | Apply committed migrations |
| `bun run db:seed` | Reset and seed catalog fixtures |
| `bun run db:studio` | Open Prisma Studio |

Workspace-specific commands can still be run from their respective directories when needed.
