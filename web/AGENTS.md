<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Doxa Web - Architecture & Conventions

This file is the canonical memory for the `web/` package. Update it whenever a decision below changes.

## Product

Ecommerce storefront. Watches first, additional categories later. Backend (separate service in `../backend/`) owns catalog, inventory, orders, payments. The web app is a thin, fast presentation layer with client-side cart UX.

## Stack

| Concern        | Choice                                    |
| -------------- | ----------------------------------------- |
| Framework      | Next.js 16 (App Router), React 19         |
| Package mgr    | **bun** - always prefer `bun add`, `bunx` |
| Styling        | Tailwind v4 (`@tailwindcss/postcss`)      |
| State (client) | Zustand                                   |
| Forms          | react-hook-form + zod (`@hookform/resolvers/zod`) |
| HTTP (client)  | axios                                     |
| HTTP (server)  | native `fetch` (Next-extended)            |
| Images         | `next/image` + Cloudinary                 |

## Data fetching - read this before writing any fetch code

**Default to Server Components for reads.** Catalog/category/PDP data is fetched on the server with `lib/api/server.ts` so the HTML ships cached and there is no client waterfall.

- Server fetches: `serverApi.get<T>(path, { revalidate, tags })` - wraps `fetch` with `next: { revalidate, tags }`. Tag every collection so we can invalidate via `revalidateTag` from webhooks/admin actions.
- Client mutations & authenticated reads-from-client: `lib/api/client.ts` (axios with `withCredentials: true`).
- Next.js 16 changed `fetch` defaults: **fetch is NOT cached by default.** You must opt in with `cache: 'force-cache'` or `next: { revalidate }`. Our `serverFetch` always forwards `next: { revalidate, tags }` so callers stay explicit.
- For authenticated SSR (e.g. account pages), read the request cookie via `cookies()` and pass it through `serverFetch(path, { cookie })`.

## Auth

The storefront itself is still guest-only in v1: no customer login, no `useSessionStore`. Cart lives entirely in `localStorage`.

**Admin auth exists** (`app/admin/`), separate from the storefront: Google OAuth only, no
passwords. Admins are an allowlist - a Google sign-in only succeeds if the email already
exists as an `AdminUser` row on the backend (added via `/admin/users/new`, SUPER_ADMIN
only). Session is a single httpOnly JWT cookie (`access_token`, ~7 days) set by
`nest-backend`'s `/auth/google/callback`; there's no refresh-token flow - the backend
re-reads the `AdminUser` row on every request instead, so revoking access or changing a
role takes effect on the admin's next request.

- `app/admin/login` - plain link to `${NEXT_PUBLIC_API_URL}/auth/google` (full navigation,
  not axios - OAuth needs a real browser redirect chain).
- `app/admin/(protected)/layout.tsx` - the auth gate. Forwards the request's `Cookie`
  header to `GET /auth/me`; redirects to `/admin/login` on failure. Must stay a sibling of
  (not a parent of) `app/admin/login` or the redirect loops.
- `middleware.ts` - cheap defense-in-depth only (redirects when the `access_token` cookie
  is absent); it does not verify the JWT. Real auth is the layout above.
- Reads: `lib/api/endpoints/auth.ts` / `admin-users.ts` (`server-only`, forward the cookie
  explicitly - these are NOT in the shared `lib/api` barrel to avoid poisoning client
  bundles). Mutations: `*-client.ts` siblings (`auth-client.ts`, `items-client.ts`,
  `categories-client.ts`, `admin-users-client.ts`) using `lib/api/client.ts`'s axios
  instance - the browser attaches the httpOnly cookie automatically, no manual forwarding
  needed.

`axios` (`lib/api/client.ts`) is configured with `withCredentials: true` for this reason.

## Catalog data model (web view)

Backend models are `Item`, `ItemVariant`, `Category` (see `nest-backend/prisma/schema.prisma`). **`Item` is a wrapper; `ItemVariant` is the product the shopper picks** (color, stock, price, content, and assets). The web mirrors the backend's explicit response DTOs in `lib/api/endpoints/types.ts`.

- `GET /item` returns `ItemListItem[]` in a pagination envelope, including category, price-ordered variants, and each variant's asset URL objects.
- `GET /item/:id` returns `ItemDetails`. Variant-specific `name`, `description`, `price`, stock, and `assets` stay on each `ItemDetailsVariant`; never flatten the first variant onto the parent item.
- The PDP keeps the selected variant in `ProductDetails`, then drives the gallery, purchase panel, specs, and cart snapshot from that one selection.
- **`pageNumber` is 0-indexed** in `Paginated<T>.metadata`. URL params on web should map 1-indexed `?page=2` → backend `pageNumber=1`.
- **Money is `Int` (minor units)** on `ItemVariant.price`. Web preserves this all the way through to `CartLine.unitPrice`. Never use floats.

