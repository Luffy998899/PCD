import * as React from 'react'
import { Info } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * Shown wherever published records do not exist yet.
 *
 * The site never fills an empty section with invented content (Rules.md §1), so
 * every list-driven surface needs an honest empty state instead.
 */
export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 rounded-md border border-dashed border-border bg-surface px-6 py-12 text-center',
        className,
      )}
    >
      <Info className="size-5 text-muted-foreground" aria-hidden="true" />
      <p className="font-medium text-foreground">{title}</p>
      {description ? (
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action}
    </div>
  )
}
