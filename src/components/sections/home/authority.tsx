import Link from 'next/link'

import { getContentBlocks } from '@/lib/content/blocks'
import { getPeople } from '@/lib/content/about'
import { getCertificates, getFacilities } from '@/lib/content/science'
import { getNetworkCounts } from '@/lib/content/network'
import { getMemberships, getTestimonials } from '@/lib/content/home'
import { Container, Section, SectionHeader } from '@/components/ui/layout'
import { Card, CardBody, CardDescription, CardTitle } from '@/components/ui/card'
import { LinkButton } from '@/components/ui/button'
import { CertificateCard } from '@/components/ui/certificate-card'
import { PeopleCard } from '@/components/ui/people-card'

/**
 * Authority sections of the homepage.
 *
 * Each one renders only when the underlying records exist, so the homepage
 * never shows an empty promise. Each has at most one primary button
 * (Rules.md §5).
 */

export async function HomeAbout() {
  const blocks = await getContentBlocks('about-overview')
  const intro = blocks[0]
  if (!intro?.body) return null

  return (
    <Section>
      <Container className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-start">
        <div className="flex flex-col gap-4">
          <SectionHeader eyebrow="About us" title={intro.heading ?? 'About the company'} />
          {intro.body.split(/\n{2,}/).slice(0, 2).map((paragraph, index) => (
            <p key={index} className="max-w-2xl text-muted-foreground">
              {paragraph}
            </p>
          ))}
          <LinkButton href="/about/overview" className="self-start">
            Read the company profile
          </LinkButton>
        </div>
      </Container>
    </Section>
  )
}

export async function HomeScience() {
  const [facilities, blocks] = await Promise.all([
    getFacilities(),
    getContentBlocks('science-quality'),
  ])
  if (facilities.length === 0 && blocks.length === 0) return null

  const intro = blocks[0]

  return (
    <Section tone="subtle">
      <Container className="flex flex-col gap-8">
        <SectionHeader
          eyebrow="Science & quality"
          title="Manufacturing and quality"
          description={intro?.body?.split(/\n{2,}/)[0]}
        />
        {facilities.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {facilities.slice(0, 3).map((facility) => (
              <Card key={facility.id}>
                <CardBody className="flex flex-col gap-2">
                  <CardTitle as="h3" className="text-base">
                    {facility.name}
                  </CardTitle>
                  {facility.summary ? (
                    <CardDescription>{facility.summary}</CardDescription>
                  ) : null}
                  <p className="text-sm text-muted-foreground">
                    {[facility.city, facility.state, facility.country].filter(Boolean).join(', ')}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : null}
        <LinkButton href="/science-quality" className="self-start">
          Explore science and quality
        </LinkButton>
      </Container>
    </Section>
  )
}

export async function HomeCertifications() {
  const certificates = await getCertificates()
  if (certificates.length === 0) return null

  return (
    <Section>
      <Container className="flex flex-col gap-8">
        <SectionHeader
          eyebrow="Certifications"
          title="Certifications and approvals"
          description="Each certificate is listed with its issuing body, number and validity."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {certificates.slice(0, 3).map((certificate) => (
            <CertificateCard key={certificate.id} certificate={certificate} />
          ))}
        </div>
        <LinkButton href="/science-quality/certifications" className="self-start">
          View all certifications
        </LinkButton>
      </Container>
    </Section>
  )
}

export async function HomeNetwork() {
  const counts = await getNetworkCounts()
  if (counts.states === 0 && counts.countries === 0) return null

  const figures = [
    { label: 'States covered', value: counts.states },
    { label: 'Districts covered', value: counts.districts },
    { label: 'Export countries', value: counts.countries },
  ].filter((figure) => figure.value > 0)

  return (
    <Section tone="subtle">
      <Container className="flex flex-col gap-8">
        <SectionHeader
          eyebrow="Our network"
          title="Where we operate"
          description="Coverage is listed state by state and country by country, so it can be checked."
        />
        <dl className="grid gap-4 sm:grid-cols-3">
          {figures.map((figure) => (
            <div key={figure.label} className="rounded-md border border-border bg-surface p-5">
              <dd className="font-display text-3xl font-semibold text-primary">{figure.value}</dd>
              <dt className="text-sm text-muted-foreground">{figure.label}</dt>
            </div>
          ))}
        </dl>
        <LinkButton href="/network" className="self-start">
          View our network
        </LinkButton>
      </Container>
    </Section>
  )
}

export async function HomeLeadership() {
  const people = await getPeople('leadership')
  if (people.length === 0) return null

  return (
    <Section>
      <Container className="flex flex-col gap-8">
        <SectionHeader
          eyebrow="Leadership"
          title="The team behind the company"
          description="The people responsible for operations, quality and supply."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {people.slice(0, 4).map((person) => (
            <PeopleCard key={person.id} person={person} showBio={false} />
          ))}
        </div>
        <LinkButton href="/about/leadership" className="self-start">
          Meet the leadership team
        </LinkButton>
      </Container>
    </Section>
  )
}

/**
 * Associations and testimonials.
 *
 * Testimonials appear only when consent is recorded, and always carry the
 * person's name — an anonymous quote is not evidence (Rules.md §1).
 */
export async function HomePartners() {
  const [memberships, testimonials] = await Promise.all([getMemberships(), getTestimonials()])
  if (memberships.length === 0 && testimonials.length === 0) return null

  return (
    <Section tone="subtle">
      <Container className="flex flex-col gap-10">
        {memberships.length > 0 ? (
          <div className="flex flex-col gap-6">
            <SectionHeader
              eyebrow="Associations"
              title="Industry memberships"
              description="Bodies we are a member of, with membership numbers where applicable."
            />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {memberships.map((membership) => (
                <li key={membership.id}>
                  <Card>
                    <CardBody className="flex flex-col gap-1">
                      <p className="font-medium text-foreground">
                        {membership.website_url ? (
                          <Link
                            href={membership.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary"
                          >
                            {membership.name}
                          </Link>
                        ) : (
                          membership.name
                        )}
                      </p>
                      {membership.membership_number ? (
                        <p className="font-mono text-xs text-muted-foreground">
                          {membership.membership_number}
                        </p>
                      ) : null}
                      {membership.since_year ? (
                        <p className="text-xs text-muted-foreground">
                          Member since {membership.since_year}
                        </p>
                      ) : null}
                    </CardBody>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {testimonials.length > 0 ? (
          <div className="flex flex-col gap-6">
            <SectionHeader eyebrow="In their words" title="What our partners say" />
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.slice(0, 3).map((testimonial) => (
                <li key={testimonial.id}>
                  <Card className="h-full">
                    <CardBody className="flex h-full flex-col gap-3">
                      <blockquote className="flex-1 text-sm text-muted-foreground">
                        “{testimonial.quote}”
                      </blockquote>
                      <footer className="text-sm">
                        <p className="font-medium text-foreground">{testimonial.author_name}</p>
                        <p className="text-muted-foreground">
                          {[
                            testimonial.author_designation,
                            testimonial.organisation,
                            testimonial.city,
                          ]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      </footer>
                    </CardBody>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Container>
    </Section>
  )
}
