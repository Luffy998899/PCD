/**
 * Legal page content (Architecture.md §5 — `data/legal.ts`).
 *
 * These documents describe how *this website* actually behaves: what the forms
 * collect, where it is stored, which cookies are set. That is verifiable from
 * the code and safe to state.
 *
 * Company-specific facts — legal entity name, addresses, grievance officer,
 * governing jurisdiction — are written as `{{tokens}}` and resolved at render
 * time from `site_settings`. An unresolved token renders a
 * `[CLIENT TO PROVIDE]` marker in development and is omitted in production.
 *
 * Every document must still be reviewed and approved by the client's legal
 * adviser before launch. `requiresLegalReview` surfaces that reminder in
 * non-production environments.
 */

export type LegalBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }

export type LegalSection = {
  heading: string
  blocks: LegalBlock[]
}

export type LegalDocument = {
  slug: string
  title: string
  metaTitle: string
  description: string
  intro: string
  sections: LegalSection[]
  requiresLegalReview: boolean
}

export const privacyPolicy: LegalDocument = {
  slug: 'privacy-policy',
  title: 'Privacy Policy',
  metaTitle: 'Privacy Policy',
  description:
    'How this website collects, uses, stores and protects the information you submit through its enquiry and application forms.',
  intro:
    'This policy explains what information {{legal_name}} collects through this website, why it is collected, how long it is kept, and the choices available to you.',
  requiresLegalReview: true,
  sections: [
    {
      heading: 'Information we collect',
      blocks: [
        {
          type: 'paragraph',
          text: 'We only collect information you choose to send us. The website does not require you to create an account to browse it.',
        },
        {
          type: 'list',
          items: [
            'Enquiry forms: your name, email address, phone number, and the message you write. Business and distribution enquiries also ask for your firm name, city and state.',
            'Career applications: the details on your application form and the CV file you upload.',
            'Adverse event and product complaint reports: the details you provide about the product and the event, which we are required to record.',
            'Technical information: the page you submitted a form from, and campaign parameters (utm_*) present in the address bar at that moment.',
          ],
        },
        {
          type: 'paragraph',
          text: 'We do not ask for financial information, government identity numbers, or health records through this website.',
        },
      ],
    },
    {
      heading: 'How we use it',
      blocks: [
        {
          type: 'list',
          items: [
            'To respond to your enquiry, application or report.',
            'To assess distribution, franchise and institutional enquiries.',
            'To meet pharmacovigilance and other regulatory obligations that apply to adverse event reports.',
            'To understand which pages and products generate enquiries, so the website can be improved.',
          ],
        },
        {
          type: 'paragraph',
          text: 'We do not sell your information, and we do not use enquiry details for unrelated marketing.',
        },
      ],
    },
    {
      heading: 'Cookies and analytics',
      blocks: [
        {
          type: 'paragraph',
          text: 'Essential cookies are used to remember your cookie preference and to keep authenticated sessions secure. These are always active because the website cannot function without them.',
        },
        {
          type: 'paragraph',
          text: 'Analytics cookies are only set after you accept them. They tell us which pages are visited and which forms are started and completed, in aggregate. You can decline analytics without losing access to any part of the website, and you can change your choice at any time from the cookie settings link in the footer.',
        },
      ],
    },
    {
      heading: 'Where your information is stored',
      blocks: [
        {
          type: 'paragraph',
          text: 'Form submissions are stored in a managed PostgreSQL database. Uploaded files, such as CVs, are stored in private storage that is not publicly accessible and is served only to authorised staff.',
        },
        {
          type: 'paragraph',
          text: 'Access is restricted to employees who need it to respond to you. Notification emails to our team contain only the details needed to make contact; the content of adverse event reports is read in the internal system rather than sent by email.',
        },
      ],
    },
    {
      heading: 'How long we keep it',
      blocks: [
        {
          type: 'paragraph',
          text: 'Enquiries are retained for as long as needed to respond to and service the business relationship. Adverse event reports are retained for the period required by applicable pharmacovigilance regulations. Job applications are retained for {{retention_careers}} unless you ask us to remove them sooner.',
        },
      ],
    },
    {
      heading: 'Your choices',
      blocks: [
        {
          type: 'list',
          items: [
            'You can ask what information we hold about you.',
            'You can ask us to correct information that is inaccurate.',
            'You can ask us to delete your enquiry or application, subject to any record-keeping obligation that applies to it.',
            'You can withdraw consent to being contacted about an enquiry.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Write to {{primary_email}} with your request. We may ask you to confirm your identity before acting on it.',
        },
      ],
    },
    {
      heading: 'Grievance officer',
      blocks: [
        {
          type: 'paragraph',
          text: 'Complaints about how your information has been handled can be addressed to {{grievance_officer_name}}, {{grievance_officer_email}}, {{registered_address}}.',
        },
      ],
    },
    {
      heading: 'Changes to this policy',
      blocks: [
        {
          type: 'paragraph',
          text: 'If this policy changes, the revised version will be published on this page with a new effective date.',
        },
      ],
    },
  ],
}

export const termsOfUse: LegalDocument = {
  slug: 'terms',
  title: 'Terms of Use',
  metaTitle: 'Terms of Use',
  description:
    'The terms that apply to your use of this website, its product information and its enquiry forms.',
  intro:
    'By using this website you accept these terms. If you do not accept them, please do not use the website.',
  requiresLegalReview: true,
  sections: [
    {
      heading: 'Purpose of this website',
      blocks: [
        {
          type: 'paragraph',
          text: 'This website provides corporate, product and quality information about {{legal_name}}, and a route to contact us. It is not a shop. Medicines cannot be bought through it, and no price, offer or availability is quoted on it.',
        },
      ],
    },
    {
      heading: 'Product information',
      blocks: [
        {
          type: 'paragraph',
          text: 'Product pages summarise information from the approved pack and prescribing information. They are intended for general reference and for healthcare professionals, and they do not replace the pack insert, the prescribing information, or the advice of a qualified physician or pharmacist.',
        },
        {
          type: 'paragraph',
          text: 'Product availability, pack presentation and approved information vary by market and may change. Always read the label and consult your physician.',
        },
      ],
    },
    {
      heading: 'Enquiries and business relationships',
      blocks: [
        {
          type: 'paragraph',
          text: 'Submitting an enquiry does not create a distribution, franchise, supply or agency relationship. Any such relationship is created only by a separate written agreement signed by an authorised representative of the company.',
        },
      ],
    },
    {
      heading: 'Intellectual property',
      blocks: [
        {
          type: 'paragraph',
          text: 'The brand names, trade marks, logos, product images, documents and text on this website belong to {{legal_name}} or its licensors. You may not copy, reproduce or reuse them without written permission, except for ordinary personal reference.',
        },
      ],
    },
    {
      heading: 'Acceptable use',
      blocks: [
        {
          type: 'list',
          items: [
            'Do not submit false information through the forms on this website.',
            'Do not attempt to gain unauthorised access to any part of the website or its administration area.',
            'Do not use automated systems to extract content from the website at a scale that affects its operation.',
            'Do not use the website to distribute unlawful, misleading or harmful material.',
          ],
        },
      ],
    },
    {
      heading: 'External links',
      blocks: [
        {
          type: 'paragraph',
          text: 'Where this website links to a third-party site, we do not control that site and are not responsible for its content or its privacy practices.',
        },
      ],
    },
    {
      heading: 'Limitation of liability',
      blocks: [
        {
          type: 'paragraph',
          text: 'The website is provided on an "as is" basis. We take reasonable care to keep information accurate and current, but we do not warrant that it is free of error or that the website will be available without interruption. To the extent permitted by law, we are not liable for loss arising from reliance on general information published here in place of the approved product literature or professional advice.',
        },
      ],
    },
    {
      heading: 'Governing law',
      blocks: [
        {
          type: 'paragraph',
          text: 'These terms are governed by the laws of India, and the courts at {{jurisdiction}} have exclusive jurisdiction over any dispute arising from them.',
        },
      ],
    },
  ],
}

export const disclaimer: LegalDocument = {
  slug: 'disclaimer',
  title: 'Disclaimer',
  metaTitle: 'Disclaimer',
  description:
    'Medical, product and general disclaimers that apply to the information published on this website.',
  intro:
    'The information on this website is published for general and professional reference. Read this disclaimer before relying on it.',
  requiresLegalReview: true,
  sections: [
    {
      heading: 'Not medical advice',
      blocks: [
        {
          type: 'paragraph',
          text: 'Nothing on this website is medical advice, a diagnosis, or a recommendation to start, stop or change any treatment. Only a registered medical practitioner who knows your history can advise you on medicines. Consult your physician. Read the label carefully.',
        },
      ],
    },
    {
      heading: 'Prescription medicines',
      blocks: [
        {
          type: 'paragraph',
          text: 'Prescription products are described here for the information of healthcare professionals and for general transparency. They must be used only on the prescription of a registered medical practitioner.',
        },
      ],
    },
    {
      heading: 'No promotion to the public',
      blocks: [
        {
          type: 'paragraph',
          text: 'Product information published here is not an advertisement or an inducement to use a medicine. It is not directed at consumers as promotional material, and it is not a claim of superiority over any other product.',
        },
      ],
    },
    {
      heading: 'Accuracy and currency',
      blocks: [
        {
          type: 'paragraph',
          text: 'Product portfolios, approvals, certificates and company information change over time. We update this website as information changes, but the approved pack insert and the currently valid certificate remain the authoritative sources.',
        },
      ],
    },
    {
      heading: 'Reporting a side effect',
      blocks: [
        {
          type: 'paragraph',
          text: 'If you experience a side effect or suspect a quality problem with one of our products, please report it through the pharmacovigilance route on this website, and speak to your physician or pharmacist.',
        },
      ],
    },
  ],
}

export const antiCounterfeit: LegalDocument = {
  slug: 'anti-counterfeit',
  title: 'Anti-Counterfeit Notice',
  metaTitle: 'Anti-Counterfeit Notice',
  description:
    'How to check that a product is genuine, and how to report a suspected counterfeit or spurious medicine.',
  intro:
    'Counterfeit medicines are a risk to patients. This page explains how to check a pack you have received and how to report a suspected counterfeit to us.',
  requiresLegalReview: true,
  sections: [
    {
      heading: 'Buy through authorised channels only',
      blocks: [
        {
          type: 'paragraph',
          text: 'Our products are supplied to licensed distributors, stockists, hospitals and pharmacies. We do not sell medicines directly to the public through this website, by social media, or through messaging applications. Treat any such offer as suspect.',
        },
      ],
    },
    {
      heading: 'What to check on the pack',
      blocks: [
        {
          type: 'list',
          items: [
            'The manufacturing and marketing details printed on the pack match the details published for that product on this website.',
            'The batch number, manufacturing date and expiry date are printed clearly and are not altered, overprinted or relabelled.',
            'The pack, seal and printing are intact, with no signs of tampering or re-sealing.',
            'Spelling, colour and print quality match the pack you normally receive.',
          ],
        },
      ],
    },
    {
      heading: 'Report a suspected counterfeit',
      blocks: [
        {
          type: 'paragraph',
          text: 'If a pack looks wrong, or if a product was offered to you through an unauthorised channel, stop using it and report it. Keep the pack and the purchase record if you can — they help the investigation.',
        },
        {
          type: 'paragraph',
          text: 'Write to {{primary_email}}, or use the product complaint route on this website. Reports can also be made to the relevant State Drug Control authority.',
        },
      ],
    },
    {
      heading: 'Misuse of our name or brands',
      blocks: [
        {
          type: 'paragraph',
          text: 'We act against unauthorised use of our company name, brand names, logos, certificates and product images, including their use in fraudulent distribution or franchise offers. If you are unsure whether an approach is genuine, contact us before acting on it.',
        },
      ],
    },
  ],
}

export const legalDocuments: LegalDocument[] = [
  privacyPolicy,
  termsOfUse,
  disclaimer,
  antiCounterfeit,
]
