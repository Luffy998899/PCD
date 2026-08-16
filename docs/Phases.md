# PCD Pharma Website — Implementation Phases

## Delivery Principle

Build in vertical slices. Keep the application runnable after every phase.

Do not try to implement the entire site in one Claude Code prompt.

Each phase must end with:
- working code
- no known blocking TypeScript/build errors
- updated navigation if routes changed
- updated `Memory.md`
- a short verification report

---

# Phase 0 — Project Foundation

### Goal
Create the base Next.js application and engineering standards.

### Build
- Next.js App Router
- TypeScript strict mode
- Tailwind
- shadcn/ui basics
- ESLint
- environment variable structure
- base layout
- global styles
- typography setup
- placeholder logo
- responsive header/footer shell

### Deliverables
- app boots locally
- clean build
- `.env.example`
- folder structure from `Architecture.md`

### Do not build
- full homepage
- product system
- admin

---

# Phase 1 — Legal, Core Infrastructure & Contact

### Goal
Get the public site foundation and compliance-critical routes online first.

### Build
- Home shell
- Contact
- Privacy Policy
- Terms
- Disclaimer
- Sitemap
- Anti-Counterfeit
- 404 page
- global error handling
- contact details model
- enquiry system foundation
- cookie consent

### Forms
- General enquiry
- Business / distribution enquiry
- Product / medical enquiry

### Acceptance
- form submissions reach database
- success/error states work
- mobile forms work
- legal navigation is accessible

---

# Phase 2 — About & Corporate Authority

### Goal
Build the trust layer before sales-heavy sections.

### Build
- Company overview
- Vision & Mission
- Founder/Chairman message
- Board of Directors
- Leadership & Core Team
- Milestones
- Values / Code of Ethics
- Awards

### Data
Create admin/content models for people and corporate facts.

### Acceptance
- all visible claims are data-driven
- photos support alt text
- leadership profiles are reusable components

---

# Phase 3 — Science, Manufacturing & Quality

### Goal
Build the strongest evidence/authority section.

### Build
- Science & Quality overview
- R&D
- Manufacturing
- QA/QC
- Certifications
- Regulatory compliance
- Pharmacovigilance

### Documents
- certificates
- sample CoA
- regulatory documents

### Acceptance
- certificates have metadata
- downloads work
- pharmacovigilance form is protected
- unsupported badges are not shown

---

# Phase 4 — Products & Product Catalogue

### Goal
Create the core searchable product system.

### Build
- Product DB schema
- therapies
- divisions
- dosage forms
- product listing
- filters
- product detail pages
- product image gallery
- prescribing information
- product catalogue download
- product enquiry

### SEO
- product metadata
- Product schema
- sitemap integration

### Acceptance
- no hardcoded product catalogues
- filters are useful and fast
- empty states exist
- each published product has a canonical URL

---

# Phase 5 — Divisions & Partner With Us

### Goal
Create the primary B2B conversion experience without hype.

### Build
- Divisions overview
- Ethical
- PCD Franchise
- OTC / Consumer
- Institutional / Government
- Export
- Contract Manufacturing only if applicable
- Partner With Us

### Partner content
- eligibility
- documents
- support
- territory model
- onboarding steps
- enquiry form

### Acceptance
- Partner CTA is clear but not aggressive
- no ROI calculator
- no fake territory checker
- no fake availability

---

# Phase 6 — Network & Reach

### Goal
Present actual operating footprint.

### Build
- Network overview
- India presence
- state/district coverage
- distributors/stockists
- global presence
- export countries
- Find a Pharmacy only with genuine data

### Acceptance
- maps represent real data only
- counts derive from database where possible
- no fabricated coverage

---

# Phase 7 — Media, Blogs & Downloads

### Goal
Build the content/SEO engine.

### Build
- Press releases
- News
- Blogs
- Gallery
- Downloads
- Events

### Blog features
- categories
- author
- publish date
- medically reviewed label
- SEO metadata
- article schema
- related products/therapies

### Acceptance
- publishing flow works
- draft articles are hidden
- social metadata exists

---

# Phase 8 — Careers

### Goal
Create a credible hiring experience.

### Build
- Life at company
- Why work with us
- Current openings
- Opening detail pages
- CV upload/application

### Acceptance
- private CV storage
- admin can change job status
- application flow is reliable

---

# Phase 9 — Homepage Assembly

### Goal
Build the homepage from validated inner-page content.

### Order
1. Hero
2. Snapshot
3. About
4. Divisions
5. Therapies
6. Science/Manufacturing/Quality
7. Certifications
8. Network
9. Leadership
10. Clients/Partners/Associations
11. News/Blogs
12. Careers
13. Enquiry strip
14. Footer

### Rules
- Hero is company-first
- max two hero buttons
- no discount language
- no ROI
- no fake stats
- no animated counters

### Acceptance
Homepage reads like one coherent company story, not a collection of unrelated sections.

---

# Phase 10 — SEO, Analytics, Accessibility & Performance

### Goal
Production hardening.

### Build
- GA4
- Search Console setup
- Organization schema
- LocalBusiness schema where valid
- Product schema
- Article schema
- Breadcrumb schema
- FAQ schema only where appropriate
- sitemap
- robots
- canonical tags
- Open Graph
- Twitter/X cards
- image optimization
- font optimization
- accessibility pass
- performance pass

### Targets
- strong Core Web Vitals
- mobile-first
- high accessibility quality
- no broken metadata

---

# Phase 11 — Admin Polish & Content Operations

### Goal
Make the site operational for a non-developer team.

### Build
- content dashboard
- draft/published workflow
- product management
- certificates
- media management
- enquiries
- careers
- SEO fields
- role permissions
- audit-friendly change records

### Acceptance
A trained internal content user can update the site without touching code.

---

# Phase 12 — Final Launch Readiness

### Checklist
- verified legal company data
- verified certificates
- verified product data
- verified leadership profiles
- verified network numbers
- verified contact details
- official domain configured
- official email configured
- SSL active
- analytics configured
- Search Console configured
- sitemap submitted
- forms tested
- email delivery tested
- mobile tested
- accessibility checked
- 404 tested
- no placeholder content
- no fake claims
- no stock photos presented as real company assets

### Final Rule
Do not launch a page just because the route exists. Launch when the content is accurate, useful, and supported by evidence.
