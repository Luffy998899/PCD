import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { buildMetadata } from '@/lib/seo/metadata'
import { getContentBlocks } from '@/lib/content/blocks'
import { primaryNavigation } from '@/data/navigation'
import { Container, Section, SectionHeader } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { Card, CardBody, CardDescription, CardTitle } from '@/components/ui/card'
import { ContentBlocks } from '@/components/sections/content-blocks'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'About the company',
    description:
      'Company profile, leadership, governance, milestones and recognition.',
    path: '/about',
  })
}

const SECTION_DESCRIPTIONS: Record<string, string> = {
  '/about/overview': 'What the company does, where it operates and how it is structured.',
  '/about/vision-mission': 'The long-term direction and the commitments that follow from it.',
  '/about/chairman-message': 'A message from the founder on the company’s purpose and priorities.',
  '/about/board': 'The directors responsible for governance.',
  '/about/leadership': 'The team running operations, quality, supply and commercial functions.',
  '/about/milestones': 'A dated record of how the company has developed.',
  '/about/values': 'The standards the company holds itself to, including its code of ethics.',
  '/about/awards': 'Recognition received, with the issuing body and year.',
}

export default async function AboutPage() {
  const blocks = await getContentBlocks('about')
  const links = primaryNavigation.find((group) => group.href === '/about')?.links ?? []

  return (
    <>
      <PageHero
        eyebrow="About us"
        title="About the company"
        description="Who we are, how we are governed, and the record behind what we publish."
        breadcrumbs={[{ label: 'About Us', href: '/about' }]}
      />

      <Section>
        <Container size="narrow">
          <ContentBlocks
            blocks={blocks}
            emptyTitle="Company profile is being prepared"
            emptyDescription="The company overview will be published here once it has been confirmed. The sections below are already available."
          />
        </Container>
      </Section>

      <Section tone="subtle">
        <Container className="flex flex-col gap-8">
          <SectionHeader title="Explore this section" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {links.map((link) => (
              <Card key={link.href} interactive className="relative">
                <CardBody className="flex flex-col gap-2">
                  <CardTitle as="h3" className="text-base">
                    <Link href={link.href} className="text-foreground hover:text-primary">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {link.label}
                    </Link>
                  </CardTitle>
                  <CardDescription>{SECTION_DESCRIPTIONS[link.href]}</CardDescription>
                  <span className="mt-1 inline-flex items-center gap-1 text-sm text-primary">
                    Read more
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
