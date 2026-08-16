import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { buildMetadata } from '@/lib/seo/metadata'
import { getOpenJobOpenings } from '@/lib/content/careers'
import { getContentBlocks } from '@/lib/content/blocks'
import { Container, Section, SectionHeader } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { Card, CardBody, CardDescription, CardTitle } from '@/components/ui/card'
import { ContentBlocks } from '@/components/sections/content-blocks'
import { LinkButton } from '@/components/ui/button'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Careers',
    description: 'Current openings, what it is like to work here, and how to apply.',
    path: '/careers',
  })
}

const SECTIONS = [
  {
    href: '/careers/openings',
    label: 'Current openings',
    description: 'Roles we are hiring for right now.',
  },
  {
    href: '/careers/life-at-company',
    label: 'Life at the company',
    description: 'How we work day to day.',
  },
  {
    href: '/careers/why-work-with-us',
    label: 'Why work with us',
    description: 'What we offer and what we expect.',
  },
]

export default async function CareersPage() {
  const [openings, blocks] = await Promise.all([
    getOpenJobOpenings(),
    getContentBlocks('careers'),
  ])

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build your career with us"
        description="We hire across manufacturing, quality, supply chain, sales and support functions."
        breadcrumbs={[{ label: 'Careers', href: '/careers' }]}
        action={
          openings.length > 0 ? (
            <LinkButton href="/careers/openings" variant="outline" size="lg">
              {openings.length} open role{openings.length === 1 ? '' : 's'}
            </LinkButton>
          ) : undefined
        }
      />

      {blocks.length > 0 ? (
        <Section spacing="compact">
          <Container size="narrow">
            <ContentBlocks blocks={blocks} emptyTitle="" />
          </Container>
        </Section>
      ) : null}

      <Section>
        <Container className="flex flex-col gap-8">
          <SectionHeader title="Explore this section" />
          <div className="grid gap-4 md:grid-cols-3">
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
