import * as React from 'react'

import { cn } from '@/lib/utils'

/** Max-width content wrapper with the responsive padding from Design.md §5. */
export function Container({
  className,
  size = 'default',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { size?: 'default' | 'narrow' }) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-5 sm:px-6 lg:px-10',
        size === 'narrow' ? 'max-w-3xl' : 'max-w-[1280px]',
        className,
      )}
      {...props}
    />
  )
}

/**
 * Vertical section rhythm (Design.md §5). `tone` controls the background so
 * pages alternate between contained and subtle bands instead of being one flat
 * surface.
 */
export function Section({
  className,
  tone = 'default',
  spacing = 'default',
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  tone?: 'default' | 'subtle' | 'primary'
  spacing?: 'default' | 'compact'
}) {
  return (
    <section
      className={cn(
        spacing === 'compact' ? 'py-10 md:py-14' : 'py-14 md:py-20 lg:py-24',
        tone === 'subtle' && 'bg-surface-subtle',
        tone === 'primary' && 'bg-primary text-primary-foreground',
        className,
      )}
      {...props}
    />
  )
}

type SectionHeaderProps = {
  eyebrow?: string | null
  title: string
  description?: string | null
  align?: 'start' | 'center'
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  children?: React.ReactNode
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'start',
  as: Heading = 'h2',
  className,
  children,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {eyebrow ? (
        <span className="text-xs font-semibold tracking-[0.14em] text-accent-strong uppercase">
          {eyebrow}
        </span>
      ) : null}
      <Heading
        className={cn(
          'text-foreground',
          Heading === 'h1'
            ? 'text-[2.125rem] leading-tight sm:text-h1'
            : 'text-[1.75rem] leading-tight sm:text-h2',
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p className={cn('max-w-2xl text-muted-foreground', align === 'center' && 'mx-auto')}>
          {description}
        </p>
      ) : null}
      {children}
    </div>
  )
}
