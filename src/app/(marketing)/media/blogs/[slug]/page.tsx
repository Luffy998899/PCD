import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { buildMetadata } from '@/lib/seo/metadata'
import { getArticleBySlug, getPublishedArticleRefs } from '@/lib/content/media'
import { truncate } from '@/lib/utils'
import { ArticleDetail } from '@/components/sections/article-detail'

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
  const refs = await getPublishedArticleRefs()
  return refs
    .filter((ref) => ref.article_type === 'blog')
    .map((ref) => ({ slug: ref.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article || article.article_type !== 'blog') {
    return { title: 'Article not found', robots: { index: false, follow: false } }
  }

  return buildMetadata({
    title: article.seo_title ?? article.title,
    description: article.seo_description ?? article.excerpt ?? truncate(article.body, 155),
    path: `/media/blogs/${article.slug}`,
    image: article.hero_image_url,
    type: 'article',
    publishedTime: article.published_at,
    modifiedTime: article.updated_at,
  })
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article || article.article_type !== 'blog') notFound()

  return <ArticleDetail article={article} basePath="/media/blogs" sectionLabel="Blogs" />
}
