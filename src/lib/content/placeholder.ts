import { IS_PRODUCTION_CONTENT } from '@/lib/env'
import { PLACEHOLDER_PREFIX } from '@/lib/constants'

/**
 * Development-only placeholders (Rules.md §1).
 *
 * The site is built before the client's verified facts exist. Rather than
 * inventing a value, unresolved facts render as a visible `[CLIENT TO PROVIDE]`
 * marker while `NEXT_PUBLIC_APP_ENV !== "production"`, and are omitted entirely
 * in production. That makes gaps obvious during review and impossible to ship.
 */
export function placeholder(label: string): string | null {
  return IS_PRODUCTION_CONTENT ? null : `${PLACEHOLDER_PREFIX}: ${label}]`
}

/**
 * Returns the supplied value, or a development placeholder when it is missing.
 * In production a missing value returns null so the caller can omit the field.
 */
export function orPlaceholder(
  value: string | null | undefined,
  label: string,
): string | null {
  const trimmed = value?.trim()
  if (trimmed) return trimmed
  return placeholder(label)
}

/** True when a string is an unresolved development placeholder. */
export function isPlaceholder(value: string | null | undefined): boolean {
  return Boolean(value?.startsWith(PLACEHOLDER_PREFIX))
}

/**
 * Strips placeholders from values that must never reach SEO metadata, schema
 * output or transactional email.
 */
export function withoutPlaceholder(value: string | null | undefined): string | null {
  if (!value || isPlaceholder(value)) return null
  return value
}
