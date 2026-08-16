import { Download as DownloadIcon } from 'lucide-react'

import type { Download } from '@/lib/content/media'
import { formatDate } from '@/lib/utils'
import { Card, CardBody, CardTitle } from '@/components/ui/card'

function formatSize(sizeKb: number | null): string | null {
  if (!sizeKb) return null
  return sizeKb >= 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`
}

/**
 * Download card. The file type and size are stated up front so nobody opens a
 * large file unexpectedly on a mobile connection.
 */
export function DownloadCard({ download }: { download: Download }) {
  const size = formatSize(download.file_size_kb)
  const updated = formatDate(download.updated_on)
  const meta = [download.file_type.toUpperCase(), size].filter(Boolean).join(' · ')

  return (
    <Card className="flex flex-col">
      <CardBody className="flex flex-1 flex-col gap-2">
        <DownloadIcon className="size-5 text-primary" aria-hidden="true" />
        <CardTitle as="h3" className="text-base">
          {download.title}
        </CardTitle>
        {download.description ? (
          <p className="text-sm text-muted-foreground">{download.description}</p>
        ) : null}
        <p className="text-xs text-muted-foreground">
          {meta}
          {updated ? ` · Updated ${updated}` : ''}
        </p>
        <a
          href={download.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm text-primary underline-offset-4 hover:underline"
        >
          Download
          <span className="sr-only">
            {download.title}
            {meta ? `, ${meta}` : ''} (opens in a new tab)
          </span>
        </a>
      </CardBody>
    </Card>
  )
}
