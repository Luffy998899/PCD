import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { buildMetadata } from '@/lib/seo/metadata'
import { getContentBlocks } from '@/lib/content/blocks'
import { getCertificates, getFacilities } from '@/lib/content/science'
import { Container, Section, SectionHeader } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { Card, CardBody, CardDescription, CardTitle } from '@/components/ui/card'
import { ContentBlocks } from '@/components/sections/content-blocks'
import { CertificateCard } from '@/components/ui/certificate-card'
import { LinkButton } from '@/components/ui/button'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Science and quality',
    description:
      'Manufacturing facilities, quality assurance and control, certifications, regulatory compliance and pharmacovigilance.',
    path: '/science-quality',
  })
}

const SECTIONS = [
  {
    href: '/science-quality/rd',
    label: 'R&D and formulation development',
    description: 'How formulations are developed and taken to a manufacturable specification.',
  },
  {
    href: '/science-quality/manufacturing',
    label: 'Manufacturing',
    description: 'Facilities, production lines, dosage forms and utilities.',
  },
  {
    href: '/science-quality/quality',
    label: 'Quality assurance and control',
    description: 'Testing performed at each stage, from raw material to finished pack.',
  },
  {
    href: '/science-quality/certifications',
    label: 'Certifications and approvals',
    description: 'Certificates with issuing body, number and validity.',
  },
  {
    href: '/science-quality/regulatory',
    label: 'Regulatory compliance',
    description: 'Licences, compliance commitments and the documents behind them.',
  },
  {
    href: '/science-quality/pharmacovigilance',
    label: 'Pharmacovigilance',
    description: 'How to report a side effect or a suspected product quality problem.',
  },
]

export default async function ScienceQualityPage() {
  const [blocks, facilities, certificates] = await Promise.all([
    getContentBlocks('science-quality'),
    getFacilities(),
    getCertificates(),
  ])

  return (
    <>
      <PageHero
        eyebrow="Science & quality"
        title="Science, manufacturing and quality"
        description="The evidence behind our products: where they are made, how they are tested, and which approvals cover them."
        breadcrumbs={[{ label: 'Science & Quality', href: '/science-quality' }]}
      />

      <Section>
        <Container size="narrow">
          <ContentBlocks
            blocks={blocks}
            emptyTitle="This overview is being prepared"
            emptyDescription="The sections below are available and are published as the company confirms each set of facts."
          />
        </Container>
      </Section>

      <Section tone="subtle">
        <Container className="flex flex-col gap-8">
          <SectionHeader title="Explore this section" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map((section) => (
              <Card key={section.href} interactive className="relative">
                <CardBody className="flex flex-col gap-2">
                  <CardTitle as="h3" className="text-base">
                    <Link href={section.href} className="text-foreground hover:text-primary">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {section.label}
                    </Link>
                  </CardTitle>
                  <CardDescription>{section.description}</CardDescription>
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

      {facilities.length > 0 ? (
        <Section>
          <Container className="flex flex-col gap-8">
            <SectionHeader
              title="Manufacturing"
              description="Our facilities and where they are located."
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {facilities.slice(0, 3).map((facility) => (
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
            <LinkButton href="/science-quality/manufacturing" className="self-start">
              View manufacturing
            </LinkButton>
          </Container>
        </Section>
      ) : null}

      {certificates.length > 0 ? (
        <Section tone="subtle">
          <Container className="flex flex-col gap-8">
            <SectionHeader
              title="Certifications and approvals"
              description="Each certificate lists its issuing body, number and validity."
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {certificates.slice(0, 3).map((certificate) => (
                <CertificateCard key={certificate.id} certificate={certificate} />
              ))}
            </div>
            <LinkButton href="/science-quality/certifications" className="self-start">
              View all certifications
            </LinkButton>
          </Container>
        </Section>
      ) : null}
    </>
  )
}
