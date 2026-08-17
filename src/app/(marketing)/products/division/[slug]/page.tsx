import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { buildMetadata } from '@/lib/seo/metadata'
import { getDivisionBySlug, getDivisions, listProducts } from '@/lib/content/products'
import { Container, Section } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { ProductCard } from '@/components/products/product-card'
import { EmptyState } from '@/components/ui/empty-state'
import { LinkButton } from '@/components/ui/button'

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
  const divisions = await getDivisions()
  return divisions.map((division) => ({ slug: division.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const division = await getDivisionBySlug(slug)

  if (!division) {
    return { title: 'Division not found', robots: { index: false, follow: false } }
  }

  return buildMetadata({
    title: division.seo_title ?? `${division.name} products`,
    description:
      division.seo_description ??
      division.summary ??
      `Products supplied through our ${division.name} division, with composition, strength and pack details.`,
    path: `/products/division/${division.slug}`,
  })
}

export default async function DivisionProductsPage({ params }: { params: Params }) {
  const { slug } = await params
  const division = await getDivisionBySlug(slug)

  if (!division) notFound()

  const { products } = await listProducts({ division: division.slug })

  return (
    <>
      <PageHero
        eyebrow="Division"
        title={division.name}
        description={division.summary ?? undefined}
        breadcrumbs={[
          { label: 'Products', href: '/products' },
          { label: division.name, href: `/products/division/${division.slug}` },
        ]}
      />

      {division.description ? (
        <Section spacing="compact">
          <Container size="narrow">
            <div className="prose-content">
              {division.description.split(/\n{2,}/).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section spacing="compact">
        <Container>
          {products.length > 0 ? (
            <>
              <h2 className="sr-only">Products in this division</h2>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <li key={product.id} className="flex">
                  <ProductCard product={product} className="w-full" />
                </li>
              ))}
            </ul>
          </>
          ) : (
            <EmptyState
              title="No products published in this division yet"
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
