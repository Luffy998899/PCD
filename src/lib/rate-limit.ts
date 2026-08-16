import 'server-only'

import { FORM_RATE_LIMIT } from '@/lib/constants'

/**
 * Best-effort in-process rate limiter for public form submissions.
 *
 * Limitation: the counter lives in the memory of a single server instance, so
 * it does not coordinate across a horizontally scaled deployment. It stops
 * casual abuse and accidental double submits. If the site is deployed across
 * multiple instances and abuse becomes a real problem, move this behind a
 * shared store (Supabase table or Upstash Redis) — the call site does not need
 * to change.
 */

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

function sweep(now: number): void {
  if (buckets.size < 500) return
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

export type RateLimitResult = { allowed: boolean; retryAfterSeconds: number }

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now()
  sweep(now)

  const existing = buckets.get(key)
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + FORM_RATE_LIMIT.windowMs })
    return { allowed: true, retryAfterSeconds: 0 }
  }

  if (existing.count >= FORM_RATE_LIMIT.max) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    }
  }

  existing.count += 1
  return { allowed: true, retryAfterSeconds: 0 }
}

/**
 * Derives a rate-limit key from proxy headers. Falls back to a shared bucket
 * when no client address is available, which is deliberately conservative.
 */
export function clientKey(headers: Headers, scope: string): string {
  const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const realIp = headers.get('x-real-ip')?.trim()
  return `${scope}:${forwarded || realIp || 'unknown'}`
}
