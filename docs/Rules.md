# PCD Pharma Website — Rules for Claude Code

## 0. Governing Rule

Follow this file together with `PRD.md`, `Architecture.md`, `Phases.md`, and `Design.md`.

When two instructions conflict, use this priority:

1. Legal/safety requirements
2. Truthfulness / verified client facts
3. PRD requirements
4. Architecture requirements
5. Design system
6. Developer convenience

Never resolve missing business facts by inventing them.

## 1. Never Fabricate Content

Do not invent:
- Company history
- Founders
- Directors
- Employees
- Certifications
- Licence numbers
- Manufacturing capacity
- Facility area
- Product compositions
- Product indications
- Product images
- Distributor counts
- State/district coverage
- Export countries
- Customer logos
- Testimonials
- Awards
- Revenue figures
- Investment ranges
- Margins
- Monopoly rights
- Clinical claims

Use explicit placeholders such as `[CLIENT TO PROVIDE]` in development-only content, and prevent placeholder content from reaching production.

## 2. Medical Content Rule

Never create medical advice.

Never claim:
- cure
- guaranteed results
- disease prevention unless officially supported and appropriate
- clinically proven without a source
- 100% safe
- zero side effects
- guaranteed recovery

Use only approved client/regulatory content.

For relevant medicine pages, include:
> Consult your physician. Read the label carefully.

## 3. PCD Sales Rules

Allowed:
- Partner With Us
- PCD Franchise
- Distribution Enquiry
- Support model
- Territory information when verified
- Qualification/document requirements
- Real onboarding workflow

Not allowed:
- ROI calculator
- Earnings projection
- Fake margin claims
- Fake territory availability
- Countdown timers
- “Only 3 territories left”
- “Guaranteed business”
- “Earn ₹X per month”
- Fake live leads or partner counters

Do not use “Become a Distributor” in the header or homepage hero.

## 4. Product Sales Rules

The public pharmaceutical website is not a retail checkout.

Never add:
- Buy Now
- Add to Cart
- retail discounts
- coupon codes
- strike-through prices
- flash-sale badges
- scarcity counters

Use:
- Enquire About This Product
- Download Prescribing Information
- View Product Details

## 5. Button Rules

Header:
- One solid button only: Partner Login

Hero:
- Maximum 2 buttons

Each homepage section:
- Maximum 1 primary button

Product page:
- Enquire About This Product

Forms:
- Submit Enquiry / Apply Now / Report Complaint as appropriate

Do not turn every sentence into a CTA.

## 6. Content Tone

Use:
- Plain English
- Short sentences
- Specific language
- Evidence-led statements
- Professional and calm tone

Avoid:
- Fake corporate hype
- Excessive adjectives
- “World-class” without proof
- “Best in India” without evidence
- “Revolutionary” claims
- Emoji-heavy content
- Aggressive sales language

## 7. Claims and Numbers

Every meaningful number needs a source or date.

If data is missing:
- omit the number, or
- use a development placeholder that cannot ship

Do not use animated counters to create the impression of scale.

## 8. Reference Website Rule

Reference websites may inform:
- information architecture
- layout ideas
- content categories
- industry conventions

Do not copy:
- text
- code
- CSS
- imagery
- logos
- proprietary graphics
- exact layouts
- source code

Create an original visual system.

## 9. Technical Rules

Use:
- TypeScript strict mode
- Next.js App Router
- Server Components by default
- Tailwind CSS
- shadcn/ui where useful
- Zod validation
- React Hook Form for complex forms
- Supabase server-side access patterns

Avoid adding libraries without a concrete need.

Before installing a library, check whether the existing stack already provides the capability.

## 10. No Unnecessary Dependencies

Do not install a package merely for:
- a small utility function
- simple class concatenation if existing helpers are enough
- a simple modal if shadcn/ui already covers it
- simple date formatting if native/server functionality is sufficient

Document every non-obvious dependency.

## 11. Component Rules

Build reusable components around repeated patterns.

