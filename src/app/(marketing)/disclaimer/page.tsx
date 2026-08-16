import type { Metadata } from 'next'

import { disclaimer } from '@/data/legal'
import { buildMetadata } from '@/lib/seo/metadata'
import { LegalDocumentPage } from '@/components/sections/legal-document'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: disclaimer.metaTitle,
    description: disclaimer.description,
    path: '/disclaimer',
  })
}

export default function Page() {
  return <LegalDocumentPage document={disclaimer} />
}
