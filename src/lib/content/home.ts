import { cache } from 'react'

import { getServerClient } from '@/lib/supabase/server'
import { isDemoMode } from '@/lib/demo'
import { demoMemberships, demoTestimonials } from '@/data/demo/records'
import { getSiteSettings } from '@/lib/content/site-settings'
import { getNetworkCounts } from '@/lib/content/network'
import { listProducts } from '@/lib/content/products'
import type { MembershipRow, TestimonialRow } from '@/types/database'

export type Membership = MembershipRow
export type Testimonial = TestimonialRow

export const getMemberships = cache(async (): Promise<Membership[]> => {
  if (isDemoMode()) return demoMemberships
  const db = await getServerClient()
  if (!db) return []
  const { data } = await db
    .from('memberships')
    .select('*')
    .eq('status', 'published')
    .order('display_order', { ascending: true })
  return data ?? []
})

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  if (isDemoMode()) return demoTestimonials
  const db = await getServerClient()
  if (!db) return []
  const { data } = await db
    .from('testimonials')
    .select('*')
    .eq('status', 'published')
    .eq('consent_on_file', true)
    .order('display_order', { ascending: true })
  return data ?? []
})

export type Snapshot = { label: string; value: string; note?: string }

/**
 * Company snapshot figures (PRD §7).
 *
 * Every figure is derived from records that exist: products counted from the
 * catalogue, coverage counted from network rows, years in operation calculated
 * from the founding year. A figure with no underlying data is omitted rather
 * than estimated, and none of them animate (Design.md §8).
 */
export const getSnapshot = cache(async (): Promise<Snapshot[]> => {
  const [settings, counts, products] = await Promise.all([
    getSiteSettings(),
    getNetworkCounts(),
    listProducts(),
  ])

  const snapshot: Snapshot[] = []

  if (settings.founded_year) {
    const years = new Date().getFullYear() - settings.founded_year
    if (years > 0) {
      snapshot.push({
        label: 'Years in operation',
        value: String(years),
        note: `Since ${settings.founded_year}`,
      })
    }
  }

  if (products.total > 0) {
    snapshot.push({ label: 'Products in portfolio', value: String(products.total) })
  }

  if (counts.states > 0) {
    snapshot.push({ label: 'States covered', value: String(counts.states) })
  }

  if (counts.districts > 0) {
    snapshot.push({ label: 'Districts covered', value: String(counts.districts) })
  }

  if (counts.countries > 0) {
    snapshot.push({ label: 'Export countries', value: String(counts.countries) })
  }

  return snapshot.slice(0, 6)
})
