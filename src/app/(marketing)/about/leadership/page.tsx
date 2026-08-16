import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo/metadata'
import { getPeople } from '@/lib/content/about'
import { Container, Section } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { PeopleCard } from '@/components/ui/people-card'
import { EmptyState } from '@/components/ui/empty-state'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Leadership and core team',
    description: 'The team responsible for operations, quality, supply and commercial functions.',
    path: '/about/leadership',
  })
}

export default async function Page() {
  const people = await getPeople('leadership')

  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Leadership and core team"
        description="The team responsible for operations, quality, supply and commercial functions."
        breadcrumbs={[
          { label: 'About Us', href: '/about' },
          { label: 'Leadership and core team', href: '/about/leadership' },
        ]}
      />
      <Section>
        <Container>
          {people.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {people.map((person) => (
                <PeopleCard key={person.id} person={person} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Leadership profiles are being prepared"
              description="Profiles are published once names, designations and authentic photographs have been confirmed."
            />
          )}
        </Container>
      </Section>
    </>
  )
}
