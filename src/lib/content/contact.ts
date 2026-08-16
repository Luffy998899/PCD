import { cache } from 'react'

import { getServerClient } from '@/lib/supabase/server'
import type { DepartmentContactRow, OfficeRow } from '@/types/database'

export type Office = OfficeRow
export type DepartmentContact = DepartmentContactRow

/**
 * Published offices, ordered for display.
 * Returns an empty list when the database is unavailable — the page then shows
 * an empty state instead of invented addresses (Rules.md §1).
 */
export const getOffices = cache(async (): Promise<Office[]> => {
  const db = await getServerClient()
  if (!db) return []

  const { data, error } = await db
    .from('offices')
    .select('*')
    .eq('status', 'published')
    .order('display_order', { ascending: true })

  if (error || !data) return []
  return data
})

export const getDepartmentContacts = cache(async (): Promise<DepartmentContact[]> => {
  const db = await getServerClient()
  if (!db) return []

  const { data, error } = await db
    .from('department_contacts')
    .select('*')
    .eq('status', 'published')
    .order('display_order', { ascending: true })

  if (error || !data) return []
  return data
})
