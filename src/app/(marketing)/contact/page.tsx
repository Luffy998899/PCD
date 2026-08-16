import type { Metadata } from 'next'
import { Building2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'

import { buildMetadata } from '@/lib/seo/metadata'
import { getDepartmentContacts, getOffices } from '@/lib/content/contact'
import { getSiteSettings } from '@/lib/content/site-settings'
import { whatsappLink } from '@/lib/env'
import { Container, Section, SectionHeader } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { Card, CardBody, CardDescription, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Pending } from '@/components/ui/pending'
import { LinkButton } from '@/components/ui/button'
import { WhatsAppLink } from '@/components/analytics/whatsapp-link'
import { EnquiryForm } from '@/components/forms/enquiry-form'
import { JsonLd } from '@/components/seo/json-ld'
import { buildCanonicalUrl } from '@/lib/seo/metadata'
import { displayName } from '@/lib/content/site-settings'
import { withoutPlaceholder } from '@/lib/content/placeholder'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Contact us',
    description:
      'Office addresses, department contacts and enquiry routes for business, product and medical questions.',
    path: '/contact',
  })
}

const OFFICE_TYPE_LABELS: Record<string, string> = {
  registered: 'Registered office',
  corporate: 'Corporate office',
  plant: 'Manufacturing unit',
  branch: 'Branch office',
  warehouse: 'Warehouse',
}

