import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { buildMetadata } from '@/lib/seo/metadata'
import { getTherapies, getTherapyBySlug, listProducts } from '@/lib/content/products'
import { Container, Section } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { ProductCard } from '@/components/products/product-card'
import { EmptyState } from '@/components/ui/empty-state'
import { LinkButton } from '@/components/ui/button'

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
  const therapies = await getTherapies()
  return therapies.map((therapy) => ({ slug: therapy.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const therapy = await getTherapyBySlug(slug)

  if (!therapy) {
    return { title: 'Therapy not found', robots: { index: false, follow: false } }
  }

  return buildMetadata({
    title: therapy.seo_title ?? `${therapy.name} products`,
    description:
      therapy.seo_description ??
      therapy.summary ??
      `Products in our ${therapy.name} range, with composition, strength and pack details.`,
    path: `/products/therapy/${therapy.slug}`,
  })
}

export default async function TherapyPage({ params }: { params: Params }) {
  const { slug } = await params
  const therapy = await getTherapyBySlug(slug)

  if (!therapy) notFound()

  const { products } = await listProducts({ therapy: therapy.slug })

  return (
    <>
      <PageHero
        eyebrow="Therapeutic area"
        title={therapy.name}
        description={therapy.summary ?? undefined}
        breadcrumbs={[
          { label: 'Products', href: '/products' },
          { label: therapy.name, href: `/products/therapy/${therapy.slug}` },
        ]}
      />

      {therapy.description ? (
        <Section spacing="compact">
          <Container size="narrow">
            <div className="prose-content">
              {therapy.description.split(/\n{2,}/).map((paragraph, index) => (
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
              <h2 className="sr-only">Products in this therapy</h2>
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
              title="No products published in this therapy yet"
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
