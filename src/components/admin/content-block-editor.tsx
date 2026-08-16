'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

import { saveContentBlock } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'
import { SelectField, TextAreaField, TextField } from '@/components/forms/fields'
import type { ContentBlockRow } from '@/types/database'

/**
 * Editor for a page content block.
 *
 * Body text is stored and rendered as plain text with blank-line paragraph
 * breaks — never as HTML — so a content editor cannot inject markup into a
 * public page (Architecture.md §17).
 */
export function ContentBlockEditor({
  pageKey,
  blockKey,
  label,
  description,
  block,
}: {
  pageKey: string
  blockKey: string
  label: string
  description?: string
  block: ContentBlockRow | null
}) {
  const [state, setState] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setState('saving')
    setError(null)

    const result = await saveContentBlock({
      pageKey,
      blockKey,
      heading: String(formData.get('heading') ?? ''),
      body: String(formData.get('body') ?? ''),
      status: String(formData.get('status') ?? 'draft'),
      sourceReference: String(formData.get('sourceReference') ?? ''),
    })

    if (result.ok) {
      setState('saved')
      return
    }
    setError(result.error)
    setState('idle')
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 border-b border-border p-6 last:border-b-0">
      <div>
        <h2 className="text-base text-foreground">{label}</h2>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>

      <TextField label="Heading" name="heading" defaultValue={block?.heading ?? ''} />
      <TextAreaField
        label="Body"
        name="body"
        rows={6}
        defaultValue={block?.body ?? ''}
        hint="Plain text. Leave a blank line between paragraphs."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Source reference"
          name="sourceReference"
          defaultValue={block?.source_reference ?? ''}
          hint="Where this claim comes from. Shown with the content when set."
        />
        <SelectField
          label="Status"
          name="status"
          defaultValue={block?.status ?? 'draft'}
          options={[
            { value: 'draft', label: 'Draft — not visible publicly' },
            { value: 'published', label: 'Published — live on the website' },
            { value: 'archived', label: 'Archived' },
          ]}
          required
        />
      </div>

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
