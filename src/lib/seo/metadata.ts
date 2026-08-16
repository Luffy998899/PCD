import type { Metadata } from 'next'

import { SITE_URL } from '@/lib/env'
import { withoutPlaceholder } from '@/lib/content/placeholder'
import { displayName, getSiteSettings } from '@/lib/content/site-settings'

export function buildCanonicalUrl(path: string): string {
  if (!path || path === '/') return `${SITE_URL}/`
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

type BuildMetadataInput = {
  title: string
  description?: string | null
  path: string
  /** Absolute or storage-relative image URL. Omitted when unavailable. */
  image?: string | null
  type?: 'website' | 'article'
  noIndex?: boolean
  publishedTime?: string | null
  modifiedTime?: string | null
}

/**
 * Single entry point for page metadata (Rules.md §19).
 *
 * Placeholder values are stripped so unresolved client facts can never leak
 * into titles, descriptions or social cards.
 */
export async function buildMetadata({
  title,
  description,
  path,
  image,
  type = 'website',
  noIndex = false,
  publishedTime,
  modifiedTime,
}: BuildMetadataInput): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteName = withoutPlaceholder(displayName(settings))
  const canonical = buildCanonicalUrl(path)
  const cleanDescription = withoutPlaceholder(description ?? null) ?? undefined
  const images = image ? [{ url: image }] : undefined

  return {
    title,
    description: cleanDescription,
    alternates: { canonical },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      url: canonical,
      title,
      description: cleanDescription,
      siteName: siteName ?? undefined,
      locale: 'en_IN',
      images,
      ...(type === 'article'
        ? {
            publishedTime: publishedTime ?? undefined,
            modifiedTime: modifiedTime ?? undefined,
          }
        : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description: cleanDescription,
      images: image ? [image] : undefined,
    },
  }
}
