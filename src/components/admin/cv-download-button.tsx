'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'

import { getCvDownloadUrl } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'

/**
 * Requests a short-lived signed URL for a CV and opens it.
 *
 * The link is never rendered into the page source, so a CV URL cannot leak
 * through the HTML or a shared screenshot of the list (Rules.md §17).
 */
export function CvDownloadButton({ applicationId }: { applicationId: string }) {
  const [state, setState] = useState<'idle' | 'loading'>('idle')
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-1">
      <Button
        variant="outline"
        size="sm"
        disabled={state === 'loading'}
        onClick={async () => {
          setState('loading')
          setError(null)
          const result = await getCvDownloadUrl(applicationId)
          setState('idle')
          if (!result.ok) {
            setError(result.error)
            return
          }
          window.open(result.url, '_blank', 'noopener,noreferrer')
        }}
      >
        {state === 'loading' ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Download className="size-4" aria-hidden="true" />
        )}
        CV
      </Button>
      {error ? (
        <span role="alert" className="text-xs text-error">
          {error}
        </span>
      ) : null}
    </div>
  )
}
