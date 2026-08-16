import type { Metadata } from 'next'

import { antiCounterfeit } from '@/data/legal'
import { buildMetadata } from '@/lib/seo/metadata'
import { LegalDocumentPage } from '@/components/sections/legal-document'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: antiCounterfeit.metaTitle,
    description: antiCounterfeit.description,
    path: '/anti-counterfeit',
  })
}

export default function Page() {
  return <LegalDocumentPage document={antiCounterfeit} />
}
