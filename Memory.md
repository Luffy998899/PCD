# Memory — Project State

Living record of what exists, what was decided, and what comes next.
Updated at the end of every phase (Rules.md §24).

---

## Current position

| | |
|---|---|
| **Active phase** | Phase 3 complete — Phase 4 next |
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

### Phase 1 — Legal, Core Infrastructure & Contact
- Migration `0001_foundation.sql`: `site_settings` (single row), `offices`,
  `department_contacts`, `enquiries`, with RLS enabled on all four. Visitors can
  insert an enquiry and never select one.
- Enquiry system: Zod schemas shared by client and server, a single
  `submitEnquiry` server action (validate → anti-spam → rate limit → insert →
  notify), honeypot + submit-timing checks, in-process rate limiter.
- One reusable `EnquiryForm` driving all variants; accessible field primitives
  with visible labels, required markers and associated errors.
- Mail service over the provider's HTTP API. Delivery failure never discards a
  persisted enquiry; adverse-event narratives are excluded from notification
  email and read in the admin instead.
- Legal pages: Privacy Policy, Terms of Use, Disclaimer, Anti-Counterfeit Notice
  in `src/data/legal.ts`, with `{{token}}` substitution from `site_settings`.
- Human-readable `/sitemap`, contact hub with equal-weight enquiry routes,
  business / product / grievance enquiry pages.
- Cookie consent via `useSyncExternalStore` (analytics opt-in, reopenable from
  the footer).
- `Breadcrumbs` with BreadcrumbList schema, `PageHero`, `JsonLd`, `DevNote`.

### Phase 2 — About & Corporate Authority
- Migration `0002_about.sql`: `content_blocks`, `people`, `milestones`,
  `core_values`, `awards`, each with publish status, provenance columns and a
  published-only public read policy.
- `content_blocks` is a shared, page-keyed store for editable narrative copy,
  reused by later phases instead of a new table per page.
- Routes: `/about` hub plus overview, vision & mission, chairman's message,
  board, leadership, milestones, values and awards.
- `PeopleCard` renders a neutral monogram when no photograph exists — no stock
  portrait ever stands in for a named individual.
- Milestones and awards display their `source_reference` where recorded.
- Admin-entered body copy is rendered as text nodes, never as raw HTML.

### Phase 3 — Science, Manufacturing & Quality
- Migration `0003_science_quality.sql`: `facilities`, `facility_specs`,
  `certificates`, `quality_tests`, `regulatory_items`,
  `pharmacovigilance_reports`.
- `facility_specs` stores label/value rows instead of fixed columns, so the
  company publishes only the figures it can evidence and simply omits the rest.
- `CertificateCard` always shows the issuing body and validity; a lapsed
  certificate is labelled rather than presented as current.
- Routes: `/science-quality` hub, R&D, manufacturing (with per-facility
  technical tables that scroll horizontally on mobile), quality, certifications,
  regulatory, pharmacovigilance.
- Pharmacovigilance reporting is a separate table, form and server action from
  enquiries: different retention, different access, different workflow. The
  narrative is never logged and never included in notification email.

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

6. **Legal copy describes real site behaviour.** The legal documents state what
   this website actually does — which fields the forms collect, where data is
   stored, which cookies are set — because that is verifiable from the code.
   Company-specific facts are tokens that resolve from `site_settings`, and each
   document carries a development-only reminder that the client's legal adviser
   must approve it.

7. **`DevNote` is separate from `Pending`.** A build-team reminder is not a
   missing client fact; conflating them would have produced misleading
   `[CLIENT TO PROVIDE]` markers.

8. **No company facts are invented.** There is no client-supplied data yet, so
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

Phase 4 — Products & product catalogue: product schema, therapies, divisions,
dosage forms, listing with filters, product detail pages with prescribing
information, product enquiry and Product schema.
