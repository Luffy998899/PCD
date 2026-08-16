import type { Metadata } from 'next'
import Link from 'next/link'

import { buildMetadata } from '@/lib/seo/metadata'
import {
  getDivisions,
  getDosageForms,
  getTherapies,
  listProducts,
  type ProductFilters,
} from '@/lib/content/products'
import { Container, Section } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { ProductCard } from '@/components/products/product-card'
import { ProductFilterBar } from '@/components/products/product-filters'
import { EmptyState } from '@/components/ui/empty-state'
import { LinkButton } from '@/components/ui/button'
import { TrackView } from '@/components/analytics/ga4'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Products',
    description:
      'Search the product portfolio by brand name or composition, and filter by therapy, division and dosage form.',
    path: '/products',
  })
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>

function first(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value
  const trimmed = raw?.trim()
  return trimmed ? trimmed : undefined
}

/** Preserves the active filters when building pagination links. */
function pageHref(filters: ProductFilters, page: number): string {
  const params = new URLSearchParams()
  if (filters.query) params.set('q', filters.query)
  if (filters.therapy) params.set('therapy', filters.therapy)
  if (filters.division) params.set('division', filters.division)
  if (filters.dosageForm) params.set('dosageForm', filters.dosageForm)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `/products?${query}` : '/products'
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams

  const filters: ProductFilters = {
    query: first(params.q),
    therapy: first(params.therapy),
    division: first(params.division),
    dosageForm: first(params.dosageForm),
    page: Number.parseInt(first(params.page) ?? '1', 10) || 1,
  }

  const [result, therapies, divisions, dosageForms] = await Promise.all([
    listProducts(filters),
    getTherapies(),
    getDivisions(),
    getDosageForms(),
  ])

  const hasFilters = Boolean(
    filters.query || filters.therapy || filters.division || filters.dosageForm,
  )

  return (
    <>
      {filters.query ? (
        <TrackView
          event="product_search"
          params={{ query: filters.query, results: result.total }}
        />
      ) : null}
      <PageHero
        eyebrow="Products"
        title="Product portfolio"
        description="Search by brand name or composition, or filter by therapy, division and dosage form."
        breadcrumbs={[{ label: 'Products', href: '/products' }]}
      />

      <Section spacing="compact">
        <Container>
          <ProductFilterBar
            therapies={therapies}
            divisions={divisions}
            dosageForms={dosageForms}
            filters={filters}
            total={result.total}
          />
        </Container>
      </Section>

      <Section spacing="compact">
        <Container className="flex flex-col gap-8">
          {result.products.length > 0 ? (
            <>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {result.products.map((product) => (
                  <li key={product.id} className="flex">
                    <ProductCard product={product} className="w-full" />
                  </li>
                ))}
              </ul>

              {result.pageCount > 1 ? (
                <nav
                  aria-label="Product listing pages"
                  className="flex items-center justify-between gap-4 border-t border-border pt-6"
                >
                  {result.page > 1 ? (
                    <LinkButton
                      href={pageHref(filters, result.page - 1)}
                      variant="outline"
                      size="sm"
                    >
                      Previous
                    </LinkButton>
                  ) : (
                    <span />
                  )}
                  <p className="text-sm text-muted-foreground">
                    Page {result.page} of {result.pageCount}
                  </p>
                  {result.page < result.pageCount ? (
                    <LinkButton
                      href={pageHref(filters, result.page + 1)}
                      variant="outline"
                      size="sm"
                    >
                      Next
                    </LinkButton>
                  ) : (
                    <span />
                  )}
                </nav>
              ) : null}
            </>
          ) : hasFilters ? (
            <EmptyState
              title="No products match these filters"
              description="Try a different therapy or dosage form, or search by composition instead of brand name."
              action={
                <Link
                  href="/products"
                  className="text-sm text-primary underline underline-offset-4"
                >
                  Clear all filters
                </Link>
              }
            />
          ) : (
            <EmptyState
              title="The product portfolio is being published"
              description="Products appear here as each entry is verified against its approved pack information. Send an enquiry and we will tell you what is available."
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
