# Tindahan

An inventory and point-of-sale system for small stores — designed to help store
owners manage products, monitor inventory, process sales, and track
transactions efficiently. It reduces manual record-keeping and gives daily store
operations one organized place to look.

> **This is a demo build.** There is no server, no database, no authentication,
> and nothing is collected about you. All data lives in your browser's memory
> for the length of the session.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run verify` | Domain checks — search ranking, stock states, formatting |

## Routes

| Route | What it does |
| --- | --- |
| `/` | Landing page |
| `/pos` | Checkout. Add items, adjust quantities, take payment. Completing a sale decrements stock. |
| `/inventory` | Product list with search, low-stock filters, inline quantity adjust, and restock |
| `/sales` | Transaction log, revenue by day, top sellers, and what needs restocking |
| `/products` | Add and edit products |

## How the demo handles data

State lives in a React reducer in `src/lib/store.tsx` and is seeded from
`src/lib/data.ts` (36 sample products with real PH prices) and
`src/lib/seed-sales.ts` (three days of transactions).

- **Refreshing restores the seed data.** Nothing is persisted.
- A `beforeunload` prompt appears when there is unsaved work. Note the browser
  controls that dialog's wording, it does not fire on in-app navigation, and
  iOS Safari only prompts after the user has interacted with the page.
- **Reset demo data** in the header is the reliable recovery path.
- A sale completed in the session is marked with a real receipt number;
  seeded transactions are labelled *Sample*.

## Why products have no barcode or SKU

The demo does no barcode scanning, so a product's **name is its only
identifier**. That makes typing the critical interaction at the counter, so
`searchProducts` in `src/lib/format.ts` is built accordingly:

- **Subsequence matching** — `sanmig` finds *San Miguel Pale Pilsen*. A
  store owner types the sound, not the exact spelling.
- **Ranking** — a name prefix beats a word-prefix, which beats a substring,
  which beats a subsequence. Shorter names win ties.
- **Nickname aliases** — `coke` reaches *Coca-Cola 1.5L*, which is impossible
  from the name alone because it contains no "k". A real name match always
  outranks an alias.
- **Compactness guard** — short queries can't match everything.

Stock is a `number`, not an integer, and every product carries a `unit`
(`pc`, `pack`, `box`, `kg`, `ml`). Palay is tracked in fractional kilos, so
`2.5 kg` is a real quantity while `0.5` without a unit would be meaningless.

## Design system

Defined once in `src/app/globals.css` as Tailwind v4 `@theme` tokens.

- **Palette** — warm kraft-paper neutrals with a single bamboo-green accent.
  Red appears only for out-of-stock and running-low states, never decoratively.
- **Type** — Gabarito (display) and Instrument Sans (body), two weights each,
  with tabular figures on money and counts.
- **Spacing** — page rhythm is a named scale (`py-section`,
  `px-gutter-md`, `spacing-stack`) enforced by the `Container` and `Section`
  components. No one-off spacing values.
- **Motion** — three animations, all gated on `prefers-reduced-motion`:
  `BlurText` on the hero headline, GSAP scroll reveals on sections, and the
  animated sale feed in the Features panel.

React Bits' `AnimatedList` was installed and then replaced — it hard-codes a
500px width and dark palette and installs a window-level Tab handler that
breaks keyboard navigation. `src/components/SaleFeed.tsx` keeps the animation
using the app's own tokens.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · shadcn/ui · motion ·
GSAP · lucide-react
