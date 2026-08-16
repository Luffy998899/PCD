import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo/metadata'
import { getGlobalCoverage } from '@/lib/content/network'
import { Container, Section } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { EmptyState } from '@/components/ui/empty-state'
import { Badge } from '@/components/ui/badge'
import { LinkButton } from '@/components/ui/button'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Global presence',
    description:
      'Countries we export to, listed with year of entry and product registration status.',
    path: '/network/global',
  })
}

const REGISTRATION_LABELS: Record<string, { label: string; tone: 'accent' | 'neutral' | 'warning' }> =
  {
    registered: { label: 'Products registered', tone: 'accent' },
    under_registration: { label: 'Registration in progress', tone: 'warning' },
    export_only: { label: 'Export supply', tone: 'neutral' },
    not_applicable: { label: 'Not applicable', tone: 'neutral' },
  }

export default async function GlobalNetworkPage() {
  const countries = await getGlobalCoverage()

  return (
    <>
      <PageHero
        eyebrow="Our network"
        title="Global presence"
        description="Countries we currently supply, with the year supply began and the product registration position in each market."
        breadcrumbs={[
          { label: 'Our Network', href: '/network' },
          { label: 'Global Presence', href: '/network/global' },
        ]}
      />

      <Section>
        <Container className="flex flex-col gap-6">
          {countries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[36rem] border-collapse text-sm">
                <caption className="sr-only">Export countries and registration status</caption>
                <thead>
                  <tr>
                    {['Country', 'Since', 'Registration status', 'Notes'].map((heading) => (
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
                  {countries.map((country) => {
                    const registration = country.registration_status
                      ? REGISTRATION_LABELS[country.registration_status]
                      : undefined
                    return (
                      <tr key={country.id}>
                        <th
                          scope="row"
                          className="border border-border px-3 py-2 text-left font-medium text-foreground"
                        >
                          {country.name}
                        </th>
                        <td className="border border-border px-3 py-2 text-muted-foreground">
                          {country.since_year ?? '—'}
                        </td>
                        <td className="border border-border px-3 py-2">
                          {registration ? (
                            /* Status is conveyed by the label, not by colour
                               alone (Rules.md §20). */
                            <Badge tone={registration.tone}>{registration.label}</Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="border border-border px-3 py-2 text-muted-foreground">
                          {country.notes ?? '—'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="Export coverage is being compiled"
              description="Countries are published individually once supply and registration status have been confirmed."
              action={
                <LinkButton href="/contact/business-enquiry" size="sm">
                  Ask about export supply
                </LinkButton>
              }
            />
          )}
        </Container>
      </Section>
    </>
  )
}
