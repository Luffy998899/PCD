import type { Metadata } from 'next'

import { termsOfUse } from '@/data/legal'
import { buildMetadata } from '@/lib/seo/metadata'
import { LegalDocumentPage } from '@/components/sections/legal-document'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: termsOfUse.metaTitle,
    description: termsOfUse.description,
    path: '/terms',
  })
}

export default function Page() {
  return <LegalDocumentPage document={termsOfUse} />
}
