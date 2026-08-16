import type { Metadata } from 'next'

import { requireAdmin } from '@/lib/auth'
import { getServerClient } from '@/lib/supabase/server'
import { updateSafetyReportStatus } from '@/app/actions/admin'
import { formatDate } from '@/lib/utils'
import {
  AdminEmpty,
  AdminHeader,
  AdminPanel,
  AdminTable,
  StatusBadge,
  Td,
  Th,
} from '@/components/admin/ui'
import { RecordStatusForm } from '@/components/admin/record-status-form'

export const metadata: Metadata = { title: 'Safety reports' }

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'Under review' },
  { value: 'closed', label: 'Closed' },
  { value: 'spam', label: 'Not a valid report' },
]

type SearchParams = Promise<Record<string, string | string[] | undefined>>

/**
 * Adverse events and product complaints. Restricted to the quality role: a
 * sales admin has no reason to read a patient's clinical narrative.
 */
export default async function AdminSafetyReportsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  await requireAdmin(['quality_admin'])

  const params = await searchParams
  const openId = typeof params.id === 'string' ? params.id : undefined

  const db = await getServerClient()
  const { data: reports } = db
    ? await db
        .from('pharmacovigilance_reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
    : { data: null }

  const selected = reports?.find((report) => report.id === openId) ?? null

  return (
    <>
      <AdminHeader
        title="Safety reports"
        description="Adverse events and product complaints. Handle these under your pharmacovigilance procedure."
      />

      {selected ? (
        <AdminPanel className="mb-6 p-6">
          <h2 className="text-lg text-foreground">
            {selected.report_type === 'adverse_event' ? 'Adverse event' : 'Product complaint'} —{' '}
            {formatDate(selected.created_at)}
          </h2>
          <dl className="my-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-muted-foreground">Reporter</dt>
              <dd className="text-foreground">
                {selected.reporter_name} ({selected.reporter_category.replace(/_/g, ' ')})
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Contact</dt>
              <dd className="text-foreground">
                {selected.reporter_email}
                <br />
                {selected.reporter_phone}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Product</dt>
              <dd className="text-foreground">{selected.product_name ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Batch</dt>
              <dd className="text-foreground">{selected.batch_number ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Expiry</dt>
              <dd className="text-foreground">{selected.expiry_date ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Onset</dt>
              <dd className="text-foreground">{selected.event_started_on ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Patient</dt>
              <dd className="text-foreground">
                {[selected.patient_age_group, selected.patient_sex].filter(Boolean).join(', ') ||
                  '—'}
              </dd>
            </div>
          </dl>

          <div className="mb-6 rounded-sm border border-border bg-surface-subtle p-4">
            <h3 className="mb-1 text-sm font-semibold text-foreground">Event description</h3>
            <p className="text-sm whitespace-pre-line text-muted-foreground">
              {selected.event_description}
            </p>
          </div>

          <RecordStatusForm
            recordId={selected.id}
            status={selected.status}
            notes={selected.internal_notes}
            options={STATUS_OPTIONS}
            action={updateSafetyReportStatus}
          />
        </AdminPanel>
      ) : null}

      <AdminPanel>
        {reports && reports.length > 0 ? (
          <AdminTable caption="Safety reports received">
            <thead>
              <tr>
                <Th>Received</Th>
                <Th>Type</Th>
                <Th>Product</Th>
                <Th>Reporter</Th>
                <Th>Status</Th>
                <Th>Open</Th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <Td>{formatDate(report.created_at)}</Td>
                  <Td>
                    {report.report_type === 'adverse_event' ? 'Adverse event' : 'Complaint'}
                  </Td>
                  <Td className="text-foreground">{report.product_name ?? '—'}</Td>
                  <Td>{report.reporter_name}</Td>
                  <Td>
                    <StatusBadge status={report.status} />
                  </Td>
                  <Td>
                    <a
                      href={`/admin/safety-reports?id=${report.id}`}
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      View
                    </a>
                  </Td>
                </tr>
              ))}
            </tbody>
          </AdminTable>
        ) : (
          <AdminEmpty
            message={
              db
                ? 'No safety reports have been received.'
                : 'The database is not configured, so reports cannot be listed.'
            }
          />
        )}
      </AdminPanel>
    </>
  )
}
