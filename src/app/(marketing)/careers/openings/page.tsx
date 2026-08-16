import type { Metadata } from 'next'
import Link from 'next/link'
import { Briefcase, MapPin } from 'lucide-react'

import { buildMetadata } from '@/lib/seo/metadata'
import {
  EMPLOYMENT_TYPE_LABELS,
  experienceRange,
  getJobOpenings,
} from '@/lib/content/careers'
import { formatDate } from '@/lib/utils'
import { Container, Section } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { Card, CardBody, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Badge } from '@/components/ui/badge'
import { LinkButton } from '@/components/ui/button'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Current openings',
    description: 'Roles we are currently hiring for, with department, location and experience.',
    path: '/careers/openings',
  })
}

export default async function OpeningsPage() {
  const openings = await getJobOpenings()
  const open = openings.filter((opening) => opening.hiring_status === 'open')

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Current openings"
        description="Roles we are hiring for now. If nothing fits, you can still send us your CV."
        breadcrumbs={[
          { label: 'Careers', href: '/careers' },
          { label: 'Current Openings', href: '/careers/openings' },
        ]}
      />

      <Section>
        <Container className="flex flex-col gap-6">
          {open.length > 0 ? (
            <ul className="flex flex-col gap-4">
              {open.map((opening) => {
                const experience = experienceRange(opening)
                return (
                  <li key={opening.id}>
                    <Card interactive className="relative">
                      <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex flex-col gap-2">
                          <CardTitle as="h2" className="text-base">
                            <Link
                              href={`/careers/openings/${opening.slug}`}
                              className="text-foreground hover:text-primary"
                            >
                              <span className="absolute inset-0" aria-hidden="true" />
                              {opening.title}
                            </Link>
                          </CardTitle>
                          {opening.summary ? (
                            <p className="max-w-2xl text-sm text-muted-foreground">
                              {opening.summary}
                            </p>
                          ) : null}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5">
                              <Briefcase className="size-4" aria-hidden="true" />
                              {opening.department}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="size-4" aria-hidden="true" />
                              {opening.location}
                            </span>
                            {experience ? <span>{experience}</span> : null}
                            <span>Posted {formatDate(opening.posted_on)}</span>
                          </div>
                        </div>
                        <Badge tone="primary" className="shrink-0 self-start">
                          {EMPLOYMENT_TYPE_LABELS[opening.employment_type]}
                        </Badge>
                      </CardBody>
                    </Card>
                  </li>
                )
              })}
            </ul>
          ) : (
            <EmptyState
              title="No open positions at the moment"
              description="We are not advertising a role right now. You can still send your CV and we will contact you when something suitable opens."
              action={
                <LinkButton href="/careers/apply" size="sm">
                  Send your CV
                </LinkButton>
              }
            />
          )}

          {open.length > 0 ? (
            <p className="text-sm text-muted-foreground">
              Nothing matching your profile?{' '}
              <Link href="/careers/apply" className="text-primary underline underline-offset-4">
                Send us your CV
              </Link>{' '}
              and we will keep it on file.
            </p>
          ) : null}
        </Container>
      </Section>
    </>
  )
}
