'use server'

import { headers } from 'next/headers'

import { applicationSchema, validateCv } from '@/lib/validation/application'
import { getServiceClient } from '@/lib/supabase/server'
import { checkRateLimit, clientKey } from '@/lib/rate-limit'
import { sendMail } from '@/lib/mail'
import { slugify } from '@/lib/utils'
import type { JobApplicationInsert } from '@/types/database'

export type ApplicationActionResult =
  | { ok: true; reference: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> }

const CV_BUCKET = 'private-documents'

/**
 * Receives a job application and its CV.
 *
 * The CV is validated then written to a private bucket. Only its storage path
 * is recorded — never a public URL — so a CV cannot be reached by guessing a
 * link (Rules.md §17).
 *
 * This action needs the service role because the bucket is private and grants
 * no anonymous access at all.
 */
export async function submitApplication(formData: FormData): Promise<ApplicationActionResult> {
  const values = {
    jobOpeningId: (formData.get('jobOpeningId') as string) || undefined,
    appliedFor: formData.get('appliedFor'),
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    currentLocation: (formData.get('currentLocation') as string) || undefined,
    experienceYears: (formData.get('experienceYears') as string) || undefined,
    currentEmployer: (formData.get('currentEmployer') as string) || undefined,
    noticePeriod: (formData.get('noticePeriod') as string) || undefined,
    message: (formData.get('message') as string) || undefined,
    consent: formData.get('consent') === 'on' || formData.get('consent') === 'true',
    sourcePage: (formData.get('sourcePage') as string) || undefined,
    companyWebsite: (formData.get('companyWebsite') as string) || undefined,
  }

  const parsed = applicationSchema.safeParse(values)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (typeof key === 'string' && !fieldErrors[key]) fieldErrors[key] = issue.message
    }
    return {
      ok: false,
      error: 'Please correct the highlighted fields and try again.',
      fieldErrors,
    }
  }

  const data = parsed.data

  const cv = formData.get('cv')
  const file = cv instanceof File ? cv : null
  const cvCheck = validateCv(file)
  if (!cvCheck.ok) {
    return { ok: false, error: cvCheck.error, fieldErrors: { cv: cvCheck.error } }
  }

  const requestHeaders = await headers()
  const limit = checkRateLimit(clientKey(requestHeaders, 'application'))
  if (!limit.allowed) {
    return {
      ok: false,
      error: 'Too many applications from this connection. Please try again later.',
    }
  }

  const db = getServiceClient()
  if (!db) {
    return {
      ok: false,
      error:
        'Applications cannot be submitted right now. Please try again later, or email your CV to our HR team.',
    }
  }

  // Path is derived from the role and a random id, never from the uploaded
  // file name, so a crafted name cannot escape the folder.
  const storagePath = `careers/cvs/${slugify(data.appliedFor).slice(0, 40)}/${crypto.randomUUID()}.${cvCheck.extension}`

  const upload = await db.storage.from(CV_BUCKET).upload(storagePath, file!, {
    contentType: file!.type,
    upsert: false,
  })

  if (upload.error) {
    console.error('[application] cv upload failed', { message: upload.error.message })
    return {
      ok: false,
      error: 'We could not upload your CV. Please try again, or email it to our HR team.',
    }
  }

  const record: JobApplicationInsert = {
    job_opening_id: data.jobOpeningId ?? null,
    applied_for: data.appliedFor,
    name: data.name,
    email: data.email,
    phone: data.phone,
    current_location: data.currentLocation ?? null,
    experience_years: data.experienceYears ?? null,
    current_employer: data.currentEmployer ?? null,
    notice_period: data.noticePeriod ?? null,
    message: data.message ?? null,
    cv_storage_path: storagePath,
    cv_file_name: file!.name.slice(0, 200),
    consent: data.consent,
    source_page: data.sourcePage ?? null,
  }

  const { data: inserted, error } = await db
    .from('job_applications')
    .insert(record)
    .select('id')
    .single()

  if (error || !inserted) {
    // Remove the orphaned upload so a failed application leaves no stray CV.
    await db.storage.from(CV_BUCKET).remove([storagePath])
    console.error('[application] insert failed', { code: error?.code })
    return {
      ok: false,
      error: 'We could not record your application. Please try again.',
    }
  }

  const reference = inserted.id.slice(0, 8).toUpperCase()

  const mail = await sendMail({
    subject: `[Career application] ${data.appliedFor} — ${reference}`,
    text: [
      `A new application has been received. Open it in the admin to view the CV.`,
      ``,
      `Reference: ${reference}`,
      `Role: ${data.appliedFor}`,
      `Name: ${data.name}`,
      `Contact: ${data.email} / ${data.phone}`,
      data.currentLocation ? `Location: ${data.currentLocation}` : null,
      data.experienceYears !== undefined ? `Experience: ${data.experienceYears} years` : null,
      data.noticePeriod ? `Notice period: ${data.noticePeriod}` : null,
    ]
      .filter((line): line is string => line !== null)
      .join('\n'),
    replyTo: data.email,
  })

  if (!mail.delivered) {
    console.warn('[application] notification not delivered', { reference, reason: mail.reason })
  }

  return { ok: true, reference }
}
