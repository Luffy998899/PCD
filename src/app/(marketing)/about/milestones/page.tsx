import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo/metadata'
import { getMilestones } from '@/lib/content/about'
import { Container, Section } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { EmptyState } from '@/components/ui/empty-state'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Milestones',
    description: 'A dated record of how the company has developed.',
    path: '/about/milestones',
  })
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export default async function MilestonesPage() {
  const milestones = await getMilestones()

  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Milestones"
        description="Dated events in the company’s development. Each entry is recorded with the year it took place."
        breadcrumbs={[
          { label: 'About Us', href: '/about' },
          { label: 'Milestones', href: '/about/milestones' },
        ]}
      />

      <Section>
        <Container size="narrow">
          {milestones.length > 0 ? (
            <ol className="flex flex-col">
              {milestones.map((milestone) => (
                <li
                  key={milestone.id}
                  className="grid gap-2 border-l-2 border-border pb-8 pl-6 last:pb-0 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-6"
                >
                  <div className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute top-1.5 -left-[1.8125rem] size-3 rounded-full border-2 border-surface bg-primary sm:-left-[1.8125rem]"
                    />
                    <p className="font-display text-lg font-semibold text-primary">
                      {milestone.year}
                    </p>
                    {milestone.month ? (
                      <p className="text-xs text-muted-foreground">
                        {MONTHS[milestone.month - 1]}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h2 className="text-base text-foreground">{milestone.title}</h2>
                    {milestone.description ? (
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    ) : null}
                    {milestone.source_reference ? (
                      <p className="text-xs text-muted-foreground">
                        Source: {milestone.source_reference}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <EmptyState
              title="Milestones are being compiled"
              description="Each milestone is published with the year it took place, once the company has confirmed the record."
            />
          )}
        </Container>
      </Section>
    </>
  )
}
