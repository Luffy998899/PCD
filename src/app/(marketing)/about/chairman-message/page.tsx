import type { Metadata } from 'next'
import Image from 'next/image'

import { buildMetadata } from '@/lib/seo/metadata'
import { getFounderMessage } from '@/lib/content/about'
import { Container, Section } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { EmptyState } from '@/components/ui/empty-state'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Message from the Chairman',
    description: 'A message from the company’s founder on its purpose and priorities.',
    path: '/about/chairman-message',
  })
}

export default async function ChairmanMessagePage() {
  const person = await getFounderMessage()

  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Message from the Chairman"
        description={person ? `${person.name}, ${person.designation}` : undefined}
        breadcrumbs={[
          { label: 'About Us', href: '/about' },
          { label: 'Chairman’s Message', href: '/about/chairman-message' },
        ]}
      />

      <Section>
        <Container>
          {person ? (
            <div className="grid gap-10 lg:grid-cols-[18rem_minmax(0,1fr)]">
              <div className="flex flex-col gap-4">
                <div className="relative aspect-4/5 w-full overflow-hidden rounded-md border border-border bg-surface-subtle">
                  {person.photo_url ? (
                    <Image
                      src={person.photo_url}
                      alt={person.photo_alt ?? `${person.name}, ${person.designation}`}
                      fill
                      sizes="(min-width: 1024px) 18rem, 90vw"
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center"
                      role="img"
                      aria-label={`No photograph available for ${person.name}`}
                    >
                      <span className="font-display text-3xl font-semibold text-primary/30">
                        {person.name
                          .split(/\s+/)
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join('')
                          .toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-display text-lg font-semibold text-foreground">
                    {person.name}
                  </p>
                  <p className="text-sm text-primary">{person.designation}</p>
                  {person.qualification ? (
                    <p className="text-xs text-muted-foreground">{person.qualification}</p>
                  ) : null}
                </div>
              </div>

              <div className="prose-content">
                {person.message
                  ?.split(/\n{2,}/)
                  .map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              </div>
            </div>
          ) : (
            <EmptyState
              title="The Chairman’s message is being prepared"
              description="This page is published once the message and an authentic photograph have been supplied."
            />
          )}
        </Container>
      </Section>
    </>
  )
}
