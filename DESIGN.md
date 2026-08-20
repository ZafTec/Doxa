---
name: Doxa
description: Precision-machined, monochrome, editorial watch storefront - honest pricing, zero ornament.
colors:
  ink: "#18181b"
  ink-inverse: "#fafafa"
  paper: "#ffffff"
  paper-dark: "#0a0a0a"
  paper-text: "#171717"
  paper-text-dark: "#ededed"
  paper-muted: "#f4f4f5"
  paper-muted-dark: "#18181b"
  paper-muted-text: "#71717a"
  paper-muted-text-dark: "#a1a1aa"
  paper-border: "#e5e5e5"
  paper-border-dark: "#27272a"
typography:
  display:
    fontFamily: "Mona Sans, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif"
    fontSize: "56px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Mona Sans, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif"
    fontSize: "clamp(1.875rem, 3vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Mona Sans, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Mona Sans, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Mona Sans, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.08em"
  mono:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, 'Courier New', monospace"
rounded:
  none: "0px"
  icon: "4px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "48px"
  container-padding: "24px"
  container-padding-md: "48px"
  container-padding-lg: "80px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ink-inverse}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.paper-text}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "48px"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.paper-text}"
    rounded: "{rounded.none}"
    padding: "24px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.paper-text}"
    rounded: "{rounded.none}"
    padding: "8px 12px"
---

# Design System: Doxa

## Overview

**Creative North Star: "The Watchmaker's Bench"**

Doxa reads like tools laid out in precise, deliberate order on a bench: nothing decorative,
nothing that isn't load-bearing. Every surface is flat, every edge is a straight 1px line,
and the only accent is ink-on-paper (or paper-on-ink in dark mode) - there is no hue doing
semantic work anywhere in the system, not even for errors. Hierarchy comes from weight,
tracking, and restraint rather than color or shadow. Wide-tracked uppercase micro-labels
stand in for the legends and gauge-markings a bench of precision instruments would carry.

This is a real, pre-launch commerce product built on trust through price/value
transparency, not a portfolio piece - the visual language is doing real work: a shopper
who isn't a watch expert should feel like nothing is being hidden or oversold to them.
The system rejects both directions a watch retailer could default to: the gold-gradient,
serif-heavy "heritage luxury" cliché, and the bright, rounded, playful DTC-ecommerce
default. It sits deliberately between them - serious but not ornate, warm but not cute.

Motion is not an afterthought bolted onto a static system; it is one of the system's few
expressive tools precisely because color isn't available for that job. Use it deliberately
and consistently (see Named Rules below), never decoratively.

**Key Characteristics:**
- Zero border-radius on every structural surface; radius is reserved for two narrow
  exceptions (icon affordances, circular swatches/avatars).
- Containment is always a 1px border - there are no shadows anywhere in the system.
- No semantic color: state is signaled through weight, underline, opacity, and fill only.
- Wide-tracked uppercase micro-labels (`Eyebrow`) do the work color-coding would do
  elsewhere.
- One illustrated signature (The Doxa Face) stands in for every icon/illustration need
  tied to system or empty states - no emoji, no stock icon sets.
- Motion is purposeful and consistent: short, functional transitions plus one signature
  view-transition morph, never ambient decoration.

## Colors

A near-pure monochrome system: one ink that inverts between light and dark mode, and a
tight grey scale around it. There is no second or third hue anywhere in the palette.

### Primary
- **Ink** (`#18181b` light mode / `#fafafa` dark mode, token `accent`): the system's only
  accent. Marks anything that must read as active, selected, or "on" - primary buttons,
  selected filters/swatches, the focus ring, solid badges. Its rarity is the point; see
  the Ink Discipline rule below.
- **Ink Inverse** (`#fafafa` light / `#18181b` dark, token `accent-foreground`): the text/
  icon color that sits on top of an Ink-filled surface.

### Neutral
- **Paper** (`#ffffff` light / `#0a0a0a` dark, token `background`): the base surface every
  page and card sits on.
- **Paper Text** (`#171717` light / `#ededed` dark, token `foreground`): primary body and
  heading text.
- **Paper Muted** (`#f4f4f5` light / `#18181b` dark, token `muted`): secondary surfaces -
  hover fills, subtle badge backgrounds, table stripes.
- **Paper Muted Text** (`#71717a` light / `#a1a1aa` dark, token `muted-foreground`):
  secondary/supporting text - eyebrows, captions, placeholder copy.
- **Paper Border** (`#e5e5e5` light / `#27272a` dark, token `border`): the single 1px
  containment device for every card, input, and divider in the system.

### Named Rules
**The Ink Discipline Rule.** Ink (the accent) never appears as a large fill. It marks a
single active/selected/primary element at a time - a filled button, a selected swatch, a
solid badge, a focus outline. If a screen needs to signal more than one thing at once,
reach for weight or a border, not a second use of Ink.

