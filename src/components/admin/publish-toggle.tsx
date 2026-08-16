'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

import { setProductStatus } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'
import type { PublishStatus } from '@/types/database'

/**
 * Publish / unpublish control.
 *
 * Publishing is what makes content public, so the button states what will
 * happen rather than showing an ambiguous switch.
 */
export function PublishToggle({
  productId,
  status,
}: {
  productId: string
  status: PublishStatus
}) {
  const [current, setCurrent] = useState<PublishStatus>(status)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const next: PublishStatus = current === 'published' ? 'draft' : 'published'

  return (
    <div className="flex flex-col gap-1">
      <Button
        size="sm"
        variant={current === 'published' ? 'outline' : 'primary'}
        disabled={saving}
        onClick={async () => {
          setSaving(true)
          setError(null)
          const result = await setProductStatus(productId, next)
          setSaving(false)
          if (!result.ok) {
            setError(result.error)
            return
          }
          setCurrent(next)
        }}
      >
        {saving ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
        {current === 'published' ? 'Unpublish' : 'Publish'}
      </Button>
      {error ? (
        <span role="alert" className="text-xs text-error">
          {error}
        </span>
      ) : null}
    </div>
  )
}
