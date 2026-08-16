import { cache } from 'react'

import { getServerClient } from '@/lib/supabase/server'
import type {
  CertificateRow,
  FacilityRow,
  FacilitySpecRow,
  QualityTestRow,
  RegulatoryItemRow,
} from '@/types/database'

export type Facility = FacilityRow
export type FacilitySpec = FacilitySpecRow
export type Certificate = CertificateRow
export type QualityTest = QualityTestRow
export type RegulatoryItem = RegulatoryItemRow

export type FacilityWithSpecs = Facility & { specs: FacilitySpec[] }

/**
 * Published facilities with their technical specifications.
 *
 * Specs are label/value rows, so the company publishes only the figures it can
 * evidence. Nothing is inferred or filled in (Rules.md §1).
 */
export const getFacilities = cache(async (): Promise<FacilityWithSpecs[]> => {
  const db = await getServerClient()
  if (!db) return []

  const { data: facilities, error } = await db
    .from('facilities')
    .select('*')
    .eq('status', 'published')
    .order('display_order', { ascending: true })

  if (error || !facilities || facilities.length === 0) return []

  const { data: specs } = await db
    .from('facility_specs')
    .select('*')
    .eq('status', 'published')
    .in(
      'facility_id',
      facilities.map((facility) => facility.id),
    )
    .order('display_order', { ascending: true })

  return facilities.map((facility) => ({
    ...facility,
    specs: (specs ?? []).filter((spec) => spec.facility_id === facility.id),
  }))
})

export const getCertificates = cache(
  async (category?: CertificateRow['category']): Promise<Certificate[]> => {
    const db = await getServerClient()
    if (!db) return []

    let query = db
      .from('certificates')
      .select('*')
      .eq('status', 'published')
      .order('display_order', { ascending: true })

    if (category) query = query.eq('category', category)

    const { data, error } = await query
    if (error || !data) return []
    return data
  },
)

export const getQualityTests = cache(async (): Promise<QualityTest[]> => {
  const db = await getServerClient()
  if (!db) return []

  const { data, error } = await db
    .from('quality_tests')
    .select('*')
    .eq('status', 'published')
    .order('display_order', { ascending: true })

  if (error || !data) return []
  return data
})

export const getRegulatoryItems = cache(async (): Promise<RegulatoryItem[]> => {
  const db = await getServerClient()
  if (!db) return []

  const { data, error } = await db
    .from('regulatory_items')
    .select('*')
    .eq('status', 'published')
    .order('display_order', { ascending: true })

  if (error || !data) return []
  return data
})

/** True when a certificate's validity date has passed. */
export function isExpired(certificate: Pick<Certificate, 'valid_until'>): boolean {
  if (!certificate.valid_until) return false
  return new Date(certificate.valid_until).getTime() < Date.now()
}
