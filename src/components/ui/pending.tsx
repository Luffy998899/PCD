import { placeholder } from '@/lib/content/placeholder'
import { IS_PRODUCTION_CONTENT } from '@/lib/env'
import { cn } from '@/lib/utils'

/**
 * Renders a visible `[CLIENT TO PROVIDE: …]` marker in non-production
 * environments and nothing at all in production (Rules.md §1).
 *
 * Use this instead of writing sample copy for a fact the client has not
 * supplied.
 */
export function Pending({ label, className }: { label: string; className?: string }) {
  const text = placeholder(label)
  if (!text) return null
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border border-dashed border-warning/60 bg-warning/10 px-1.5 py-0.5 align-middle text-xs font-medium text-warning',
        className,
      )}
      data-placeholder="true"
    >
      {text}
    </span>
  )
}

/**
 * Development-only note for the build team — a review reminder or a caveat
 * about a page, as opposed to a missing client fact. Renders nothing in
 * production.
 */
export function DevNote({ children, className }: { children: string; className?: string }) {
  if (IS_PRODUCTION_CONTENT) return null
  return (
    <p
      className={cn(
        'rounded-md border border-dashed border-info/50 bg-info/5 px-4 py-3 text-sm text-info',
        className,
      )}
      data-dev-note="true"
    >
      <span className="font-semibold">Note for build team: </span>
      {children}
    </p>
  )
}

/** Block-level variant for whole sections that are awaiting client content. */
export function PendingBlock({ label, className }: { label: string; className?: string }) {
  const text = placeholder(label)
  if (!text) return null
  return (
    <p
      className={cn(
        'rounded-md border border-dashed border-warning/60 bg-warning/5 px-4 py-3 text-sm text-warning',
        className,
      )}
      data-placeholder="true"
    >
      {text}
    </p>
  )
}
