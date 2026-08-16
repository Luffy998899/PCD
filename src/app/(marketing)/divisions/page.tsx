import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { buildMetadata } from '@/lib/seo/metadata'
import { getDivisions } from '@/lib/content/products'
import { getContentBlocks } from '@/lib/content/blocks'
import { Container, Section } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { Card, CardBody, CardDescription, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { ContentBlocks } from '@/components/sections/content-blocks'
import { LinkButton } from '@/components/ui/button'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Divisions',
    description:
      'The divisions through which we supply: prescription, PCD franchise, consumer health, institutional and export.',
    path: '/divisions',
  })
}

export default async function DivisionsPage() {
  const [divisions, blocks] = await Promise.all([
    getDivisions(),
    getContentBlocks('divisions'),
  ])

  return (
    <>
      <PageHero
        eyebrow="Divisions"
        title="Our divisions"
        description="Each division serves a different route to market, with its own product range and terms of supply."
        breadcrumbs={[{ label: 'Divisions', href: '/divisions' }]}
      />

      {blocks.length > 0 ? (
        <Section spacing="compact">
          <Container size="narrow">
            <ContentBlocks blocks={blocks} emptyTitle="" />
          </Container>
        </Section>
      ) : null}

      <Section>
        <Container>
          {divisions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {divisions.map((division) => (
                <Card key={division.id} interactive className="relative flex flex-col">
                  <CardBody className="flex flex-1 flex-col gap-2">
                    <CardTitle as="h2" className="text-base">
                      <Link
                        href={`/divisions/${division.slug}`}
                        className="text-foreground hover:text-primary"
                      >
                        <span className="absolute inset-0" aria-hidden="true" />
                        {division.name}
                      </Link>
                    </CardTitle>
                    {division.summary ? (
                      <CardDescription>{division.summary}</CardDescription>
                    ) : null}
                    <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm text-primary">
                      View division
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </span>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Division information is being prepared"
              description="Each division is published once its scope and product range have been confirmed. Send an enquiry and we will tell you which route fits your requirement."
              action={
                <LinkButton href="/contact/business-enquiry" size="sm">
                  Send a business enquiry
                </LinkButton>
              }
            />
          )}
        </Container>
      </Section>
    </>
  )
}
