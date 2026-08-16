import { MessageCircle } from 'lucide-react'

import { displayName, getSiteSettings } from '@/lib/content/site-settings'
import { getSnapshot } from '@/lib/content/home'
import { whatsappLink } from '@/lib/env'
import { Container, Section } from '@/components/ui/layout'
import { ExternalLinkButton, LinkButton } from '@/components/ui/button'
import { Pending } from '@/components/ui/pending'
import { Card, CardBody } from '@/components/ui/card'

/**
 * Homepage hero (PRD §7, Rules.md §5).
 *
 * Company-first: who this is and what it does, then exactly two buttons —
 * product discovery and enquiry. WhatsApp is a secondary text affordance, not a
 * third button. No offer, countdown, price or ROI language exists here.
 */
export async function HomeHero() {
  const settings = await getSiteSettings()
  const name = displayName(settings)
  const whatsapp = whatsappLink('Hello, I would like to know more about your products.')

  return (
    <section className="border-b border-border bg-surface">
      <Container className="grid gap-10 py-14 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-center lg:gap-16">
        <div className="flex flex-col gap-6">
          <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
            Pharmaceutical manufacturing and distribution
          </p>

          <h1 className="text-[2.25rem] leading-tight sm:text-h1 lg:text-display">
            {name ? (
              <>
                {name}
                {settings.tagline ? (
                  <span className="mt-3 block text-[1.375rem] leading-snug font-normal text-muted-foreground sm:text-h3">
                    {settings.tagline}
                  </span>
                ) : null}
              </>
            ) : (
              <Pending label="Company name and positioning statement" />
            )}
          </h1>

          {settings.short_description ? (
            <p className="max-w-xl text-body-lg text-muted-foreground">
              {settings.short_description}
            </p>
          ) : (
            <Pending label="One-paragraph company description for the homepage hero" />
          )}

          {/* Exactly two buttons (Rules.md §5). */}
          <div className="flex flex-wrap items-center gap-3">
            <LinkButton href="/products" size="lg">
              Find products
            </LinkButton>
            <LinkButton href="/contact" variant="outline" size="lg">
              Send an enquiry
            </LinkButton>
          </div>

          {whatsapp ? (
            <ExternalLinkButton href={whatsapp} variant="ghost" size="sm" className="self-start">
              <MessageCircle className="size-4" aria-hidden="true" />
              Chat on WhatsApp
            </ExternalLinkButton>
          ) : null}
        </div>

        <Card className="bg-primary-soft/60">
          <CardBody className="flex flex-col gap-4">
            <h2 className="font-display text-sm font-semibold tracking-wide text-primary uppercase">
              What you can find here
            </h2>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">Product information</span> —
                composition, strength, pack and prescribing information.
              </li>
              <li>
                <span className="font-medium text-foreground">Manufacturing and quality</span> —
                facilities, testing and certifications with their issuing bodies.
              </li>
              <li>
                <span className="font-medium text-foreground">Distribution</span> — how
                partnership and supply arrangements work.
              </li>
              <li>
                <span className="font-medium text-foreground">Safety reporting</span> — how to
                report a side effect or product complaint.
              </li>
            </ul>
          </CardBody>
        </Card>
      </Container>
    </section>
  )
}

/**
 * Snapshot strip. Rendered only when at least one figure is backed by real
 * records; there is no animation and no rounded-up marketing number.
 */
export async function HomeSnapshot() {
  const snapshot = await getSnapshot()
  if (snapshot.length === 0) return null

  return (
    <Section tone="subtle" spacing="compact">
      <Container>
        <h2 className="sr-only">Company snapshot</h2>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {snapshot.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-1 rounded-md border border-border bg-surface p-5"
            >
              <dd className="font-display text-3xl font-semibold text-primary">{stat.value}</dd>
              <dt className="text-sm text-muted-foreground">{stat.label}</dt>
              {stat.note ? (
                <p className="text-xs text-muted-foreground/80">{stat.note}</p>
              ) : null}
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  )
}
