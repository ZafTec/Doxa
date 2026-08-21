# Doxa

Doxa is a watch storefront composed of a NestJS API and a Next.js web application. Each application manages its own dependencies and commands with Bun.

## Applications

| Directory      | Purpose                                    | Local URL               |
| -------------- | ------------------------------------------ | ----------------------- |
| `nest-backend` | NestJS, Prisma, and PostgreSQL catalog API | `http://localhost:3000` |
| `web`          | Next.js storefront                         | `http://localhost:3001` |

## Backend setup

1. Copy `nest-backend/.env.example` to `nest-backend/.env`.
2. Ensure PostgreSQL is running and matches `DATABASE_URL`.
3. Install dependencies, prepare the database, and start the API:

```bash
cd nest-backend
bun install
bun run db:setup
bun run dev
```

The seed clears existing catalog data before inserting fixtures. Do not run it against a database containing data you need to keep.

### Backend commands

```bash
bun run dev                # Start the API in watch mode
bun run build              # Build the API
bun run lint               # Check backend and Prisma source
bun run lint:fix           # Apply lint fixes
bun run test               # Run unit tests
bun run test:e2e           # Run e2e tests
bun run db:generate        # Generate the Prisma client
bun run db:migrate         # Create and apply a development migration
bun run db:migrate:deploy  # Apply committed migrations
bun run db:seed            # Reset and seed catalog fixtures
bun run db:setup           # Apply migrations and seed fixtures
bun run db:studio          # Open Prisma Studio
```

## Frontend setup

In a separate terminal:

```bash
cd web
bun install
bun run dev
```

Copy `web/.env.example` to `web/.env.local` before starting the frontend. The development server uses port 3001 so the API can consistently use port 3000.

### Frontend commands

```bash
bun run dev       # Start the storefront in development mode
bun run build     # Build the storefront
bun run lint      # Check frontend source
bun run lint:fix  # Apply lint fixes
```

## Git hooks

A pre-commit hook (Husky + lint-staged) runs the relevant app's lint (and, for
`web`, a typecheck) on every commit, scoped to whichever app you changed. It
activates once you install dependencies at the **repo root**:

```bash
bun install
```

## CI/CD

GitHub Actions workflows live in `.github/workflows/`:

- **`ci.yml`** - runs on every pull request and push to `main`: lints, builds,
  and tests both apps (`nest-backend` against a real Postgres service
  container, including e2e; `web` via typecheck + lint + build).
- **`release.yml`** - runs when a `v*.*.*` tag is pushed: re-runs CI, then
  builds and pushes Docker images for both apps to Docker Hub
  (`<username>/doxa-backend`, `<username>/doxa-web`) and cuts a GitHub Release
  with auto-generated notes.

Releasing requires two repo secrets (Settings -> Secrets and variables ->
Actions): `DOCKERHUB_USERNAME` and a `DOCKERHUB_TOKEN` (access token, not your
password).

## Editor configuration

Repository-specific Zed settings live in `.zed/settings.json` and configure the TypeScript language server to use the workspace TypeScript SDK.