Do not:
- duplicate the same card 5 times with different component names
- create `PremiumProductCard`, `ModernProductCard`, `ElegantProductCard` for the same UI
- put entire pages into giant 1000+ line components

Pages compose sections. Components own reusable UI behavior.

## 12. Styling Rules

Use design tokens from `Design.md`.

Avoid:
- random hex colors scattered across components
- arbitrary font sizes on every element
- excessive gradients
- excessive glassmorphism
- huge rounded cards everywhere
- heavy animation

The design should feel premium, pharmaceutical, credible, and calm.

## 13. Animation Rules

Animation must communicate hierarchy or state.

Allowed:
- subtle section reveal
- small hover transitions
- mobile menu transition
- image fade/scale on hover

Not allowed:
- aggressive page transitions
- continuously moving content
- fake number counters
- distracting parallax
- infinite logo carousels unless justified

Respect `prefers-reduced-motion`.

## 14. Image Rules

Prefer real client assets for:
- products
- factory
- laboratories
- leadership
- certificates
- offices
- team

Do not use stock images as if they depict the actual company.

If temporary assets are required during development, label them internally and replace before launch.

## 15. Form Rules

Every form must have:
- server validation
- clear field labels
- accessible errors
- loading state
- success state
- failure state
- spam/rate-limit protection where public

Never silently discard submissions.

## 16. Admin Rules

Admin pages are private.

Never trust:
- client-side role checks
- hidden fields
- disabled buttons

Validate authorization on the server.

Audit sensitive changes where practical.

## 17. File Upload Rules

Validate:
- type
- extension
- file size
- authenticated user role

Private files such as CVs and sensitive reports must not be public bucket objects.

## 18. Error Rules

Never show users:
- SQL errors
- stack traces
- Supabase internals
- provider API keys
- raw validation internals

Log enough information for debugging without unnecessarily storing medical or personal data.

## 19. SEO Rules

Every public page needs:
- meaningful title
- meta description where useful
- canonical URL
- Open Graph metadata
- correct heading hierarchy
- breadcrumbs where appropriate

Never generate fake FAQ schema.
Never generate Product schema for incomplete or non-product pages.

## 20. Accessibility Rules

Minimum:
- WCAG-conscious contrast
- keyboard access
- semantic HTML
- labels for forms
- focus states
- useful alt text
- skip link
- reduced motion
- mobile usability

## 21. Data Model Rules

Do not put dynamic product/catalogue/lead data in hardcoded UI files.

Do not hardcode:
- product cards
- leader profiles
- certificate lists
- blog posts
- job openings
- enquiry data

Static navigation configuration is acceptable.

## 22. CMS / Content Rules

Published content must be explicitly marked published.

Draft content must never appear on public pages.

Deleted content must not leave broken public links where avoidable.

## 23. Testing Rules

Before marking a phase complete, verify:
- TypeScript passes
- lint passes
- build passes
- relevant routes render
- forms validate
- mobile layout works
- no obvious accessibility regressions
- no placeholder claims reached public output

## 24. Claude Code Workflow Rules

At the start of each session:
1. Read `PRD.md`.
2. Read `Architecture.md`.
3. Read `Rules.md`.
4. Read `Phases.md` and identify the active phase.
5. Read `Design.md`.
6. Read `Memory.md` when it exists.
7. Inspect the current code before modifying it.

Before changing architecture:
- explain the reason in the code/task notes
- avoid unnecessary rewrites
- preserve working functionality

After completing work:
- update `Memory.md`
- record completed work
- record important decisions
- record known issues
- record next step

## 25. Do Not Overbuild

Do not build V2 features during V1 phases.

Do not introduce:
- e-commerce
- medical AI
- patient portals
- CRM suites
- complex ERP functionality
- advanced recommendation engines

unless explicitly added to the PRD later.

## 26. Definition of Done

A feature is not done when it “looks right.”

It is done when:
- the requirement exists
- it is correctly wired to data
- it handles empty/loading/error states
- it is responsive
- it is accessible
- it is SEO-correct when public
- it does not invent facts
- relevant tests/build checks pass
