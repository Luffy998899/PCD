import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import { buildCanonicalUrl } from '@/lib/seo/metadata'
import { JsonLd } from '@/components/seo/json-ld'
import { cn } from '@/lib/utils'

export type Crumb = { label: string; href: string }

/**
 * Breadcrumb trail plus matching BreadcrumbList structured data
 * (Rules.md §19). The final crumb is the current page and is not a link.
 */
export function Breadcrumbs({
  items,
  className,
  tone = 'default',
}: {
  items: Crumb[]
  className?: string
  tone?: 'default' | 'inverse'
}) {
  if (items.length === 0) return null

  const trail: Crumb[] = [{ label: 'Home', href: '/' }, ...items]
  const last = trail[trail.length - 1]!

  return (
    <>
      <nav aria-label="Breadcrumb" className={className}>
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm">
          {trail.map((crumb, index) => {
            const isLast = index === trail.length - 1
            return (
              <li key={crumb.href} className="flex items-center gap-1.5">
                {index > 0 ? (
                  <ChevronRight
                    className={cn(
                      'size-3.5',
                      tone === 'inverse' ? 'text-primary-foreground/40' : 'text-muted-foreground/50',
                    )}
                    aria-hidden="true"
                  />
                ) : null}
                {isLast ? (
                  <span
                    aria-current="page"
                    className={cn(
                      tone === 'inverse' ? 'text-primary-foreground/80' : 'text-muted-foreground',
                    )}
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className={cn(
                      'underline-offset-4 hover:underline',
                      tone === 'inverse'
                        ? 'text-primary-foreground/70'
                        : 'text-muted-foreground hover:text-primary',
                    )}
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: trail.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.label,
            item: buildCanonicalUrl(crumb.href),
          })),
        }}
      />
      <span className="sr-only">{`Current page: ${last.label}`}</span>
    </>
  )
}
