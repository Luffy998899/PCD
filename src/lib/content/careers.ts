import { cache } from 'react'

import { getServerClient } from '@/lib/supabase/server'
import type { JobOpeningRow } from '@/types/database'

export type JobOpening = JobOpeningRow

export const EMPLOYMENT_TYPE_LABELS: Record<JobOpening['employment_type'], string> = {
  full_time: 'Full time',
  part_time: 'Part time',
  contract: 'Contract',
  internship: 'Internship',
}

/**
 * Published openings, newest first.
 *
 * Closed roles remain visible while published so an applicant who follows an
 * old link sees the position honestly rather than a 404; the detail page
 * disables the application form instead (Rules.md §22).
 */
export const getJobOpenings = cache(async (): Promise<JobOpening[]> => {
  const db = await getServerClient()
  if (!db) return []

  const { data, error } = await db
    .from('job_openings')
    .select('*')
    .eq('status', 'published')
    .order('posted_on', { ascending: false })

  if (error || !data) return []
  return data
})

export const getOpenJobOpenings = cache(async (): Promise<JobOpening[]> => {
  const openings = await getJobOpenings()
  return openings.filter((opening) => opening.hiring_status === 'open')
})

export const getJobOpeningBySlug = cache(async (slug: string): Promise<JobOpening | null> => {
  const openings = await getJobOpenings()
  return openings.find((opening) => opening.slug === slug) ?? null
})

/** Human-readable experience range, or null when unspecified. */
export function experienceRange(opening: JobOpening): string | null {
  const { experience_min: min, experience_max: max } = opening
  if (min === null && max === null) return null
  if (min !== null && max !== null) return `${min}–${max} years`
  if (min !== null) return `${min}+ years`
  return `Up to ${max} years`
}
