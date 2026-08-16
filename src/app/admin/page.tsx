import Link from 'next/link'

import { hasRole, requireAdmin } from '@/lib/auth'
import { getServerClient } from '@/lib/supabase/server'
import { IS_PRODUCTION_CONTENT } from '@/lib/env'
import { formatDate } from '@/lib/utils'
import { AdminHeader, AdminPanel } from '@/components/admin/ui'

/** Counts the rows a role is allowed to see; returns null when not permitted. */
async function countRows(
  table: 'enquiries' | 'job_applications' | 'pharmacovigilance_reports' | 'products' | 'articles',
  filter: { column: string; value: string },
): Promise<number | null> {
  const db = await getServerClient()
  if (!db) return null

  const { count, error } = await db
    .from(table)
    .select('id', { count: 'exact', head: true })
    .eq(filter.column, filter.value)

  if (error) return null
  return count ?? 0
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const session = await requireAdmin()
  const params = await searchParams
  const denied = params.denied === '1'

  const canSeeLeads = hasRole(session, ['sales_admin', 'content_admin'])
  const canSeeApplications = hasRole(session, ['hr_admin'])
  const canSeeReports = hasRole(session, ['quality_admin'])
  const canSeeContent = hasRole(session, ['content_admin'])

  const [newEnquiries, newApplications, newReports, draftProducts, draftArticles] =
    await Promise.all([
      canSeeLeads ? countRows('enquiries', { column: 'status', value: 'new' }) : null,
      canSeeApplications
        ? countRows('job_applications', { column: 'status', value: 'new' })
        : null,
      canSeeReports
        ? countRows('pharmacovigilance_reports', { column: 'status', value: 'new' })
        : null,
      canSeeContent ? countRows('products', { column: 'status', value: 'draft' }) : null,
      canSeeContent ? countRows('articles', { column: 'status', value: 'draft' }) : null,
    ])

  const cards = [
    { label: 'New enquiries', value: newEnquiries, href: '/admin/enquiries' },
    { label: 'New applications', value: newApplications, href: '/admin/applications' },
    { label: 'New safety reports', value: newReports, href: '/admin/safety-reports' },
    { label: 'Draft products', value: draftProducts, href: '/admin/products' },
    { label: 'Draft articles', value: draftArticles, href: '/admin/content' },
  ].filter((card) => card.value !== null)

  return (
    <>
      <AdminHeader
        title={`Welcome, ${session.fullName ?? session.email}`}
        description={`Signed in on ${formatDate(new Date())}. You see only the sections your role covers.`}
      />

      {denied ? (
        <p
          role="alert"
          className="mb-6 rounded-md border border-warning/40 bg-warning/5 px-4 py-3 text-sm text-warning-strong"
        >
          Your role does not have access to that section.
        </p>
      ) : null}

      {!IS_PRODUCTION_CONTENT ? (
        <p className="mb-6 rounded-md border border-info/40 bg-info/5 px-4 py-3 text-sm text-info">
          This deployment is not marked as production, so unresolved
          <span className="font-mono"> [CLIENT TO PROVIDE] </span>
          markers are visible on the public site. Set
          <span className="font-mono"> NEXT_PUBLIC_APP_ENV=production </span>
          before launch.
        </p>
      ) : null}

      {cards.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <Link key={card.label} href={card.href}>
              <AdminPanel className="p-5 transition-colors duration-200 hover:border-primary">
                <p className="font-display text-3xl font-semibold text-primary">{card.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{card.label}</p>
              </AdminPanel>
            </Link>
          ))}
        </div>
      ) : (
        <AdminPanel className="p-6">
          <p className="text-sm text-muted-foreground">
            No sections are available for your role yet. Contact the company administrator if you
            believe this is wrong.
          </p>
        </AdminPanel>
      )}
    </>
  )
}
