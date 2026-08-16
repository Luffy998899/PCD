import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo/metadata'
import { getQualityTests, type QualityTest } from '@/lib/content/science'
import { getContentBlocks } from '@/lib/content/blocks'
import { Container, Section, SectionHeader } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { Card, CardBody, CardDescription, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { ContentBlocks } from '@/components/sections/content-blocks'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Quality assurance and quality control',
    description:
      'Testing performed at each stage of manufacture, from raw material to finished pack.',
    path: '/science-quality/quality',
  })
}

const STAGE_LABELS: Record<QualityTest['stage'], string> = {
  raw_material: 'Raw material testing',
  in_process: 'In-process checks',
  finished_product: 'Finished product testing',
  stability: 'Stability studies',
  packaging: 'Packaging checks',
}

const STAGE_ORDER: QualityTest['stage'][] = [
  'raw_material',
  'in_process',
  'finished_product',
  'stability',
  'packaging',
]

export default async function QualityPage() {
  const [tests, blocks] = await Promise.all([
    getQualityTests(),
    getContentBlocks('science-quality-control'),
  ])

  const grouped = STAGE_ORDER.map(
    (stage) => [stage, tests.filter((test) => test.stage === stage)] as const,
  ).filter(([, items]) => items.length > 0)

  return (
    <>
      <PageHero
        eyebrow="Science & quality"
        title="Quality assurance and quality control"
        description="What is tested, at which stage, and with what equipment."
        breadcrumbs={[
          { label: 'Science & Quality', href: '/science-quality' },
          { label: 'Quality Assurance & Control', href: '/science-quality/quality' },
        ]}
      />

      {blocks.length > 0 ? (
        <Section spacing="compact">
          <Container size="narrow">
            <ContentBlocks blocks={blocks} emptyTitle="" />
          </Container>
        </Section>
      ) : null}

      <Section>
        <Container className="flex flex-col gap-12">
          {grouped.length > 0 ? (
            grouped.map(([stage, items]) => (
              <div key={stage} className="flex flex-col gap-6">
                <SectionHeader title={STAGE_LABELS[stage]} as="h2" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((test) => (
                    <Card key={test.id}>
                      <CardBody className="flex flex-col gap-2">
                        <CardTitle as="h3" className="text-base">
                          {test.name}
                        </CardTitle>
                        {test.description ? (
                          <CardDescription>{test.description}</CardDescription>
                        ) : null}
                        {test.equipment ? (
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">Equipment: </span>
                            {test.equipment}
                          </p>
                        ) : null}
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title="Quality control details are being prepared"
              description="The tests performed at each stage are published here once confirmed by the quality team."
            />
          )}
        </Container>
      </Section>
    </>
  )
}
