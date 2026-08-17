# Memory — Project State

Living record of what exists, what was decided, and what comes next.
Updated at the end of every phase (Rules.md §24).

---

## Current position

| | |
|---|---|
| **Active phase** | Phase 12 complete — all phases delivered |
| **App state** | Builds clean. 49 public routes + 7 admin routes. Typecheck, lint, build and launch gate all pass. |
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

### Phase 4 — Products & Product Catalogue
- Migration `0004_products.sql`: `divisions`, `therapies`, `dosage_forms`,
  `products`, `product_images`, `product_documents`, plus catalogue columns on
  `site_settings`.
- Image and document read policies check the parent product's status, so assets
  of a draft product are not reachable before it is published.
- Listing filters and search run in the database via a plain GET form: no
  client JavaScript required, every filter combination has a shareable URL, and
  results are crawlable. An unknown filter slug returns nothing rather than
  everything.
- Product detail page renders only the prescribing sections that have approved
  content, plus manufacturing details, documents, safety statement and an
  in-page product enquiry carrying product context.
- `Product` schema is emitted with no price, offer or availability — the site is
  not a storefront.
- `/sitemap.xml` and `/robots.ts`: robots disallows everything unless
  `NEXT_PUBLIC_APP_ENV=production`, so staging cannot be indexed.

### Phase 5 — Divisions & Partner With Us
- Navigation is now resolved against published records
  (`lib/content/navigation.ts`): the Divisions dropdown lists only divisions
  that exist in the database, and Products gains published therapies. Which
  divisions a company operates is a business fact, so it is no longer asserted
  by static config.
- `/divisions` overview and `/divisions/[slug]` detail pages, each showing the
  division's products and routing to the business enquiry.
- `/network/partner-with-us`: a qualification workflow driven by editable
  content blocks covering eligibility, documents, territory model, support,
  training, commercial terms and onboarding.
- The partner page states plainly what the company does **not** do — no earnings
  projections, no online territory availability, no payment before a written
  agreement. No ROI calculator, countdown, scarcity claim or fake counter exists
  anywhere in the codebase.

### Phase 6 — Network & Reach
- Migration `0005_network.sql`: `network_states`, `network_districts`,
  `network_countries`, `partners`.
- Coverage figures are counted from published rows at render time. No aggregate
  "states covered" value is stored anywhere, so a coverage number the underlying
  records do not support cannot be displayed.
- Coverage is presented as structured tables, not a decorative map or globe. A
  real map is added only once genuine location data exists (Design.md §15).
- A partner's contact details are published only when `consent_to_publish` is
  true — enforced in the RLS policy and repeated at the call site.
- `find-a-pharmacy` has no route: the page is created only if genuine
  pharmacy-level data is supplied (Architecture.md §6).

### Phase 7 — Media, Blogs & Downloads
- Migration `0006_media.sql`: `article_categories`, `articles`, `gallery_items`,
  `downloads`, `events`.
- Press releases, news and blogs share one `articles` table separated by
  `article_type`: same lifecycle, same SEO surface, same author model — three
  near-identical tables would have been duplication.
- A published article must have a publish date (DB constraint), and the read
  policy requires `published_at <= now()`, so drafts and scheduled posts cannot
  leak to public pages.
- `medically_reviewed` is only valid with a named reviewer, enforced by a DB
  check constraint as well as in the UI.
- Gallery `alt_text` is `not null` — an unlabelled image gallery is unusable
  with a screen reader.
- Article schema carries only real headline, dates and publisher; the related
  product link is re-checked against published status so removed products leave
  no broken links.
- Articles are added to the XML sitemap.

### Phase 8 — Careers
- Migration `0007_careers.sql`: `job_openings`, `job_applications`, and a
  **private** `private-documents` storage bucket with a 5 MB limit and a MIME
  allow-list.
- CVs are referenced by storage path, never by public URL. No storage policy
  grants anonymous access; uploads go through a server action using the service
  role, and admin downloads will use short-lived signed URLs.
- The CV storage path is derived from the role slug plus a random UUID — never
  from the uploaded file name — so a crafted name cannot escape the folder.
- If the application insert fails after upload, the orphaned file is removed.
- `hiring_status` is separate from `status`: a filled role stays reachable (so
  old links do not 404) but is `noindex`, and its form is replaced with a clear
  "this role is closed" panel.
- Applications are insert-only for the public; there is no public select policy.

### Phase 9 — Homepage Assembly
- Migration `0008_home.sql`: `founded_year` on `site_settings`, plus
  `memberships` and `testimonials`.
- A testimonial is readable only when `consent_on_file` is true — consent is
  part of the RLS read condition, not an admin convention — and always carries
  the person's name.
- Snapshot figures are derived: years in operation from the founding year,
  products counted from the catalogue, coverage counted from network rows. A
  figure with no underlying data is omitted, and none animate.
- Every homepage section returns `null` when its records do not exist, so the
  page never shows empty scaffolding.
- Hero is company-first with exactly two buttons; WhatsApp is a secondary text
  affordance. Each section has at most one primary button.
- The enquiry strip gives business and product/medical enquiries equal weight.
- Organization schema is emitted only once the company's real identity is known.

### Phase 10 — SEO, Analytics, Accessibility & Performance
- GA4 loads **only after** the visitor accepts analytics cookies — the script
  tag is not rendered before consent, so declining produces no analytics network
  request at all. Verified: the homepage HTML contains no googletagmanager
  reference.
- Conversion events wired per PRD §6: enquiry started/submitted, product enquiry
  started/submitted, partner enquiry, WhatsApp click, product search, product
  detail viewed, career application. Analytics is internal measurement only —
  no counter derived from it is ever displayed.
