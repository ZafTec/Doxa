# Doxa Backend - Architecture & Conventions

This file is the canonical memory for `nest-backend/`. Update it when a backend contract or architectural decision changes.

## Stack and commands

- NestJS 11, Prisma 7, PostgreSQL, Zod 4, Bun.
- Use Bun for package and script commands.
- Run `bun run lint`, `bun run test`, and `bun run build` before considering backend work complete.
- Prisma generates into `prisma/generated/`. Never edit generated files directly.

## Public API response contracts

Prisma models are persistence types, not public API contracts. Controllers and services must return feature DTOs that explicitly describe the JSON shape sent to clients.

For enriched Prisma queries:

1. Define the public response in `src/<feature>/<feature>.dto.ts`.
2. Define a shared `select` or `include` object in `src/<feature>/<feature>.mapper.ts` and constrain it with `satisfies Prisma.<Model>Include` or `satisfies Prisma.<Model>Select`.
3. Derive the mapper input with Prisma's generated `<Model>GetPayload` type.
4. Map every field explicitly from the Prisma result to the response DTO.
5. Use the same include/select object in the service query so the query and mapper cannot drift.
6. Update the matching type in `web/lib/api/endpoints/types.ts` whenever the wire contract changes.

Do not:

- Return relation-loaded Prisma records while declaring them as bare model types.
- Use `as unknown as ...` to force a Prisma result into an API response type.
- Let incidental query structure become the public API shape.

`src/item/item.mapper.ts` is the reference implementation.

## Catalog and asset contracts

- `Item` is the catalog wrapper; `ItemVariant` is the shopper-selectable product/colorway.
- Money is stored and returned as integer minor units. Never use floating-point prices.
- `GET /item` returns `ItemListDto`, including category, variants, and each variant's asset URL objects.
- `GET /item/:id` returns `ItemDetailsDto`. Variant-specific fields (`name`, `description`, `price`, stock, and assets) stay on each variant.
- Never flatten the first variant's fields or assets onto the parent item. Clients must choose a variant explicitly and render that variant's content.
- Load variant assets through the item query relation. Do not issue a second asset query for an arbitrarily selected variant.

## Validation and tests

- Validate request input with Zod schemas and `ZodValidationPipe`.
- Add mapper tests when changing a response contract, especially for nested relations.
- Service/controller tests should cover authorization, missing records, pagination, and transactional behavior where applicable.
