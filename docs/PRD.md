# PCD Pharma Website — Product Requirements Document (PRD)

## 1. Product Overview

Build a premium, trustworthy, mobile-first Indian pharmaceutical company website designed for a PCD Pharma / ethical pharma business.

The website is a corporate authority and lead-generation platform, not an e-commerce storefront. Its primary business objective is to convert website visitors into qualified leads. Every major visitor journey should naturally move the user toward one of three actions: **submit an enquiry, start a WhatsApp conversation, or discover/search products and then enquire about them**.

The site must still establish pharmaceutical authority before asking for conversion. Trust, products, quality, manufacturing, certifications, company information, and network coverage are the evidence that supports the lead-generation goal. The website should never feel like an aggressive sales landing page.

### Guiding principle

> **Depth of information = authority. Design is secondary.**

All claims, numbers, certifications, manufacturing statements, product information, leadership information, and network claims must be based on client-provided evidence. Never invent business facts to make the website look complete.

## 2. Reference Direction

The provided benchmark sites are used for information architecture, content patterns, and market conventions only. Do not clone their text, visuals, branding, assets, HTML, CSS, or proprietary content.

References:
- https://www.erikaremedies.in/
- https://www.biophargroup.com/
- https://rolfesbiopharma.com/
- https://www.lifecareneuro.com/
- https://www.sencarelife.com/
- https://www.biotichealthcare.com/
- https://lifesparkpharma.on-forge.com/

The supplied `learn.pdf` is the primary requirements source for the project.

## 3. Business Goals

The goals are ranked in this order:

1. **Convert visitors into qualified leads.** The website should make it easy and natural for a visitor to enquire, start a WhatsApp conversation, or find a relevant product and enquire about it.
2. Establish pharmaceutical-company credibility so visitors trust the company enough to submit an enquiry.
3. Present the full product portfolio in a structured, fast, searchable way that helps users reach the right product quickly.
4. Generate qualified PCD / franchise / distribution / institutional / product / medical enquiries without aggressive sales tactics.
5. Explain manufacturing, quality, certifications, regulatory practices, and pharmacovigilance as conversion-supporting proof.
6. Communicate India-wide and international reach where evidence exists.
7. Support SEO through product, therapy, article, and company-content pages.
8. Provide a maintainable content system so the company can update products, people, certificates, articles, jobs, and enquiries without editing code.

## 4. Target Users

### A. PCD / Franchise Partner
Needs:
- Company legitimacy
- Product range
- Territory / monopoly-right information where applicable
- Support model
- Eligibility and documents
- Enquiry path

### B. Doctor / Healthcare Professional
Needs:
- Product composition and prescribing information
- Therapeutic categories
- Manufacturing and quality information
- Medical/product enquiry route

### C. Distributor / Stockist / Institutional Buyer
Needs:
- Product portfolio
- Supply capability
- Network information
- Institutional / distribution enquiry route

### D. Patient / General Public
Needs:
- General company information
- Product education where appropriate
- Safety/disclaimer information
- Pharmacovigilance / product complaint route

### E. Job Applicant
Needs:
- Life at company
- Current openings
- Role details
- CV submission

### F. Search Engine / Researcher
Needs:
- Clear company identity
- Structured product data
- Organization and product schema
- Crawlable internal links
- Canonical URLs, sitemap, robots.txt

## 5. Core Site Map

### Header
- Home
- About Us
- Divisions
- Products
- Science & Quality
- Our Network
- Media & Insights
- Careers
- Contact Us
- Partner Login — small outline button; the only solid header button

### About Us
- Overview / Company Profile
- Vision & Mission
- Chairman / Founder Message
- Board of Directors
- Leadership & Core Team
- Milestones & Timeline
- Core Values & Code of Ethics
- Awards & Recognition

### Divisions
- Overview
- Ethical / Prescription Division
- PCD Franchise Division
- OTC & Consumer Health Division
- Institutional & Government Supply
- Export / International Division
- Contract Manufacturing (only when applicable)

### Products
- Product Overview
- By Therapy
- By Division
- By Dosage Form
- Individual Product Pages
- Product Catalogue PDF
- Prescribing Information

### Science & Quality
- Overview
- R&D and Formulation Development
- Manufacturing Facilities
- Quality Assurance & Quality Control
- Certifications & Approvals
- Regulatory Compliance
- Pharmacovigilance / Report a Side Effect

### Our Network
- Overview / Reach Map
- India Presence
- Global Presence
- Distributors & Stockists
- Partner With Us
- Find a Pharmacy / Where to Buy (only when real data exists)

### Media & Insights
- Press Releases
- News & Media Coverage
- Blogs & Health Articles
- Photo & Video Gallery
- Downloads
- Events & Exhibitions

### Careers
- Life at Company
- Why Work With Us
- Current Openings
- Apply / Submit CV

### Contact
- Office information
- Department-wise contacts
- General enquiry
- Product / Medical enquiry
- Business / Distribution enquiry
- Grievance / Complaint
- Pharmacovigilance

