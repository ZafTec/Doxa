<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Doxa Web — Architecture & Conventions

This file is the canonical memory for the `web/` package. Update it whenever a decision below changes.

## Product

Ecommerce storefront. Watches first, additional categories later. Backend (separate service in `../backend/`) owns catalog, inventory, orders, payments. The web app is a thin, fast presentation layer with client-side cart UX.

## Stack

| Concern        | Choice                                    |
| -------------- | ----------------------------------------- |
| Framework      | Next.js 16 (App Router), React 19         |
| Package mgr    | **bun** — always prefer `bun add`, `bunx` |
| Styling        | Tailwind v4 (`@tailwindcss/postcss`)      |
| State (client) | Zustand                                   |
| Forms          | react-hook-form + zod (`@hookform/resolvers/zod`) |
| HTTP (client)  | axios                                     |
| HTTP (server)  | native `fetch` (Next-extended)            |
| Images         | `next/image` + Cloudinary                 |

## Data fetching — read this before writing any fetch code

**Default to Server Components for reads.** Catalog/category/PDP data is fetched on the server with `lib/api/server.ts` so the HTML ships cached and there is no client waterfall.

- Server fetches: `serverApi.get<T>(path, { revalidate, tags })` — wraps `fetch` with `next: { revalidate, tags }`. Tag every collection so we can invalidate via `revalidateTag` from webhooks/admin actions.
- Client mutations & authenticated reads-from-client: `lib/api/client.ts` (axios with `withCredentials: true`).
- Next.js 16 changed `fetch` defaults: **fetch is NOT cached by default.** You must opt in with `cache: 'force-cache'` or `next: { revalidate }`. Our `serverFetch` always forwards `next: { revalidate, tags }` so callers stay explicit.
- For authenticated SSR (e.g. account pages), read the request cookie via `cookies()` and pass it through `serverFetch(path, { cookie })`.

## Auth — none in v1

Guest-only storefront. No login, no session cookie, no `useSessionStore`. Cart lives entirely in `localStorage`. Re-add when the backend grows an auth module and we wire a customer dashboard.

`axios` is still configured with `withCredentials: true` so that flipping the switch later doesn't require touching the client.

## Catalog data model (web view)

Backend models are `Item`, `ItemVariant`, `Category` (see `nest-backend/prisma/schema.prisma`). **`Item` is a wrapper; `ItemVariant` is the product the shopper picks** (color, stock, price). The web mirrors them in `lib/api/endpoints/types.ts`.

Frontend assumptions that the backend will catch up to:

- **`Item.itemVariants: ItemVariant[]` (1:N).** The schema is currently `itemVariant ItemVariant?` (1:1 via `@unique` on `itemId`) but the frontend assumes 1:N because a watch model has multiple colorways. Backend will flip the schema to match.
- **Controllers include relations.** `GET /item` and `GET /item/:id` need `include: { itemVariant: true, category: true }` to be useful — without that, responses contain no price, stock, or category. Listed as a backend TODO.
- **No `name`, no `image` on Item.** The card title is `brand`; the subtitle is `description`. Images are placeholders until a `mediaUrl` column lands and we wire Cloudinary.
- **`pageNumber` is 0-indexed** in `Paginated<T>.metadata`. URL params on web should map 1-indexed `?page=2` → backend `pageNumber=1`.
- **Money is `Int` (minor units)** on `ItemVariant.price`. Web preserves this all the way through to `CartLine.unitPrice`. Never use floats.

## State management (Zustand)

Located in `lib/store/`.

| Store          | Purpose                       | Persisted? |
| -------------- | ----------------------------- | ---------- |
| `useCartStore` | Cart lines, totals, mutations | `localStorage` (`doxa.cart`) — `lines` only |
| `useUiStore`   | Theme, sidebar/drawer state   | `localStorage` (`doxa.ui`) — **only `theme`**; `sidebarOpen` is transient |

Conventions:

- `CartLine` is a **snapshot** of a variant at add-to-cart time (brand/description/color/unitPrice). Catalog edits do not retroactively mutate the cart.
- Money is **minor units (integers)** on `CartLine.unitPrice`.
- Persisted stores use `partialize` to avoid serializing methods.
- Persisted keys are namespaced under `doxa.<feature>`.

