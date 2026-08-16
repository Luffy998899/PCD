'use server'

import { headers } from 'next/headers'

import { pharmacovigilanceSchema } from '@/lib/validation/pharmacovigilance'
import { getServerClient, getServiceClient } from '@/lib/supabase/server'
import { checkRateLimit, clientKey } from '@/lib/rate-limit'
import { sendMail } from '@/lib/mail'
import type { PharmacovigilanceReportInsert } from '@/types/database'

export type PharmacovigilanceActionResult =
  | { ok: true; reference: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> }

const MIN_ELAPSED_MS = 3000

/**
 * Records an adverse event or product complaint.
 *
 * The report narrative is never written to application logs and never included
 * in notification email — the team is told a report exists and reads it in the
 * admin (Rules.md §18).
 */
export async function submitPharmacovigilanceReport(
  input: unknown,
): Promise<PharmacovigilanceActionResult> {
  const parsed = pharmacovigilanceSchema.safeParse(input)

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

  if (typeof data.elapsedMs === 'number' && data.elapsedMs < MIN_ELAPSED_MS) {
    return { ok: false, error: 'Submission could not be verified. Please try again.' }
  }

  const requestHeaders = await headers()
  const limit = checkRateLimit(clientKey(requestHeaders, 'pharmacovigilance'))
  if (!limit.allowed) {
    return {
      ok: false,
      error:
        'Too many submissions from this connection. If this is urgent, please contact us by phone.',
    }
  }

  const db = getServiceClient() ?? (await getServerClient())
  if (!db) {
    return {
      ok: false,
      error:
        'Reports cannot be submitted right now. Please contact us by phone or email so the report is not lost.',
    }
  }

  const record: PharmacovigilanceReportInsert = {
    report_type: data.reportType,
    reporter_name: data.reporterName,
    reporter_email: data.reporterEmail,
    reporter_phone: data.reporterPhone,
    reporter_category: data.reporterCategory,
    product_name: data.productName ?? null,
    batch_number: data.batchNumber ?? null,
    expiry_date: data.expiryDate ?? null,
    event_description: data.eventDescription,
    event_started_on: data.eventStartedOn ?? null,
    patient_age_group: data.patientAgeGroup ?? null,
    patient_sex: data.patientSex ?? null,
    consent: data.consent,
    source_page: data.sourcePage ?? null,
  }

  const { data: inserted, error } = await db
    .from('pharmacovigilance_reports')
    .insert(record)
    .select('id')
    .single()

  if (error || !inserted) {
    // Deliberately minimal: no part of the report is logged.
    console.error('[pharmacovigilance] insert failed', { code: error?.code })
    return {
      ok: false,
      error:
        'We could not record your report. Please contact us by phone or email so it is not lost.',
    }
  }

  const reference = inserted.id.slice(0, 8).toUpperCase()

  const mail = await sendMail({
    subject: `[Pharmacovigilance] New ${data.reportType === 'adverse_event' ? 'adverse event' : 'product complaint'} report ${reference}`,
    text: [
      `A new report has been recorded. Open it in the admin to read the details.`,
      ``,
      `Reference: ${reference}`,
      `Reporter: ${data.reporterName} (${data.reporterCategory})`,
      `Contact: ${data.reporterEmail} / ${data.reporterPhone}`,
    ].join('\n'),
    replyTo: data.reporterEmail,
  })

  if (!mail.delivered) {
    console.warn('[pharmacovigilance] notification not delivered', {
      reference,
      reason: mail.reason,
    })
  }

  return { ok: true, reference }
}
