import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo/metadata'
import { getContentBlocks } from '@/lib/content/blocks'
import { getFacilities } from '@/lib/content/science'
import { Container, Section, SectionHeader } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { ContentBlocks } from '@/components/sections/content-blocks'
import { Card, CardBody, CardDescription, CardTitle } from '@/components/ui/card'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'R&D and formulation development',
    description:
      'How formulations are developed, trialled and taken to a manufacturable specification.',
    path: '/science-quality/rd',
  })
}

export default async function ResearchDevelopmentPage() {
  const [blocks, facilities] = await Promise.all([
    getContentBlocks('science-rd'),
    getFacilities(),
  ])

  const rndSites = facilities.filter((facility) => facility.facility_type === 'rnd')

  return (
    <>
      <PageHero
        eyebrow="Science & quality"
        title="R&D and formulation development"
        description="How our formulations are developed and validated before they reach production."
        breadcrumbs={[
          { label: 'Science & Quality', href: '/science-quality' },
          { label: 'R&D', href: '/science-quality/rd' },
        ]}
      />

      <Section>
        <Container size="narrow">
          <ContentBlocks
            blocks={blocks}
            emptyTitle="R&D information is being prepared"
            emptyDescription="This page is published once the company has confirmed its formulation development capability."
          />
        </Container>
      </Section>

      {rndSites.length > 0 ? (
        <Section tone="subtle">
          <Container className="flex flex-col gap-8">
            <SectionHeader title="R&D facilities" as="h2" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {rndSites.map((facility) => (
                <Card key={facility.id}>
                  <CardBody className="flex flex-col gap-2">
                    <CardTitle as="h3" className="text-base">
                      {facility.name}
                    </CardTitle>
                    {facility.summary ? (
                      <CardDescription>{facility.summary}</CardDescription>
                    ) : null}
                    <p className="text-sm text-muted-foreground">
                      {[facility.city, facility.state, facility.country]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  )
}
