import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { buildMetadata } from '@/lib/seo/metadata'
import { getArticles } from '@/lib/content/media'
import { Container, Section, SectionHeader } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { Card, CardBody, CardDescription, CardTitle } from '@/components/ui/card'
import { ArticleCard } from '@/components/ui/article-card'
import { EmptyState } from '@/components/ui/empty-state'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Media and insights',
    description:
      'Press releases, news coverage, health articles, gallery, downloads and events.',
    path: '/media',
  })
}

const SECTIONS = [
  {
    href: '/media/press-releases',
    label: 'Press releases',
    description: 'Official statements issued by the company.',
  },
  {
    href: '/media/news',
    label: 'News and coverage',
    description: 'Company news and press coverage.',
  },
  {
    href: '/media/blogs',
    label: 'Blogs and health articles',
    description: 'General health and industry information, reviewed where appropriate.',
  },
  { href: '/media/gallery', label: 'Gallery', description: 'Facilities, teams and events.' },
  {
    href: '/media/downloads',
    label: 'Downloads',
    description: 'Company, product and quality documents.',
  },
  {
    href: '/media/events',
    label: 'Events',
    description: 'Exhibitions and conferences we attend.',
  },
]

const BASE_PATHS = {
  blog: '/media/blogs',
  news: '/media/news',
  press_release: '/media/press-releases',
} as const

export default async function MediaPage() {
  const latest = await getArticles(undefined, 6)

  return (
    <>
      <PageHero
        eyebrow="Media & insights"
        title="Media and insights"
        description="What we have published, and where we have been covered."
        breadcrumbs={[{ label: 'Media & Insights', href: '/media' }]}
      />

      <Section spacing="compact">
        <Container className="flex flex-col gap-8">
          <SectionHeader title="Latest" />
          {latest.length > 0 ? (
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {latest.map((article) => (
                <li key={article.id} className="flex">
                  <ArticleCard
                    article={article}
                    href={`${BASE_PATHS[article.article_type]}/${article.slug}`}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="Nothing published yet"
              description="Press releases, news and articles appear here as they are published."
            />
          )}
        </Container>
      </Section>

      <Section tone="subtle">
        <Container className="flex flex-col gap-8">
          <SectionHeader title="Explore this section" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map((section) => (
              <Card key={section.href} interactive className="relative">
                <CardBody className="flex flex-col gap-2">
                  <CardTitle as="h2" className="text-base">
                    <Link href={section.href} className="text-foreground hover:text-primary">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {section.label}
                    </Link>
                  </CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                  <span className="mt-1 inline-flex items-center gap-1 text-sm text-primary">
                    View
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </span>
                </CardBody>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
