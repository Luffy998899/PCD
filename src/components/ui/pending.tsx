import { placeholder } from '@/lib/content/placeholder'
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
