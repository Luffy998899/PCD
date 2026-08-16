import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

import { headerAction, primaryNavigation } from '@/data/navigation'
import { displayName, getSiteSettings } from '@/lib/content/site-settings'
import { buttonVariants } from '@/components/ui/button'
import { Container } from '@/components/ui/layout'
import { Logo } from '@/components/layout/logo'
import { MobileNav } from '@/components/layout/mobile-nav'

/**
 * Corporate header (Design.md §6).
 *
 * Desktop dropdowns open on hover and on keyboard focus, and every dropdown
 * item is also reachable from the section landing page, so no information
 * depends on hover alone.
 */
export async function SiteHeader() {
  const settings = await getSiteSettings()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-sm">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo name={displayName(settings)} />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center">
            {primaryNavigation.map((group) => (
              <li key={group.label} className="group relative">
                <Link
                  href={group.href}
                  className="flex items-center gap-1 px-3 py-2 text-[0.9375rem] text-muted-foreground transition-colors duration-200 hover:text-primary focus-visible:text-primary"
                >
                  {group.label}
                  {group.links.length > 0 ? (
                    <ChevronDown className="size-3.5 opacity-60" aria-hidden="true" />
                  ) : null}
                </Link>
                {group.links.length > 0 ? (
                  <div className="invisible absolute top-full left-0 z-10 min-w-60 rounded-md border border-border bg-surface p-2 opacity-0 shadow-sm transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
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
          <Link
            href={headerAction.href}
            className={cnHeaderAction}
          >
            {headerAction.label}
          </Link>
          <MobileNav />
        </div>
      </Container>
    </header>
  )
}

const cnHeaderAction = `${buttonVariants({ variant: 'primary', size: 'sm' })} hidden sm:inline-flex`
