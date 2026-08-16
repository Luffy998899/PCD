import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import type { Database } from '@/types/database'
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from '@/lib/env'

export type Db = SupabaseClient<Database>

/**
 * Request-scoped Supabase client for Server Components, Server Actions and
 * Route Handlers.
 *
 * Returns `null` when Supabase is not configured. Callers must handle that by
 * degrading to an empty state — the site has to stay renderable before the
 * client's database is provisioned, and it must never fall back to invented
 * content.
 */
export async function getServerClient(): Promise<Db | null> {
  if (!isSupabaseConfigured()) return null
  const cookieStore = await cookies()

  return createServerClient<Database>(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options)
          }
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // Session refresh is handled by the middleware instead.
        }
      },
    },
  })
}

/**
 * Service-role client. Server-only, bypasses RLS.
 *
 * Use exclusively for trusted mutations that a public visitor legitimately
 * triggers (enquiry inserts) and for admin operations that have already passed
 * a server-side authorization check.
 */
export function getServiceClient(): Db | null {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (!SUPABASE_URL || !serviceKey) return null

  return createClient<Database>(SUPABASE_URL, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
