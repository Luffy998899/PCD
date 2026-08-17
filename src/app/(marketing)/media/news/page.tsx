import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo/metadata'
import { getArticles } from '@/lib/content/media'
import { Container, Section } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { ArticleCard } from '@/components/ui/article-card'
import { EmptyState } from '@/components/ui/empty-state'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'News and media coverage',
    description: 'Company news and coverage in the trade and general press.',
    path: '/media/news',
  })
}

export default async function Page() {
  const articles = await getArticles('news')

  return (
    <>
      <PageHero
        eyebrow="Media & insights"
        title="News and media coverage"
        description="Company news and coverage in the trade and general press."
        breadcrumbs={[
          { label: 'Media & Insights', href: '/media' },
          { label: 'News and media coverage', href: '/media/news' },
        ]}
      />

      <Section>
        <Container>
          {articles.length > 0 ? (
            <>
              <h2 className="sr-only">News items</h2>
              <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <li key={article.id} className="flex">
                  <ArticleCard article={article} href={`/media/news/${article.slug}`} />
                </li>
              ))}
            </ul>
          </>
          ) : (
            <EmptyState
              title="No news published yet"
              description="Company news and press coverage appear here once published."
            />
          )}
        </Container>
      </Section>
    </>
  )
}
