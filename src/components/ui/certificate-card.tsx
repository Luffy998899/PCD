import { Download, FileCheck2 } from 'lucide-react'

import { type Certificate, isExpired } from '@/lib/content/science'
import { formatDate } from '@/lib/utils'
import { Card, CardBody } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

/**
 * Certificate card (Design.md §12).
 *
 * Shows the certificate name, issuing body, number and validity, with the
 * document where one has been uploaded. This is deliberately not a "trust badge
 * wall": each entry states who issued it and until when.
 */
export function CertificateCard({ certificate }: { certificate: Certificate }) {
  const expired = isExpired(certificate)
  const validUntil = formatDate(certificate.valid_until)
  const issuedOn = formatDate(certificate.issued_on)

  return (
    <Card className="flex flex-col">
      <CardBody className="flex flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <FileCheck2 className="size-5 shrink-0 text-primary" aria-hidden="true" />
          {expired ? (
            <Badge tone="warning">Renewal in progress</Badge>
          ) : validUntil ? (
            <Badge tone="accent">Valid to {validUntil}</Badge>
          ) : null}
        </div>

        <h3 className="text-base text-foreground">{certificate.name}</h3>

        <dl className="flex flex-col gap-1.5 text-sm">
          <div className="flex flex-wrap gap-x-2">
            <dt className="text-muted-foreground">Issued by</dt>
            <dd className="text-foreground">{certificate.issuing_body}</dd>
          </div>
          {certificate.certificate_number ? (
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-muted-foreground">Certificate no.</dt>
              <dd className="font-mono text-foreground">{certificate.certificate_number}</dd>
            </div>
          ) : null}
          {issuedOn ? (
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-muted-foreground">Issued on</dt>
              <dd className="text-foreground">{issuedOn}</dd>
            </div>
          ) : null}
          {certificate.scope ? (
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-muted-foreground">Scope</dt>
              <dd className="text-foreground">{certificate.scope}</dd>
            </div>
          ) : null}
        </dl>

        {certificate.document_url ? (
          <a
            href={certificate.document_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm text-primary underline-offset-4 hover:underline"
          >
            <Download className="size-4" aria-hidden="true" />
            View certificate
            <span className="sr-only">
              {certificate.name} issued by {certificate.issuing_body} (opens in a new tab)
            </span>
          </a>
        ) : null}
      </CardBody>
    </Card>
  )
}
