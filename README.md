# PCD Pharma Website

Corporate authority and lead-generation website for an Indian PCD / ethical
pharmaceutical company. Not an e-commerce storefront.

## Specification

The build is governed by the documents in [`docs/`](./docs):

| Document | Purpose |
|---|---|
| [`docs/PRD.md`](./docs/PRD.md) | What to build |
| [`docs/Architecture.md`](./docs/Architecture.md) | How to build it |
| [`docs/Rules.md`](./docs/Rules.md) | What must and must not be done |
| [`docs/Phases.md`](./docs/Phases.md) | Build order |
| [`docs/Design.md`](./docs/Design.md) | Visual system |
| [`Memory.md`](./Memory.md) | Ongoing project state, decisions and next step |

When instructions conflict, `Rules.md` §0 sets the priority order:
legal/safety → truthfulness → PRD → architecture → design → convenience.

## Stack

- Next.js (App Router) + TypeScript strict mode
- Tailwind CSS v4, design tokens defined in `src/styles/globals.css`
- Supabase (PostgreSQL, Auth, Storage)
- React Hook Form + Zod
- Lucide icons

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in what you have; the app runs without it
npm run dev
```

The site renders without Supabase configured. Every database-backed surface
falls back to an empty state rather than to sample content.

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run build       # production build
npm run verify      # all three
```

## Content integrity

This repository contains **no invented business facts**. Company details,
statistics, products, certificates, people and network coverage are all
database-driven.

Fields the client has not yet supplied render as a visible
`[CLIENT TO PROVIDE: …]` marker while `NEXT_PUBLIC_APP_ENV` is not
`production`, and are omitted entirely when it is. Placeholder text is stripped
from page metadata, structured data and outbound email.

Set `NEXT_PUBLIC_APP_ENV=production` for any public deployment.

## Demo mode

To see every page filled in before real content exists:

```bash
echo "NEXT_PUBLIC_DEMO_MODE=1" >> .env.local
npm run dev
```

This populates the whole site from a fictional company — Nirvaan Lifesciences —
with 16 products across 6 therapies, 2 manufacturing units with technical
tables, 5 certificates (one deliberately expired, to show how a lapsed
certificate is presented), 19 states and 49 districts of coverage, 8 export
markets, leadership and board profiles, articles, jobs and testimonials.

Two things make it safe:

- **It cannot be enabled in production.** `NEXT_PUBLIC_APP_ENV=production`
  short-circuits the check regardless of the flag, and `npm run check:launch`
  fails a production build that has the flag set.
- **It is obviously fictional.** Registration numbers are prefixed `DEMO-`,
  and a banner sits above every page while the mode is on.

Imagery is abstract SVG in `public/demo/`, labelled as illustrative. Photographs
of facilities, people or packs are never generated — a demo asset that looks
like a real photograph is the one most likely to reach production by accident
(`Rules.md` §14).

## Troubleshooting

### `Cannot find native binding` / `Cannot find module '@tailwindcss/oxide-*'`

**This repairs itself.** Tailwind v4 compiles CSS through a platform-specific
native binary shipped as an *optional* dependency, and npm skips optional
dependencies in several situations: the long-standing bug in
[npm/cli#4828](https://github.com/npm/cli/issues/4828), an `omit=optional`
setting, or a `node_modules` tree created on a different platform (common with
containers and devcontainer volumes).

`scripts/ensure-native-deps.mjs` detects that state and installs the correct
binary for the current platform. It runs automatically on `postinstall`, and
again before `npm run dev` and `npm run build`, so a missing binding is fixed
rather than surfacing as a PostCSS stack trace. It is a no-op when the binding
is already loadable, and it uses `--no-save`, so neither `package.json` nor the
lockfile is modified.

If the automatic repair cannot fix it, the script prints the manual fallback:

```bash
rm -rf node_modules package-lock.json
npm install
```

In a devcontainer, also check that `node_modules` is not bind-mounted from the
host — a tree installed on another platform will keep failing.

## Database

SQL migrations live in [`supabase/migrations`](./supabase/migrations) and are
applied in filename order. Tables are introduced by the phase that needs them.
