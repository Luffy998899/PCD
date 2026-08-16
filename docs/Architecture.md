# PCD Pharma Website — Architecture

## 1. Architectural Goal

Create a production-grade, content-driven pharmaceutical corporate website that is easy for Claude Code to implement incrementally and easy for the company to maintain after launch.

Architecture priorities:
1. Content correctness
2. SEO
3. Performance
4. Accessibility
5. Security
6. Maintainability
7. Visual polish

## 2. Recommended Stack

### Frontend / Application
- Next.js 15+ with App Router
- TypeScript strict mode
- React
- Tailwind CSS
- shadcn/ui for reusable primitives
- Lucide React for icons

### Backend / Data
- Supabase PostgreSQL
- Supabase Auth for admin authentication
- Supabase Storage for certificates, brochures, CVs, product images, leadership photos, gallery assets
- Server Actions / Route Handlers for trusted mutations and integrations

### Forms / Validation
- React Hook Form
- Zod

### Email
Use a transactional email provider such as Resend or Brevo. Keep provider-specific logic behind a small mail service interface.

### Maps
Prefer Google Maps or Mapbox only when actual office/network data is supplied. Do not build decorative maps that imply coverage that does not exist.

### Analytics
- Google Analytics 4
- Google Search Console

## 3. Rendering Strategy

Use Server Components by default.

Use Client Components only when interaction requires them, for example:
- Product filtering
- Mobile navigation
- Forms
- Maps
- Image galleries
- Admin UI
- Interactive India/network visualizations

Use static generation / ISR for stable public content where possible.

Use server-side fetching for SEO-critical content.

## 4. High-Level Request Flow

```text
Browser
  |
  v
Next.js App Router
  |
  +--> Public route
  |      |
  |      +--> SEO metadata
  |      +--> Server component
  |      +--> Supabase read
  |      +--> Render HTML
  |
  +--> Form submission
  |      |
  |      +--> Zod validation
  |      +--> Server Action / Route Handler
  |      +--> Supabase insert
  |      +--> Email notification
  |      +--> Success state
  |
  +--> Admin route
         |
         +--> Auth check
         +--> Role check
         +--> CRUD via server-side operations
         +--> Supabase
```

## 5. Folder Structure

Keep the structure compact. Do not create dozens of micro-folders.

```text
src/
  app/
    (marketing)/
      page.tsx
      about/
      divisions/
      products/
      science-quality/
      network/
      media/
      careers/
      contact/
    admin/
      login/
      dashboard/
      products/
      content/
      enquiries/
      media/
      careers/
    api/
      ...
    sitemap.ts
    robots.ts
    layout.tsx
    not-found.tsx
    error.tsx
  components/
    layout/
    sections/
    products/
    forms/
    ui/
    seo/
  lib/
    supabase/
    validation/
    mail/
    seo/
    utils.ts
    constants.ts
  data/
    navigation.ts
    legal.ts
  types/
    database.ts
    content.ts
  styles/
    globals.css
```

## 6. Route Model

### Public

```text
/
/about
/about/overview
/about/vision-mission
/about/chairman-message
/about/board
/about/leadership
/about/milestones
/about/values
/about/awards

/divisions
/divisions/ethical
/divisions/pcd
/divisions/otc
/divisions/institutional
/divisions/export
/divisions/contract-manufacturing

/products
/products/[slug]
/products/therapy/[slug]
/products/division/[slug]
/products/dosage-form/[slug]
/products/catalogue
/products/prescribing-information

/science-quality
/science-quality/rd
/science-quality/manufacturing
/science-quality/quality
/science-quality/certifications
/science-quality/regulatory
/science-quality/pharmacovigilance

/network
/network/india
/network/global
/network/distributors
/network/partner-with-us
/network/find-a-pharmacy

/media
/media/press-releases
/media/news
/media/blogs
/media/blogs/[slug]
/media/gallery
/media/downloads
/media/events

/careers
/careers/life-at-company
/careers/why-work-with-us
/careers/openings
/careers/openings/[slug]
/careers/apply

/contact
/privacy-policy
/terms
/disclaimer
/anti-counterfeit
```

Remove routes that do not have real content. Do not publish empty pages solely to fill the sitemap.

## 7. Database Model

The schema should be normalized but not over-engineered.

