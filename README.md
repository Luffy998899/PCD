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

## Database

SQL migrations live in [`supabase/migrations`](./supabase/migrations) and are
applied in filename order. Tables are introduced by the phase that needs them.
