import type { Metadata } from 'next'
import Link from 'next/link'

import { buildMetadata } from '@/lib/seo/metadata'
import { getArticleCategories, getArticles } from '@/lib/content/media'
import { MEDICINE_SAFETY_STATEMENT } from '@/lib/constants'
import { Container, Section } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { ArticleCard } from '@/components/ui/article-card'
import { EmptyState } from '@/components/ui/empty-state'
import { Badge } from '@/components/ui/badge'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Blogs and health articles',
    description:
      'Health and industry articles. Medically reviewed articles carry the reviewer’s name and review date.',
    path: '/media/blogs',
  })
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export default async function BlogsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const rawCategory = Array.isArray(params.category) ? params.category[0] : params.category
  const activeCategory = rawCategory?.trim() || undefined

  const [articles, categories] = await Promise.all([getArticles('blog'), getArticleCategories()])

  const filtered = activeCategory
    ? articles.filter((article) => article.category?.slug === activeCategory)
    : articles

  return (
    <>
      <PageHero
        eyebrow="Media & insights"
        title="Blogs and health articles"
        description="General health and industry information. Articles reviewed by a qualified professional say so, and name the reviewer."
        breadcrumbs={[
          { label: 'Media & Insights', href: '/media' },
          { label: 'Blogs', href: '/media/blogs' },
        ]}
      />

      <Section>
        <Container className="flex flex-col gap-8">
          <p className="rounded-md border border-border bg-surface-subtle px-4 py-3 text-sm text-foreground">
            These articles are general information and are not a substitute for professional
            advice. {MEDICINE_SAFETY_STATEMENT}
          </p>

          {categories.length > 0 ? (
            <nav aria-label="Article categories">
              <ul className="flex flex-wrap gap-2">
                <li>
                  <Link href="/media/blogs">
                    <Badge tone={activeCategory ? 'outline' : 'primary'}>All articles</Badge>
                  </Link>
                </li>
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link href={`/media/blogs?category=${category.slug}`}>
                      <Badge tone={activeCategory === category.slug ? 'primary' : 'outline'}>
                        {category.name}
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          {filtered.length > 0 ? (
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((article) => (
                <li key={article.id} className="flex">
                  <ArticleCard article={article} href={`/media/blogs/${article.slug}`} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title={activeCategory ? 'No articles in this category yet' : 'No articles published yet'}
              description="Articles appear here once written and, where they cover health topics, reviewed."
            />
          )}
        </Container>
      </Section>
    </>
  )
}
