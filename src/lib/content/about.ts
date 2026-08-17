import { cache } from 'react'

import { getServerClient } from '@/lib/supabase/server'
import { isDemoMode } from '@/lib/demo'
import { demoAwards, demoMilestones, demoPeople, demoValues } from '@/data/demo/records'
import type {
  AwardRow,
  CoreValueRow,
  MilestoneRow,
  PersonCategory,
  PersonRow,
} from '@/types/database'

export type Person = PersonRow
export type Milestone = MilestoneRow
export type CoreValue = CoreValueRow
export type Award = AwardRow

/** Published people, optionally filtered to a category. */
export const getPeople = cache(async (category?: PersonCategory): Promise<Person[]> => {
  if (isDemoMode()) {
    return category ? demoPeople.filter((p) => p.category === category) : demoPeople
  }

  const db = await getServerClient()
  if (!db) return []

  let query = db
    .from('people')
    .select('*')
    .eq('status', 'published')
    .order('display_order', { ascending: true })

  if (category) query = query.eq('category', category)

  const { data, error } = await query
  if (error || !data) return []
  return data
})

/**
 * The person whose message appears on the chairman/founder page.
 * Prefers a founder with a message; falls back to the first board member with
 * one, so the page works whichever way the client models it.
 */
export const getFounderMessage = cache(async (): Promise<Person | null> => {
  const people = await getPeople()
  return (
    people.find((person) => person.category === 'founder' && person.message) ??
    people.find((person) => person.category === 'board' && person.message) ??
    null
  )
})

export const getMilestones = cache(async (): Promise<Milestone[]> => {
  if (isDemoMode()) return [...demoMilestones].sort((a, b) => b.year - a.year)
  const db = await getServerClient()
  if (!db) return []

  const { data, error } = await db
    .from('milestones')
    .select('*')
    .eq('status', 'published')
    .order('year', { ascending: false })
    .order('display_order', { ascending: true })

  if (error || !data) return []
  return data
})

export const getCoreValues = cache(async (): Promise<CoreValue[]> => {
  if (isDemoMode()) return demoValues
  const db = await getServerClient()
  if (!db) return []

  const { data, error } = await db
    .from('core_values')
    .select('*')
    .eq('status', 'published')
    .order('display_order', { ascending: true })

  if (error || !data) return []
  return data
})

export const getAwards = cache(async (): Promise<Award[]> => {
  if (isDemoMode()) return demoAwards
  const db = await getServerClient()
  if (!db) return []

  const { data, error } = await db
    .from('awards')
    .select('*')
    .eq('status', 'published')
    .order('year', { ascending: false })
    .order('display_order', { ascending: true })

  if (error || !data) return []
  return data
})
