import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo/metadata'
import { getPartners } from '@/lib/content/network'
import { Container, Section } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { Card, CardBody, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Badge } from '@/components/ui/badge'
import { LinkButton } from '@/components/ui/button'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Distributors and stockists',
    description:
      'Distributors and stockists who have consented to their contact details being published.',
    path: '/network/distributors',
  })
}

const TYPE_LABELS: Record<string, string> = {
  distributor: 'Distributor',
  stockist: 'Stockist',
  cnf: 'C&F agent',
  institutional: 'Institutional supply',
}

export default async function DistributorsPage() {
  const partners = await getPartners()

  return (
    <>
      <PageHero
        eyebrow="Our network"
        title="Distributors and stockists"
        description="Only partners who have confirmed their details and consented to publication are listed here."
        breadcrumbs={[
          { label: 'Our Network', href: '/network' },
          { label: 'Distributors & Stockists', href: '/network/distributors' },
        ]}
      />

      <Section>
        <Container>
          {partners.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {partners.map((partner) => (
                <Card key={partner.id}>
                  <CardBody className="flex flex-col gap-2">
                    <Badge tone="primary">
                      {TYPE_LABELS[partner.partner_type] ?? partner.partner_type}
                    </Badge>
                    <CardTitle as="h2" className="text-base">
                      {partner.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {[partner.city, partner.stateName].filter(Boolean).join(', ')}
                    </p>
                    {partner.address ? (
                      <address className="text-sm whitespace-pre-line text-muted-foreground not-italic">
                        {partner.address}
                      </address>
                    ) : null}
                    <div className="flex flex-col gap-1 text-sm">
                      {partner.contact_person ? (
                        <p className="text-muted-foreground">{partner.contact_person}</p>
                      ) : null}
                      {partner.phone ? (
                        <a className="text-primary hover:underline" href={`tel:${partner.phone}`}>
                          {partner.phone}
                        </a>
                      ) : null}
                      {partner.email ? (
                        <a
                          className="text-primary hover:underline"
                          href={`mailto:${partner.email}`}
                        >
                          {partner.email}
                        </a>
                      ) : null}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No distributor details published"
              description="We publish a partner's details only with that partner's consent. Contact us and we will put you in touch with the distributor for your area."
              action={
                <LinkButton href="/contact/business-enquiry" size="sm">
                  Ask for your local distributor
                </LinkButton>
              }
            />
          )}
        </Container>
      </Section>
    </>
  )
}
