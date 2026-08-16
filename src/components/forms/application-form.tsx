'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Loader2 } from 'lucide-react'

import { submitApplication } from '@/app/actions/application'
import { MAX_UPLOAD_BYTES } from '@/lib/constants'
import { trackEvent } from '@/lib/analytics'
import { Button } from '@/components/ui/button'
import { CheckboxField, HoneypotField, TextAreaField, TextField } from '@/components/forms/fields'

/**
 * Job application form.
 *
 * The CV is a real file input inside a native form, so the whole submission —
 * fields and file — goes to one server action in a single request. Validation
 * on the server is authoritative; the client-side checks here only give faster
 * feedback.
 */
export function ApplicationForm({
  jobOpeningId,
  appliedFor,
  roleIsFixed = false,
}: {
  jobOpeningId?: string
  appliedFor?: string
  roleIsFixed?: boolean
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [reference, setReference] = useState<string | null>(null)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    // Attribution is read at submit time rather than held in state, so nothing
    // impure runs during render.
    formData.set('sourcePage', `${window.location.pathname}${window.location.search}`)

    setStatus('submitting')
    setFormError(null)
    setFieldErrors({})

    const result = await submitApplication(formData)

    if (result.ok) {
      trackEvent('career_application_submitted', { role: appliedFor })
      setReference(result.reference)
      setStatus('success')
      formRef.current?.reset()
      return
    }

    setFieldErrors(result.fieldErrors ?? {})
    setFormError(result.error)
    setStatus('error')
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-3 rounded-md border border-accent/30 bg-accent-soft p-6"
      >
        <CheckCircle2 className="size-6 text-accent" aria-hidden="true" />
        <h3 className="text-lg text-foreground">Application received</h3>
        <p className="text-sm text-muted-foreground">
          Thank you. Our HR team reviews every application and will contact you if your profile
          matches the role.
        </p>
        {reference ? (
          <p className="text-sm text-muted-foreground">
            Your reference:{' '}
            <span className="font-mono font-medium text-foreground">{reference}</span>
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <HoneypotField name="companyWebsite" />
      {jobOpeningId ? <input type="hidden" name="jobOpeningId" value={jobOpeningId} /> : null}

      {roleIsFixed && appliedFor ? (
        <input type="hidden" name="appliedFor" value={appliedFor} />
      ) : (
        <TextField
          label="Role you are applying for"
          name="appliedFor"
          required
          defaultValue={appliedFor}
          error={fieldErrors.appliedFor}
        />
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Full name"
          name="name"
          required
          autoComplete="name"
          error={fieldErrors.name}
        />
        <TextField
          label="Email address"
          name="email"
          type="email"
          required
          autoComplete="email"
          error={fieldErrors.email}
        />
        <TextField
          label="Phone number"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          error={fieldErrors.phone}
        />
        <TextField
          label="Current location"
          name="currentLocation"
          autoComplete="address-level2"
          error={fieldErrors.currentLocation}
        />
        <TextField
          label="Total experience (years)"
          name="experienceYears"
          type="number"
          min={0}
          max={60}
          step="0.5"
          error={fieldErrors.experienceYears}
        />
        <TextField
          label="Current employer"
          name="currentEmployer"
          error={fieldErrors.currentEmployer}
        />
        <TextField
          label="Notice period"
          name="noticePeriod"
          hint="For example 30 days"
          error={fieldErrors.noticePeriod}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cv" className="text-sm font-medium text-foreground">
          Your CV
          <span className="ml-1 text-error" aria-hidden="true">
            *
          </span>
        </label>
        <p id="cv-hint" className="text-xs text-muted-foreground">
          PDF, DOC or DOCX, up to {Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))} MB. Your CV is
          stored privately and is not published anywhere on this website.
        </p>
        <input
          id="cv"
          name="cv"
          type="file"
          required
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          aria-describedby={fieldErrors.cv ? 'cv-hint cv-error' : 'cv-hint'}
          aria-invalid={fieldErrors.cv ? true : undefined}
          className="w-full rounded-sm border border-border bg-surface px-3 py-2.5 text-sm text-foreground file:mr-3 file:rounded-sm file:border-0 file:bg-primary-soft file:px-3 file:py-1.5 file:text-sm file:text-primary"
        />
        {fieldErrors.cv ? (
          <p id="cv-error" className="text-sm text-error">
            {fieldErrors.cv}
          </p>
        ) : null}
      </div>

      <TextAreaField
        label="Anything else you would like us to know"
        name="message"
        rows={4}
        error={fieldErrors.message}
      />

      <CheckboxField
        name="consent"
        label={
          <>
            I consent to my CV and details being stored and used to assess this application, as
            described in the{' '}
            <Link href="/privacy-policy" className="text-primary underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </>
        }
        error={fieldErrors.consent}
      />

      {formError ? (
        <p
          role="alert"
          className="rounded-sm border border-error/30 bg-error/5 px-4 py-3 text-sm text-error"
        >
          {formError}
        </p>
      ) : null}

      <div>
        <Button type="submit" disabled={status === 'submitting'} size="lg">
          {status === 'submitting' ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            'Apply now'
          )}
        </Button>
      </div>
    </form>
  )
}
