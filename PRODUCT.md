# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences:

- **Shoppers** - casual/gift buyers across a broad price range, not watch collectors or
  specs-obsessed enthusiasts. They want to browse and buy confidently without needing
  expert knowledge. Guest-only in v1 (no customer accounts); cart lives in `localStorage`.
- **Admin staff** - manage the catalog (items, variants, categories), inventory, and
  product imagery through the admin panel. Access is a Google OAuth allowlist
  (`AdminUser` rows), with two roles: `SUPER_ADMIN` and `EDITOR`.

## Product Purpose

Doxa is a real, pre-launch ecommerce watch storefront (not a demo/portfolio project).
It sells watches first, with additional categories planned later. Success means a
casual or gift buyer can browse a small, understandable catalog and check out without
feeling like they need to be a watch expert first.

## Positioning

Price/value transparency: straightforward, honest pricing and specs, no upsell games.
Trust is the differentiator versus generic watch retailers, not curation depth or
collector-grade detail.

## Operating Context

- Two-service architecture: NestJS + Prisma + PostgreSQL backend (`nest-backend/`) owns
  catalog, inventory, orders, and payments; the Next.js app (`web/`) is a thin,
  fast presentation layer for both the storefront and the admin panel.
- Product imagery is stored in MinIO (S3-compatible) on a shared VPS and served through
  `next/image`.
- Real supplier(s) are already lined up as the inventory source; current catalog data in
  the database is still fixture/seed data pending backfill from that sourcing.
- Launch shipping is single-region: Ethiopia, primarily Addis Ababa, with broader
  regional support to be discussed later.

## Capabilities and Constraints

- Guest-only checkout in v1 - no customer login/accounts; cart state is
  client-side only.
- Admin access is allowlist-gated (Google OAuth; email must already exist as an
  `AdminUser` row); no self-serve admin signup.
- Money is handled as integer minor units end-to-end (`ItemVariant.price`,
  `CartLine.unitPrice`) - never floats.
- `Item` is a wrapper; `ItemVariant` is the actual product a shopper picks (color,
  stock, price, content, assets).
- Open/undecided: payment provider not yet chosen; returns policy not yet defined;
  exact regional shipping support beyond Addis Ababa not yet scoped.

## Brand Commitments

"Doxa" is the committed product name and identity, not a placeholder - preserve it as
a binding brand fact in future work.

## Evidence on Hand

Real supplier(s) are lined up for inventory sourcing, but no supplier details, real
SKU data, testimonials, case studies, or press exist yet in this project. Current
catalog content in the database is fixture/seed data. Do not fabricate supplier
names, pricing, reviews, or press mentions - treat their absence as real until the
user provides them.

## Product Principles

1. Trust through transparency - honest pricing and clear specs, no upsell dark
   patterns.
2. Low-friction browsing for non-expert buyers - optimize for a casual/gift shopper,
   not a collector doing deep comparison.
3. Guest-first commerce - no account-creation friction; add customer auth only when a
   real need emerges.
4. Backend owns commerce truth - catalog, inventory, orders, and payments live in the
   API; the storefront stays a thin, fast presentation layer.
5. Real inventory over placeholder - supplier-sourced catalog data should replace
   fixture/seed data as sourcing solidifies.
