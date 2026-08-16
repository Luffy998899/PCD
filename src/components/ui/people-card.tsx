import Image from 'next/image'
import { Linkedin } from 'lucide-react'

import type { Person } from '@/lib/content/about'
import { cn } from '@/lib/utils'
import { Card, CardBody } from '@/components/ui/card'

/**
 * Editorial profile card (Design.md §13).
 *
 * When no photograph has been supplied the card shows a neutral monogram.
 * A stock portrait is never used to stand in for a named individual
 * (Rules.md §14).
 */
export function PeopleCard({
  person,
  className,
  showBio = true,
}: {
  person: Person
  className?: string
  showBio?: boolean
}) {
  const initials = person.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return (
    <Card className={cn('flex flex-col overflow-hidden', className)}>
      <div className="relative aspect-4/5 w-full bg-surface-subtle">
        {person.photo_url ? (
          <Image
            src={person.photo_url}
            alt={person.photo_alt ?? `${person.name}, ${person.designation}`}
            fill
            sizes="(min-width: 1024px) 20rem, (min-width: 640px) 45vw, 90vw"
            className="object-cover"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            role="img"
            aria-label={`No photograph available for ${person.name}`}
          >
            <span className="font-display text-3xl font-semibold text-primary/30">{initials}</span>
          </div>
        )}
      </div>

      <CardBody className="flex flex-1 flex-col gap-1.5">
        <h3 className="text-base text-foreground">{person.name}</h3>
        <p className="text-sm font-medium text-primary">{person.designation}</p>
        {person.qualification ? (
          <p className="text-xs text-muted-foreground">{person.qualification}</p>
        ) : null}
        {showBio && person.bio ? (
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{person.bio}</p>
        ) : null}
        {person.linkedin_url ? (
          <a
            href={person.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline"
          >
            <Linkedin className="size-4" aria-hidden="true" />
            LinkedIn profile
            <span className="sr-only">for {person.name} (opens in a new tab)</span>
          </a>
        ) : null}
      </CardBody>
    </Card>
  )
}
