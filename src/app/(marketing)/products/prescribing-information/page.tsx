import type { Metadata } from 'next'
import Link from 'next/link'
import { Download } from 'lucide-react'

import { buildMetadata } from '@/lib/seo/metadata'
import { getProductsWithPrescribingInformation } from '@/lib/content/products'
import { MEDICINE_SAFETY_STATEMENT } from '@/lib/constants'
import { Container, Section } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { EmptyState } from '@/components/ui/empty-state'
import { LinkButton } from '@/components/ui/button'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Prescribing information',
    description:
      'Prescribing information documents for products where they are available, for healthcare professionals.',
    path: '/products/prescribing-information',
  })
}

export default async function PrescribingInformationPage() {
  const products = await getProductsWithPrescribingInformation()

  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Prescribing information"
        description="Approved prescribing information for our products, intended for healthcare professionals."
        breadcrumbs={[
          { label: 'Products', href: '/products' },
          { label: 'Prescribing Information', href: '/products/prescribing-information' },
        ]}
      />

      <Section>
        <Container className="flex flex-col gap-6">
          <p className="rounded-md border border-border bg-surface-subtle px-4 py-3 text-sm text-foreground">
            These documents summarise approved product information. They do not replace the pack
            insert or professional judgement. {MEDICINE_SAFETY_STATEMENT}
          </p>

          {products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[36rem] border-collapse text-sm">
                <caption className="sr-only">
                  Products with prescribing information available for download
                </caption>
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="border border-border bg-surface-subtle px-3 py-2 text-left font-semibold text-foreground"
                    >
                      Brand
                    </th>
                    <th
                      scope="col"
                      className="border border-border bg-surface-subtle px-3 py-2 text-left font-semibold text-foreground"
                    >
                      Composition
                    </th>
                    <th
                      scope="col"
                      className="border border-border bg-surface-subtle px-3 py-2 text-left font-semibold text-foreground"
                    >
                      Document
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <th
                        scope="row"
                        className="border border-border px-3 py-2 text-left font-medium"
                      >
                        <Link
                          href={`/products/${product.slug}`}
                          className="text-primary underline-offset-4 hover:underline"
                        >
                          {product.brand_name}
                        </Link>
                      </th>
                      <td className="border border-border px-3 py-2 text-muted-foreground">
                        {product.generic_composition}
                      </td>
                      <td className="border border-border px-3 py-2">
                        <a
                          href={product.prescribing_information_url!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-primary underline-offset-4 hover:underline"
                        >
                          <Download className="size-4" aria-hidden="true" />
                          Download
                          <span className="sr-only">
                            prescribing information for {product.brand_name} (opens in a new tab)
                          </span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No prescribing information published yet"
              description="Documents are published against each product once approved. Healthcare professionals can request information directly in the meantime."
              action={
                <LinkButton href="/contact/product-enquiry" size="sm">
                  Request product information
                </LinkButton>
              }
            />
          )}
        </Container>
      </Section>
    </>
  )
}
