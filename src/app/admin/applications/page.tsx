import type { Metadata } from 'next'

import { requireAdmin } from '@/lib/auth'
import { getServerClient } from '@/lib/supabase/server'
import { updateApplicationStatus } from '@/app/actions/admin'
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
import { CvDownloadButton } from '@/components/admin/cv-download-button'

export const metadata: Metadata = { title: 'Applications' }

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'rejected', label: 'Not selected' },
  { value: 'hired', label: 'Hired' },
  { value: 'spam', label: 'Spam' },
]

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  await requireAdmin(['hr_admin'])

  const params = await searchParams
  const openId = typeof params.id === 'string' ? params.id : undefined

  const db = await getServerClient()
  const { data: applications } = db
    ? await db
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
    : { data: null }

  const selected = applications?.find((application) => application.id === openId) ?? null

  return (
    <>
      <AdminHeader
        title="Applications"
        description="Career applications. CVs are stored privately and opened through a short-lived link."
      />

      {selected ? (
        <AdminPanel className="mb-6 p-6">
          <h2 className="text-lg text-foreground">
            {selected.name} — {selected.applied_for}
          </h2>
          <dl className="my-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd>
                <a className="text-primary hover:underline" href={`mailto:${selected.email}`}>
                  {selected.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Phone</dt>
              <dd className="text-foreground">{selected.phone}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Location</dt>
              <dd className="text-foreground">{selected.current_location ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Experience</dt>
              <dd className="text-foreground">
                {selected.experience_years !== null ? `${selected.experience_years} years` : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Current employer</dt>
              <dd className="text-foreground">{selected.current_employer ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Notice period</dt>
              <dd className="text-foreground">{selected.notice_period ?? '—'}</dd>
            </div>
          </dl>

          {selected.message ? (
            <div className="mb-6 rounded-sm border border-border bg-surface-subtle p-4">
              <h3 className="mb-1 text-sm font-semibold text-foreground">Message</h3>
              <p className="text-sm whitespace-pre-line text-muted-foreground">
                {selected.message}
              </p>
            </div>
          ) : null}

          {selected.cv_storage_path ? (
            <div className="mb-6">
              <CvDownloadButton applicationId={selected.id} />
            </div>
          ) : null}

          <RecordStatusForm
            recordId={selected.id}
            status={selected.status}
            notes={selected.internal_notes}
            options={STATUS_OPTIONS}
            action={updateApplicationStatus}
          />
        </AdminPanel>
      ) : null}

      <AdminPanel>
        {applications && applications.length > 0 ? (
          <AdminTable caption="Career applications received">
            <thead>
              <tr>
                <Th>Received</Th>
                <Th>Applicant</Th>
                <Th>Role</Th>
                <Th>Experience</Th>
                <Th>Status</Th>
                <Th>Open</Th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application.id}>
                  <Td>{formatDate(application.created_at)}</Td>
                  <Td className="text-foreground">{application.name}</Td>
                  <Td>{application.applied_for}</Td>
                  <Td>
                    {application.experience_years !== null
                      ? `${application.experience_years} yrs`
                      : '—'}
                  </Td>
                  <Td>
                    <StatusBadge status={application.status} />
                  </Td>
                  <Td>
                    <a
                      href={`/admin/applications?id=${application.id}`}
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
                ? 'No applications have been received.'
                : 'The database is not configured, so applications cannot be listed.'
            }
          />
        )}
      </AdminPanel>
    </>
  )
}
