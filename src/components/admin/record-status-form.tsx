'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { SelectField, TextAreaField } from '@/components/forms/fields'
import type { AdminActionResult } from '@/app/actions/admin'

/**
 * Status + internal notes editor, shared by enquiries, applications and safety
 * reports. One component rather than three near-identical ones (Rules.md §11).
 */
export function RecordStatusForm({
  recordId,
  status,
  notes,
  options,
  action,
}: {
  recordId: string
  status: string
  notes: string | null
  options: { value: string; label: string }[]
  action: (id: string, status: string, notes: string) => Promise<AdminActionResult>
}) {
  const [state, setState] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setState('saving')
    setError(null)

    const result = await action(
      recordId,
      String(formData.get('status') ?? ''),
      String(formData.get('notes') ?? ''),
    )

    if (result.ok) {
      setState('saved')
      return
    }
    setError(result.error)
    setState('idle')
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <SelectField label="Status" name="status" defaultValue={status} options={options} required />
      <TextAreaField
        label="Internal notes"
        name="notes"
        rows={4}
        defaultValue={notes ?? ''}
        hint="Visible to staff only. Never shown on the public site."
      />
      {error ? (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      ) : null}
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" disabled={state === 'saving'}>
          {state === 'saving' ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Saving…
            </>
          ) : (
            'Save'
          )}
        </Button>
        {state === 'saved' ? (
          <span role="status" className="text-sm text-accent-strong">
            Saved
          </span>
        ) : null}
      </div>
    </form>
  )
}
