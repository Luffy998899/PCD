import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { buildMetadata } from '@/lib/seo/metadata'
import { getDosageFormBySlug, getDosageForms, listProducts } from '@/lib/content/products'
import { Container, Section } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { ProductCard } from '@/components/products/product-card'
import { EmptyState } from '@/components/ui/empty-state'
import { LinkButton } from '@/components/ui/button'

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
  const forms = await getDosageForms()
  return forms.map((form) => ({ slug: form.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const form = await getDosageFormBySlug(slug)

  if (!form) {
    return { title: 'Dosage form not found', robots: { index: false, follow: false } }
  }

  return buildMetadata({
    title: `${form.name} products`,
    description:
      form.description ??
      `Products available as ${form.name.toLowerCase()}, with composition, strength and pack details.`,
    path: `/products/dosage-form/${form.slug}`,
  })
}

export default async function DosageFormPage({ params }: { params: Params }) {
  const { slug } = await params
  const form = await getDosageFormBySlug(slug)

  if (!form) notFound()

  const { products } = await listProducts({ dosageForm: form.slug })

  return (
    <>
      <PageHero
        eyebrow="Dosage form"
        title={form.name}
        description={form.description ?? undefined}
        breadcrumbs={[
          { label: 'Products', href: '/products' },
          { label: form.name, href: `/products/dosage-form/${form.slug}` },
        ]}
      />

      <Section spacing="compact">
        <Container>
          {products.length > 0 ? (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <li key={product.id} className="flex">
                  <ProductCard product={product} className="w-full" />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No products published in this dosage form yet"
              description="Products appear here as each entry is verified. Send an enquiry and we will tell you what is available."
              action={
                <LinkButton href="/contact/product-enquiry" size="sm">
                  Send a product enquiry
                </LinkButton>
              }
            />
          )}
        </Container>
      </Section>
    </>
  )
}
