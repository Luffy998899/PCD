import type { Metadata } from 'next'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'

import { buildMetadata } from '@/lib/seo/metadata'
import { getAwards } from '@/lib/content/about'
import { Container, Section } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { Card, CardBody, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Badge } from '@/components/ui/badge'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Awards and recognition',
    description: 'Recognition received by the company, listed with the issuing body and year.',
    path: '/about/awards',
  })
}

export default async function AwardsPage() {
  const awards = await getAwards()

  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Awards and recognition"
        description="Each entry lists who issued it and when. Only recognition the company can evidence is published here."
        breadcrumbs={[
          { label: 'About Us', href: '/about' },
          { label: 'Awards & Recognition', href: '/about/awards' },
        ]}
      />

      <Section>
        <Container>
          {awards.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {awards.map((award) => (
                <Card key={award.id} className="flex flex-col overflow-hidden">
                  {award.image_url ? (
                    <div className="relative aspect-video w-full bg-surface-subtle">
                      <Image
                        src={award.image_url}
                        alt={`${award.title}${award.awarded_by ? `, awarded by ${award.awarded_by}` : ''}`}
                        fill
                        sizes="(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 90vw"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <CardBody className="flex flex-1 flex-col gap-2">
                    {award.year ? <Badge tone="primary">{award.year}</Badge> : null}
                    <CardTitle as="h2" className="text-base">
                      {award.title}
                    </CardTitle>
                    {award.awarded_by ? (
                      <p className="text-sm text-muted-foreground">
                        Awarded by {award.awarded_by}
                      </p>
                    ) : null}
                    {award.description ? (
                      <p className="text-sm text-muted-foreground">{award.description}</p>
                    ) : null}
                    {award.document_url ? (
                      <a
                        href={award.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline"
                      >
                        <ExternalLink className="size-3.5" aria-hidden="true" />
                        View certificate
                        <span className="sr-only">for {award.title} (opens in a new tab)</span>
                      </a>
                    ) : null}
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No awards published yet"
              description="Recognition is listed here once the company has supplied the certificate or citation supporting it."
            />
          )}
        </Container>
      </Section>
    </>
  )
}
