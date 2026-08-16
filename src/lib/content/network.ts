import { cache } from 'react'

import { getServerClient } from '@/lib/supabase/server'
import type {
  NetworkCountryRow,
  NetworkDistrictRow,
  NetworkStateRow,
  PartnerRow,
} from '@/types/database'

export type NetworkState = NetworkStateRow & { districts: NetworkDistrictRow[] }
export type NetworkCountry = NetworkCountryRow
export type Partner = PartnerRow & { stateName: string | null }

/**
 * India coverage: published states with their published districts.
 *
 * Coverage counts are derived from these rows at render time. No aggregate
 * figure is stored anywhere, so the site cannot display a coverage number that
 * the underlying records do not support (Rules.md §7).
 */
export const getIndiaCoverage = cache(async (): Promise<NetworkState[]> => {
  const db = await getServerClient()
  if (!db) return []

  const { data: states, error } = await db
    .from('network_states')
    .select('*')
    .eq('status', 'published')
    .order('display_order', { ascending: true })
    .order('name', { ascending: true })

  if (error || !states || states.length === 0) return []

  const { data: districts } = await db
    .from('network_districts')
    .select('*')
    .eq('status', 'published')
    .in(
      'state_id',
      states.map((state) => state.id),
    )
    .order('name', { ascending: true })

  return states.map((state) => ({
    ...state,
    districts: (districts ?? []).filter((district) => district.state_id === state.id),
  }))
})

export const getGlobalCoverage = cache(async (): Promise<NetworkCountry[]> => {
  const db = await getServerClient()
  if (!db) return []

  const { data, error } = await db
    .from('network_countries')
    .select('*')
    .eq('status', 'published')
    .order('display_order', { ascending: true })
    .order('name', { ascending: true })

  if (error || !data) return []
  return data
})

/**
 * Distributors and stockists.
 *
 * The read policy already restricts this to partners who consented to being
 * published; the filter is repeated here so the intent is visible at the call
 * site too.
 */
export const getPartners = cache(async (): Promise<Partner[]> => {
  const db = await getServerClient()
  if (!db) return []

  const [{ data: partners, error }, states] = await Promise.all([
    db
      .from('partners')
      .select('*')
      .eq('status', 'published')
      .eq('consent_to_publish', true)
      .order('display_order', { ascending: true })
      .order('name', { ascending: true }),
    getIndiaCoverage(),
  ])

  if (error || !partners) return []

  const stateNames = new Map(states.map((state) => [state.id, state.name]))
  return partners.map((partner) => ({
    ...partner,
    stateName: partner.state_id ? (stateNames.get(partner.state_id) ?? null) : null,
  }))
})

export type NetworkCounts = {
  states: number
  districts: number
  countries: number
  partners: number
}

/** Counted, never stored. */
export const getNetworkCounts = cache(async (): Promise<NetworkCounts> => {
  const [states, countries, partners] = await Promise.all([
    getIndiaCoverage(),
    getGlobalCoverage(),
    getPartners(),
  ])

  return {
    states: states.length,
    districts: states.reduce((total, state) => total + state.districts.length, 0),
    countries: countries.length,
    partners: partners.length,
  }
})
