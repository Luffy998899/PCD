'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { recordAudit, requireAdmin } from '@/lib/auth'
import { getServerClient } from '@/lib/supabase/server'
import type { PublishStatus } from '@/types/database'

/**
 * Admin mutations.
 *
 * Every action re-checks authorization on the server before touching data, and
 * writes an audit row afterwards. The database policies enforce the same rules
 * independently (Rules.md §16).
 */

export type AdminActionResult = { ok: true } | { ok: false; error: string }

const idSchema = z.string().uuid('Invalid record reference')

const enquiryStatusSchema = z.enum(['new', 'in_progress', 'closed', 'spam'])
const applicationStatusSchema = z.enum(['new', 'shortlisted', 'rejected', 'hired', 'spam'])
const publishStatusSchema = z.enum(['draft', 'published', 'archived'])

export async function updateEnquiryStatus(
  id: string,
  status: string,
  notes: string,
): Promise<AdminActionResult> {
  const session = await requireAdmin(['sales_admin', 'content_admin'])

  const parsedId = idSchema.safeParse(id)
  const parsedStatus = enquiryStatusSchema.safeParse(status)
  if (!parsedId.success || !parsedStatus.success) {
    return { ok: false, error: 'That update was not valid.' }
  }

  const db = await getServerClient()
  if (!db) return { ok: false, error: 'The database is unavailable.' }

  const { error } = await db
    .from('enquiries')
    .update({ status: parsedStatus.data, internal_notes: notes.slice(0, 4000) || null })
    .eq('id', parsedId.data)

  if (error) {
    console.error('[admin] enquiry update failed', { code: error.code })
    return { ok: false, error: 'The update could not be saved.' }
  }

  await recordAudit(session, {
    action: 'update_status',
    entity: 'enquiries',
    entity_id: parsedId.data,
    summary: `Status set to ${parsedStatus.data}`,
  })

  revalidatePath('/admin/enquiries')
  return { ok: true }
}

export async function updateApplicationStatus(
  id: string,
  status: string,
  notes: string,
): Promise<AdminActionResult> {
  const session = await requireAdmin(['hr_admin'])

  const parsedId = idSchema.safeParse(id)
  const parsedStatus = applicationStatusSchema.safeParse(status)
  if (!parsedId.success || !parsedStatus.success) {
    return { ok: false, error: 'That update was not valid.' }
  }

  const db = await getServerClient()
  if (!db) return { ok: false, error: 'The database is unavailable.' }

  const { error } = await db
    .from('job_applications')
    .update({ status: parsedStatus.data, internal_notes: notes.slice(0, 4000) || null })
    .eq('id', parsedId.data)

  if (error) return { ok: false, error: 'The update could not be saved.' }

  await recordAudit(session, {
    action: 'update_status',
    entity: 'job_applications',
    entity_id: parsedId.data,
    summary: `Status set to ${parsedStatus.data}`,
  })

  revalidatePath('/admin/applications')
  return { ok: true }
}

export async function updateSafetyReportStatus(
  id: string,
  status: string,
  notes: string,
): Promise<AdminActionResult> {
  const session = await requireAdmin(['quality_admin'])

  const parsedId = idSchema.safeParse(id)
  const parsedStatus = enquiryStatusSchema.safeParse(status)
  if (!parsedId.success || !parsedStatus.success) {
    return { ok: false, error: 'That update was not valid.' }
  }

  const db = await getServerClient()
  if (!db) return { ok: false, error: 'The database is unavailable.' }

  const { error } = await db
    .from('pharmacovigilance_reports')
    .update({ status: parsedStatus.data, internal_notes: notes.slice(0, 4000) || null })
    .eq('id', parsedId.data)

  if (error) return { ok: false, error: 'The update could not be saved.' }

  // The audit summary deliberately carries no clinical detail (Rules.md §18).
  await recordAudit(session, {
    action: 'update_status',
    entity: 'pharmacovigilance_reports',
    entity_id: parsedId.data,
    summary: `Status set to ${parsedStatus.data}`,
  })

  revalidatePath('/admin/safety-reports')
  return { ok: true }
}

