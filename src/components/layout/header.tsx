import Link from 'next/link'
import { ChevronDown, Mail, Phone, ShieldAlert } from 'lucide-react'

import { headerAction } from '@/data/navigation'
import { getPrimaryNavigation } from '@/lib/content/navigation'
import { displayName, getSiteSettings } from '@/lib/content/site-settings'
import { buttonVariants } from '@/components/ui/button'
import { Container } from '@/components/ui/layout'
import { Logo } from '@/components/layout/logo'
import { MobileNav } from '@/components/layout/mobile-nav'

/**
 * Corporate header (Design.md §6).
 *
 * Two tiers: a slim utility bar carrying the contact routes a visitor may need
 * urgently — including the adverse-event route, which a pharmaceutical site
 * should never bury — and the main navigation below it.
 *
 * Desktop dropdowns open on hover and on keyboard focus, and every dropdown
 * item is also reachable from its section landing page, so no information
 * depends on hover alone.
 */
export async function SiteHeader() {
  const [settings, navigation] = await Promise.all([getSiteSettings(), getPrimaryNavigation()])

  return (
    <header className="sticky top-0 z-50">
      {/* Utility bar */}
      <div className="hidden border-b border-primary-dark/40 bg-primary text-primary-foreground lg:block">
        <Container className="flex h-9 items-center justify-between gap-6 text-xs">
          <div className="flex items-center gap-5">
            {settings.primary_phone ? (
              <a
                href={`tel:${settings.primary_phone}`}
                className="inline-flex items-center gap-1.5 text-primary-foreground/80 transition-colors hover:text-primary-foreground"
              >
                <Phone className="size-3.5" aria-hidden="true" />
                {settings.primary_phone}
              </a>
            ) : null}
            {settings.primary_email ? (
              <a
                href={`mailto:${settings.primary_email}`}
                className="inline-flex items-center gap-1.5 text-primary-foreground/80 transition-colors hover:text-primary-foreground"
              >
                <Mail className="size-3.5" aria-hidden="true" />
                {settings.primary_email}
              </a>
            ) : null}
          </div>
          <Link
            href="/science-quality/pharmacovigilance"
            className="inline-flex items-center gap-1.5 text-primary-foreground/80 underline-offset-4 transition-colors hover:text-primary-foreground hover:underline"
          >
            <ShieldAlert className="size-3.5" aria-hidden="true" />
            Report a side effect
          </Link>
        </Container>
      </div>

      {/* Main bar */}
      <div className="border-b border-border bg-surface/95 backdrop-blur-sm">
        <Container className="flex h-16 items-center justify-between gap-4">
          <Logo name={displayName(settings)} />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center">
              {navigation.map((group) => (
                <li key={group.label} className="group relative">
                  <Link
                    href={group.href}
                    className="flex items-center gap-1 px-3 py-5 text-[0.9375rem] text-muted-foreground transition-colors duration-200 hover:text-primary focus-visible:text-primary"
                  >
                    {group.label}
                    {group.links.length > 0 ? (
                      <ChevronDown
                        className="size-3.5 opacity-60 transition-transform duration-200 group-hover:rotate-180"
                        aria-hidden="true"
                      />
                    ) : null}
                  </Link>
                  {group.links.length > 0 ? (
                    <div className="invisible absolute top-full left-0 z-10 min-w-64 -translate-y-1 rounded-md border border-border bg-surface p-2 opacity-0 shadow-lg shadow-foreground/5 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      {/* Accent edge ties the dropdown to the section it belongs to. */}
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 h-0.5 rounded-t-md bg-accent-strong"
                      />
                      <ul>
                        {group.links.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              className="block rounded-sm px-3 py-2 text-sm text-muted-foreground transition-colors duration-150 hover:bg-surface-subtle hover:text-primary"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Link href={headerAction.href} className={headerActionClasses}>
              {headerAction.label}
            </Link>
            <MobileNav groups={navigation} />
          </div>
        </Container>
      </div>
    </header>
  )
}

const headerActionClasses = `${buttonVariants({ variant: 'primary', size: 'sm' })} hidden sm:inline-flex`
