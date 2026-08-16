/**
 * Typed, centralised environment access.
 *
 * Nothing here throws at import time: the site must stay renderable while the
 * client is still supplying credentials and business data. Features degrade to
 * a documented safe state instead (see `isSupabaseConfigured`, `isMailConfigured`).
 */

function readPublic(value: string | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

export const APP_ENV = (readPublic(process.env.NEXT_PUBLIC_APP_ENV) ?? 'development') as
  | 'development'
  | 'staging'
  | 'production'

/**
 * True only for the live public deployment. Development-only placeholder
 * content is suppressed when this is true (Rules.md §1).
 */
export const IS_PRODUCTION_CONTENT = APP_ENV === 'production'

export const SITE_URL = (
  readPublic(process.env.NEXT_PUBLIC_SITE_URL) ?? 'http://localhost:3000'
).replace(/\/+$/, '')

export const SUPABASE_URL = readPublic(process.env.NEXT_PUBLIC_SUPABASE_URL)
export const SUPABASE_ANON_KEY = readPublic(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
}

export const GA4_MEASUREMENT_ID = readPublic(process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID)
export const GOOGLE_SITE_VERIFICATION = readPublic(
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
)

/**
 * Official WhatsApp number, digits only. Null until the client confirms it —
 * every WhatsApp affordance is hidden while it is null rather than pointing at
 * an invented number.
 */
export const WHATSAPP_NUMBER = (() => {
  const raw = readPublic(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER)
  if (!raw) return null
  const digits = raw.replace(/\D/g, '')
  return digits.length >= 10 ? digits : null
})()

export function whatsappLink(message?: string): string | null {
  if (!WHATSAPP_NUMBER) return null
  const base = `https://wa.me/${WHATSAPP_NUMBER}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
