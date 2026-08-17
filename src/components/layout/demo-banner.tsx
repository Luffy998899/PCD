import { FlaskConical } from 'lucide-react'

import { isDemoMode } from '@/lib/demo'
import { Container } from '@/components/ui/layout'

/**
 * Standing notice that the visible content is fictional.
 *
 * Demo mode cannot be enabled in production, but the banner exists so nobody
 * reviewing a staging link mistakes the sample company for real client data
 * (Rules.md §1).
 */
export function DemoBanner() {
  if (!isDemoMode()) return null

  return (
    <div className="border-b border-warning/30 bg-warning/10">
      <Container className="flex flex-wrap items-center gap-x-2 gap-y-1 py-2 text-xs text-warning-strong">
        <FlaskConical className="size-3.5 shrink-0" aria-hidden="true" />
        <span className="font-semibold">Demo content.</span>
        <span>
          Nirvaan Lifesciences is a fictional company used to preview this website. Every name,
          number, certificate and product on these pages is sample data.
        </span>
      </Container>
    </div>
  )
}
