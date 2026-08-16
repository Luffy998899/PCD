'use server'

import { headers } from 'next/headers'

import { enquirySubmissionSchema } from '@/lib/validation/enquiry'
import { getServerClient, getServiceClient } from '@/lib/supabase/server'
import { checkRateLimit, clientKey } from '@/lib/rate-limit'
import { sendMail } from '@/lib/mail'
import type { EnquiryInsert } from '@/types/database'

export type EnquiryActionResult =
  | { ok: true; reference: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> }

/** Minimum time a human plausibly needs to complete a form. */
const MIN_ELAPSED_MS = 2500

const TYPE_LABELS: Record<string, string> = {
  general: 'General enquiry',
  business: 'Business / distribution enquiry',
  product: 'Product / medical enquiry',
  partner: 'Partner enquiry',
  grievance: 'Grievance',
  pharmacovigilance: 'Adverse event / product complaint',
}

/**
 * Single trusted entry point for every public enquiry form
 * (Architecture.md §12).
 *
 * Order: server validation → anti-spam → rate limit → database insert →
 * notification. The submission is only reported as successful once it is
 * persisted; notification failure never discards it (Rules.md §15).
 */
export async function submitEnquiry(input: unknown): Promise<EnquiryActionResult> {
  const parsed = enquirySubmissionSchema.safeParse(input)

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

  // Anti-spam: honeypot is validated by the schema; timing is checked here so a
  // fast legitimate paste is not punished as harshly as an instant bot post.
  if (typeof data.elapsedMs === 'number' && data.elapsedMs < MIN_ELAPSED_MS) {
    return { ok: false, error: 'Submission could not be verified. Please try again.' }
  }

  const requestHeaders = await headers()
  const limit = checkRateLimit(clientKey(requestHeaders, 'enquiry'))
  if (!limit.allowed) {
    const minutes = Math.ceil(limit.retryAfterSeconds / 60)
    return {
      ok: false,
      error: `Too many submissions from this connection. Please try again in about ${minutes} minute${minutes === 1 ? '' : 's'}, or email us directly.`,
    }
  }

  const db = getServiceClient() ?? (await getServerClient())
  if (!db) {
    // Better to tell the visitor plainly than to pretend the enquiry was
    // received.
    return {
      ok: false,
      error:
        'Enquiries cannot be submitted right now. Please contact us by phone or email while we restore this form.',
    }
  }

  const record: EnquiryInsert = {
    enquiry_type: data.enquiryType,
    name: data.name,
    email: data.email,
    phone: data.phone,
    organisation: data.organisation ?? null,
    city: data.city ?? null,
    state: data.state ?? null,
    country: data.country ?? null,
    subject: data.subject ?? null,
    message: data.message,
    product_reference: data.productReference ?? null,
    therapy_reference: data.therapyReference ?? null,
    division_reference: data.divisionReference ?? null,
    consent: data.consent,
    source_page: data.sourcePage ?? null,
    utm: data.utm ?? null,
  }

  const { data: inserted, error } = await db
    .from('enquiries')
    .insert(record)
    .select('id')
    .single()

  if (error || !inserted) {
    // Raw database errors are never surfaced to the visitor (Rules.md §18).
    console.error('[enquiry] insert failed', { type: data.enquiryType, code: error?.code })
    return {
      ok: false,
      error:
        'We could not record your enquiry. Please try again, or contact us by phone or email.',
    }
  }

  const reference = inserted.id.slice(0, 8).toUpperCase()

  // Notification content is limited to what the team needs in order to respond.
  // Pharmacovigilance narratives are excluded from email and are read from the
  // admin instead (Rules.md §18).
  const isSensitive = data.enquiryType === 'pharmacovigilance'
  const bodyLines = [
    `Type: ${TYPE_LABELS[data.enquiryType] ?? data.enquiryType}`,
    `Reference: ${reference}`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    data.organisation ? `Organisation: ${data.organisation}` : null,
    [data.city, data.state, data.country].filter(Boolean).join(', ') || null,
    data.productReference ? `Product: ${data.productReference}` : null,
    data.sourcePage ? `Source page: ${data.sourcePage}` : null,
    '',
    isSensitive
      ? 'A report has been recorded. Open it in the admin to read the details.'
      : data.message,
  ].filter((line): line is string => line !== null)

  const mail = await sendMail({
    subject: `[${TYPE_LABELS[data.enquiryType] ?? 'Enquiry'}] ${reference}`,
    text: bodyLines.join('\n'),
    replyTo: data.email,
  })

  if (!mail.delivered) {
    // Persisted successfully — the notification is a secondary channel.
    console.warn('[enquiry] notification not delivered', {
      reference,
      reason: mail.reason,
    })
  }

  return { ok: true, reference }
}