- LocalBusiness schema added to `/contact`, emitted only when a real company
  name and a published office both exist.
- **Contrast audit**: every token pair used for text was computed against WCAG.
  Three failed and were fixed by adding `--color-accent-strong` (#0F6B4C) and
  `--color-warning-strong` (#92400E) for accent/warning *text* on tinted
  backgrounds, and by raising input placeholder opacity. Fills keep the exact
  `Design.md` swatches. All pairs now ≥ 4.5:1.
- Automated audit across 9 representative pages: exactly one `h1` each, no
  heading-level skips, every `img` has `alt`, every form control is labelled,
  and title/canonical/og/lang/skip-link are present. All 49 public routes
  return 200.

### Phase 11 — Admin & Content Operations
- Migration `0009_admin.sql`: `admin_users` (auth user → role), `audit_log`, and
  `is_admin()` / `has_admin_role()` SECURITY DEFINER helpers used by every admin
  policy.
- **Authorization lives in the database.** Each content table gets an admin
  manage policy keyed on role; leads are readable by sales/content; safety
  reports by quality only; applications and the CV bucket by HR only. The UI
  checks the same rules, but the UI is not what protects the data.
- Being signed in grants nothing: a user needs an active `admin_users` row.
- Three independent gates: middleware (redirect), `requireAdmin()` per page and
  per action, and RLS.
- Admin routes are `force-dynamic` so a build performed without Supabase
  configured cannot prerender authenticated screens as static output.
- CVs are opened through a 5-minute signed URL requested by a server action; the
  URL never appears in page source, and every issue is audited.
- Audit rows are written on status changes, publish/unpublish and CV access. The
  safety-report audit summary deliberately carries no clinical detail.
- Screens: dashboard (role-scoped counts), enquiries, applications, safety
  reports, product publishing, and a page-content editor whose keys map to what
  the public pages read.

### Phase 12 — Launch Readiness
- `scripts/check-launch-readiness.mjs` (`npm run check:launch`), wired into
  `npm run verify`. With `NEXT_PUBLIC_APP_ENV=production` it is a **gate**: it
  exits non-zero on placeholder content in rendered output, a missing or
  non-https site URL, missing Supabase/mail configuration, or a service-role key
  exposed through a `NEXT_PUBLIC_` variable.
- The scan covers `.html` and `.rsc` output only. JavaScript chunks legitimately
  contain the marker string — it is the constant the placeholder system is built
  from, and the admin dashboard explains it in prose — so scanning them produced
  a false positive that was fixed.
- **Verified end to end**: a production build renders zero placeholders, and
  injecting one into the build output makes the gate exit 1.
- `docs/LAUNCH.md` carries the full checklist, including the content the company
  must supply and the features that are deliberately absent.

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

9. **Accessibility outranks the design swatch.** `Design.md`'s accent
   (#12805C) fails 4.5:1 as text on its own soft tint, and the PRD sets 4.5:1 as
   a requirement. Under the `Rules.md` §0 priority order the requirement wins,
   so a darker variant was added for text while fills keep the specified colour.

8. **No company facts are invented.** There is no client-supplied data yet, so
   company name, addresses, CIN/GST/licence numbers, statistics, products,
   people and certificates all render as placeholders or empty states.

### Post-delivery fixes
- Migrated `src/middleware.ts` to `src/proxy.ts` (Next.js 16 renamed the
  convention; the old one warns on every build). Re-verified admin gating after
  the rename rather than assuming it was safe.
- **Tailwind native-binding self-repair.** Tailwind v4 compiles CSS through a
  platform-specific native binary shipped as an optional dependency, which npm
  skips in several situations (npm/cli#4828, `omit=optional`, a `node_modules`
  tree built on another platform). The failure surfaces as a PostCSS stack
  trace that reads like a code fault. `scripts/ensure-native-deps.mjs` detects
  the missing binding, resolves the correct package for the running
  platform/libc, and installs it with `--no-save`. Wired to `postinstall`,
  `predev` and `prebuild`; no-op when healthy; guarded against the recursion
  caused by npm re-running `postinstall` during the repair install.
  Verified by deleting the binding and confirming `npm run build`, `npm run dev`
  and `npm ci` all recover on their own, with Tailwind emitting a full 55KB
  stylesheet containing the design tokens.

---

## Known gaps / open items

- **No client business data at all.** Every factual field is a placeholder. The
  site is structurally complete but not launchable until real content is loaded.
- Supabase project is not provisioned; migrations exist as SQL files but have not
  been applied anywhere.
- Placeholder logo mark must be replaced with the client's logo.

---

## Next step

All twelve phases are delivered. The site is structurally complete and cannot
launch with placeholder content, but it is **not launchable yet** because no
client business data exists. The next work is data entry and verification, not
development:

1. Provision Supabase and apply `supabase/migrations` in filename order.
2. Create a `super_admin` row in `admin_users`.
3. Populate `site_settings` (legal name, CIN, GST, licence, addresses, contacts,
   founding year), then products, certificates, people, facilities and network
   coverage.
4. Have the client's legal adviser approve the four legal documents.
5. Work through `docs/LAUNCH.md` and run `npm run verify` with
   `NEXT_PUBLIC_APP_ENV=production`.

Development still outstanding (all follow patterns already established in the
codebase, none blocking launch of the public site):

- Admin CRUD forms for certificates, people, facilities, network coverage,
  articles, gallery, downloads and events. Publishing and role enforcement
  already exist; these entities are currently populated through Supabase Studio
  rather than a bespoke form.
- Rate limiting is in-process; move it to a shared store if the site is
  deployed across multiple instances.
