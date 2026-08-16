'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Loader2 } from 'lucide-react'

import { pharmacovigilanceSchema } from '@/lib/validation/pharmacovigilance'
import { submitPharmacovigilanceReport } from '@/app/actions/pharmacovigilance'
import { Button } from '@/components/ui/button'
import {
  CheckboxField,
  HoneypotField,
  SelectField,
  TextAreaField,
  TextField,
} from '@/components/forms/fields'

type FormValues = {
  reportType: 'adverse_event' | 'product_complaint'
  reporterName: string
  reporterEmail: string
  reporterPhone: string
  reporterCategory: 'patient' | 'physician' | 'pharmacist' | 'other_hcp' | 'other'
  productName?: string
  batchNumber?: string
  expiryDate?: string
  eventDescription: string
  eventStartedOn?: string
  patientAgeGroup?: string
  patientSex?: string
  consent: boolean
  companyWebsite?: string
}

const REPORTER_CATEGORIES = [
  { value: 'patient', label: 'Patient or carer' },
  { value: 'physician', label: 'Physician' },
  { value: 'pharmacist', label: 'Pharmacist' },
  { value: 'other_hcp', label: 'Other healthcare professional' },
  { value: 'other', label: 'Other' },
]

const AGE_GROUPS = [
  { value: 'under-2', label: 'Under 2 years' },
  { value: '2-11', label: '2 to 11 years' },
  { value: '12-17', label: '12 to 17 years' },
  { value: '18-64', label: '18 to 64 years' },
  { value: '65-plus', label: '65 years and over' },
  { value: 'not-known', label: 'Not known' },
]

/**
 * Adverse event / product complaint form.
 *
 * Kept separate from `EnquiryForm` because the fields, the storage table and
 * the handling obligations are different — this is a safety report, not a lead.
 */
export function PharmacovigilanceForm() {
  const mountedAt = useRef(0)
  useEffect(() => {
    mountedAt.current = Date.now()
  }, [])

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [formError, setFormError] = useState<string | null>(null)
  const [reference, setReference] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(pharmacovigilanceSchema) as unknown as Resolver<FormValues>,
    defaultValues: {
      reportType: 'adverse_event',
      reporterCategory: 'patient',
      consent: false,
      companyWebsite: '',
    },
  })

  const submitValues = async (values: FormValues) => {
    setStatus('submitting')
    setFormError(null)

    const url = new URL(window.location.href)
    const result = await submitPharmacovigilanceReport({
      ...values,
      sourcePage: `${url.pathname}${url.search}`,
      elapsedMs: Date.now() - mountedAt.current,
    })

    if (result.ok) {
      setReference(result.reference)
      setStatus('success')
      reset()
      return
    }

    if (result.fieldErrors) {
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        if (field in values) {
          setError(field as keyof FormValues, { type: 'server', message })
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
        <h3 className="text-lg text-foreground">Report recorded</h3>
        <p className="text-sm text-muted-foreground">
          Thank you for reporting this. Our pharmacovigilance team will review it and may contact
          you for further information. If the patient&rsquo;s condition is serious or worsening,
          seek medical attention now.
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
    <form
      onSubmit={(event) => {
        void handleSubmit(submitValues)(event)
      }}
      noValidate
      className="flex flex-col gap-5"
    >
      <HoneypotField {...register('companyWebsite')} />

      <SelectField
        label="What are you reporting?"
        required
        options={[
          { value: 'adverse_event', label: 'A side effect or adverse event' },
          { value: 'product_complaint', label: 'A product quality problem' },
        ]}
        error={errors.reportType?.message}
        {...register('reportType')}
      />

      <fieldset className="flex flex-col gap-5">
        <legend className="text-sm font-semibold text-foreground">About you</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Your name"
            required
            autoComplete="name"
            error={errors.reporterName?.message}
            {...register('reporterName')}
          />
          <SelectField
            label="You are"
            required
            options={REPORTER_CATEGORIES}
            error={errors.reporterCategory?.message}
            {...register('reporterCategory')}
          />
          <TextField
            label="Email address"
            type="email"
            required
            autoComplete="email"
            error={errors.reporterEmail?.message}
            {...register('reporterEmail')}
          />
          <TextField
            label="Phone number"
            type="tel"
            required
            autoComplete="tel"
            error={errors.reporterPhone?.message}
            {...register('reporterPhone')}
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className="text-sm font-semibold text-foreground">About the product</legend>
        <div className="grid gap-5 sm:grid-cols-3">
          <TextField
            label="Product name"
            hint="As printed on the pack"
            error={errors.productName?.message}
            {...register('productName')}
          />
          <TextField
            label="Batch number"
            error={errors.batchNumber?.message}
            {...register('batchNumber')}
          />
          <TextField
            label="Expiry date"
            hint="For example 08/2027"
            error={errors.expiryDate?.message}
            {...register('expiryDate')}
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className="text-sm font-semibold text-foreground">What happened</legend>
        <TextAreaField
          label="Describe the event"
          required
          rows={6}
          hint="What happened, when it started, and what has been done since. Please do not include the patient's name or contact details."
          error={errors.eventDescription?.message}
          {...register('eventDescription')}
        />
        <div className="grid gap-5 sm:grid-cols-3">
          <TextField
            label="When did it start?"
            hint="For example 12 March 2026"
            error={errors.eventStartedOn?.message}
            {...register('eventStartedOn')}
          />
          <SelectField
            label="Patient age group"
            placeholder="Select"
            options={AGE_GROUPS}
            error={errors.patientAgeGroup?.message}
            {...register('patientAgeGroup')}
          />
          <SelectField
            label="Patient sex"
            placeholder="Select"
            options={[
              { value: 'female', label: 'Female' },
              { value: 'male', label: 'Male' },
              { value: 'other', label: 'Other' },
              { value: 'not-known', label: 'Not known' },
            ]}
            error={errors.patientSex?.message}
            {...register('patientSex')}
          />
        </div>
      </fieldset>

      <CheckboxField
        label={
          <>
            I consent to this report being recorded and used for pharmacovigilance purposes,
            including submission to the regulatory authority where required, as described in the{' '}
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
            'Report complaint'
          )}
        </Button>
      </div>
    </form>
  )
}
