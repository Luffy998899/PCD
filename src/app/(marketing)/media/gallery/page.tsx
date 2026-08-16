import type { Metadata } from 'next'
import Image from 'next/image'

import { buildMetadata } from '@/lib/seo/metadata'
import { getGalleryItems } from '@/lib/content/media'
import { formatDate } from '@/lib/utils'
import { Container, Section } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { EmptyState } from '@/components/ui/empty-state'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Gallery',
    description: 'Photographs of our facilities, teams and events.',
    path: '/media/gallery',
  })
}

const CATEGORY_LABELS: Record<string, string> = {
  facility: 'Facilities',
  team: 'Team',
  event: 'Events',
  product: 'Products',
  other: 'Other',
}

const CATEGORY_ORDER = ['facility', 'team', 'event', 'product', 'other'] as const

export default async function GalleryPage() {
  const items = await getGalleryItems()

  const grouped = CATEGORY_ORDER.map(
    (category) => [category, items.filter((item) => item.category === category)] as const,
  ).filter(([, entries]) => entries.length > 0)

  return (
    <>
      <PageHero
        eyebrow="Media & insights"
        title="Gallery"
        description="Photographs of our own facilities, teams and events. We do not present stock photography as company imagery."
        breadcrumbs={[
          { label: 'Media & Insights', href: '/media' },
          { label: 'Gallery', href: '/media/gallery' },
        ]}
      />

      <Section>
        <Container className="flex flex-col gap-12">
          {grouped.length > 0 ? (
            grouped.map(([category, entries]) => (
              <section key={category} className="flex flex-col gap-5">
                <h2 className="text-[1.5rem] leading-snug text-foreground">
                  {CATEGORY_LABELS[category]}
                </h2>
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {entries.map((item) => (
                    <li key={item.id}>
                      <figure className="flex flex-col gap-2">
                        <div className="relative aspect-4/3 w-full overflow-hidden rounded-md border border-border bg-surface-subtle">
                          <Image
                            src={item.image_url}
                            alt={item.alt_text}
                            fill
                            sizes="(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 90vw"
                            className="object-cover transition-transform duration-300 hover:scale-[1.02]"
                          />
                        </div>
                        <figcaption className="text-sm text-muted-foreground">
                          {item.title}
                          {item.captured_on ? ` · ${formatDate(item.captured_on)}` : ''}
                        </figcaption>
                      </figure>
                    </li>
                  ))}
                </ul>
              </section>
            ))
          ) : (
            <EmptyState
              title="No photographs published yet"
              description="Images of our facilities, laboratories and teams are published here once available."
            />
          )}
        </Container>
      </Section>
    </>
  )
}
