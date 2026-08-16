import Image from 'next/image'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

import type { Article } from '@/lib/content/media'
import { formatDate, toIsoDate, truncate } from '@/lib/utils'
import { Card, CardBody } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

/** Editorial article card (Design.md §18): date, category, title, excerpt. */
export function ArticleCard({ article, href }: { article: Article; href: string }) {
  const published = formatDate(article.published_at)
  const iso = toIsoDate(article.published_at)

  return (
    <Card interactive className="relative flex flex-col overflow-hidden">
      {article.hero_image_url ? (
        <div className="relative aspect-16/9 w-full border-b border-border bg-surface-subtle">
          <Image
            src={article.hero_image_url}
            alt={article.hero_image_alt ?? ''}
            fill
            sizes="(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 90vw"
            className="object-cover"
          />
        </div>
      ) : null}

      <CardBody className="flex flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {iso && published ? <time dateTime={iso}>{published}</time> : null}
          {article.category ? (
            <>
              <span aria-hidden="true">·</span>
              <span>{article.category.name}</span>
            </>
          ) : null}
        </div>

        <h3 className="text-base text-foreground">
          <Link href={href} className="hover:text-primary">
            <span className="absolute inset-0" aria-hidden="true" />
            {article.title}
          </Link>
        </h3>

        {article.excerpt ? (
          <p className="text-sm text-muted-foreground">{truncate(article.excerpt, 160)}</p>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
          {article.medically_reviewed && article.reviewer_name ? (
            <Badge tone="accent">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              Medically reviewed
            </Badge>
          ) : null}
          {article.authorName ? (
            <span className="text-xs text-muted-foreground">By {article.authorName}</span>
          ) : null}
        </div>
      </CardBody>
    </Card>
  )
}
