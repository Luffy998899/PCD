import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Briefcase, CalendarDays, MapPin, Users } from 'lucide-react'

import { buildMetadata } from '@/lib/seo/metadata'
import {
  EMPLOYMENT_TYPE_LABELS,
  experienceRange,
  getJobOpeningBySlug,
  getJobOpenings,
} from '@/lib/content/careers'
import { formatDate, truncate } from '@/lib/utils'
import { Container, Section, SectionHeader } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { Card, CardBody, CardTitle } from '@/components/ui/card'
import { ApplicationForm } from '@/components/forms/application-form'
import { LinkButton } from '@/components/ui/button'

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
  const openings = await getJobOpenings()
  return openings.map((opening) => ({ slug: opening.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const opening = await getJobOpeningBySlug(slug)

  if (!opening) {
    return { title: 'Opening not found', robots: { index: false, follow: false } }
  }

  return buildMetadata({
    title: opening.seo_title ?? `${opening.title} — ${opening.location}`,
    description:
      opening.seo_description ?? opening.summary ?? truncate(opening.description, 155),
    path: `/careers/openings/${opening.slug}`,
    // A filled role stays reachable but is not promoted in search.
    noIndex: opening.hiring_status === 'closed',
  })
}

const DETAIL_SECTIONS = [
  { key: 'description', heading: 'About the role' },
  { key: 'responsibilities', heading: 'Responsibilities' },
  { key: 'requirements', heading: 'What we are looking for' },
] as const

export default async function OpeningDetailPage({ params }: { params: Params }) {
  const { slug } = await params
  const opening = await getJobOpeningBySlug(slug)

  if (!opening) notFound()

  const experience = experienceRange(opening)
  const isOpen = opening.hiring_status === 'open'

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title={opening.title}
        description={opening.summary ?? undefined}
        breadcrumbs={[
          { label: 'Careers', href: '/careers' },
          { label: 'Current Openings', href: '/careers/openings' },
          { label: opening.title, href: `/careers/openings/${opening.slug}` },
        ]}
      />

      <Section>
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="flex flex-col gap-8">
            {DETAIL_SECTIONS.filter(({ key }) => Boolean(opening[key])).map(
              ({ key, heading }) => (
                <section key={key} className="flex flex-col gap-2">
                  <h2 className="text-[1.5rem] leading-snug text-foreground">{heading}</h2>
                  <div className="prose-content">
                    {String(opening[key])
                      .split(/\n{2,}/)
                      .map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                  </div>
                </section>
              ),
            )}
          </div>

          <aside className="flex flex-col gap-4">
            <Card>
              <CardBody className="flex flex-col gap-3">
                <CardTitle as="h2" className="text-base">
                  Role details
                </CardTitle>
                <dl className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Briefcase className="size-4 text-muted-foreground" aria-hidden="true" />
                    <dt className="sr-only">Department</dt>
                    <dd className="text-foreground">{opening.department}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-muted-foreground" aria-hidden="true" />
                    <dt className="sr-only">Location</dt>
                    <dd className="text-foreground">{opening.location}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
                    <dt className="sr-only">Employment type</dt>
                    <dd className="text-foreground">
                      {EMPLOYMENT_TYPE_LABELS[opening.employment_type]}
                    </dd>
                  </div>
                  {experience ? (
                    <div className="flex items-center gap-2">
                      <Users className="size-4 text-muted-foreground" aria-hidden="true" />
                      <dt className="sr-only">Experience</dt>
                      <dd className="text-foreground">{experience}</dd>
                    </div>
                  ) : null}
                  {opening.positions ? (
                    <div className="flex flex-col">
                      <dt className="text-muted-foreground">Positions</dt>
                      <dd className="text-foreground">{opening.positions}</dd>
                    </div>
                  ) : null}
                  <div className="flex flex-col">
                    <dt className="text-muted-foreground">Posted</dt>
                    <dd className="text-foreground">{formatDate(opening.posted_on)}</dd>
                  </div>
                  {opening.closes_on ? (
                    <div className="flex flex-col">
                      <dt className="text-muted-foreground">Applications close</dt>
                      <dd className="text-foreground">{formatDate(opening.closes_on)}</dd>
                    </div>
                  ) : null}
                </dl>
              </CardBody>
            </Card>
          </aside>
        </Container>
      </Section>

      <Section tone="subtle" id="apply">
        <Container size="narrow" className="flex flex-col gap-6">
          {isOpen ? (
            <>
              <SectionHeader
                title={`Apply for ${opening.title}`}
                description="Your CV is stored privately and is only seen by our HR team."
              />
              <ApplicationForm
                jobOpeningId={opening.id}
                appliedFor={opening.title}
                roleIsFixed
              />
            </>
          ) : (
            <Card>
              <CardBody className="flex flex-col items-start gap-3">
                <CardTitle as="h2">This role is closed</CardTitle>
                <p className="text-sm text-muted-foreground">
                  We are no longer accepting applications for this position. You can view current
                  openings, or send us your CV for future roles.
                </p>
                <div className="flex flex-wrap gap-3">
                  <LinkButton href="/careers/openings">View current openings</LinkButton>
                  <Link
                    href="/careers/apply"
                    className="inline-flex items-center text-sm text-primary underline underline-offset-4"
                  >
                    Send your CV
                  </Link>
                </div>
              </CardBody>
            </Card>
          )}
        </Container>
      </Section>
    </>
  )
}
