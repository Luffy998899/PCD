import type { MetadataRoute } from 'next'

import { IS_PRODUCTION_CONTENT, SITE_URL } from '@/lib/env'

export default function robots(): MetadataRoute.Robots {
  // Staging and preview deployments carry unverified placeholder content and
  // must never be indexed.
  if (!IS_PRODUCTION_CONTENT) {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }

  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
