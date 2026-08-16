'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Loader2 } from 'lucide-react'

import { schemaForEnquiryType, type PublicEnquiryType } from '@/lib/validation/enquiry'
import { submitEnquiry } from '@/app/actions/enquiry'
import { trackEvent } from '@/lib/analytics'
import { Button } from '@/components/ui/button'
import {
  CheckboxField,
  HoneypotField,
  TextAreaField,
  TextField,
} from '@/components/forms/fields'

export type EnquiryFormValues = {
  name: string
  email: string
  phone: string
  organisation?: string
  city?: string
  state?: string
  country?: string
  subject?: string
  message: string
  productReference?: string
  therapyReference?: string
  divisionReference?: string
  consent: boolean
  companyWebsite?: string
}

type OptionalField = 'organisation' | 'city' | 'state' | 'country' | 'subject'

export type EnquiryFormProps = {
  enquiryType: PublicEnquiryType
  /** Which optional fields to show. Keep forms short (PRD §6). */
  fields?: OptionalField[]
  /** Fields the organisation/city/state group must be filled in for. */
  submitLabel?: string
  messageLabel?: string
  messageHint?: string
  consentLabel?: string
  successTitle?: string
  successMessage?: string
  /** Context carried with the enquiry, e.g. the product being viewed. */
  context?: {
    productReference?: string
    therapyReference?: string
    divisionReference?: string
    subject?: string
  }
}

/**
 * The site's single enquiry form (Rules.md §11).
 *
 * Variants differ by `enquiryType`, visible fields and copy — not by having
 * separate components. Validation runs on the client for feedback and again on
 * the server, which is authoritative.
 */
export function EnquiryForm({
  enquiryType,
  fields = [],
  submitLabel = 'Send enquiry',
  messageLabel = 'Your message',
  messageHint,
  consentLabel = 'I consent to being contacted about this enquiry and to my details being stored for that purpose.',
  successTitle = 'Enquiry received',
  successMessage = 'Thank you. Our team will review your enquiry and respond to the contact details you provided.',
  context,
}: EnquiryFormProps) {
  // Set after mount so nothing impure runs during render.
  const mountedAt = useRef(0)
  useEffect(() => {
    mountedAt.current = Date.now()
  }, [])

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [formError, setFormError] = useState<string | null>(null)
  const [reference, setReference] = useState<string | null>(null)

  const requiresBusinessFields = enquiryType === 'business' || enquiryType === 'partner'

  // Conversion measurement (PRD §6). Fires once, when the visitor first
  // interacts with the form.
  const startedRef = useRef(false)
  const onFirstInteraction = () => {
    if (startedRef.current) return
    startedRef.current = true
    trackEvent(enquiryType === 'product' ? 'product_enquiry_started' : 'enquiry_started', {
      enquiry_type: enquiryType,
      product: context?.productReference,
    })
  }

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(schemaForEnquiryType(enquiryType)) as unknown as Resolver<EnquiryFormValues>,
    defaultValues: {
      consent: false,
      companyWebsite: '',
      subject: context?.subject,
      productReference: context?.productReference,
      therapyReference: context?.therapyReference,
      divisionReference: context?.divisionReference,
    },
  })

  // Declared, not invoked, during render — `handleSubmit` is applied inside the
  // form's submit handler so refs and timers are only touched on an event.
  const submitValues = async (values: EnquiryFormValues) => {
    setStatus('submitting')
    setFormError(null)

    // Attribution context (PRD §6). Collected at submit time so it reflects the
    // page the visitor actually converted from.
    const url = new URL(window.location.href)
    const utm: Record<string, string> = {}
    for (const [key, value] of url.searchParams) {
      if (key.startsWith('utm_')) utm[key] = value.slice(0, 200)
    }

    const result = await submitEnquiry({
      ...values,
      enquiryType,
      sourcePage: `${url.pathname}${url.search}`,
      utm: Object.keys(utm).length > 0 ? utm : undefined,
      elapsedMs: Date.now() - mountedAt.current,
    })

    if (result.ok) {
      trackEvent(
        enquiryType === 'product'
          ? 'product_enquiry_submitted'
          : enquiryType === 'partner'
            ? 'partner_enquiry_submitted'
            : 'enquiry_submitted',
        { enquiry_type: enquiryType, product: context?.productReference },
      )
      setReference(result.reference)
      setStatus('success')
      startedRef.current = false
      reset()
      return
    }

    if (result.fieldErrors) {
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        if (field in values) {
          setError(field as keyof EnquiryFormValues, { type: 'server', message })
        }
      }
    }
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
        <h3 className="text-lg text-foreground">{successTitle}</h3>
        <p className="text-sm text-muted-foreground">{successMessage}</p>
        {reference ? (
          <p className="text-sm text-muted-foreground">
            Your reference: <span className="font-mono font-medium text-foreground">{reference}</span>
          </p>
        ) : null}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            mountedAt.current = Date.now()
            setStatus('idle')
            setReference(null)
          }}
        >
          Send another enquiry
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(submitValues)(event)
      }}
      onFocus={onFirstInteraction}
      noValidate
      className="flex flex-col gap-5"
    >
      <HoneypotField {...register('companyWebsite')} />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Full name"
          required
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />
        <TextField
          label="Email address"
          type="email"
          required
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <TextField
          label="Phone number"
          type="tel"
          required
          autoComplete="tel"
          error={errors.phone?.message}
          {...register('phone')}
        />
        {fields.includes('organisation') ? (
          <TextField
            label={requiresBusinessFields ? 'Firm / organisation' : 'Organisation'}
            required={requiresBusinessFields}
            autoComplete="organization"
            error={errors.organisation?.message}
            {...register('organisation')}
          />
        ) : null}
        {fields.includes('city') ? (
          <TextField
            label="City"
            required={requiresBusinessFields}
            autoComplete="address-level2"
            error={errors.city?.message}
            {...register('city')}
          />
        ) : null}
        {fields.includes('state') ? (
          <TextField
            label="State"
            required={requiresBusinessFields}
            autoComplete="address-level1"
            error={errors.state?.message}
            {...register('state')}
          />
        ) : null}
        {fields.includes('country') ? (
          <TextField
            label="Country"
            autoComplete="country-name"
            error={errors.country?.message}
            {...register('country')}
          />
        ) : null}
      </div>

      {fields.includes('subject') ? (
        <TextField label="Subject" error={errors.subject?.message} {...register('subject')} />
      ) : (
        <input type="hidden" {...register('subject')} />
      )}

      <input type="hidden" {...register('productReference')} />
      <input type="hidden" {...register('therapyReference')} />
      <input type="hidden" {...register('divisionReference')} />

      <TextAreaField
        label={messageLabel}
        hint={messageHint}
        required
        error={errors.message?.message}
        {...register('message')}
      />

      <CheckboxField
        label={
          <>
            {consentLabel}{' '}
            <Link href="/privacy-policy" className="text-primary underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </>
        }
        error={errors.consent?.message}
        {...register('consent')}
      />

      {formError ? (
        <p role="alert" className="rounded-sm border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">
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
            submitLabel
          )}
        </Button>
      </div>
    </form>
  )
}