## 6. Conversion & Lead-Generation Requirements

Lead generation is the primary business purpose of the site. Every important page should answer three questions:

1. What does the company offer?
2. Why should the visitor trust the company?
3. What is the easiest next action for the visitor?

### Primary conversion actions

The core conversion actions are:
- **Enquire** — submit a business, distribution, product, medical, institutional, export, or general enquiry.
- **WhatsApp** — start a conversation with the company using the official WhatsApp number.
- **Search / Discover Products** — find a relevant SKU or therapy and continue into a product enquiry.

### Conversion rules

- Every major page must have at least one logical next-step CTA.
- Product pages must prioritize **Enquire About This Product** and optionally WhatsApp with the product context prefilled.
- The product search experience must be prominent and fast because product discovery is one of the main routes to lead conversion.
- Business/PCD visitors must be able to reach a dedicated enquiry flow without searching through the entire site.
- Contact details and WhatsApp must remain easy to find on mobile.
- CTA copy must describe the action clearly: `Send Enquiry`, `Enquire About This Product`, `Chat on WhatsApp`, `Find Products`, `Request Product Information`. Avoid manipulative copy such as `Act Now`, `Limited Slots`, or fake urgency.
- Forms should ask only for information needed to qualify or respond to the enquiry. Do not create unnecessarily long lead forms.
- Preserve the distinction between **business lead capture** and **patient/medical communication**.
- The site must never fabricate availability, territory status, response promises, product demand, sales numbers, or lead incentives.

### Conversion hierarchy

Use this hierarchy when deciding where to place attention:

**1. Enquiry / lead capture → 2. WhatsApp conversation → 3. Product search/discovery → 4. Authority content → 5. Secondary corporate navigation**

Authority content remains essential, but it supports the conversion goal rather than replacing it.

### Lead attribution

Where technically appropriate, enquiry submissions and WhatsApp clicks should capture basic attribution context such as:
- Landing page / source page
- Product or division context
- UTM parameters when present
- Device/source metadata that is privacy-appropriate

This data should help the business understand which pages and products generate leads.

### Conversion measurement

Track at minimum:
- Enquiry form started
- Enquiry form submitted
- WhatsApp click
- Product search used
- Product detail viewed
- Product enquiry initiated
- Product enquiry submitted
- Partner / PCD enquiry submitted
- Contact page interaction

Do not add fake counters or misleading conversion numbers to the public website. Analytics are for internal measurement only.

## 7. Homepage Requirements

Build the homepage as the final composition layer, pulling verified content from the inner pages.

### Section order
1. Hero
2. Company Snapshot Strip
3. About the Company
4. Our Divisions
5. Therapeutic Areas / Product Range
6. Science, Manufacturing & Quality
7. Certifications & Approvals
8. Our Reach — India + Global
9. Leadership Preview
10. Clients, Partners & Associations
11. Latest News & Blogs
12. Careers Teaser
13. Enquiry Strip
14. Footer

### Hero
The hero must communicate who the company is and immediately provide a clear path toward conversion. The visitor should understand within a few seconds what the company does, what it offers, and what they can do next.

Primary conversion paths must be visible without creating a spammy sales feel:
- **Explore / Search Products** — primary discovery action.
- **Send an Enquiry** — primary lead action.
- **WhatsApp** — persistent conversational lead channel, visually secondary to the main CTA.

The hero may use a maximum of two prominent buttons, with WhatsApp presented as a secondary contact affordance rather than a third large hero button.

The hero must not use PCD discount claims, distributor pricing, ROI projections, countdowns, coupons, fake urgency, or unverifiable promises.

### Snapshot
Use 4–6 verified static numbers such as:
- Years in operation
- Products in portfolio
- Districts covered
- States covered
- Team size
- Manufacturing capacity

Numbers must not animate. Every number must have a source/date in content administration.

## 8. Product System

Products are a core feature, not a marketing carousel.

### Product listing
Support filters:
- Therapy
- Division
- Dosage Form

Product cards show:
- Brand name
- Generic composition
- Pack size
- Therapeutic category

Public product pages must not show:
- Retail checkout
- Buy Now
- Add to Cart
- Discount price
- Coupon language
- Fake stock indicators

### Product detail template
Each SKU page must support:
- Brand name
- Generic composition
- Strength
- Pack size
- Therapeutic category
- Indications
- Dosage / directions for use
- Warnings
- Contraindications
- Side effects
- Storage instructions
- Keep out of reach of children
- Manufactured by / Marketed by
- Licence number when applicable
- Pack images: front, back, label close-up
- Enquiry CTA: Enquire About This Product
- Prescribing Information attachment when applicable

Product content is structured data and should be reusable across listing pages, therapy pages, search, sitemap, metadata, and schema.

## 9. PCD / Partner Experience

The PCD experience is an enquiry and qualification workflow, not a retail funnel.

Required content:
- Who the company is looking for
- Qualification requirements
- Documents required
- Investment range only when the company explicitly supplies a real range
- Territory / monopoly-right policy when applicable
- Support offered
- Promotional inputs
- Training
- Credit terms when applicable
- Onboarding stages and realistic timelines
- Enquiry form

