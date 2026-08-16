# PCD Pharma Website — Design System

## 1. Design Direction

### Core feeling
- Pharmaceutical
- Premium
- Trustworthy
- Calm
- Modern
- Evidence-led
- Human

Avoid the typical low-trust “PCD brochure website” look.

The visual system should feel closer to a serious Indian healthcare company than an aggressive sales landing page.

## 2. Design Principles

1. Authority before decoration.
2. Clarity before cleverness.
3. Real photography before generic stock imagery.
4. Whitespace before density.
5. One clear CTA per section.
6. Strong typography and hierarchy.
7. Consistent product presentation.
8. Use color to establish trust, not to create urgency.

## 3. Color System

Use a light, clinical base with a deep primary brand color and a restrained accent.

### Base
```text
Background:        #F8FAFC
Surface:           #FFFFFF
Surface Subtle:    #F1F5F9
Text Primary:      #0F172A
Text Secondary:    #475569
Border:            #E2E8F0
```

### Primary
```text
Primary:           #0B3B5A
Primary Dark:      #082D45
Primary Soft:      #E8F1F6
```

### Accent
Use a restrained healthcare green for quality / positive states.

```text
Accent:            #12805C
Accent Soft:       #E8F5F0
```

### Semantic
```text
Success:           #15803D
Warning:           #B45309
Error:             #B91C1C
Info:              #0369A1
```

Do not use all colors at once. Most pages should visually rely on neutrals + primary, with accent used selectively.

## 4. Typography

Preferred font stack:
- Inter for UI/body
- Manrope or Geist Sans for major display headings if the project uses a second font

Keep typography restrained and editorial.

### Scale
```text
Display:   56–72px desktop / 40–48px mobile
H1:        44–56px / 34–40px
H2:        32–40px / 28–32px
H3:        24–30px / 22–26px
Body L:    18–20px
Body:      16px
Small:     14px
Caption:   12–13px
```

Use 1.1–1.25 line-height for headings and 1.5–1.75 for body copy.

## 5. Layout

Max content width:
- 1200–1280px

Desktop horizontal padding:
- 24–40px

Mobile horizontal padding:
- 18–20px

Section vertical spacing:
- Desktop: 88–128px
- Tablet: 72–96px
- Mobile: 56–72px

Do not make every section full-bleed. Use contained sections to create rhythm.

## 6. Header

Desktop:
- clean white or very light surface
- subtle bottom border
- compact logo area
- navigation with generous spacing
- Partner Login as the only solid button

Mobile:
- compact sticky header
- logo
- menu trigger
- Partner Login can remain visible only if space permits; otherwise place it inside the menu

Header should feel corporate, not like a SaaS dashboard.

## 7. Hero

The hero should be calm and confident.

Layout:
- left: company statement + support copy + 1–2 CTAs
- right: authentic company/facility/leadership image or carefully designed visual

Use one clear headline.

Avoid:
- giant sales statements
- price badges
- multiple popups
- rotating text gimmicks
- countdowns

## 8. Stats / Snapshot Strip

Use a clean horizontal strip or 4–6 cards.

Each stat:
- large number
- small label
- optional source/date in secondary content

No animated counters.

## 9. Cards

Card style:
- white surface
- thin border
- subtle shadow only when needed
- modest corner radius
- generous padding

Recommended radius:
- small: 8px
- medium: 12px
- large: 16px

Avoid extreme 32–48px corner radii across the entire site.

## 10. Product Cards

Product card hierarchy:
1. Product image
2. Brand name
3. Composition
4. Strength / pack size
5. Therapy/category
6. View Product link

Do not make product cards look like retail shopping cards.

## 11. Product Detail Page

Above the fold:
- product image gallery
- brand
- generic composition
- strength
- pack
- therapy
- enquiry CTA

Below:
- description
- indications
- directions
- warnings
- contraindications
- side effects
- storage
- manufacturing information
- documents

Use tabs or anchored sections only when they improve scanability.

## 12. Trust / Certificate Design

Certificate cards should show:
- certificate name
- issuing body
- certificate number
- validity
- View / Download action

Do not create fake “trust badge walls.”

## 13. Leadership Design

Use editorial profile cards.

Image:
- consistent crop
- high quality
- authentic

Content:
- name
- designation
- concise bio

Avoid social-media-style profile cards.

## 14. Manufacturing Design

Use strong real photography.

Recommended structure:
- hero image
- facility facts
- production capabilities
- QC capabilities
- gallery
- certificates

Use technical data tables where useful.

## 15. Network Design

Prefer real maps and structured coverage tables.

India coverage:
- map
- state list
- districts
- partners/distributors when verified

Global coverage:
- country list
- year of entry
- registration status where applicable

Do not use an attractive globe graphic with invented coverage.

## 16. Forms

Forms should look serious and easy to complete.

Use:
- visible labels
- clear required-field markers
- short helper text
- inline validation
- strong submit button

Avoid giant forms on every page.

For PCD forms, consider a step structure only when the number of required fields justifies it.

## 17. Enquiry Strip

Use two equal-weight cards/columns:
- Business / Distribution Enquiry
- Product / Medical Enquiry

Do not visually imply that distributors are more important than medical/product enquiries.

## 18. Blog / Media

Use an editorial layout.

Card metadata:
- date
- category
- title
- short excerpt

Avoid sensational blog thumbnails.

## 19. Footer

Footer should feel authoritative and information-rich without becoming chaotic.

Columns:
- Company
- Divisions
- Products
- Science & Quality
- Media
- Careers

Footer legal row:
- Privacy
- Terms
- Disclaimer
- Sitemap
- Anti-Counterfeit

Legal/company block should support:
- legal company name
- address
- CIN
- GST
- Drug Licence
- official email
- phone
- WhatsApp where applicable

Include:
> Products to be used as directed. Read the label carefully. Consult your physician.

## 20. Iconography

Use Lucide icons or a single consistent icon set.

Icons should be supporting elements, not decoration everywhere.

Avoid mixing:
- emoji
- random icon libraries
- outline and filled icon styles inconsistently

## 21. Photography

Priority order:
1. Actual facility
2. Actual products
3. Actual leadership/team
4. Actual laboratories
5. Actual office
6. Verified partner/client imagery
7. Neutral stock photography only where genuinely needed

Never show stock personnel as company doctors, scientists, executives, or factory workers.

## 22. Responsive Rules

Design mobile-first.

Break content into single-column sections on small screens.

Do not rely on hover states for critical information.

Tables should become:
- stacked cards, or
- horizontally scrollable tables where the table structure is important.

## 23. Motion

Default motion:
- 150–300ms transitions
- subtle opacity/translate reveals
- restrained hover movement

Avoid motion that competes with medical/company content.

Respect `prefers-reduced-motion`.

## 24. Accessibility

Target at least 4.5:1 contrast for normal text.

Use:
- visible focus states
- semantic markup
- readable font size
- clear link affordances
- descriptive button labels

Do not use color alone to indicate status.

## 25. Visual Quality Bar

The final website should answer these questions visually within seconds:
- Who is this company?
- What does it do?
- Why should I trust it?
- What products/divisions does it have?
- Where does it operate?
- How can I contact it?

Every visual decision should reinforce one of those questions.
