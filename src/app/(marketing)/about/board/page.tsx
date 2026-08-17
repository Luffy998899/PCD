import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo/metadata'
import { getPeople } from '@/lib/content/about'
import { Container, Section } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { PeopleCard } from '@/components/ui/people-card'
import { EmptyState } from '@/components/ui/empty-state'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Board of Directors',
    description: 'The directors responsible for the governance of the company.',
    path: '/about/board',
  })
}

export default async function Page() {
  const people = await getPeople('board')

  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Board of Directors"
        description="The directors responsible for the governance of the company."
        breadcrumbs={[
          { label: 'About Us', href: '/about' },
          { label: 'Board of Directors', href: '/about/board' },
        ]}
      />
      <Section>
        <Container>
          {people.length > 0 ? (
            <>
              <h2 className="sr-only">Board members</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {people.map((person) => (
                  <PeopleCard key={person.id} person={person} />
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              title="Board of Directors profiles are being prepared"
              description="Director profiles are published once names, designations and authentic photographs have been confirmed."
            />
          )}
        </Container>
      </Section>
    </>
  )
}
