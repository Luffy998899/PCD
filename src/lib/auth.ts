import 'server-only'

import { redirect } from 'next/navigation'

import { getServerClient, getServiceClient } from '@/lib/supabase/server'
import type { AdminRole, AuditLogInsert } from '@/types/database'

export type AdminSession = {
  userId: string
  email: string
  fullName: string | null
  role: AdminRole
}

/**
 * Server-side authorization (Rules.md §16, Architecture.md §11).
 *
 * Every admin page and every admin mutation calls `requireAdmin` before doing
 * anything. Being signed in is not enough: the user must also have an active
 * row in `admin_users`. The database policies enforce the same rule
 * independently, so a bug here cannot expose data on its own.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const db = await getServerClient()
  if (!db) return null

  const {
    data: { user },
  } = await db.auth.getUser()
  if (!user) return null

  const { data: admin } = await db
    .from('admin_users')
    .select('id, email, full_name, role, is_active')
    .eq('id', user.id)
    .maybeSingle()

  if (!admin || !admin.is_active) return null

  return {
    userId: admin.id,
    email: admin.email,
    fullName: admin.full_name,
    role: admin.role,
  }
}

/** `super_admin` satisfies every role requirement. */
export function hasRole(session: AdminSession, allowed: AdminRole[]): boolean {
  return session.role === 'super_admin' || allowed.includes(session.role)
}

/**
 * Redirects to the login page when there is no admin session, and to the
 * dashboard when the session exists but lacks the required role.
 */
export async function requireAdmin(allowed?: AdminRole[]): Promise<AdminSession> {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')
  if (allowed && !hasRole(session, allowed)) redirect('/admin?denied=1')
  return session
}

/**
 * Records a change for audit (Architecture.md §11, Rules.md §16).
 * Failure to write the audit row is logged but never blocks the operation.
 */
export async function recordAudit(
  session: AdminSession,
  entry: Pick<AuditLogInsert, 'action' | 'entity' | 'entity_id' | 'summary'>,
): Promise<void> {
  const db = getServiceClient() ?? (await getServerClient())
  if (!db) return

  const { error } = await db.from('audit_log').insert({
    actor_id: session.userId,
    actor_email: session.email,
    ...entry,
  })

  if (error) console.warn('[audit] write failed', { entity: entry.entity, code: error.code })
}

export const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: 'Super admin',
  content_admin: 'Content admin',
  sales_admin: 'Sales admin',
  hr_admin: 'HR admin',
  quality_admin: 'Quality admin',
}