**The No Hue Rule.** There is no red/green/amber anywhere in the system, including for
form errors and destructive actions. Errors are `text-foreground underline decoration-2
underline-offset-2`; disabled is `opacity-40`; selected is `border-accent` (plus
`bg-accent text-accent-foreground` when it must read fully "on"). A genuinely new
severity need is a design decision to raise explicitly, not a reach for `red-500`.

## Typography

**Display/Headline/Title/Body Font:** Mona Sans (with `ui-sans-serif, system-ui,
-apple-system, "Segoe UI", Helvetica, Arial, sans-serif` fallback)
**Label Font:** Mona Sans, always uppercase and wide-tracked
**Mono Font:** Geist Mono (with `ui-monospace, SFMono-Regular, Menlo, "Courier New",
monospace` fallback) - reserved for numerals via `tabular-nums`, not run as body text

**Character:** One typeface family carries the entire hierarchy; distinction comes from
size, weight, tracking, and case rather than from mixing families. Mona Sans's geometric
regularity reads as precision-instrument-adjacent even at display size.

### Hierarchy
- **Display** (600, 56px, leading-none, tracking -0.02em): the storefront hero headline
  only - one use per page, at most.
- **Headline** (600, 30-36px responsive, tight leading, tracking -0.01em): page-level
  titles on content pages (contact, newsletter, legal, error/placeholder states).
- **Title** (600, 24px, tracking -0.01em): admin page titles and in-page section headers
  ("You may also like").
- **Body** (400, 14-16px, `text-muted-foreground` when secondary, `leading-[1.55]` for
  anything longer than a line): everything else, including PDP description copy.
- **Label** (500, 11px, tracking 0.08em, uppercase, `text-muted-foreground` by default):
  brand kickers, section labels, stock/status text, table headers - always through the
  `Eyebrow` primitive, never retyped inline.

### Named Rules
**The One Family Rule.** Every text role is Mona Sans. A second typeface is never
introduced to signal hierarchy - size, weight, tracking, and case already do that job.

**The Tabular Numerals Rule.** Price, quantity, and count digits always carry
`tabular-nums` so they don't visually jitter as they update or align in a column.

## Layout

Content is capped at a `1440px` container (`mx-auto max-w-[1440px]`) with responsive
horizontal padding: `px-6` mobile, `md:px-12` at medium and up, `lg:px-20` at the largest
breakpoint. This exact `px-6 md:px-12 lg:px-20` scale is shared by every full-width
section - header, footer, hero, filter row, catalog grid, PDP - so their content shares
one left/right edge at every viewport width; don't introduce a fourth variant. Narrow,
single-column content pages (contact, newsletter,
legal, placeholder/error states) use a tighter centered container (480-720px) instead of
the full-width grid. The header is a fixed `h-16` bar; the cart drawer is a fixed
`max-w-[420px]` panel sliding from the right edge.

Spacing runs on an 8px rhythm (`8px / 16px / 24px / 48px` show up repeatedly as gaps,
padding, and vertical section rhythm) rather than a dense custom scale.

## Elevation & Depth

Doxa is flat by construction, not flat by default-and-occasionally-broken: there are no
`box-shadow` utilities anywhere in the system. Depth and separation are conveyed entirely
through a single 1px `border-border` line and, secondarily, through the `paper-muted`
background as a subtle tonal layer (hover fills, secondary surfaces).

### Named Rules
**The Border-Only Rule.** If something needs to look contained, separated, or "above" its
surroundings, the answer is a 1px border, never a shadow. This is an invariant, not a
starting point to relax later.

## Shapes

Zero radius is the default for every structural surface - buttons, inputs, cards, chips,
panels. The only two exceptions are icon-only affordances (`IconButton`, Tailwind's
default `rounded`, ~4px) and circular elements (swatches, avatars, `rounded-full`). A new
component reaching for any radius outside those two cases is off-language by definition.

## Components

Every interactive primitive is restrained and exact: state changes are signaled through
weight, opacity, border, and a small active-state scale-down - never through color or
shadow.

### Buttons
- **Shape:** flat, zero radius.
- **Two registers, never blended:** *Prominent CTA* is normal-case `text-sm font-medium`
  at `h-9/h-12/h-14` (hero, "Add to bag") via `Button`/`buttonVariants`
  (`primary`/`secondary`/`ghost`). *Compact action* is `text-xs font-medium uppercase
  tracking-[0.08em]` (admin toolbar/row actions) - typographic, styled like an `Eyebrow`
  on an interactive element, never forced through the normal-case `Button` component.
- **Primary:** `bg-accent text-accent-foreground`, `hover:opacity-90`.
- **Secondary:** `border border-border text-foreground`, `hover:border-muted-foreground`.
- **Ghost:** `text-muted-foreground`, `hover:text-foreground`.
- **Press feedback:** `active:scale-[0.97]` on every variant - the one place the system
  uses transform instead of color for feedback.
