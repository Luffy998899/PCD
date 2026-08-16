import type { Metadata } from 'next'

import { requireAdmin } from '@/lib/auth'
import { getServerClient } from '@/lib/supabase/server'
import { updateEnquiryStatus } from '@/app/actions/admin'
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

export const metadata: Metadata = { title: 'Enquiries' }

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'closed', label: 'Closed' },
  { value: 'spam', label: 'Spam' },
]

const TYPE_LABELS: Record<string, string> = {
  general: 'General',
  business: 'Business',
  product: 'Product',
  partner: 'Partner',
  grievance: 'Grievance',
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  await requireAdmin(['sales_admin', 'content_admin'])

  const params = await searchParams
  const openId = typeof params.id === 'string' ? params.id : undefined

  const db = await getServerClient()
  const { data: enquiries } = db
    ? await db.from('enquiries').select('*').order('created_at', { ascending: false }).limit(100)
    : { data: null }

  const selected = enquiries?.find((enquiry) => enquiry.id === openId) ?? null

  return (
    <>
      <AdminHeader
        title="Enquiries"
        description="Leads from every public form. Showing the 100 most recent."
      />

      {selected ? (
        <AdminPanel className="mb-6 p-6">
          <h2 className="text-lg text-foreground">
            {selected.name} — {TYPE_LABELS[selected.enquiry_type] ?? selected.enquiry_type}
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
              <dd>
                <a className="text-primary hover:underline" href={`tel:${selected.phone}`}>
                  {selected.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Organisation</dt>
              <dd className="text-foreground">{selected.organisation ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Location</dt>
              <dd className="text-foreground">
                {[selected.city, selected.state, selected.country].filter(Boolean).join(', ') ||
                  '—'}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Product context</dt>
              <dd className="text-foreground">{selected.product_reference ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Source page</dt>
              <dd className="text-foreground">{selected.source_page ?? '—'}</dd>
            </div>
            {selected.utm ? (
              <div className="sm:col-span-2 lg:col-span-3">
                <dt className="text-muted-foreground">Campaign</dt>
                <dd className="font-mono text-xs text-foreground">
                  {Object.entries(selected.utm)
                    .map(([key, value]) => `${key}=${value}`)
                    .join(' · ')}
                </dd>
              </div>
            ) : null}
          </dl>

          <div className="mb-6 rounded-sm border border-border bg-surface-subtle p-4">
            <h3 className="mb-1 text-sm font-semibold text-foreground">Message</h3>
            <p className="text-sm whitespace-pre-line text-muted-foreground">
              {selected.message}
            </p>
          </div>

          <RecordStatusForm
            recordId={selected.id}
            status={selected.status}
            notes={selected.internal_notes}
            options={STATUS_OPTIONS}
            action={updateEnquiryStatus}
          />
        </AdminPanel>
      ) : null}

      <AdminPanel>
        {enquiries && enquiries.length > 0 ? (
          <AdminTable caption="Enquiries received">
            <thead>
              <tr>
                <Th>Received</Th>
                <Th>Type</Th>
                <Th>Name</Th>
                <Th>Contact</Th>
                <Th>Status</Th>
                <Th>Open</Th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((enquiry) => (
                <tr key={enquiry.id}>
                  <Td>{formatDate(enquiry.created_at)}</Td>
                  <Td>{TYPE_LABELS[enquiry.enquiry_type] ?? enquiry.enquiry_type}</Td>
                  <Td className="text-foreground">{enquiry.name}</Td>
                  <Td>
                    {enquiry.email}
                    <br />
                    {enquiry.phone}
                  </Td>
                  <Td>
                    <StatusBadge status={enquiry.status} />
                  </Td>
                  <Td>
                    <a
                      href={`/admin/enquiries?id=${enquiry.id}`}
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
                ? 'No enquiries have been received yet.'
                : 'The database is not configured, so enquiries cannot be listed.'
            }
          />
        )}
      </AdminPanel>
    </>
  )
}
