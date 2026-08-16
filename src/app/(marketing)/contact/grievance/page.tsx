import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo/metadata'
import { getSiteSettings } from '@/lib/content/site-settings'
import { Container, Section } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { EnquiryForm } from '@/components/forms/enquiry-form'
import { Card, CardBody, CardTitle } from '@/components/ui/card'
import { Pending } from '@/components/ui/pending'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Raise a grievance',
    description:
      'Route for complaints about service, conduct or the handling of your personal information.',
    path: '/contact/grievance',
  })
}

export default async function GrievancePage() {
  const settings = await getSiteSettings()

  return (
    <>
      <PageHero
        eyebrow="Grievance"
        title="Raise a grievance"
        description="Use this route for a complaint about our service, the conduct of a representative, or how your personal information has been handled."
        breadcrumbs={[
          { label: 'Contact Us', href: '/contact' },
          { label: 'Grievance', href: '/contact/grievance' },
        ]}
      />

      <Section>
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="flex flex-col gap-6">
            <EnquiryForm
              enquiryType="grievance"
              fields={['organisation', 'city', 'state', 'subject']}
              messageLabel="Describe the grievance"
              messageHint="Include dates, names and any reference numbers so we can trace the matter."
              submitLabel="Submit grievance"
              successTitle="Grievance recorded"
              successMessage="Your grievance has been recorded and routed to the grievance officer. Keep your reference number for follow-up."
            />
          </div>

          <aside className="flex flex-col gap-4">
            <Card>
              <CardBody className="flex flex-col gap-3">
                <CardTitle as="h2" className="text-base">
                  Grievance officer
                </CardTitle>
                <dl className="flex flex-col gap-2 text-sm">
                  <div className="flex flex-col">
                    <dt className="text-muted-foreground">Name</dt>
                    <dd className="text-foreground">
                      {settings.grievance_officer_name ?? (
                        <Pending label="Grievance officer name" />
                      )}
                    </dd>
                  </div>
                  <div className="flex flex-col">
                    <dt className="text-muted-foreground">Email</dt>
                    <dd className="text-foreground">
                      {settings.grievance_officer_email ? (
                        <a
                          className="text-primary underline underline-offset-4"
                          href={`mailto:${settings.grievance_officer_email}`}
                        >
                          {settings.grievance_officer_email}
                        </a>
                      ) : (
                        <Pending label="Grievance officer email" />
                      )}
                    </dd>
                  </div>
                  <div className="flex flex-col">
                    <dt className="text-muted-foreground">Phone</dt>
                    <dd className="text-foreground">
                      {settings.grievance_officer_phone ?? (
                        <Pending label="Grievance officer phone" />
                      )}
                    </dd>
                  </div>
                </dl>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="flex flex-col gap-2">
                <CardTitle as="h2" className="text-base">
                  Product quality or side effect
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  A suspected side effect or quality defect is not handled as a grievance. Use the
                  pharmacovigilance route so it is recorded correctly.
                </p>
              </CardBody>
            </Card>
          </aside>
        </Container>
      </Section>
    </>
  )
}
