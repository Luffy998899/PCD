import { APP_ENV } from '@/lib/env'

/**
 * Demo mode.
 *
 * Fills every database-backed surface with a fictional company so the site can
 * be reviewed end to end before real content exists.
 *
 * Two guarantees make this safe under Rules.md §1:
 *
 *  1. It is **impossible to enable in production.** `APP_ENV === 'production'`
 *     short-circuits the check regardless of the flag, so demo content cannot
 *     reach a live site even if the variable is set by mistake.
 *  2. The content is **obviously fictional.** The company is named
 *     "Nirvaan Lifesciences (DEMO)", every registration number is prefixed
 *     `DEMO-`, and a banner sits above every page while the mode is on.
 *
 * Enable it with `NEXT_PUBLIC_DEMO_MODE=1` in `.env.local`.
 */
export function isDemoMode(): boolean {
  if (APP_ENV === 'production') return false
  return process.env.NEXT_PUBLIC_DEMO_MODE?.trim() === '1'
}
