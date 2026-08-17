import Link from 'next/link'
import { ArrowRight, FileCheck2, FlaskConical, PackageSearch, ShieldAlert } from 'lucide-react'

import { displayName, getSiteSettings } from '@/lib/content/site-settings'
import { getSnapshot } from '@/lib/content/home'
import { getCertificates } from '@/lib/content/science'
import { whatsappLink } from '@/lib/env'
import { Container, Section } from '@/components/ui/layout'
import { LinkButton } from '@/components/ui/button'
import { WhatsAppLink } from '@/components/analytics/whatsapp-link'
import { Pending } from '@/components/ui/pending'

/**
 * Homepage hero (PRD §7, Rules.md §5).
 *
 * Company-first, then exactly two buttons — product discovery and enquiry.
 * WhatsApp is a secondary text affordance, never a third button.
 *
 * The right-hand panel is a "proof card": the things a prescriber or a
 * distributor actually checks before trusting a manufacturer, drawn from real
 * records rather than decorated with marketing claims. It is the hero's visual
 * anchor, which keeps the section credible without a stock photograph.
 */
export async function HomeHero() {
  const [settings, certificates] = await Promise.all([getSiteSettings(), getCertificates()])
  const name = displayName(settings)
  const whatsapp = whatsappLink('Hello, I would like to know more about your products.')

  const primaryCertificate = certificates.find(
    (certificate) => certificate.category === 'quality' && certificate.certificate_number,
  )

  return (
    <section className="relative overflow-hidden border-b border-border bg-surface">
      {/* Signature motif, faint enough to read as paper rather than pattern. */}
      <div className="blueprint pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-linear-to-l from-primary-soft/50 to-transparent lg:block"
        aria-hidden="true"
      />

      <Container className="relative grid gap-12 py-16 md:py-24 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-20">
        <div className="flex flex-col gap-7">
          <p className="rule-accent text-xs font-semibold tracking-[0.16em] text-accent-strong uppercase">
            Pharmaceutical manufacturing &amp; distribution
          </p>

          <div>
            <h1 className="text-[2.5rem] leading-[1.05] font-semibold tracking-tight text-foreground sm:text-[3.25rem] lg:text-[3.75rem]">
              {name ?? <Pending label="Company name" />}
            </h1>
            {settings.tagline ? (
              <p className="mt-4 max-w-xl text-[1.375rem] leading-snug text-primary sm:text-[1.5rem]">
                {settings.tagline}
              </p>
            ) : null}
          </div>

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
              <PackageSearch className="size-4" aria-hidden="true" />
              Find products
            </LinkButton>
            <LinkButton href="/contact" variant="outline" size="lg">
              Send an enquiry
            </LinkButton>
          </div>

          {whatsapp ? (
            <WhatsAppLink href={whatsapp} context="home_hero" className="-ml-3 self-start" />
          ) : null}
        </div>

        {/* Proof card */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-lg border border-border bg-primary text-primary-foreground shadow-xl shadow-primary/10">
            <div className="blister pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

            <div className="relative border-b border-primary-foreground/15 px-6 py-5">
              <p className="text-xs font-semibold tracking-[0.16em] text-primary-foreground/60 uppercase">
                What you can verify here
              </p>
            </div>

            <ul className="relative divide-y divide-primary-foreground/10">
              <ProofRow
                icon={<PackageSearch className="size-4" aria-hidden="true" />}
                title="Every product, in full"
                detail="Composition, strength, pack and prescribing information — not a brochure list."
                href="/products"
                linkLabel="Search the portfolio"
              />
              <ProofRow
                icon={<FileCheck2 className="size-4" aria-hidden="true" />}
                title="Certificates with numbers"
                detail={
                  primaryCertificate
                    ? `${primaryCertificate.name} · ${primaryCertificate.issuing_body}`
                    : 'Each certificate lists its issuing body, number and validity.'
                }
                href="/science-quality/certifications"
                linkLabel="View certifications"
              />
              <ProofRow
                icon={<FlaskConical className="size-4" aria-hidden="true" />}
                title="How each batch is tested"
                detail="Raw material, in-process and finished product, with stability studies behind them."
                href="/science-quality/quality"
                linkLabel="See our quality process"
              />
              <ProofRow
                icon={<ShieldAlert className="size-4" aria-hidden="true" />}
                title="A route to report a problem"
                detail="Side effects and quality complaints reach the pharmacovigilance team directly."
                href="/science-quality/pharmacovigilance"
                linkLabel="Report a side effect"
              />
            </ul>
          </div>
        </div>
      </Container>
    </section>
  )
}

function ProofRow({
  icon,
  title,
  detail,
  href,
  linkLabel,
}: {
  icon: React.ReactNode
  title: string
  detail: string
  href: string
  linkLabel: string
}) {
  return (
    <li className="group/row relative transition-colors duration-200 hover:bg-primary-foreground/5">
      <Link href={href} className="flex gap-4 px-6 py-4">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-sm bg-primary-foreground/10 text-primary-foreground">
          {icon}
        </span>
        <span className="flex min-w-0 flex-col gap-1">
          <span className="font-medium text-primary-foreground">{title}</span>
          <span className="text-sm text-primary-foreground/70">{detail}</span>
          <span className="mt-1 inline-flex items-center gap-1 text-sm text-primary-foreground/90">
            {linkLabel}
            <ArrowRight
              className="size-3.5 transition-transform duration-200 group-hover/row:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </span>
      </Link>
    </li>
  )
}

/**
 * Snapshot strip. Rendered only when at least one figure is backed by real
 * records. Divided by hairline rules rather than boxed cards, so it reads as a
 * single statement of scale — and nothing animates (Design.md §8).
 */
export async function HomeSnapshot() {
  const snapshot = await getSnapshot()
  if (snapshot.length === 0) return null

  return (
    <Section tone="subtle" spacing="compact" className="border-b border-border">
      <Container>
        <h2 className="sr-only">Company snapshot</h2>
        <dl className="grid divide-y divide-border sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
          {snapshot.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex flex-col gap-1 py-5 sm:px-6 sm:py-2 ${
                index > 0 ? 'sm:border-l sm:border-border' : ''
              } ${index === 0 ? 'sm:pl-0' : ''}`}
            >
              <dd className="font-display text-[2.5rem] leading-none font-semibold tracking-tight text-primary">
                {stat.value}
              </dd>
              <dt className="text-sm font-medium text-foreground">{stat.label}</dt>
              {stat.note ? <p className="text-xs text-muted-foreground">{stat.note}</p> : null}
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  )
}
