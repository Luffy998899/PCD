import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo/metadata'
import { getCoreValues } from '@/lib/content/about'
import { getContentBlocks } from '@/lib/content/blocks'
import { Container, Section, SectionHeader } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { Card, CardBody, CardDescription, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { ContentBlocks } from '@/components/sections/content-blocks'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Core values and code of ethics',
    description:
      'The standards the company holds itself to, and the code of ethics that applies to its people.',
    path: '/about/values',
  })
}

export default async function ValuesPage() {
  const [values, blocks] = await Promise.all([getCoreValues(), getContentBlocks('about-values')])

  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Core values and code of ethics"
        description="The standards we hold ourselves to in manufacturing, marketing and dealing with partners."
        breadcrumbs={[
          { label: 'About Us', href: '/about' },
          { label: 'Values & Code of Ethics', href: '/about/values' },
        ]}
      />

      <Section>
        <Container className="flex flex-col gap-8">
          <SectionHeader title="Core values" />
          {values.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((value) => (
                <Card key={value.id}>
                  <CardBody className="flex flex-col gap-2">
                    <CardTitle as="h3" className="text-base">
                      {value.title}
                    </CardTitle>
                    <CardDescription>{value.description}</CardDescription>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Core values are being finalised"
              description="These are published once approved by the company."
            />
          )}
        </Container>
      </Section>

      <Section tone="subtle">
        <Container size="narrow">
          <ContentBlocks
            blocks={blocks}
            emptyTitle="The code of ethics is being prepared"
            emptyDescription="The full code of ethics is published here once approved."
          />
        </Container>
      </Section>
    </>
  )
}