/**
 * Publishes or unpublishes a product.
 *
 * Publishing is the moment unverified content would become public, so it is the
 * change most worth auditing.
 */
export async function setProductStatus(
  id: string,
  status: PublishStatus,
): Promise<AdminActionResult> {
  const session = await requireAdmin(['content_admin'])

  const parsedId = idSchema.safeParse(id)
  const parsedStatus = publishStatusSchema.safeParse(status)
  if (!parsedId.success || !parsedStatus.success) {
    return { ok: false, error: 'That update was not valid.' }
  }

  const db = await getServerClient()
  if (!db) return { ok: false, error: 'The database is unavailable.' }

  const { data, error } = await db
    .from('products')
    .update({ status: parsedStatus.data })
    .eq('id', parsedId.data)
    .select('brand_name, slug')
    .single()

  if (error || !data) return { ok: false, error: 'The update could not be saved.' }

  await recordAudit(session, {
    action: parsedStatus.data === 'published' ? 'publish' : 'unpublish',
    entity: 'products',
    entity_id: parsedId.data,
    summary: `${data.brand_name} set to ${parsedStatus.data}`,
  })

  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath(`/products/${data.slug}`)
  return { ok: true }
}

const contentBlockSchema = z.object({
  pageKey: z.string().trim().min(1).max(80),
  blockKey: z.string().trim().min(1).max(80),
  heading: z.string().trim().max(200).optional(),
  body: z.string().trim().max(20000).optional(),
  status: publishStatusSchema,
  sourceReference: z.string().trim().max(300).optional(),
})

/** Creates or updates a page content block. */
export async function saveContentBlock(input: unknown): Promise<AdminActionResult> {
  const session = await requireAdmin(['content_admin'])

  const parsed = contentBlockSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: 'Please check the fields and try again.' }
  }

  const db = await getServerClient()
  if (!db) return { ok: false, error: 'The database is unavailable.' }

  const { pageKey, blockKey, heading, body, status, sourceReference } = parsed.data

  const { error } = await db.from('content_blocks').upsert(
    {
      page_key: pageKey,
      block_key: blockKey,
      heading: heading ?? null,
      body: body ?? null,
      status,
      source_reference: sourceReference ?? null,
    },
    { onConflict: 'page_key,block_key' },
  )

  if (error) {
    console.error('[admin] content block save failed', { code: error.code })
    return { ok: false, error: 'The content could not be saved.' }
  }

  await recordAudit(session, {
    action: status === 'published' ? 'publish' : 'save',
    entity: 'content_blocks',
    entity_id: `${pageKey}/${blockKey}`,
    summary: `Block ${blockKey} on ${pageKey} set to ${status}`,
  })

  revalidatePath('/admin/content')
  return { ok: true }
}

/**
 * Issues a short-lived signed URL for a CV.
 *
 * The bucket is private, so this is the only way to read one, and every issue
 * is audited — downloading someone's CV is an access event worth recording
 * (Rules.md §17).
 */
export async function getCvDownloadUrl(
  applicationId: string,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const session = await requireAdmin(['hr_admin'])

  const parsedId = idSchema.safeParse(applicationId)
  if (!parsedId.success) return { ok: false, error: 'That record reference is not valid.' }

  const db = await getServerClient()
  if (!db) return { ok: false, error: 'The database is unavailable.' }

  const { data: application, error } = await db
    .from('job_applications')
    .select('cv_storage_path, name')
    .eq('id', parsedId.data)
    .maybeSingle()

  if (error || !application?.cv_storage_path) {
    return { ok: false, error: 'No CV is attached to this application.' }
  }

  const { data: signed, error: signError } = await db.storage
    .from('private-documents')
    .createSignedUrl(application.cv_storage_path, 300)

  if (signError || !signed) {
    return { ok: false, error: 'The download link could not be created.' }
  }

  await recordAudit(session, {
    action: 'download_cv',
    entity: 'job_applications',
    entity_id: parsedId.data,
    summary: `CV accessed for ${application.name}`,
  })

  return { ok: true, url: signed.signedUrl }
}
