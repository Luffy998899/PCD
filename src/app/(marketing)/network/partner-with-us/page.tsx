import type { Metadata } from 'next'
import { CheckCircle2 } from 'lucide-react'

import { buildMetadata } from '@/lib/seo/metadata'
import { getContentBlocks } from '@/lib/content/blocks'
import { Container, Section, SectionHeader } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { Card, CardBody, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { EnquiryForm } from '@/components/forms/enquiry-form'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Partner with us',
    description:
      'PCD franchise and distribution partnerships: who we are looking for, what is required, the support offered and how onboarding works.',
    path: '/network/partner-with-us',
  })
}

/**
 * The sections a partner page should answer (PRD §9), in the order a
 * prospective partner asks them. Each is filled from an editable content block;
 * a section with no approved content is omitted rather than guessed at.
 */
const SECTIONS: { key: string; heading: string }[] = [
  { key: 'who-we-look-for', heading: 'Who we are looking for' },
  { key: 'eligibility', heading: 'Eligibility and qualification' },
  { key: 'documents', heading: 'Documents required' },
  { key: 'territory', heading: 'Territory model' },
  { key: 'support', heading: 'Support we provide' },
  { key: 'promotional-inputs', heading: 'Promotional inputs' },
  { key: 'training', heading: 'Training' },
  { key: 'credit-terms', heading: 'Commercial and credit terms' },
  { key: 'onboarding', heading: 'How onboarding works' },
]

export default async function PartnerWithUsPage() {
  const blocks = await getContentBlocks('partner-with-us')
  const byKey = new Map(blocks.map((block) => [block.block_key, block]))
  const available = SECTIONS.filter((section) => byKey.has(section.key))

  return (
    <>
      <PageHero
        eyebrow="Our network"
        title="Partner with us"
        description="We appoint distribution and PCD franchise partners through a documented qualification process. This page sets out what that involves."
        breadcrumbs={[
          { label: 'Our Network', href: '/network' },
          { label: 'Partner With Us', href: '/network/partner-with-us' },
        ]}
      />

      <Section>
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="flex flex-col gap-10">
            {available.length > 0 ? (
              available.map((section) => {
                const block = byKey.get(section.key)!
                return (
                  <section key={section.key} className="flex flex-col gap-3">
                    <h2 className="text-[1.5rem] leading-snug text-foreground">
                      {block.heading ?? section.heading}
                    </h2>
                    {block.body
                      ? block.body.split(/\n{2,}/).map((paragraph, index) => (
                          <p key={index} className="text-muted-foreground">
                            {paragraph}
                          </p>
                        ))
                      : null}
                  </section>
                )
              })
            ) : (
              <EmptyState
                title="Partnership terms are being finalised"
                description="Eligibility, documentation, territory policy and support are published here once approved. You can still send an enquiry and our team will explain the current position directly."
              />
            )}
          </div>

          <aside className="flex flex-col gap-4">
            <Card>
              <CardBody className="flex flex-col gap-3">
                <CardTitle as="h2" className="text-base">
                  What we do not do
                </CardTitle>
                {/* Stating this plainly is the honest counterweight to the
                    claims common in this market (Rules.md §3). */}
                <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <CheckCircle2
                      className="mt-0.5 size-4 shrink-0 text-accent"
                      aria-hidden="true"
                    />
                    We do not publish earnings projections or guaranteed returns.
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2
                      className="mt-0.5 size-4 shrink-0 text-accent"
                      aria-hidden="true"
                    />
                    We do not advertise territory availability online. Availability is confirmed
                    by our team.
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2
                      className="mt-0.5 size-4 shrink-0 text-accent"
                      aria-hidden="true"
                    />
                    We do not ask for payment before a written agreement is in place.
                  </li>
                </ul>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="flex flex-col gap-3">
                <CardTitle as="h2" className="text-base">
                  Before you enquire
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Have your drug licence number, GST registration and the district you intend to
                  cover ready. It lets us answer accurately on the first call.
                </p>
              </CardBody>
            </Card>
          </aside>
        </Container>
      </Section>

      <Section tone="subtle" id="partner-enquiry">
        <Container size="narrow" className="flex flex-col gap-6">
          <SectionHeader
            title="Partnership enquiry"
            description="Tell us about your firm and the territory you cover. Our team will respond with the position for that territory."
          />
          <EnquiryForm
            enquiryType="partner"
            fields={['organisation', 'city', 'state', 'country']}
            messageLabel="Your requirement"
            messageHint="Include the districts you cover, your current lines of business, and the product range you are interested in."
            submitLabel="Send enquiry"
            successMessage="Thank you. Our team will review your enquiry and contact you about the territory you named."
          />
        </Container>
      </Section>
    </>
  )
}
