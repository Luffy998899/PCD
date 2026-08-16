import * as React from 'react'

import { cn } from '@/lib/utils'

/** Base surface card: white, thin border, modest radius (Design.md §9). */
export function Card({
  className,
  interactive = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-md border border-border bg-surface',
        interactive && 'transition-colors duration-200 hover:border-primary/40',
        className,
      )}
      {...props}
    />
  )
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5 sm:p-6', className)} {...props} />
}

export function CardTitle({
  className,
  as: Heading = 'h3',
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { as?: 'h2' | 'h3' | 'h4' }) {
  return <Heading className={cn('text-lg text-foreground', className)} {...props} />
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />
}

/**
 * Definition row used for factual data (licence numbers, pack sizes, facility
 * facts). Keeps label/value pairs consistent across the site.
 */
export function DataRow({
  label,
  value,
  className,
}: {
  label: string
  value: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid gap-1 border-b border-border py-3 last:border-b-0 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-4',
        className,
      )}
    >
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{value}</dd>
    </div>
  )
}

export function DataList({ className, ...props }: React.HTMLAttributes<HTMLDListElement>) {
  return <dl className={cn('divide-border', className)} {...props} />
}