## State management (Zustand)

Located in `lib/store/`.

| Store          | Purpose                       | Persisted? |
| -------------- | ----------------------------- | ---------- |
| `useCartStore` | Cart lines, totals, mutations | `localStorage` (`doxa.cart`) - `lines` only |
| `useUiStore`   | Theme, sidebar/drawer state   | `localStorage` (`doxa.ui`) - **only `theme`**; `sidebarOpen` is transient |

Conventions:

- `CartLine` is a **snapshot** of a variant at add-to-cart time (brand/description/color/unitPrice). Catalog edits do not retroactively mutate the cart.
- Money is **minor units (integers)** on `CartLine.unitPrice`.
- Persisted stores use `partialize` to avoid serializing methods.
- Persisted keys are namespaced under `doxa.<feature>`.

## Forms & validation

- `useZodForm(schema, options?)` in `lib/validation/use-zod-form.ts` - generic wrapper around `useForm` that wires `zodResolver` and defaults `mode: 'onTouched'`.
- Shared schemas live in `lib/validation/schemas.ts`. Login/signup are gone (no auth in v1); address/checkout/payment schemas land when those flows do.
- Zod v4 is in use - `ZodType<Output, Input>` ordering matters for resolver typing; do not change `useZodForm`'s generics without re-typechecking.

## Design language

Doxa reads as **precision-machined, monochrome, editorial** - zero border-radius on
every structural surface, borders (never shadows) for containment, and wide-tracked
uppercase micro-labels for anything secondary. This is the whole language; extend it,
don't add to it. Reusable primitives for it live in `app/components/ui/`.

**All design tokens live in `app/globals.css`** - never inline hex values in components,
never use `bg-[var(--background)]` arbitrary syntax.

- Tokens are declared as CSS vars on `:root` (light) and `.dark` (dark mode), then
  exposed to Tailwind via `@theme inline`. Semantic tokens: `background`, `foreground`,
  `muted`, `muted-foreground`, `border`, `accent`, `accent-foreground`. Use them through
  Tailwind utilities: `bg-background`, `text-foreground`, `border-border`, `bg-muted`,
  `text-muted-foreground`, `bg-accent text-accent-foreground`.
- Manual dark mode is wired via `@custom-variant dark (&:where(.dark, .dark *))`. The
  `dark` class on `<html>` is toggled by (a) an inline `<head>` script that runs
  pre-paint to avoid FOUC, and (b) `ThemeEffect` which reaffirms after hydration and
  subscribes to `prefers-color-scheme` when `theme === "system"`.
- **No semantic color.** There is no red/green/amber anywhere in the system, including
  for errors and destructive actions - deliberate, not an oversight. State is signaled
  through weight, underline, opacity and fill, never hue: form errors are
  `text-foreground underline decoration-2 underline-offset-2`; disabled is
  `opacity-40 cursor-not-allowed`; a selected/active state is `border-accent` (plus
  `bg-accent text-accent-foreground` when it must read as "on"). If a future page
  genuinely needs a severity color (e.g. a live inventory alert), raise it as a design
  decision first rather than reaching for `red-500`.
- **Typography:** primary is **Mona Sans** loaded via `next/font/google` (`Mona_Sans`)
  and exposed as `--font-sans`. Mono is **Geist Mono** as `--font-mono`. The Tailwind
  `--font-sans` / `--font-mono` chains add a professional system-UI fallback
  (`ui-sans-serif, system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif`
  and `ui-monospace, SFMono-Regular, Menlo, "Courier New", monospace`) so text stays
  sharp before the webfont arrives and on rendering failures.
  - Headlines: `font-semibold`, tight/negative tracking (`tracking-tight` or
    `tracking-[-0.02em]`), tight leading. Sizes run from `text-2xl` (admin page titles)
    up to the hero's `text-[56px]`.
  - Body: `text-sm` or `text-base`, `text-muted-foreground` for secondary copy,
    `leading-[1.55]` for anything longer than a line.
  - Eyebrow/micro-label (brand kickers, section labels, stock/status text, table
    headers): always `text-[11px] font-medium uppercase tracking-[0.08em]
    text-muted-foreground` - use the `<Eyebrow>` primitive rather than retyping this.
  - Numerals (price, quantity, counts) always get `tabular-nums`.
- **Radius:** flat by default. Buttons, inputs, cards, chips, panels: **no radius at
  all**. The only rounded things are icon-only affordances (`IconButton`, Tailwind's
  default `rounded`, ~4px) and circular swatches/avatars (`rounded-full`). If something
  new wants a radius beyond those two cases, it's off-language.
- **Containment:** a 1px `border-border` is the only way to box something in. There are
  no shadows anywhere in the system - don't add `shadow-*` utilities.
