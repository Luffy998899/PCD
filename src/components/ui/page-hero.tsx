import * as React from 'react'

import { Container } from '@/components/ui/layout'
import { Breadcrumbs, type Crumb } from '@/components/ui/breadcrumbs'

/**
 * Standard inner-page header: breadcrumbs, one H1, supporting copy and at most
 * one primary action (Rules.md §5).
 */
export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  action,
  children,
}: {
  eyebrow?: string
  title: string
  description?: string
  breadcrumbs: Crumb[]
  action?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <div className="relative overflow-hidden border-b border-primary-dark/40 bg-primary text-primary-foreground">
      {/* Same blister motif as the hero proof card, so inner pages read as part
          of one system rather than a different template. */}
      <div className="blister pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
      <Container className="relative py-12 md:py-16">
        <Breadcrumbs items={breadcrumbs} tone="inverse" className="mb-6" />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            {eyebrow ? (
              <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-primary-foreground/70 uppercase">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="text-[2rem] leading-tight font-semibold tracking-tight sm:text-h1">
              {title}
            </h1>
            <span
              aria-hidden="true"
              className="mt-5 block h-0.5 w-10 bg-accent-strong"
            />
            {description ? (
              <p className="mt-4 text-primary-foreground/80 md:text-body-lg">{description}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
        {children}
      </Container>
    </div>
  )
}
