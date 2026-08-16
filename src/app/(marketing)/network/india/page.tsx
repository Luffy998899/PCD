import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo/metadata'
import { getIndiaCoverage } from '@/lib/content/network'
import { Container, Section } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { EmptyState } from '@/components/ui/empty-state'
import { LinkButton } from '@/components/ui/button'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'India presence',
    description:
      'States and districts we currently supply, listed individually with the year coverage began.',
    path: '/network/india',
  })
}

const REGION_LABELS: Record<string, string> = {
  north: 'North',
  south: 'South',
  east: 'East',
  west: 'West',
  central: 'Central',
  'north-east': 'North-East',
}

export default async function IndiaNetworkPage() {
  const states = await getIndiaCoverage()
  const districtTotal = states.reduce((total, state) => total + state.districts.length, 0)

  return (
    <>
      <PageHero
        eyebrow="Our network"
        title="India presence"
        description="Each state we supply is listed below with its districts. We publish the list itself rather than a headline number, so the coverage can be checked."
        breadcrumbs={[
          { label: 'Our Network', href: '/network' },
          { label: 'India Presence', href: '/network/india' },
        ]}
      />

      <Section>
        <Container className="flex flex-col gap-6">
          {states.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground">
                {states.length} state{states.length === 1 ? '' : 's'}
                {districtTotal > 0
                  ? ` and ${districtTotal} district${districtTotal === 1 ? '' : 's'}`
                  : ''}{' '}
                currently supplied.
              </p>

              {/* Coverage is a table, not a decorative map. A map is added only
                  when the underlying location data is real (Design.md §15). */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[40rem] border-collapse text-sm">
                  <caption className="sr-only">States and districts covered in India</caption>
                  <thead>
                    <tr>
                      {['State', 'Region', 'Since', 'Districts'].map((heading) => (
                        <th
                          key={heading}
                          scope="col"
                          className="border border-border bg-surface-subtle px-3 py-2 text-left font-semibold text-foreground"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {states.map((state) => (
                      <tr key={state.id}>
                        <th
                          scope="row"
                          className="border border-border px-3 py-2 text-left font-medium text-foreground"
                        >
                          {state.name}
                        </th>
                        <td className="border border-border px-3 py-2 text-muted-foreground">
                          {state.region ? (REGION_LABELS[state.region] ?? state.region) : '—'}
                        </td>
                        <td className="border border-border px-3 py-2 text-muted-foreground">
                          {state.since_year ?? '—'}
                        </td>
                        <td className="border border-border px-3 py-2 text-muted-foreground">
                          {state.districts.length > 0
                            ? state.districts.map((district) => district.name).join(', ')
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <EmptyState
              title="India coverage is being compiled"
              description="States and districts are published individually once confirmed. Contact us and we will tell you whether we currently supply your area."
              action={
                <LinkButton href="/contact/business-enquiry" size="sm">
                  Ask about your area
                </LinkButton>
              }
            />
          )}
        </Container>
      </Section>
    </>
  )
}
