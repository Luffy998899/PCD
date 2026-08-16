import type { Metadata } from 'next'
import Image from 'next/image'

import { buildMetadata } from '@/lib/seo/metadata'
import { getFacilities, type FacilitySpec } from '@/lib/content/science'
import { getContentBlocks } from '@/lib/content/blocks'
import { Container, Section, SectionHeader } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { EmptyState } from '@/components/ui/empty-state'
import { ContentBlocks } from '@/components/sections/content-blocks'
import { Badge } from '@/components/ui/badge'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Manufacturing facilities',
    description:
      'Manufacturing locations, production capability and utilities, published with the figures the company can evidence.',
    path: '/science-quality/manufacturing',
  })
}

const SPEC_CATEGORY_LABELS: Record<FacilitySpec['category'], string> = {
  general: 'Facility',
  production: 'Production',
  quality: 'Quality',
  utilities: 'Utilities',
}

const FACILITY_TYPE_LABELS: Record<string, string> = {
  manufacturing: 'Manufacturing unit',
  laboratory: 'Laboratory',
  warehouse: 'Warehouse',
  rnd: 'R&D centre',
}

/** Groups specs so each facility renders one table per category. */
function groupSpecs(specs: FacilitySpec[]): [FacilitySpec['category'], FacilitySpec[]][] {
  const order: FacilitySpec['category'][] = ['general', 'production', 'quality', 'utilities']
  return order
    .map(
      (category) =>
        [category, specs.filter((spec) => spec.category === category)] as [
          FacilitySpec['category'],
          FacilitySpec[],
        ],
    )
    .filter(([, items]) => items.length > 0)
}

export default async function ManufacturingPage() {
  const [facilities, blocks] = await Promise.all([
    getFacilities(),
    getContentBlocks('science-manufacturing'),
  ])

  return (
    <>
      <PageHero
        eyebrow="Science & quality"
        title="Manufacturing"
        description="Where our products are made, and the capability of each site. Figures are published only where the company holds supporting records."
        breadcrumbs={[
          { label: 'Science & Quality', href: '/science-quality' },
          { label: 'Manufacturing', href: '/science-quality/manufacturing' },
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
          {facilities.length > 0 ? (
            facilities.map((facility) => (
              <article key={facility.id} className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <Badge tone="primary">
                    {FACILITY_TYPE_LABELS[facility.facility_type] ?? facility.facility_type}
                  </Badge>
                  <SectionHeader
                    title={facility.name}
                    description={facility.summary}
                    as="h2"
                  />
                  <p className="text-sm text-muted-foreground">
                    {[facility.city, facility.state, facility.country].filter(Boolean).join(', ')}
                    {facility.commissioned_year
                      ? ` · Commissioned ${facility.commissioned_year}`
                      : ''}
                  </p>
                </div>

                {facility.hero_image_url ? (
                  <div className="relative aspect-16/9 w-full overflow-hidden rounded-md border border-border bg-surface-subtle">
                    <Image
                      src={facility.hero_image_url}
                      alt={facility.hero_image_alt ?? `${facility.name} facility`}
                      fill
                      sizes="(min-width: 1280px) 1200px, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}

                {facility.description ? (
                  <div className="prose-content max-w-3xl">
                    {facility.description.split(/\n{2,}/).map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                ) : null}

                {groupSpecs(facility.specs).map(([category, specs]) => (
                  <div key={category} className="flex flex-col gap-3">
                    <h3 className="text-base text-foreground">
                      {SPEC_CATEGORY_LABELS[category]}
                    </h3>
                    {/* Technical data tables scroll horizontally on small
                        screens rather than shrinking to unreadable text
                        (Design.md §22). */}
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[32rem] border-collapse text-sm">
                        <caption className="sr-only">
                          {SPEC_CATEGORY_LABELS[category]} details for {facility.name}
                        </caption>
                        <thead>
                          <tr>
                            <th
                              scope="col"
                              className="border border-border bg-surface-subtle px-3 py-2 text-left font-semibold text-foreground"
                            >
                              Item
                            </th>
                            <th
                              scope="col"
                              className="border border-border bg-surface-subtle px-3 py-2 text-left font-semibold text-foreground"
                            >
                              Detail
                            </th>
                            <th
                              scope="col"
                              className="border border-border bg-surface-subtle px-3 py-2 text-left font-semibold text-foreground"
                            >
                              Source
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {specs.map((spec) => (
                            <tr key={spec.id}>
                              <th
                                scope="row"
                                className="border border-border px-3 py-2 text-left font-medium text-foreground"
                              >
                                {spec.label}
                              </th>
                              <td className="border border-border px-3 py-2 text-muted-foreground">
                                {spec.value}
                                {spec.unit ? ` ${spec.unit}` : ''}
                              </td>
                              <td className="border border-border px-3 py-2 text-muted-foreground">
                                {spec.source_reference ?? '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </article>
            ))
          ) : (
            <EmptyState
              title="Facility information is being prepared"
              description="Manufacturing locations and their technical details are published here once the company has confirmed each figure against its records."
            />
          )}
        </Container>
      </Section>
    </>
  )
}
