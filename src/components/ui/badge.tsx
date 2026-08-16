import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs font-medium',
  {
    variants: {
      tone: {
        neutral: 'bg-surface-subtle text-muted-foreground',
        primary: 'bg-primary-soft text-primary',
        accent: 'bg-accent-soft text-accent',
        outline: 'border border-border text-muted-foreground',
        warning: 'bg-warning/10 text-warning',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
)

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />
}