export default async function ContactPage() {
  const [settings, offices, departments] = await Promise.all([
    getSiteSettings(),
    getOffices(),
    getDepartmentContacts(),
  ])
  const whatsapp = whatsappLink('Hello, I would like to speak to your team.')

  // LocalBusiness schema requires a real, verifiable address. It is emitted
  // only when the company name and a published office both exist — never for a
  // placeholder (Rules.md §19).
  const companyName = withoutPlaceholder(displayName(settings))
  const primaryOffice = offices[0]
  const localBusinessSchema =
    companyName && primaryOffice
      ? {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: companyName,
          url: buildCanonicalUrl('/contact'),
          address: {
            '@type': 'PostalAddress',
            streetAddress: primaryOffice.address,
            addressLocality: primaryOffice.city ?? undefined,
            addressRegion: primaryOffice.state ?? undefined,
            postalCode: primaryOffice.postal_code ?? undefined,
            addressCountry: primaryOffice.country,
          },
          ...(primaryOffice.phone || settings.primary_phone
            ? { telephone: primaryOffice.phone ?? settings.primary_phone }
            : {}),
          ...(primaryOffice.email || settings.primary_email
            ? { email: primaryOffice.email ?? settings.primary_email }
            : {}),
        }
      : null

  return (
    <>
      <JsonLd data={localBusinessSchema} />
      <PageHero
        title="Contact us"
        description="Reach the right team directly. Business, product and medical enquiries are handled separately so each one goes to the people who can answer it."
        breadcrumbs={[{ label: 'Contact Us', href: '/contact' }]}
      />

      {/* Primary contact channels */}
      <Section spacing="compact">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardBody className="flex flex-col gap-2">
                <Mail className="size-5 text-primary" aria-hidden="true" />
                <CardTitle as="h2" className="text-base">
                  Email
                </CardTitle>
                {settings.primary_email ? (
                  <a
                    className="text-sm text-primary underline underline-offset-4"
                    href={`mailto:${settings.primary_email}`}
                  >
                    {settings.primary_email}
                  </a>
                ) : (
                  <Pending label="Official email address" />
                )}
              </CardBody>
            </Card>

            <Card>
              <CardBody className="flex flex-col gap-2">
                <Phone className="size-5 text-primary" aria-hidden="true" />
                <CardTitle as="h2" className="text-base">
                  Phone
                </CardTitle>
                {settings.primary_phone ? (
                  <a
                    className="text-sm text-primary underline underline-offset-4"
                    href={`tel:${settings.primary_phone}`}
                  >
                    {settings.primary_phone}
                  </a>
                ) : (
                  <Pending label="Official phone number" />
                )}
              </CardBody>
            </Card>

            <Card>
              <CardBody className="flex flex-col gap-2">
                <MessageCircle className="size-5 text-primary" aria-hidden="true" />
                <CardTitle as="h2" className="text-base">
                  WhatsApp
                </CardTitle>
                {whatsapp ? (
                  <WhatsAppLink
                    href={whatsapp}
                    context="contact_page"
                    variant="outline"
                    className="self-start"
                  />
                ) : (
                  <Pending label="Official WhatsApp number" />
                )}
              </CardBody>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Enquiry routes — equal weight (Design.md §17) */}
      <Section tone="subtle" spacing="compact">
        <Container className="flex flex-col gap-6">
          <SectionHeader
            title="Choose the right enquiry route"
            description="Each route reaches a different team. Using the right one gets you a faster and more accurate answer."
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="flex flex-col">
              <CardBody className="flex flex-1 flex-col gap-3">
                <CardTitle as="h3">Business / distribution enquiry</CardTitle>
                <CardDescription className="flex-1">
                  For distribution, PCD franchise, institutional supply and export enquiries from
                  firms and organisations.
                </CardDescription>
                <LinkButton href="/contact/business-enquiry" className="self-start">
                  Send a business enquiry
                </LinkButton>
              </CardBody>
            </Card>

            <Card className="flex flex-col">
              <CardBody className="flex flex-1 flex-col gap-3">
                <CardTitle as="h3">Product / medical enquiry</CardTitle>
                <CardDescription className="flex-1">
                  For questions about a product, its composition or its prescribing information,
                  from healthcare professionals and the public.
                </CardDescription>
                <LinkButton href="/contact/product-enquiry" className="self-start">
                  Send a product enquiry
                </LinkButton>
              </CardBody>
            </Card>

            <Card className="flex flex-col">
              <CardBody className="flex flex-1 flex-col gap-3">
                <CardTitle as="h3">Report a side effect or product complaint</CardTitle>
                <CardDescription className="flex-1">
                  For adverse events and suspected quality defects. These reports are handled by
                  the pharmacovigilance team.
                </CardDescription>
                <LinkButton
                  href="/science-quality/pharmacovigilance"
                  variant="outline"
                  className="self-start"
                >
                  Open the reporting route
                </LinkButton>
              </CardBody>
            </Card>

            <Card className="flex flex-col">
              <CardBody className="flex flex-1 flex-col gap-3">
                <CardTitle as="h3">Grievance</CardTitle>
                <CardDescription className="flex-1">
                  For complaints about service, conduct or how your information has been handled.
                </CardDescription>
                <LinkButton href="/contact/grievance" variant="outline" className="self-start">
                  Raise a grievance
                </LinkButton>
              </CardBody>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Offices */}
      <Section>
        <Container className="flex flex-col gap-6">
          <SectionHeader
            title="Our offices"
            description="Registered, corporate and manufacturing locations."
          />
          {offices.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {offices.map((office) => (
                <Card key={office.id}>
                  <CardBody className="flex flex-col gap-3">
                    <span className="text-xs font-semibold tracking-[0.12em] text-accent-strong uppercase">
                      {OFFICE_TYPE_LABELS[office.office_type] ?? office.office_type}
                    </span>
                    <CardTitle as="h3" className="text-base">
                      {office.name}
                    </CardTitle>
                    <address className="flex gap-2.5 text-sm text-muted-foreground not-italic">
                      <MapPin className="mt-0.5 size-4 shrink-0 opacity-70" aria-hidden="true" />
                      <span className="whitespace-pre-line">
                        {[
                          office.address,
                          [office.city, office.state, office.postal_code]
                            .filter(Boolean)
                            .join(', '),
                          office.country,
                        ]
                          .filter(Boolean)
                          .join('\n')}
                      </span>
                    </address>
                    <div className="flex flex-col gap-1 text-sm">
                      {office.phone ? (
                        <a className="text-primary hover:underline" href={`tel:${office.phone}`}>
                          {office.phone}
                        </a>
                      ) : null}
                      {office.email ? (
                        <a className="text-primary hover:underline" href={`mailto:${office.email}`}>
                          {office.email}
                        </a>
                      ) : null}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Office details are being finalised"
              description="Registered and corporate office addresses will be published here once confirmed. Use the email or phone above in the meantime."
            />
          )}
        </Container>
      </Section>

      {/* Department contacts */}
      {departments.length > 0 ? (
        <Section tone="subtle" spacing="compact">
          <Container className="flex flex-col gap-6">
            <SectionHeader
              title="Department contacts"
              description="Direct lines to the teams that handle specific subjects."
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {departments.map((department) => (
                <Card key={department.id}>
                  <CardBody className="flex flex-col gap-2">
                    <Building2 className="size-5 text-primary" aria-hidden="true" />
                    <CardTitle as="h3" className="text-base">
                      {department.department}
                    </CardTitle>
                    {department.description ? (
                      <CardDescription>{department.description}</CardDescription>
                    ) : null}
                    <div className="flex flex-col gap-1 text-sm">
                      {department.email ? (
                        <a
                          className="text-primary hover:underline"
                          href={`mailto:${department.email}`}
                        >
                          {department.email}
                        </a>
                      ) : null}
                      {department.phone ? (
                        <a className="text-primary hover:underline" href={`tel:${department.phone}`}>
                          {department.phone}
                        </a>
                      ) : null}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* General enquiry */}
      <Section id="general-enquiry">
        <Container size="narrow" className="flex flex-col gap-6">
          <SectionHeader
            title="General enquiry"
            description="For anything that does not fit the routes above. We will direct it to the right team."
          />
          <EnquiryForm
            enquiryType="general"
            fields={['organisation', 'city', 'subject']}
            messageLabel="How can we help?"
            submitLabel="Send enquiry"
          />
        </Container>
      </Section>
    </>
  )
}
