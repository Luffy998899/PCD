import type { Metadata } from 'next'
import { AlertTriangle } from 'lucide-react'

import { buildMetadata } from '@/lib/seo/metadata'
import { getSiteSettings } from '@/lib/content/site-settings'
import { getContentBlocks } from '@/lib/content/blocks'
import { MEDICINE_SAFETY_STATEMENT } from '@/lib/constants'
import { Container, Section, SectionHeader } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { Card, CardBody, CardTitle } from '@/components/ui/card'
import { Pending } from '@/components/ui/pending'
import { ContentBlocks } from '@/components/sections/content-blocks'
import { PharmacovigilanceForm } from '@/components/forms/pharmacovigilance-form'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Pharmacovigilance — report a side effect',
    description:
      'Report a suspected side effect or a product quality problem. Reports are reviewed by our pharmacovigilance team.',
    path: '/science-quality/pharmacovigilance',
  })
}

export default async function PharmacovigilancePage() {
  const [settings, blocks] = await Promise.all([
    getSiteSettings(),
    getContentBlocks('science-pharmacovigilance'),
  ])

  return (
    <>
      <PageHero
        eyebrow="Science & quality"
        title="Report a side effect or product complaint"
        description="Reporting helps us monitor the safety and quality of our products. Every report is reviewed by the pharmacovigilance team."
        breadcrumbs={[
          { label: 'Science & Quality', href: '/science-quality' },
          { label: 'Pharmacovigilance', href: '/science-quality/pharmacovigilance' },
        ]}
      />

      <Section spacing="compact">
        <Container>
          <div className="flex items-start gap-3 rounded-md border border-warning/40 bg-warning/5 p-5">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden="true" />
            <div className="flex flex-col gap-1">
              <p className="font-medium text-foreground">
                This form is not for medical emergencies.
              </p>
              <p className="text-sm text-muted-foreground">
                If the patient needs urgent care, contact a physician or the nearest hospital
                immediately. {MEDICINE_SAFETY_STATEMENT}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {blocks.length > 0 ? (
        <Section spacing="compact">
          <Container size="narrow">
            <ContentBlocks blocks={blocks} emptyTitle="" />
          </Container>
        </Section>
      ) : null}

      <Section>
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="flex flex-col gap-6">
            <SectionHeader
              title="Submit a report"
              description="Give as much detail as you can. Fields marked with an asterisk are required."
            />
            <PharmacovigilanceForm />
          </div>

          <aside className="flex flex-col gap-4">
            <Card>
              <CardBody className="flex flex-col gap-3">
                <CardTitle as="h2" className="text-base">
                  What happens to your report
                </CardTitle>
                <ol className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <li>1. The report is recorded and given a reference number.</li>
                  <li>2. The pharmacovigilance team reviews it.</li>
                  <li>3. We may contact you for further details.</li>
                  <li>
                    4. Where required, the report is submitted to the regulatory authority.
                  </li>
                </ol>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="flex flex-col gap-3">
                <CardTitle as="h2" className="text-base">
                  Report by phone or email
                </CardTitle>
                <div className="flex flex-col gap-1 text-sm">
                  {settings.primary_email ? (
                    <a
                      className="text-primary underline underline-offset-4"
                      href={`mailto:${settings.primary_email}`}
                    >
                      {settings.primary_email}
                    </a>
                  ) : (
                    <Pending label="Pharmacovigilance email address" />
                  )}
                  {settings.primary_phone ? (
                    <a
                      className="text-primary underline underline-offset-4"
                      href={`tel:${settings.primary_phone}`}
                    >
                      {settings.primary_phone}
                    </a>
                  ) : (
                    <Pending label="Pharmacovigilance phone number" />
                  )}
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="flex flex-col gap-2">
                <CardTitle as="h2" className="text-base">
                  Your privacy
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Reports are stored securely and are not published. Please do not include the
                  patient&rsquo;s name or address — an age group and sex are enough.
                </p>
              </CardBody>
            </Card>
          </aside>
        </Container>
      </Section>
    </>
  )
}
