import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo/metadata'
import { getCertificates } from '@/lib/content/science'
import { Container, Section, SectionHeader } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { CertificateCard } from '@/components/ui/certificate-card'
import { EmptyState } from '@/components/ui/empty-state'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Certifications and approvals',
    description:
      'Certificates held by the company, each listed with its issuing body, certificate number and validity.',
    path: '/science-quality/certifications',
  })
}

const CATEGORY_LABELS: Record<string, string> = {
  quality: 'Quality management',
  regulatory: 'Regulatory',
  product: 'Product',
  environment: 'Environment and safety',
  other: 'Other',
}

const CATEGORY_ORDER = ['quality', 'regulatory', 'product', 'environment', 'other'] as const

export default async function CertificationsPage() {
  const certificates = await getCertificates()

  const grouped = CATEGORY_ORDER.map(
    (category) =>
      [category, certificates.filter((certificate) => certificate.category === category)] as const,
  ).filter(([, items]) => items.length > 0)

  return (
    <>
      <PageHero
        eyebrow="Science & quality"
        title="Certifications and approvals"
        description="Every certificate published here names its issuing body and, where applicable, its certificate number and validity. Only certificates the company holds are listed."
        breadcrumbs={[
          { label: 'Science & Quality', href: '/science-quality' },
          { label: 'Certifications', href: '/science-quality/certifications' },
        ]}
      />

      <Section>
        <Container className="flex flex-col gap-12">
          {grouped.length > 0 ? (
            grouped.map(([category, items]) => (
              <div key={category} className="flex flex-col gap-6">
                <SectionHeader title={CATEGORY_LABELS[category] ?? category} as="h2" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((certificate) => (
                    <CertificateCard key={certificate.id} certificate={certificate} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title="No certificates published yet"
              description="Certificates appear here once the document, issuing body and validity have been recorded. We do not display badges for approvals we cannot evidence."
            />
          )}
        </Container>
      </Section>
    </>
  )
}
