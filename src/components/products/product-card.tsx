import Image from 'next/image'
import Link from 'next/link'
import { Pill } from 'lucide-react'

import type { Product } from '@/lib/content/products'
import { Card, CardBody } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

/**
 * Product card (Design.md §10).
 *
 * Hierarchy: image, brand, composition, strength/pack, therapy, link. This is
 * a catalogue entry, not a retail card — no price, no cart, no offer language
 * (Rules.md §4).
 */
export function ProductCard({
  product,
  imageUrl,
  imageAlt,
  className,
}: {
  product: Product
  imageUrl?: string | null
  imageAlt?: string | null
  className?: string
}) {
  return (
    <Card
      interactive
      className={cn('group/card relative flex flex-col overflow-hidden', className)}
    >
      <div className="relative aspect-4/3 w-full overflow-hidden border-b border-border bg-surface-subtle">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt ?? `${product.brand_name} pack`}
            fill
            sizes="(min-width: 1024px) 20rem, (min-width: 640px) 45vw, 90vw"
            className="object-contain p-4 transition-transform duration-300 group-hover/card:scale-[1.03]"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            role="img"
            aria-label={`No pack image available for ${product.brand_name}`}
          >
            <Pill className="size-8 text-primary/25" aria-hidden="true" />
          </div>
        )}
      </div>

      <CardBody className="flex flex-1 flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold text-foreground">
            <Link href={`/products/${product.slug}`} className="hover:text-primary">
              <span className="absolute inset-0" aria-hidden="true" />
              {product.brand_name}
            </Link>
          </h3>
          {/* Composition is what a prescriber scans for, so it gets its own
              labelled line rather than being run together with pack details. */}
          <p className="text-sm leading-snug text-muted-foreground">
            {product.generic_composition}
          </p>
        </div>

        {product.strength || product.pack_size ? (
          <dl className="flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-3 text-xs">
            {product.strength ? (
              <div className="flex gap-1.5">
                <dt className="text-muted-foreground">Strength</dt>
                <dd className="font-medium text-foreground">{product.strength}</dd>
              </div>
            ) : null}
            {product.pack_size ? (
              <div className="flex gap-1.5">
                <dt className="text-muted-foreground">Pack</dt>
                <dd className="font-medium text-foreground">{product.pack_size}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          {product.therapy ? <Badge tone="primary">{product.therapy.name}</Badge> : null}
          {product.dosageForm ? <Badge tone="outline">{product.dosageForm.name}</Badge> : null}
          {product.is_prescription_only ? (
            <span
              className="ml-auto font-mono text-xs font-semibold text-muted-foreground"
              title="Prescription only"
            >
              Rx
            </span>
          ) : null}
        </div>
      </CardBody>
    </Card>
  )
}
