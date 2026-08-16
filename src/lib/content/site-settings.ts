import { cache } from 'react'

import { getServerClient } from '@/lib/supabase/server'
import type { SiteSettingsRow } from '@/types/database'

export type SiteSettings = Omit<SiteSettingsRow, 'id' | 'updated_at'>

const EMPTY_SETTINGS: SiteSettings = {
  legal_name: null,
  brand_name: null,
  tagline: null,
  short_description: null,
  cin: null,
  gst: null,
  pan: null,
  drug_licence_number: null,
  fssai_number: null,
  registered_address: null,
  corporate_address: null,
  primary_email: null,
  primary_phone: null,
  whatsapp_number: null,
  grievance_officer_name: null,
  grievance_officer_email: null,
  grievance_officer_phone: null,
  logo_url: null,
}

/**
 * Company identity and statutory details.
 *
 * Returns empty values when the database is unavailable or the row has not been
 * filled in. Callers render `[CLIENT TO PROVIDE]` markers in development and
 * omit the field in production — never a made-up value (Rules.md §1).
 *
 * `cache` de-duplicates the read within a single request.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const db = await getServerClient()
  if (!db) return EMPTY_SETTINGS

  const { data, error } = await db
    .from('site_settings')
    .select('*')
    .eq('id', 'default')
    .maybeSingle()

  if (error || !data) return EMPTY_SETTINGS

  const { id: _id, updated_at: _updatedAt, ...settings } = data
  return settings
})

/**
 * Display name for the header, metadata and schema.
 * Falls back to the legal name, then to null.
 */
export function displayName(settings: SiteSettings): string | null {
  return settings.brand_name?.trim() || settings.legal_name?.trim() || null
}
