/**
 * Static navigation configuration.
 *
 * Rules.md §21 allows static navigation config. Business content (products,
 * people, certificates, articles…) must never live here — it comes from the
 * database.
 *
 * A route only belongs in this file once the page exists and has real content
 * to show (Architecture.md §6).
 */

export type NavLink = {
  label: string
  href: string
  description?: string
}

export type NavGroup = {
  label: string
  href: string
  links: NavLink[]
}

export const primaryNavigation: NavGroup[] = [
  {
    label: 'About Us',
    href: '/about',
    links: [
      { label: 'Company Overview', href: '/about/overview' },
      { label: 'Vision & Mission', href: '/about/vision-mission' },
      { label: 'Chairman’s Message', href: '/about/chairman-message' },
      { label: 'Board of Directors', href: '/about/board' },
      { label: 'Leadership & Core Team', href: '/about/leadership' },
      { label: 'Milestones', href: '/about/milestones' },
      { label: 'Values & Code of Ethics', href: '/about/values' },
      { label: 'Awards & Recognition', href: '/about/awards' },
    ],
  },
  {
    label: 'Divisions',
    href: '/divisions',
    // Which divisions the company actually operates is a business fact, so the
    // sub-links are resolved from published records at render time
    // (`lib/content/navigation.ts`).
    links: [],
  },
  {
    label: 'Products',
    href: '/products',
    links: [
      { label: 'All Products', href: '/products' },
      { label: 'Product Catalogue', href: '/products/catalogue' },
      { label: 'Prescribing Information', href: '/products/prescribing-information' },
    ],
  },
  {
    label: 'Science & Quality',
    href: '/science-quality',
    links: [
      { label: 'Overview', href: '/science-quality' },
      { label: 'R&D and Formulation', href: '/science-quality/rd' },
      { label: 'Manufacturing', href: '/science-quality/manufacturing' },
      { label: 'Quality Assurance & Control', href: '/science-quality/quality' },
      { label: 'Certifications & Approvals', href: '/science-quality/certifications' },
      { label: 'Regulatory Compliance', href: '/science-quality/regulatory' },
      { label: 'Pharmacovigilance', href: '/science-quality/pharmacovigilance' },
    ],
  },
  {
    label: 'Our Network',
    href: '/network',
    links: [
      { label: 'Overview', href: '/network' },
      { label: 'India Presence', href: '/network/india' },
      { label: 'Global Presence', href: '/network/global' },
      { label: 'Distributors & Stockists', href: '/network/distributors' },
      { label: 'Partner With Us', href: '/network/partner-with-us' },
    ],
  },
  {
    label: 'Media & Insights',
    href: '/media',
    links: [
      { label: 'Press Releases', href: '/media/press-releases' },
      { label: 'News & Coverage', href: '/media/news' },
      { label: 'Blogs & Health Articles', href: '/media/blogs' },
      { label: 'Gallery', href: '/media/gallery' },
      { label: 'Downloads', href: '/media/downloads' },
      { label: 'Events', href: '/media/events' },
    ],
  },
  {
    label: 'Careers',
    href: '/careers',
    links: [
      { label: 'Life at the Company', href: '/careers/life-at-company' },
      { label: 'Why Work With Us', href: '/careers/why-work-with-us' },
      { label: 'Current Openings', href: '/careers/openings' },
    ],
  },
  {
    label: 'Contact Us',
    href: '/contact',
    links: [
      { label: 'Contact & Offices', href: '/contact' },
      { label: 'Business / Distribution Enquiry', href: '/contact/business-enquiry' },
      { label: 'Product / Medical Enquiry', href: '/contact/product-enquiry' },
      { label: 'Grievance', href: '/contact/grievance' },
      { label: 'Report a Side Effect', href: '/science-quality/pharmacovigilance' },
    ],
  },
]

/** Header actions. Rules.md §5: Partner Login is the only solid header button. */
export const headerAction: NavLink = { label: 'Partner Login', href: '/admin/login' }

export const footerColumns: NavGroup[] = [
  {
    label: 'Company',
    href: '/about',
    links: [
      { label: 'Company Overview', href: '/about/overview' },
      { label: 'Vision & Mission', href: '/about/vision-mission' },
      { label: 'Leadership', href: '/about/leadership' },
      { label: 'Milestones', href: '/about/milestones' },
      { label: 'Awards', href: '/about/awards' },
    ],
  },
  {
    label: 'Divisions',
    href: '/divisions',
    // Which divisions the company actually operates is a business fact, so the
    // sub-links are resolved from published records at render time
    // (`lib/content/navigation.ts`).
    links: [],
  },
  {
    label: 'Products',
    href: '/products',
    links: [
      { label: 'All Products', href: '/products' },
      { label: 'Product Catalogue', href: '/products/catalogue' },
      { label: 'Prescribing Information', href: '/products/prescribing-information' },
    ],
  },
  {
    label: 'Science & Quality',
    href: '/science-quality',
    links: [
      { label: 'Manufacturing', href: '/science-quality/manufacturing' },
      { label: 'Quality Assurance & Control', href: '/science-quality/quality' },
      { label: 'Certifications', href: '/science-quality/certifications' },
      { label: 'Regulatory Compliance', href: '/science-quality/regulatory' },
      { label: 'Pharmacovigilance', href: '/science-quality/pharmacovigilance' },
    ],
  },
  {
    label: 'Media',
    href: '/media',
    links: [
      { label: 'Press Releases', href: '/media/press-releases' },
      { label: 'News & Coverage', href: '/media/news' },
      { label: 'Blogs', href: '/media/blogs' },
      { label: 'Gallery', href: '/media/gallery' },
      { label: 'Downloads', href: '/media/downloads' },
    ],
  },
  {
    label: 'Careers',
    href: '/careers',
    links: [
      { label: 'Life at the Company', href: '/careers/life-at-company' },
      { label: 'Why Work With Us', href: '/careers/why-work-with-us' },
      { label: 'Current Openings', href: '/careers/openings' },
    ],
  },
]

export const legalNavigation: NavLink[] = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Use', href: '/terms' },
  { label: 'Disclaimer', href: '/disclaimer' },
  { label: 'Sitemap', href: '/sitemap' },
  { label: 'Anti-Counterfeit Notice', href: '/anti-counterfeit' },
]
