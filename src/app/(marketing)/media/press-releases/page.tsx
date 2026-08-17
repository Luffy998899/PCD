import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo/metadata'
import { getArticles } from '@/lib/content/media'
import { Container, Section } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { ArticleCard } from '@/components/ui/article-card'
import { EmptyState } from '@/components/ui/empty-state'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Press releases',
    description: 'Official statements issued by the company.',
    path: '/media/press-releases',
  })
}

export default async function Page() {
  const articles = await getArticles('press_release')

  return (
    <>
      <PageHero
        eyebrow="Media & insights"
        title="Press releases"
        description="Official statements issued by the company."
        breadcrumbs={[
          { label: 'Media & Insights', href: '/media' },
          { label: 'Press releases', href: '/media/press-releases' },
        ]}
      />

      <Section>
        <Container>
          {articles.length > 0 ? (
            <>
              <h2 className="sr-only">Press releases</h2>
              <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <li key={article.id} className="flex">
                  <ArticleCard article={article} href={`/media/press-releases/${article.slug}`} />
                </li>
              ))}
            </ul>
          </>
          ) : (
            <EmptyState
              title="No press releases published yet"
              description="Official statements appear here as they are issued."
            />
          )}
        </Container>
      </Section>
    </>
  )
}
