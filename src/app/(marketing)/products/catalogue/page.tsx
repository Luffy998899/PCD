import type { Metadata } from 'next'
import { Download } from 'lucide-react'

import { buildMetadata } from '@/lib/seo/metadata'
import { getSiteSettings } from '@/lib/content/site-settings'
import { getDivisions, getTherapies, listProducts } from '@/lib/content/products'
import { formatDate } from '@/lib/utils'
import { Container, Section, SectionHeader } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { Card, CardBody, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { ExternalLinkButton, LinkButton } from '@/components/ui/button'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Product catalogue',
    description:
      'Download the product catalogue, or browse the portfolio by therapy and division.',
    path: '/products/catalogue',
  })
}

export default async function CataloguePage() {
  const [settings, therapies, divisions, { total }] = await Promise.all([
    getSiteSettings(),
    getTherapies(),
    getDivisions(),
    listProducts(),
  ])

  const updatedOn = formatDate(settings.product_catalogue_updated_on)

  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Product catalogue"
        description="The full portfolio in one document, plus quick routes into the online catalogue."
        breadcrumbs={[
          { label: 'Products', href: '/products' },
          { label: 'Catalogue', href: '/products/catalogue' },
        ]}
      />

      <Section spacing="compact">
        <Container>
          {settings.product_catalogue_url ? (
            <Card>
              <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-1">
                  <CardTitle as="h2" className="text-base">
                    Product catalogue (PDF)
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {updatedOn ? `Updated ${updatedOn}.` : null}
                    {total > 0
                      ? ` ${total} product${total === 1 ? '' : 's'} are also listed online.`
                      : null}
                  </p>
                </div>
                <ExternalLinkButton href={settings.product_catalogue_url} className="shrink-0">
                  <Download className="size-4" aria-hidden="true" />
                  Download catalogue
                </ExternalLinkButton>
              </CardBody>
            </Card>
          ) : (
            <EmptyState
              title="The catalogue document is being prepared"
              description="The downloadable catalogue is published here once it has been approved. The online product listing is available in the meantime."
              action={
                <LinkButton href="/products" size="sm">
                  Browse products
                </LinkButton>
              }
            />
          )}
        </Container>
      </Section>

      {therapies.length > 0 ? (
        <Section spacing="compact">
          <Container className="flex flex-col gap-6">
            <SectionHeader title="Browse by therapy" />
            <ul className="flex flex-wrap gap-2">
              {therapies.map((therapy) => (
                <li key={therapy.id}>
                  <LinkButton
                    href={`/products/therapy/${therapy.slug}`}
                    variant="outline"
                    size="sm"
                  >
                    {therapy.name}
                  </LinkButton>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {divisions.length > 0 ? (
        <Section spacing="compact" tone="subtle">
          <Container className="flex flex-col gap-6">
            <SectionHeader title="Browse by division" />
            <ul className="flex flex-wrap gap-2">
              {divisions.map((division) => (
                <li key={division.id}>
                  <LinkButton
                    href={`/products/division/${division.slug}`}
                    variant="outline"
                    size="sm"
                  >
                    {division.name}
                  </LinkButton>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}
    </>
  )
}
