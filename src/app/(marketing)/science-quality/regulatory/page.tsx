import type { Metadata } from 'next'
import { FileText } from 'lucide-react'

import { buildMetadata } from '@/lib/seo/metadata'
import { getRegulatoryItems } from '@/lib/content/science'
import { getContentBlocks } from '@/lib/content/blocks'
import { formatDate } from '@/lib/utils'
import { Container, Section, SectionHeader } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { Card, CardBody, CardDescription, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { ContentBlocks } from '@/components/sections/content-blocks'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Regulatory compliance',
    description:
      'Licences, compliance commitments and the documents supporting them.',
    path: '/science-quality/regulatory',
  })
}

const CATEGORY_LABELS: Record<string, string> = {
  compliance: 'Compliance',
  licence: 'Licences',
  policy: 'Policies',
  submission: 'Submissions',
}

const CATEGORY_ORDER = ['licence', 'compliance', 'policy', 'submission'] as const

export default async function RegulatoryPage() {
  const [items, blocks] = await Promise.all([
    getRegulatoryItems(),
    getContentBlocks('science-regulatory'),
  ])

  const grouped = CATEGORY_ORDER.map(
    (category) => [category, items.filter((item) => item.category === category)] as const,
  ).filter(([, entries]) => entries.length > 0)

  return (
    <>
      <PageHero
        eyebrow="Science & quality"
        title="Regulatory compliance"
        description="The licences we hold and the compliance practices we follow."
        breadcrumbs={[
          { label: 'Science & Quality', href: '/science-quality' },
          { label: 'Regulatory Compliance', href: '/science-quality/regulatory' },
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
            grouped.map(([category, entries]) => (
              <div key={category} className="flex flex-col gap-6">
                <SectionHeader title={CATEGORY_LABELS[category] ?? category} as="h2" />
                <div className="grid gap-4 md:grid-cols-2">
                  {entries.map((item) => {
                    const validUntil = formatDate(item.valid_until)
                    return (
                      <Card key={item.id}>
                        <CardBody className="flex flex-col gap-2">
                          <CardTitle as="h3" className="text-base">
                            {item.title}
                          </CardTitle>
                          {item.reference_number ? (
                            <p className="font-mono text-sm text-muted-foreground">
                              {item.reference_number}
                            </p>
                          ) : null}
                          {item.description ? (
                            <CardDescription>{item.description}</CardDescription>
                          ) : null}
                          {validUntil ? (
                            <p className="text-sm text-muted-foreground">Valid to {validUntil}</p>
                          ) : null}
                          {item.document_url ? (
                            <a
                              href={item.document_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline"
                            >
                              <FileText className="size-4" aria-hidden="true" />
                              View document
                              <span className="sr-only">
                                for {item.title} (opens in a new tab)
                              </span>
                            </a>
                          ) : null}
                        </CardBody>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title="Regulatory information is being prepared"
              description="Licences and compliance commitments are published here once the supporting documents have been verified."
            />
          )}
        </Container>
      </Section>
    </>
  )
}