- **Disabled:** `opacity-40 cursor-not-allowed`.

### Badges / Chips
- **Style:** `text-[11px] font-medium uppercase tracking-[0.08em]`, three variants -
  `subtle` (`bg-muted text-foreground`), `outline` (`border border-border`), `solid`
  (`bg-accent text-accent-foreground`).
- **Use:** active-filter chips and any other state-as-label affordance; no color coding,
  same weight/border/fill vocabulary as everything else.

### Cards / Containers
- **Corner Style:** zero radius.
- **Background:** `bg-background`.
- **Shadow Strategy:** none - see Elevation & Depth.
- **Border:** 1px `border-border`, the only containment device.
- **Internal Padding:** `p-6` (24px).

### Inputs / Fields
- **Style:** `border border-border bg-background`, zero radius, `text-sm` (or `text-xs`
  in the `compact` variant used for table-row selects/filter fields).
- **Focus:** `border-accent` plus the global 2px accent outline (see Focus below) - no
  glow, no ring utility.
- **Disabled:** `opacity-40 cursor-not-allowed`.

### Focus (system-wide, not per-component)
A single global rule (`:focus-visible { outline: 2px solid var(--accent); outline-offset:
2px }`) covers every interactive element. No component defines its own focus style; a
wrong-looking outline is fixed at the base rule, never locally overridden.

### Navigation
Header nav links are `text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground`
with a `hover:text-foreground` transition and a `border-b border-transparent` reserved for
an active-state underline. The wordmark is set in heavy tracked caps
(`text-xl font-bold tracking-[0.2em]` in the header/sidebar, `text-3xl` with
`tracking-[0.25em]` in the footer) - the one place the system permits a bold weight beyond
600.

### The Doxa Face (signature component)
A single hand-drawn illustrated character - a watch case drawn as a face (case, lugs,
crown), stroke-only in `currentColor` - used across empty and error states in three moods
(`calm`, `lost`, `broken`; hands positioned at 10:10 for `calm`, the classic "smiling
watch" pose real watch photography shoots for). This is the system's only illustration and
its only permitted representational icon - no emoji, no stock icon set, ever substitutes
for it.

### Motion
- **Hover/focus feedback:** `transition-colors` for color/background-only changes,
  `transition`/`transition-opacity` where a primary button's hover fades opacity; default
  duration 150ms.
- **Large-surface moments:** `duration-500` (the product-card image hover-zoom is the
  reference case).
- **Press feedback:** `active:scale-[0.97]` (buttons) / `active:scale-[0.94]` (icon
  buttons) instead of a color change.
- **Signature transition:** a `View Transition`-driven image morph (catalog/related card
  -> PDP gallery, 320ms) with a brief mid-flight blur to hide pixel-interpolation
  artifacts during the crop resize - a hand-off, not a show.
- **Respect for reduced motion:** every animation collapses to `0s` under
  `prefers-reduced-motion: reduce`, including the signature morph.

### Named Rules
**The Purposeful Motion Rule.** Motion always marks a real state change or hand-off
(hover, press, selection, a navigation transition) - never runs as ambient decoration.
Consistency and restraint matter more than novelty: reuse the existing duration/easing
vocabulary before inventing a new one.

## Do's and Don'ts

### Do:
- **Do** use a 1px `border-border` for every containment need - cards, inputs, dividers,
  panels.
- **Do** route all text through the five typographic roles (Display/Headline/Title/Body/
  Label) and their exact weight/tracking values rather than picking an arbitrary size.
- **Do** signal state (error, disabled, selected, active) through weight, underline,
  opacity, or fill - never through hue.
- **Do** keep motion purposeful and consistent with the existing duration/easing
  vocabulary (150ms feedback, 500ms large-surface, the 320ms morph).
- **Do** reach for The Doxa Face before any other icon/illustration for empty or error
  states.

### Don't:
- **Don't** add `shadow-*` utilities anywhere - depth is a border, never a shadow.
- **Don't** add a radius to a structural surface (buttons, inputs, cards, chips, panels) -
  the only exceptions are small icon affordances and circular elements.
- **Don't** reach for `red-500`/`green-500`/`amber-500` or any semantic hue for errors,
  warnings, or success states - use weight/underline/opacity/fill instead, and raise a
  genuinely new severity need as a design decision first.
- **Don't** drift toward gold-gradient "heritage luxury" styling or bright, rounded,
  playful DTC-ecommerce styling - the system sits deliberately between both.
- **Don't** introduce a second illustration style, emoji, or stock icon set alongside The
  Doxa Face.
- **Don't** animate decoratively - every transition should be traceable to a real state
  change or hand-off.
