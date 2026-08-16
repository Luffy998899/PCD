import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { buildMetadata } from '@/lib/seo/metadata'
import { getDivisionBySlug, getDivisions, listProducts } from '@/lib/content/products'
import { getContentBlocks } from '@/lib/content/blocks'
import { Container, Section, SectionHeader } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { ProductCard } from '@/components/products/product-card'
import { ContentBlocks } from '@/components/sections/content-blocks'
import { LinkButton } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'

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
    title: division.seo_title ?? division.name,
    description: division.seo_description ?? division.summary,
    path: `/divisions/${division.slug}`,
    image: division.hero_image_url,
  })
}

export default async function DivisionPage({ params }: { params: Params }) {
  const { slug } = await params
  const division = await getDivisionBySlug(slug)

  if (!division) notFound()

  const [{ products, total }, blocks] = await Promise.all([
    listProducts({ division: division.slug }),
    getContentBlocks(`division-${division.slug}`),
  ])

  return (
    <>
      <PageHero
        eyebrow="Division"
        title={division.name}
        description={division.summary ?? undefined}
        breadcrumbs={[
          { label: 'Divisions', href: '/divisions' },
          { label: division.name, href: `/divisions/${division.slug}` },
        ]}
      />

      {division.hero_image_url ? (
        <Section spacing="compact">
          <Container>
            <div className="relative aspect-16/7 w-full overflow-hidden rounded-md border border-border bg-surface-subtle">
              <Image
                src={division.hero_image_url}
                alt={division.hero_image_alt ?? `${division.name} division`}
                fill
                sizes="(min-width: 1280px) 1200px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </Container>
        </Section>
      ) : null}

      {division.description || blocks.length > 0 ? (
        <Section spacing="compact">
          <Container size="narrow" className="flex flex-col gap-10">
            {division.description ? (
              <div className="prose-content">
                {division.description.split(/\n{2,}/).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            ) : null}
            {blocks.length > 0 ? <ContentBlocks blocks={blocks} emptyTitle="" /> : null}
          </Container>
        </Section>
      ) : null}

      <Section tone="subtle">
        <Container className="flex flex-col gap-8">
          <SectionHeader
            title={`Products in ${division.name}`}
            description={
              total > 0
                ? `${total} product${total === 1 ? '' : 's'} are supplied through this division.`
                : undefined
            }
          />
          {products.length > 0 ? (
            <>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.slice(0, 8).map((product) => (
                  <li key={product.id} className="flex">
                    <ProductCard product={product} className="w-full" />
                  </li>
                ))}
              </ul>
              <LinkButton href={`/products/division/${division.slug}`} className="self-start">
                View all products
              </LinkButton>
            </>
          ) : (
            <EmptyState
              title="Products for this division are being published"
              description="Send an enquiry and we will share the range available through this division."
            />
          )}
        </Container>
      </Section>

      <Section spacing="compact">
        <Container className="flex flex-col items-start gap-4">
          <SectionHeader
            title="Work with this division"
            description="Tell us your requirement and territory, and we will route your enquiry to the right team."
          />
          <LinkButton href="/contact/business-enquiry">Send a business enquiry</LinkButton>
        </Container>
      </Section>
    </>
  )
}