Core tables:

```text
site_settings
navigation_items
seo_pages

companies
divisions
therapies
dosage_forms
products
product_images
product_documents

people
milestones
values
awards

facilities
quality_tests
certificates
regulatory_items

network_states
network_districts
network_countries
partners

articles
press_releases
events
gallery_items
downloads

testimonials
job_openings
job_applications

enquiries
pharmacovigilance_reports
gravience_reports

admin_users
```

Do not create every table on day one. Create tables as required by the implementation phase.

## 8. Important Product Schema

A product record should support at minimum:

```text
id
brand_name
slug
generic_composition
strength
pack_size
therapy_id
division_id
dosage_form_id
indications
directions
warnings
contraindications
side_effects
storage
manufactured_by
marketed_by
licence_number
prescribing_information_url
status
seo_title
seo_description
created_at
updated_at
```

## 9. Content Provenance

Every high-authority claim should be traceable internally.

For records containing factual claims, support optional fields:

```text
source_reference
source_document_url
source_note
verified_by
verified_at
valid_until
```

This makes it easier for admins to review certificates, numbers, capacity statements, and other claims before publishing.

## 10. Media Storage

Use structured folders/buckets:

```text
products/
certificates/
people/
facilities/
documents/
blogs/
gallery/
careers/cvs/
```

Validate uploads by MIME type, extension, file size, and authenticated role.

Do not expose CVs or private enquiry attachments publicly.

## 11. Authentication & Authorization

Use Supabase Auth.

Roles:
- super_admin
- content_admin
- sales_admin
- hr_admin
- quality_admin

Public users have no admin permissions.

Use Row Level Security where applicable.

Admin authorization must be enforced server-side. Hiding a button in the browser is not authorization.

## 12. Forms Architecture

All public forms follow this pattern:

```text
UI Form
  -> Client validation
  -> Server validation
  -> Anti-spam/rate limiting
  -> Database insert
  -> Optional email notification
  -> Audit/status
```

Implement server-side validation even when client-side validation exists.

## 13. SEO Architecture

Each content entity should expose metadata.

Utilities:
- `buildMetadata()`
- `buildCanonicalUrl()`
- schema helpers
- breadcrumb helpers

Schema should only be emitted when the underlying content is real and valid.

Use `generateMetadata` for dynamic pages.

Generate sitemap dynamically from published records.

## 14. Design System Architecture

Create shared primitives:
- Container
- SectionHeader
- Button
- LinkButton
- Badge
- Card
- StatCard
- Breadcrumbs
- PageHero
- ProductCard
- PeopleCard
- CertificateCard
- ArticleCard
- EnquiryForm
- DownloadCard

Do not create separate one-off button/card components for every section.

## 15. Error Handling

Required:
- Global error boundary
- Route-level `not-found.tsx`
- Friendly form errors
- Server logging
- No raw database/provider errors shown to users

User-facing errors must be clear and actionable.

## 16. Performance

- Prefer Next/Image
- Use appropriately sized images
- Lazy-load below-the-fold media
- Avoid giant client-side libraries
- Keep public pages mostly server-rendered
- Avoid layout shift
- Use font optimization
- Cache stable queries
- Paginate admin/content listings

## 17. Security

- No secrets in client components
- Use environment variables
- Restrict storage buckets
- Validate file uploads
- Sanitize / safely render rich content
- Add rate limiting to public forms
- Protect admin routes
- Add CSRF-safe mutation patterns appropriate to the framework
- Do not log medical form content unnecessarily

## 18. Accessibility

Minimum expectations:
- Keyboard navigation
- Visible focus state
- Semantic HTML
- Accessible form labels
- Alt text for meaningful images
- Empty alt for decorative images
- Sufficient contrast
- Reduced-motion support
- No information conveyed by color alone
- Mobile navigation operable without a mouse

## 19. Deployment

Preferred production platform:
- Vercel for Next.js
- Supabase for database/auth/storage

Production environment variables should be documented in `.env.example`.

## 20. Development Principle for Claude Code

Before creating a new abstraction, ask:
1. Is the pattern repeated?
2. Can an existing component serve the need?
3. Does the abstraction reduce complexity?

Prefer a small number of well-designed reusable components over an elaborate design-system framework.
