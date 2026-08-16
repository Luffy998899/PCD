import type { Metadata } from 'next'
import { CalendarDays, ExternalLink, MapPin } from 'lucide-react'

import { buildMetadata } from '@/lib/seo/metadata'
import { getEvents } from '@/lib/content/media'
import { formatDate, toIsoDate } from '@/lib/utils'
import { Container, Section } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { Card, CardBody, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Badge } from '@/components/ui/badge'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Events and exhibitions',
    description: 'Trade exhibitions, conferences and company events.',
    path: '/media/events',
  })
}

export default async function EventsPage() {
  const events = await getEvents()
  const today = new Date().toISOString().slice(0, 10)

  const upcoming = events.filter((event) => (event.ends_on ?? event.starts_on) >= today)
  const past = events.filter((event) => (event.ends_on ?? event.starts_on) < today)

  const groups = [
    { label: 'Upcoming', entries: upcoming },
    { label: 'Past events', entries: past },
  ].filter((group) => group.entries.length > 0)

  return (
    <>
      <PageHero
        eyebrow="Media & insights"
        title="Events and exhibitions"
        description="Where you can meet our team."
        breadcrumbs={[
          { label: 'Media & Insights', href: '/media' },
          { label: 'Events', href: '/media/events' },
        ]}
      />

      <Section>
        <Container className="flex flex-col gap-12">
          {groups.length > 0 ? (
            groups.map((group) => (
              <section key={group.label} className="flex flex-col gap-5">
                <h2 className="text-[1.5rem] leading-snug text-foreground">{group.label}</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {group.entries.map((event) => (
                    <Card key={event.id}>
                      <CardBody className="flex flex-col gap-2">
                        {group.label === 'Upcoming' ? <Badge tone="accent">Upcoming</Badge> : null}
                        <CardTitle as="h3" className="text-base">
                          {event.title}
                        </CardTitle>
                        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
                          <time dateTime={toIsoDate(event.starts_on) ?? undefined}>
                            {formatDate(event.starts_on)}
                          </time>
                          {event.ends_on ? (
                            <>
                              <span aria-hidden="true">–</span>
                              <time dateTime={toIsoDate(event.ends_on) ?? undefined}>
                                {formatDate(event.ends_on)}
                              </time>
                            </>
                          ) : null}
                        </p>
                        {event.location ? (
                          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MapPin className="size-4 shrink-0" aria-hidden="true" />
                            {event.location}
                          </p>
                        ) : null}
                        {event.description ? (
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                        ) : null}
                        {event.event_url ? (
                          <a
                            href={event.event_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline"
                          >
                            <ExternalLink className="size-3.5" aria-hidden="true" />
                            Event details
                            <span className="sr-only">for {event.title} (opens in a new tab)</span>
                          </a>
                        ) : null}
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </section>
            ))
          ) : (
            <EmptyState
              title="No events listed"
              description="Exhibitions and conferences we are attending are published here once confirmed."
            />
          )}
        </Container>
      </Section>
    </>
  )
}