- **Motion:** `transition-colors` for hover states that only change color/background;
  `transition` (or `transition-opacity`) where a primary button's hover fades opacity.
  Durations: default (150ms) for hover/focus feedback, `duration-500` for large-surface
  moments (the product-card image zoom on hover is the reference).
- **Focus:** handled once, globally, in `globals.css` - a `:focus-visible { outline: 2px
  solid var(--accent); outline-offset: 2px }` base rule. Don't add per-component focus
  styles; if the default outline looks wrong somewhere, fix the base rule, not the
  component.
- **Buttons have two registers**, both real, don't blend them:
  1. *Prominent CTA* - normal-case, `text-sm font-medium` (hero CTA, "Add to bag").
     Use `<Button>` / `buttonVariants()` from `ui/button.tsx` (variants
     `primary`/`secondary`/`ghost`, sizes `sm`/`md`/`lg` = `h-9`/`h-12`/`h-14`).
  2. *Compact action* - `text-xs font-medium uppercase tracking-[0.08em]` (admin
     toolbar actions like "New item", row actions like "Remove"). This is typographic,
     not a button component - it's the same treatment as `<Eyebrow>` on an interactive
     element; don't force it through `<Button>`, which is normal-case only.
- **Primitives** (`app/components/ui/`): `Button`/`buttonVariants`, `IconButton`,
  `Input`/`Textarea`/`Select` (+ `inputClassName`/`inputClassNameCompact`),
  `Badge`/`badgeVariants` (the active-filter chip pattern - `subtle`/`outline`/`solid`),
  `Card` (a bordered panel, no shadow), `Eyebrow`/`eyebrowClassName`. Reach for these
  before writing a new inline class string; if a pattern repeats a third time outside
  `ui/`, promote it into one instead.
- To add a new token: declare it on `:root` and `.dark`, expose it under `@theme inline`
  (e.g. `--color-success: var(--success)`), then use `bg-success` etc. in components -
  but see "No semantic color" above before adding a hue.

## Images & CDN

- Cloudinary is the canonical image host. Configured via `images.remotePatterns` in `next.config.ts` for `https://res.cloudinary.com/**`.
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` will hold the account name when set up; URL building helpers go in `lib/cloudinary/` when needed.
- Always use `next/image` for product imagery - never raw `<img>`.

## Project layout

```
web/
  middleware.ts                Admin route cookie-presence check (see Auth section)
  app/
    (storefront)/               Guest-only storefront, wrapped in SiteHeader/Sidebar/Cart/Footer
      page.tsx, watches/[id]/
    components/                  Shared across storefront + admin
      ui/                          Design-language primitives - Button, IconButton, Input/
                                    Textarea/Select, Badge, Card, Eyebrow (see "Design language")
      catalog/, pdp/                Storefront-specific (ProductCard, Gallery, PurchasePanel, ...)
      site-header.tsx, site-footer.tsx, cart-button.tsx, cart-drawer.tsx, theme-toggle.tsx
    admin/                       Admin panel - no storefront chrome
      login/                      Public: Google sign-in link
      (protected)/                 Auth-gated via layout.tsx -> GET /auth/me
        page.tsx, items/, categories/, users/
      components/                  AdminShell, AdminNav, LogoutButton, form-field helpers
  lib/
    api/
      client.ts               axios instance (cookie-ready, withCredentials: true)
      server.ts               server-side fetch wrapper (RSC)
      errors.ts               ApiError class
      types.ts                ApiResponse / ApiErrorPayload
      endpoints/
        types.ts              Endpoint contracts / Category / AdminUser / Paginated<T>
        items.ts, categories.ts        Public reads + provisional serverApi creates (server-only)
        items-client.ts, categories-client.ts   Client-side creates used by admin forms
        auth.ts, admin-users.ts        Admin reads, server-only, cookie forwarded explicitly
        auth-client.ts, admin-users-client.ts    Admin mutations via client.ts axios
    store/                    Zustand stores (cart, ui)
    validation/               useZodForm + shared zod schemas + admin-schemas.ts
```

## Commit & workflow conventions

- One-line, imperative commit subjects. No co-author trailers requested by the repo owner.
- Commit per logical step rather than batching unrelated changes.
- Run `bunx tsc --noEmit` before committing; the dev server is usually already running in another terminal - do not start a new one.

## Open questions / TODO

**Backend-side (tracked here because the web blocks on them):**

- Implement the object-storage contract described in `docs/s3-assets-implementation-guide.md` while preserving per-variant assets in `ItemDetails`.
- Decide whether the parent `Item` needs its own customer-facing title or whether variant names remain canonical.

**Web-side:**

- Cloudinary URL helper once `CLOUDINARY_CLOUD_NAME` is set.
- Decide whether to adopt TanStack Query for client mutations later; current default is RSC reads + axios point mutations.
