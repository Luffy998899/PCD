import type { Metadata } from 'next'

import { privacyPolicy } from '@/data/legal'
import { buildMetadata } from '@/lib/seo/metadata'
import { LegalDocumentPage } from '@/components/sections/legal-document'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: privacyPolicy.metaTitle,
    description: privacyPolicy.description,
    path: '/privacy-policy',
  })
}

export default function Page() {
  return <LegalDocumentPage document={privacyPolicy} />
}
