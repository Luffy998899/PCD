import type { Metadata } from 'next'

import { requireAdmin } from '@/lib/auth'
import { getServerClient } from '@/lib/supabase/server'
import { AdminHeader, AdminPanel } from '@/components/admin/ui'
import { ContentBlockEditor } from '@/components/admin/content-block-editor'

export const metadata: Metadata = { title: 'Page content' }

/**
 * The narrative copy an internal editor can change without a developer.
 *
 * These keys match what the public pages read, so editing here updates the live
 * page directly once the block is published.
 */
const EDITABLE_BLOCKS: { pageKey: string; blockKey: string; label: string; description: string }[] =
  [
    {
      pageKey: 'about-overview',
      blockKey: 'profile',
      label: 'Company overview',
      description: 'Shown on /about/overview and summarised on the homepage.',
    },
    {
      pageKey: 'about-vision-mission',
      blockKey: 'vision',
      label: 'Vision',
      description: 'Shown on /about/vision-mission.',
    },
    {
      pageKey: 'about-vision-mission',
      blockKey: 'mission',
      label: 'Mission',
      description: 'Shown on /about/vision-mission.',
    },
    {
      pageKey: 'science-quality',
      blockKey: 'overview',
      label: 'Science and quality overview',
      description: 'Shown on /science-quality and summarised on the homepage.',
    },
    {
      pageKey: 'science-manufacturing',
      blockKey: 'overview',
      label: 'Manufacturing introduction',
      description: 'Shown above the facility tables on /science-quality/manufacturing.',
    },
    {
      pageKey: 'partner-with-us',
      blockKey: 'who-we-look-for',
      label: 'Partner — who we are looking for',
      description: 'Shown on /network/partner-with-us.',
    },
    {
      pageKey: 'partner-with-us',
      blockKey: 'eligibility',
      label: 'Partner — eligibility and qualification',
      description: 'Shown on /network/partner-with-us.',
    },
    {
      pageKey: 'partner-with-us',
      blockKey: 'documents',
      label: 'Partner — documents required',
      description: 'Shown on /network/partner-with-us.',
    },
    {
      pageKey: 'partner-with-us',
      blockKey: 'support',
      label: 'Partner — support provided',
      description: 'Shown on /network/partner-with-us.',
    },
    {
      pageKey: 'partner-with-us',
      blockKey: 'onboarding',
      label: 'Partner — onboarding process',
      description: 'Shown on /network/partner-with-us.',
    },
    {
      pageKey: 'careers',
      blockKey: 'intro',
      label: 'Careers introduction',
      description: 'Shown on /careers.',
    },
    {
      pageKey: 'careers-life',
      blockKey: 'overview',
      label: 'Life at the company',
      description: 'Shown on /careers/life-at-company.',
    },
  ]

export default async function AdminContentPage() {
  await requireAdmin(['content_admin'])

  const db = await getServerClient()
  const { data: blocks } = db
    ? await db.from('content_blocks').select('*')
    : { data: null }

  const byKey = new Map((blocks ?? []).map((block) => [`${block.page_key}/${block.block_key}`, block]))

  return (
    <>
      <AdminHeader
        title="Page content"
        description="Edit the narrative copy on the public pages. Draft content is never shown publicly."
      />

      {!db ? (
        <AdminPanel className="p-6">
          <p className="text-sm text-muted-foreground">
            The database is not configured, so content cannot be edited on this deployment.
          </p>
        </AdminPanel>
      ) : (
        <AdminPanel>
          {EDITABLE_BLOCKS.map((entry) => (
            <ContentBlockEditor
              key={`${entry.pageKey}/${entry.blockKey}`}
              pageKey={entry.pageKey}
              blockKey={entry.blockKey}
              label={entry.label}
              description={entry.description}
              block={byKey.get(`${entry.pageKey}/${entry.blockKey}`) ?? null}
            />
          ))}
        </AdminPanel>
      )}
    </>
  )
}
