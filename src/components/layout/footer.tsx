import Link from 'next/link'
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'

import { legalNavigation } from '@/data/navigation'
import { getFooterColumns } from '@/lib/content/navigation'
import { displayName, getSiteSettings } from '@/lib/content/site-settings'
import { FOOTER_SAFETY_STATEMENT } from '@/lib/constants'
import { whatsappLink } from '@/lib/env'
import { Container } from '@/components/ui/layout'
import { Logo } from '@/components/layout/logo'
import { Pending } from '@/components/ui/pending'
import { CookieSettingsButton } from '@/components/layout/cookie-consent'
import { WhatsAppTextLink } from '@/components/analytics/whatsapp-link'

function StatutoryRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex flex-wrap gap-x-2 text-sm">
      <span className="text-primary-foreground/60">{label}</span>
      {value ? (
        <span className="text-primary-foreground/90">{value}</span>
      ) : (
        <Pending label={label} />
      )}
    </div>
  )
}

export async function SiteFooter() {
  const [settings, columns] = await Promise.all([getSiteSettings(), getFooterColumns()])
  const name = displayName(settings)
  const whatsapp = whatsappLink()

  return (
    <footer className="bg-primary text-primary-foreground">
      <Container className="py-14 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_1fr]">
          <div className="flex flex-col gap-5">
            <Logo name={name} tagline={settings.tagline} tone="inverse" />
            {settings.short_description ? (
              <p className="max-w-sm text-sm text-primary-foreground/70">
                {settings.short_description}
              </p>
            ) : null}

            <address className="flex flex-col gap-3 text-sm not-italic text-primary-foreground/80">
              <div className="flex gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 opacity-70" aria-hidden="true" />
                {settings.registered_address ? (
                  <span className="whitespace-pre-line">{settings.registered_address}</span>
                ) : (
                  <Pending label="Registered office address" />
                )}
              </div>
              <div className="flex gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0 opacity-70" aria-hidden="true" />
                {settings.primary_email ? (
                  <a className="hover:underline" href={`mailto:${settings.primary_email}`}>
                    {settings.primary_email}
                  </a>
                ) : (
                  <Pending label="Official email" />
                )}
              </div>
              <div className="flex gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0 opacity-70" aria-hidden="true" />
                {settings.primary_phone ? (
                  <a className="hover:underline" href={`tel:${settings.primary_phone}`}>
                    {settings.primary_phone}
                  </a>
                ) : (
                  <Pending label="Official phone number" />
                )}
              </div>
              {whatsapp ? (
                <div className="flex gap-2.5">
                  <MessageCircle className="mt-0.5 size-4 shrink-0 opacity-70" aria-hidden="true" />
                  <WhatsAppTextLink href={whatsapp} className="hover:underline" />
                </div>
              ) : null}
            </address>
          </div>

          <nav aria-label="Footer" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {columns.map((column) => (
              <div key={column.label}>
                <h2 className="font-display text-sm font-semibold tracking-wide text-primary-foreground uppercase">
                  {column.label}
                </h2>
                <ul className="mt-3 flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-primary-foreground/70 transition-colors duration-200 hover:text-primary-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 grid gap-4 border-t border-primary-foreground/15 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          <StatutoryRow label="Legal name" value={settings.legal_name} />
          <StatutoryRow label="CIN" value={settings.cin} />
          <StatutoryRow label="GST" value={settings.gst} />
          <StatutoryRow label="Drug Licence" value={settings.drug_licence_number} />
        </div>

        <p className="mt-8 rounded-md border border-primary-foreground/15 bg-primary-foreground/5 px-4 py-3 text-sm text-primary-foreground/85">
          {FOOTER_SAFETY_STATEMENT}
        </p>
      </Container>

      <div className="border-t border-primary-foreground/15">
        <Container className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} {name ?? <Pending label="Legal company name" />}. All
            rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalNavigation.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-primary-foreground/70 transition-colors duration-200 hover:text-primary-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <CookieSettingsButton className="text-sm text-primary-foreground/70 underline-offset-4 transition-colors duration-200 hover:text-primary-foreground hover:underline" />
            </li>
          </ul>
        </Container>
      </div>
    </footer>
  )
}
