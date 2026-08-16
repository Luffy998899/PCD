'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

import type { Database } from '@/types/database'
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from '@/lib/env'

let cached: SupabaseClient<Database> | null = null

/**
 * Browser Supabase client — used only by the admin UI for auth.
 * Public pages read data on the server.
 */
export function getBrowserClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) return null
  cached ??= createBrowserClient<Database>(SUPABASE_URL!, SUPABASE_ANON_KEY!)
  return cached
}
