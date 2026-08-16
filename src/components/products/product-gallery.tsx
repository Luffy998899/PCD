'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Pill } from 'lucide-react'

import type { ProductImage } from '@/lib/content/products'
import { cn } from '@/lib/utils'

const IMAGE_TYPE_LABELS: Record<ProductImage['image_type'], string> = {
  pack_front: 'Pack front',
  pack_back: 'Pack back',
  label: 'Label close-up',
  other: 'Additional view',
}

/**
 * Pack image gallery. Thumbnails are real buttons so the gallery is fully
 * keyboard operable, and the selected view is announced.
 */
export function ProductGallery({
  images,
  productName,
}: {
  images: ProductImage[]
  productName: string
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = images[activeIndex] ?? images[0] ?? null

  if (!active) {
    return (
      <div
        className="flex aspect-square w-full items-center justify-center rounded-md border border-border bg-surface-subtle"
        role="img"
        aria-label={`No pack image available for ${productName}`}
      >
        <Pill className="size-10 text-primary/25" aria-hidden="true" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-md border border-border bg-surface">
        <Image
          src={active.image_url}
          alt={active.alt_text}
          fill
          sizes="(min-width: 1024px) 32rem, 90vw"
          className="object-contain p-6"
          priority
        />
      </div>

      {images.length > 1 ? (
        <ul className="flex flex-wrap gap-2">
          {images.map((image, index) => (
            <li key={image.id}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-pressed={index === activeIndex}
                className={cn(
                  'relative size-16 overflow-hidden rounded-sm border bg-surface transition-colors duration-150',
                  index === activeIndex
                    ? 'border-primary'
                    : 'border-border hover:border-primary/50',
                )}
              >
                <Image
                  src={image.image_url}
                  alt=""
                  fill
                  sizes="4rem"
                  className="object-contain p-1.5"
                />
                <span className="sr-only">
                  Show {IMAGE_TYPE_LABELS[image.image_type]} of {productName}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="text-xs text-muted-foreground" aria-live="polite">
        {IMAGE_TYPE_LABELS[active.image_type]}
      </p>
    </div>
  )
}
