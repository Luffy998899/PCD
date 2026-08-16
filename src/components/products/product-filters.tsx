import Link from 'next/link'
import { Search, X } from 'lucide-react'

import type { Division, DosageForm, ProductFilters, Therapy } from '@/lib/content/products'
import { Button } from '@/components/ui/button'

/**
 * Product search and filters.
 *
 * A plain GET form: filtering is server-rendered, works without JavaScript,
 * and every combination has a shareable, crawlable URL.
 */
export function ProductFilterBar({
  therapies,
  divisions,
  dosageForms,
  filters,
  total,
}: {
  therapies: Therapy[]
  divisions: Division[]
  dosageForms: DosageForm[]
  filters: ProductFilters
  total: number
}) {
  const hasFilters = Boolean(
    filters.query || filters.therapy || filters.division || filters.dosageForm,
  )

  return (
    <form method="get" action="/products" className="flex flex-col gap-4" role="search">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <label htmlFor="product-search" className="sr-only">
            Search products by brand name or composition
          </label>
          <input
            id="product-search"
            name="q"
            type="search"
            defaultValue={filters.query ?? ''}
            placeholder="Search by brand name or composition"
            className="w-full rounded-sm border border-border bg-surface py-2.5 pr-3 pl-9 text-[0.9375rem] text-foreground placeholder:text-muted-foreground/60 focus-visible:border-primary"
          />
        </div>
        <Button type="submit" size="md">
          Find products
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="filter-therapy" className="text-sm font-medium text-foreground">
            Therapy
          </label>
          <select
            id="filter-therapy"
            name="therapy"
            defaultValue={filters.therapy ?? ''}
            disabled={therapies.length === 0}
            className="rounded-sm border border-border bg-surface px-3 py-2.5 text-sm text-foreground disabled:opacity-60"
          >
            <option value="">All therapies</option>
            {therapies.map((therapy) => (
              <option key={therapy.id} value={therapy.slug}>
                {therapy.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="filter-division" className="text-sm font-medium text-foreground">
            Division
          </label>
          <select
            id="filter-division"
            name="division"
            defaultValue={filters.division ?? ''}
            disabled={divisions.length === 0}
            className="rounded-sm border border-border bg-surface px-3 py-2.5 text-sm text-foreground disabled:opacity-60"
          >
            <option value="">All divisions</option>
            {divisions.map((division) => (
              <option key={division.id} value={division.slug}>
                {division.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="filter-dosage-form" className="text-sm font-medium text-foreground">
            Dosage form
          </label>
          <select
            id="filter-dosage-form"
            name="dosageForm"
            defaultValue={filters.dosageForm ?? ''}
            disabled={dosageForms.length === 0}
            className="rounded-sm border border-border bg-surface px-3 py-2.5 text-sm text-foreground disabled:opacity-60"
          >
            <option value="">All dosage forms</option>
            {dosageForms.map((form) => (
              <option key={form.id} value={form.slug}>
                {form.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {total === 1 ? '1 product' : `${total} products`}
          {hasFilters ? ' matching your filters' : ''}
        </p>
        <div className="flex items-center gap-3">
          <Button type="submit" variant="outline" size="sm">
            Apply filters
          </Button>
          {hasFilters ? (
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
            >
              <X className="size-3.5" aria-hidden="true" />
              Clear all
            </Link>
          ) : null}
        </div>
      </div>
    </form>
  )
}
