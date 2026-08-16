import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/env'
import { legalNavigation } from '@/data/navigation'
import { getPrimaryNavigation } from '@/lib/content/navigation'
import { getDivisions, getPublishedProductRefs, getTherapies } from '@/lib/content/products'

/**
 * XML sitemap generated from navigation plus published records
 * (Architecture.md §13).
 *
 * Dynamic entries come from the database, so a draft product or an unpublished
 * therapy never appears here.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticPaths = new Set<string>(['/'])
  for (const group of await getPrimaryNavigation()) {
    staticPaths.add(group.href)
    for (const link of group.links) staticPaths.add(link.href)
  }
  for (const link of legalNavigation) staticPaths.add(link.href)

  // The admin login is not public content.
  staticPaths.delete('/admin/login')

  const entries: MetadataRoute.Sitemap = [...staticPaths].map((path) => ({
    url: `${SITE_URL}${path === '/' ? '/' : path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.7,
  }))

  const [products, therapies, divisions] = await Promise.all([
    getPublishedProductRefs(),
    getTherapies(),
    getDivisions(),
  ])

  for (const product of products) {
    entries.push({
      url: `${SITE_URL}/products/${product.slug}`,
      lastModified: new Date(product.updated_at),
      changeFrequency: 'monthly',
      priority: 0.8,
    })
  }

  for (const therapy of therapies) {
    entries.push({
      url: `${SITE_URL}/products/therapy/${therapy.slug}`,
      lastModified: new Date(therapy.updated_at),
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  }

  for (const division of divisions) {
    entries.push({
      url: `${SITE_URL}/products/division/${division.slug}`,
      lastModified: new Date(division.updated_at),
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  }

  return entries
}
