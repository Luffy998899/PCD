import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { buildMetadata } from '@/lib/seo/metadata'
import { getNetworkCounts } from '@/lib/content/network'
import { getContentBlocks } from '@/lib/content/blocks'
import { Container, Section, SectionHeader } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { Card, CardBody, CardDescription, CardTitle } from '@/components/ui/card'
import { ContentBlocks } from '@/components/sections/content-blocks'
import { EmptyState } from '@/components/ui/empty-state'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Our network',
    description:
      'Where we operate in India and internationally, and how to reach our distributors.',
    path: '/network',
  })
}

const SECTIONS = [
  {
    href: '/network/india',
    label: 'India presence',
    description: 'States and districts we currently supply, listed individually.',
  },
  {
    href: '/network/global',
    label: 'Global presence',
    description: 'Countries we export to, with year of entry and registration status.',
  },
  {
    href: '/network/distributors',
    label: 'Distributors and stockists',
    description: 'Partners who have consented to their details being published.',
  },
  {
    href: '/network/partner-with-us',
    label: 'Partner with us',
    description: 'How distribution and PCD franchise appointments work.',
  },
]

export default async function NetworkPage() {
  const [counts, blocks] = await Promise.all([
    getNetworkCounts(),
    getContentBlocks('network'),
  ])

  const hasCoverage = counts.states > 0 || counts.countries > 0

  return (
    <>
      <PageHero
        eyebrow="Our network"
        title="Where we operate"
        description="Our footprint is listed state by state and country by country. Every figure on this page is counted from those entries."
        breadcrumbs={[{ label: 'Our Network', href: '/network' }]}
      />

      <Section spacing="compact">
        <Container>
          {hasCoverage ? (
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'States covered', value: counts.states },
                { label: 'Districts covered', value: counts.districts },
                { label: 'Export countries', value: counts.countries },
                { label: 'Listed partners', value: counts.partners },
              ]
                .filter((stat) => stat.value > 0)
                .map((stat) => (
                  <Card key={stat.label}>
                    <CardBody className="flex flex-col gap-1">
                      {/* Static figure, counted from published records. No
                          animated counter (Design.md §8). */}
                      <dt className="text-sm text-muted-foreground">{stat.label}</dt>
                      <dd className="font-display text-3xl font-semibold text-primary">
                        {stat.value}
                      </dd>
                    </CardBody>
                  </Card>
                ))}
            </dl>
          ) : (
            <EmptyState
              title="Coverage details are being compiled"
              description="States, districts and export countries are published individually, so this page shows figures only once those entries exist."
            />
          )}
        </Container>
      </Section>

      {blocks.length > 0 ? (
        <Section spacing="compact">
          <Container size="narrow">
            <ContentBlocks blocks={blocks} emptyTitle="" />
          </Container>
        </Section>
      ) : null}

      <Section tone="subtle">
        <Container className="flex flex-col gap-8">
          <SectionHeader title="Explore this section" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {SECTIONS.map((section) => (
              <Card key={section.href} interactive className="relative">
                <CardBody className="flex flex-col gap-2">
                  <CardTitle as="h2" className="text-base">
                    <Link href={section.href} className="text-foreground hover:text-primary">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {section.label}
                    </Link>
                  </CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                  <span className="mt-1 inline-flex items-center gap-1 text-sm text-primary">
                    View
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </span>
                </CardBody>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
