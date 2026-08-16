'use client'

import { useEffect } from 'react'

import { Button, LinkButton } from '@/components/ui/button'
import { Container, Section } from '@/components/ui/layout'

/**
 * Route-level error boundary.
 *
 * Users never see the underlying error message, stack trace or database
 * details (Rules.md §18). The digest is surfaced only as a support reference.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[route-error]', error.digest ?? error.message)
  }, [error])

  return (
    <Section>
      <Container size="narrow" className="flex flex-col items-start gap-5">
        <p className="text-sm font-semibold tracking-[0.14em] text-accent-strong uppercase">
          Something went wrong
        </p>
        <h1 className="text-[2.125rem] leading-tight sm:text-h1">This page could not be loaded</h1>
        <p className="text-muted-foreground">
          The problem has been logged. Please try again, or contact us if you need this
          information now.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={reset}>Try again</Button>
          <LinkButton href="/contact" variant="outline">
            Contact us
          </LinkButton>
        </div>
        {error.digest ? (
          <p className="text-sm text-muted-foreground">
            Support reference: <span className="font-mono">{error.digest}</span>
          </p>
        ) : null}
      </Container>
    </Section>
  )
}