Do not implement an ROI calculator, fake territory checker, fake availability checker, fake earnings projection, or fabricated margins.

## 9. Science, Manufacturing & Quality

The website must provide evidence-led information about:
- R&D
- Formulation development
- Manufacturing locations
- Plant area
- Year commissioned
- Production lines
- Dosage forms
- Capacity
- Clean rooms
- Water systems
- HVAC
- Testing laboratories
- QA/QC team
- Batch testing
- Stability chambers
- Retention samples
- Batch-record policy
- Sample Certificate of Analysis
- Certificates and approvals
- Regulatory compliance
- Pharmacovigilance

Only publish what the client can prove.

## 10. Authority & Trust Content

The system must support:
- Legal company name
- CIN
- GST
- PAN
- Drug Manufacturing Licence
- WHO-GMP certificate
- ISO certificate
- FSSAI when applicable
- Trademark registration numbers
- Industry memberships
- Founder / chairman message
- Board profiles
- Leadership profiles
- Factory and laboratory photos
- Certificates as PDF/JPG
- Awards
- Press coverage
- Signed testimonials with consent

Every proof asset should have a source, status, and optional validity date in the CMS.

## 11. Media, Blog & SEO

Blogs should support:
- Title
- Slug
- Category
- Author
- Published date
- Hero image
- Excerpt
- Rich article content
- Medically reviewed flag
- Reviewer when applicable
- Related products / therapies
- SEO title
- SEO description
- Canonical URL

Initial target from the supplied brief: at least 2 SEO-focused articles per month.

## 12. Careers

Support:
- Life at company
- Culture
- Benefits
- Current openings
- Department
- Location
- Experience
- Job description
- Application form
- CV upload

## 13. Forms & Leads

Every enquiry form must have a defined audience and purpose.

Form types:
- General enquiry
- Product / Medical enquiry
- Business / Distribution enquiry
- Partner enquiry
- Pharmacovigilance / Product complaint
- Grievance
- Career application

Minimum lead fields should be tailored to the form rather than creating one giant form.

Store:
- Form type
- Submission date/time
- Name
- Contact details
- Company / organization where applicable
- City/state/country where applicable
- Product/therapy where applicable
- Message
- Consent
- Source page
- Status
- Internal notes

## 14. Admin / Content Management

The production site must be content-editable without changing source code.

Admin capabilities should cover at least:
- Products
- Therapies
- Divisions
- People / leadership
- Certificates
- Manufacturing facts
- Network coverage
- Blogs
- News
- Careers
- Downloads
- Testimonials
- Enquiries
- Site settings / SEO

Every admin record should have draft/published status where useful.

## 15. SEO & Technical Requirements

Required:
- Metadata on every route
- Open Graph tags
- Twitter/X card metadata
- Canonical URLs
- robots.txt
- sitemap.xml
- Organization schema
- LocalBusiness schema when applicable
- Product schema on product pages
- Article schema on blog/article pages
- BreadcrumbList schema
- FAQPage schema only for real FAQs
- Google Analytics 4
- Google Search Console
- Google Business Profile support
- SSL
- Mobile-first responsive layout
- Target page performance under 2 seconds where practical
- Minimum text contrast ratio of 4.5:1
- Sticky-header-safe anchor offsets
- Accessible keyboard navigation
- Semantic headings
- Optimized images

## 16. Legal / Compliance UX

Before launch, include:
- Privacy Policy
- Terms of Use
- Disclaimer
- Sitemap
- Anti-Counterfeit Notice
- Cookie consent
- Pharmacovigilance route
- Grievance officer details when required
- Appropriate medicine-use disclaimer

Default safety statement for relevant medicine content:

> Consult your physician. Read the label carefully.

## 17. Content Safety Requirements

Use plain English and short sentences.

Never:
- Invent certifications
- Invent plant capacity
- Invent patient outcomes
- Claim clinical proof without evidence
- Promise cures
- Fabricate customers or partners
- Fabricate testimonials
- Invent regulatory approvals
- Invent distributor coverage
- Invent product compositions
- Invent medical claims

Use medically responsible phrasing and publish only approved client content.

## 18. Success Criteria

The project is successful when:
1. A visitor can understand the company and its credibility within the first screen and first scroll.
2. A partner can reach the PCD enquiry flow in 2–3 clicks.
3. A doctor can locate a product and its relevant information quickly.
4. A visitor can verify company claims through proof assets.
5. The product catalogue is searchable and filterable.
6. Admin users can update content without a developer.
7. All public pages are responsive, accessible, indexable, and fast.
8. No unsupported business or medical claims are present.

## 19. Out of Scope for V1

- Public e-commerce checkout
- Retail medicine sales
- Discount/coupon system
- Online payment for medicines
- ROI/profit calculators
- Fake territory/stock availability tools
- Patient diagnosis tools
- Treatment recommendation engine
- AI medical advice chatbot
- Unverified review aggregation