## Forms & validation

- `useZodForm(schema, options?)` in `lib/validation/use-zod-form.ts` — generic wrapper around `useForm` that wires `zodResolver` and defaults `mode: 'onTouched'`.
- Shared schemas live in `lib/validation/schemas.ts`. Login/signup are gone (no auth in v1); address/checkout/payment schemas land when those flows do.
- Zod v4 is in use — `ZodType<Output, Input>` ordering matters for resolver typing; do not change `useZodForm`'s generics without re-typechecking.

## Design tokens & typography

**All design tokens live in `app/globals.css`** — never inline hex values in components, never use `bg-[var(--background)]` arbitrary syntax.

- Tokens are declared as CSS vars on `:root` (light) and `.dark` (dark mode), then exposed to Tailwind via `@theme inline`. Current semantic tokens: `background`, `foreground`, `muted`, `muted-foreground`, `border`, `accent`, `accent-foreground`. Use them through Tailwind utilities: `bg-background`, `text-foreground`, `border-border`, `bg-muted`, `text-muted-foreground`, `bg-accent text-accent-foreground`.
- Manual dark mode is wired via `@custom-variant dark (&:where(.dark, .dark *))`. The `dark` class on `<html>` is toggled by (a) an inline `<head>` script that runs pre-paint to avoid FOUC, and (b) `ThemeEffect` which reaffirms after hydration and subscribes to `prefers-color-scheme` when `theme === "system"`.
- **Typography:** primary is **Mona Sans** loaded via `next/font/google` (`Mona_Sans`) and exposed as `--font-sans`. Mono is **Geist Mono** as `--font-mono`. The Tailwind `--font-sans` / `--font-mono` chains add a professional system-UI fallback (`ui-sans-serif, system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif` and `ui-monospace, SFMono-Regular, Menlo, "Courier New", monospace`) so text stays sharp before the webfont arrives and on rendering failures.
- To add a new token: declare it on `:root` and `.dark`, expose it under `@theme inline` (e.g. `--color-success: var(--success)`), then use `bg-success` etc. in components.

## Images & CDN

- Cloudinary is the canonical image host. Configured via `images.remotePatterns` in `next.config.ts` for `https://res.cloudinary.com/**`.
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` will hold the account name when set up; URL building helpers go in `lib/cloudinary/` when needed.
- Always use `next/image` for product imagery — never raw `<img>`.

## Project layout

```
web/
  app/                        Routes (App Router)
  lib/
    api/
      client.ts               axios instance (cookie-ready; auth off in v1)
      server.ts               server-side fetch wrapper (RSC)
      errors.ts               ApiError class
      types.ts                ApiResponse / ApiErrorPayload
      endpoints/
        types.ts              Item / ItemVariant / Category / Paginated<T>
        items.ts              GET /item, GET /item/:id, POST /item/create
        categories.ts         GET /category, POST /category/create
    store/                    Zustand stores (cart, ui)
    validation/               useZodForm + shared zod schemas
```

## Commit & workflow conventions

- One-line, imperative commit subjects. No co-author trailers requested by the repo owner.
- Commit per logical step rather than batching unrelated changes.
- Run `bunx tsc --noEmit` before committing; the dev server is usually already running in another terminal — do not start a new one.

## Open questions / TODO

**Backend-side (tracked here because the web blocks on them):**

- `item.service.ts` queries must `include: { itemVariant: true, category: true }`. Without that, `GET /item` and `GET /item/:id` return rows with no price/stock/category and the catalog cannot render.
- Schema: `itemVariant ItemVariant?` → `itemVariants ItemVariant[]` (remove `@unique` on `itemId`). Watches need multiple colorways.
- Enable CORS for the web origin (no credentials needed since there's no auth in v1).
- Add a `name`/`title` column to `Item` (or rely on `brand` + `description` as the title-subtitle pair). Decide.
- Add a media model (`Media { id, itemId, url, alt, order }`) so the catalog can ship real images via Cloudinary.

**Web-side:**

- Cloudinary URL helper once `CLOUDINARY_CLOUD_NAME` is set.
- Decide whether to adopt TanStack Query for client mutations later; current default is RSC reads + axios point mutations.
