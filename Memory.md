# Memory — Project State

Living record of what exists, what was decided, and what comes next.
Updated at the end of every phase (Rules.md §24).

---

## Current position

| | |
|---|---|
| **Active phase** | Phase 0 complete — Phase 1 next |
| **App state** | Boots, builds clean, no TypeScript or lint errors |
| **Database** | Not provisioned. All reads degrade to empty state. |

---

## Completed work

### Phase 0 — Project Foundation
- Next.js App Router project, TypeScript strict mode (plus `noUncheckedIndexedAccess`).
- Tailwind CSS v4 with the full `Design.md` token set defined in `src/styles/globals.css` (`@theme`).
- ESLint flat config (`eslint-config-next` core-web-vitals + typescript).
- Folder structure per `Architecture.md` §5.
- Base layout, Inter + Manrope fonts, skip link, focus styles, reduced-motion handling.
- Reusable primitives: `Button` / `LinkButton` / `ExternalLinkButton`, `Container`, `Section`,
  `SectionHeader`, `Card` family, `DataRow`, `Badge`, `EmptyState`, `Pending`.
- Responsive header (desktop dropdowns + client mobile panel) and information-rich footer.
- Placeholder logo mark — geometric, not an invented brand identity.
- `not-found.tsx` and `error.tsx`.
- `.env.example` covering app, Supabase, mail, analytics and WhatsApp configuration.
- Supabase server/service/browser client factories.
- `buildMetadata()` / `buildCanonicalUrl()` SEO helpers.

---

## Key decisions

1. **Next.js 16.3.1, not 15.1.x.** The 15.1.6 release carries a published CVE
   (CVE-2025-66478). 16.x is the current patched line and still satisfies the
   `Architecture.md` requirement of "Next.js 15+". Consequence: `next lint` is
   removed in 16, so `npm run lint` calls `eslint` directly with a flat config.

2. **Graceful degradation when Supabase is unconfigured.** Every client factory
   returns `null` rather than throwing, and every data function returns an empty
   result. The site stays renderable before the client's database exists, and it
   can never silently fall back to invented content.

3. **`[CLIENT TO PROVIDE]` placeholders cannot reach production.**
   `src/lib/content/placeholder.ts` renders markers only when
   `NEXT_PUBLIC_APP_ENV !== "production"`; in production the field is omitted.
   `withoutPlaceholder()` strips them from metadata, schema and email.

4. **No mail SDK dependency.** The transactional email provider is called over
   its HTTP API behind a small mail-service interface (`Architecture.md` §2,
   Rules.md §10), so no extra package is installed for it.

5. **One button component, one card component.** Variants are handled by
   `class-variance-authority`, not by parallel component names (Rules.md §11).

6. **No company facts are invented.** There is no client-supplied data yet, so
   company name, addresses, CIN/GST/licence numbers, statistics, products,
   people and certificates all render as placeholders or empty states.

---

## Known gaps / open items

- **No client business data at all.** Every factual field is a placeholder. The
  site is structurally complete but not launchable until real content is loaded.
- Supabase project is not provisioned; migrations exist as SQL files but have not
  been applied anywhere.
- Placeholder logo mark must be replaced with the client's logo.

---

## Next step

Phase 1 — Legal, core infrastructure and contact: legal routes, contact page,
enquiry schema and forms (general / business / product), cookie consent,
rate limiting and mail notifications.
