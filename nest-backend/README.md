# Doxa API

NestJS and Prisma API for the Doxa storefront. Bun is the only supported package manager and runtime.

## Local setup

1. Start PostgreSQL and create a database named `doxa`.
2. Copy `.env.example` to `.env` and update `DATABASE_URL` if your PostgreSQL credentials, host, port, or database name differ.
3. Install dependencies and prepare the database:

```bash
bun install
bun run db:setup
```

`db:setup` applies the committed migrations and runs the destructive development seed. The seed clears existing catalog data before inserting fixtures, so do not run it against a database containing data you need to keep.

4. Start the API:

```bash
bun run start:dev
```

The API listens on `http://localhost:3000` by default.

## Database commands

```bash
bun run db:generate        # Generate the Prisma client
bun run db:migrate         # Create and apply a migration during development
bun run db:migrate:deploy  # Apply committed migrations
bun run db:seed            # Reset and seed catalog fixtures
bun run db:studio          # Open Prisma Studio
```

If Prisma reports `ECONNREFUSED`, PostgreSQL is not reachable at the host and port in `DATABASE_URL`. Start PostgreSQL or correct the connection string before starting the storefront.
