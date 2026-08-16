import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, ShieldCheck } from 'lucide-react'

import type { Article } from '@/lib/content/media'
import { getProductBySlug } from '@/lib/content/products'
import { getTherapies } from '@/lib/content/products'
import { buildCanonicalUrl } from '@/lib/seo/metadata'
import { displayName, getSiteSettings } from '@/lib/content/site-settings'
import { withoutPlaceholder } from '@/lib/content/placeholder'
import { MEDICINE_SAFETY_STATEMENT } from '@/lib/constants'
import { formatDate, toIsoDate } from '@/lib/utils'
import { Container, Section } from '@/components/ui/layout'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { Badge } from '@/components/ui/badge'
import { Card, CardBody, CardTitle } from '@/components/ui/card'
import { JsonLd } from '@/components/seo/json-ld'

const TYPE_LABELS: Record<Article['article_type'], string> = {
  blog: 'Blog',
  news: 'News',
  press_release: 'Press release',
}

/**
 * Shared article page for blogs, news and press releases.
 *
 * Article schema is emitted with the real headline, dates and publisher only.
 * The medically-reviewed label is shown only when a reviewer is named — the
 * database enforces the same rule (Rules.md §2, §19).
 */
export async function ArticleDetail({
  article,
  basePath,
  sectionLabel,
}: {
  article: Article
  basePath: string
  sectionLabel: string
}) {
  const [settings, therapies] = await Promise.all([getSiteSettings(), getTherapies()])
  const publisher = withoutPlaceholder(displayName(settings))

  const relatedTherapy = article.related_therapy_id
    ? (therapies.find((therapy) => therapy.id === article.related_therapy_id) ?? null)
    : null

  const published = formatDate(article.published_at)
  const publishedIso = article.published_at ? new Date(article.published_at).toISOString() : null

  const schema = publishedIso
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.excerpt ?? undefined,
        datePublished: publishedIso,
        dateModified: new Date(article.updated_at).toISOString(),
        mainEntityOfPage: buildCanonicalUrl(`${basePath}/${article.slug}`),
        ...(article.hero_image_url ? { image: [article.hero_image_url] } : {}),
        ...(article.authorName
          ? { author: { '@type': 'Person', name: article.authorName } }
          : publisher
            ? { author: { '@type': 'Organization', name: publisher } }
            : {}),
        ...(publisher ? { publisher: { '@type': 'Organization', name: publisher } } : {}),
      }
    : null

  return (
    <>
      <JsonLd data={schema} />

      <div className="border-b border-border bg-surface">
        <Container className="pt-6 pb-10">
          <Breadcrumbs
            items={[
              { label: 'Media & Insights', href: '/media' },
              { label: sectionLabel, href: basePath },
              { label: article.title, href: `${basePath}/${article.slug}` },
            ]}
            className="mb-8"
          />

          <div className="flex max-w-3xl flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="primary">{TYPE_LABELS[article.article_type]}</Badge>
              {article.category ? <Badge tone="outline">{article.category.name}</Badge> : null}
              {article.medically_reviewed && article.reviewer_name ? (
                <Badge tone="accent">
                  <ShieldCheck className="size-3.5" aria-hidden="true" />
                  Medically reviewed
                </Badge>
              ) : null}
            </div>

            <h1 className="text-[2rem] leading-tight sm:text-h1">{article.title}</h1>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              {published && publishedIso ? (
                <time dateTime={toIsoDate(article.published_at) ?? undefined}>{published}</time>
              ) : null}
              {article.authorName ? <span>By {article.authorName}</span> : null}
            </div>

            {article.excerpt ? (
              <p className="text-body-lg text-muted-foreground">{article.excerpt}</p>
            ) : null}
          </div>
        </Container>
      </div>

      <Section>
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <article className="flex flex-col gap-6">
            {article.hero_image_url ? (
              <div className="relative aspect-16/9 w-full overflow-hidden rounded-md border border-border bg-surface-subtle">
                <Image
                  src={article.hero_image_url}
                  alt={article.hero_image_alt ?? ''}
                  fill
                  sizes="(min-width: 1024px) 46rem, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            ) : null}

            <div className="prose-content">
              {article.body.split(/\n{2,}/).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {article.source_url ? (
              <a
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 self-start text-sm text-primary underline-offset-4 hover:underline"
              >
                <ExternalLink className="size-4" aria-hidden="true" />
                Read the original coverage
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : null}

            {article.article_type === 'blog' ? (
              <p className="rounded-md border border-border bg-surface-subtle px-4 py-3 text-sm text-foreground">
                This article is general information, not medical advice.{' '}
                {MEDICINE_SAFETY_STATEMENT}
              </p>
            ) : null}
          </article>

          <aside className="flex flex-col gap-4">
            {article.medically_reviewed && article.reviewer_name ? (
              <Card>
                <CardBody className="flex flex-col gap-2">
                  <CardTitle as="h2" className="text-base">
                    Medical review
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Reviewed by {article.reviewer_name}
                    {article.reviewer_credential ? `, ${article.reviewer_credential}` : ''}
                    {article.reviewed_on ? ` on ${formatDate(article.reviewed_on)}` : ''}.
                  </p>
                </CardBody>
              </Card>
            ) : null}

            {relatedTherapy ? (
              <Card>
                <CardBody className="flex flex-col gap-2">
                  <CardTitle as="h2" className="text-base">
                    Related therapy
                  </CardTitle>
                  <Link
                    href={`/products/therapy/${relatedTherapy.slug}`}
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    {relatedTherapy.name} products
                  </Link>
                </CardBody>
              </Card>
            ) : null}

            <RelatedProduct productId={article.related_product_id} />
          </aside>
        </Container>
      </Section>
    </>
  )
}

/** Renders the related product link only when that product is still published. */
async function RelatedProduct({ productId }: { productId: string | null }) {
  if (!productId) return null

  // The related product is looked up by id through the published-only view, so
  // an unpublished product leaves no broken link behind (Rules.md §22).
  const { getServerClient } = await import('@/lib/supabase/server')
  const db = await getServerClient()
  if (!db) return null

  const { data } = await db
    .from('products')
    .select('slug')
    .eq('id', productId)
    .eq('status', 'published')
    .maybeSingle()

  if (!data) return null
  const product = await getProductBySlug(data.slug)
  if (!product) return null

  return (
    <Card>
      <CardBody className="flex flex-col gap-2">
        <CardTitle as="h2" className="text-base">
          Related product
        </CardTitle>
        <Link
          href={`/products/${product.slug}`}
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          {product.brand_name}
        </Link>
        <p className="text-sm text-muted-foreground">{product.generic_composition}</p>
      </CardBody>
    </Card>
  )
}
