import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo/metadata'
import { getDownloads } from '@/lib/content/media'
import { Container, Section } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { DownloadCard } from '@/components/ui/download-card'
import { EmptyState } from '@/components/ui/empty-state'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Downloads',
    description: 'Company, product and quality documents available for download.',
    path: '/media/downloads',
  })
}

const CATEGORY_LABELS: Record<string, string> = {
  corporate: 'Corporate',
  product: 'Product',
  quality: 'Quality and compliance',
  partner: 'For partners',
  general: 'General',
}

const CATEGORY_ORDER = ['corporate', 'product', 'quality', 'partner', 'general'] as const

export default async function DownloadsPage() {
  const downloads = await getDownloads()

  const grouped = CATEGORY_ORDER.map(
    (category) => [category, downloads.filter((item) => item.category === category)] as const,
  ).filter(([, entries]) => entries.length > 0)

  return (
    <>
      <PageHero
        eyebrow="Media & insights"
        title="Downloads"
        description="Documents you can download, each listed with its file type and size."
        breadcrumbs={[
          { label: 'Media & Insights', href: '/media' },
          { label: 'Downloads', href: '/media/downloads' },
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
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {entries.map((download) => (
                    <DownloadCard key={download.id} download={download} />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <EmptyState
              title="No documents published yet"
              description="Company and product documents are published here once approved for release."
            />
          )}
        </Container>
      </Section>
    </>
  )
}
