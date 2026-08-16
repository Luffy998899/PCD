import type { Metadata } from 'next'
import Link from 'next/link'

import { getAdminSession, hasRole, ROLE_LABELS } from '@/lib/auth'
import { Container } from '@/components/ui/layout'
import { SignOutButton } from '@/components/admin/sign-out-button'
import type { AdminRole } from '@/types/database'

/**
 * Admin pages are always rendered per-request. Without this, a build performed
 * while Supabase is unconfigured would prerender these routes as static output,
 * which must never happen for authenticated screens.
 */
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | Admin' },
  // The admin area is never indexed.
  robots: { index: false, follow: false },
}

const NAV: { href: string; label: string; roles?: AdminRole[] }[] = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/enquiries', label: 'Enquiries', roles: ['sales_admin', 'content_admin'] },
  { href: '/admin/applications', label: 'Applications', roles: ['hr_admin'] },
  { href: '/admin/safety-reports', label: 'Safety reports', roles: ['quality_admin'] },
  { href: '/admin/products', label: 'Products', roles: ['content_admin'] },
  { href: '/admin/content', label: 'Page content', roles: ['content_admin'] },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession()

  // The login page renders inside this layout too, so an absent session is not
  // an error here — `requireAdmin()` in each page handles the redirect.
  if (!session) return <>{children}</>

  const visible = NAV.filter((item) => !item.roles || hasRole(session, item.roles))

  return (
    <div className="flex min-h-dvh flex-col bg-surface-subtle">
      <header className="border-b border-border bg-surface">
        <Container className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-display font-semibold text-foreground">
              Content admin
            </Link>
            <nav aria-label="Admin">
              <ul className="hidden items-center gap-1 md:flex">
                {visible.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="rounded-sm px-3 py-2 text-sm text-muted-foreground hover:bg-surface-subtle hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {session.fullName ?? session.email} · {ROLE_LABELS[session.role]}
            </span>
            <SignOutButton />
          </div>
        </Container>
      </header>

      <nav aria-label="Admin sections" className="border-b border-border bg-surface md:hidden">
        <Container className="flex gap-1 overflow-x-auto py-2">
          {visible.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-sm px-3 py-2 text-sm text-muted-foreground"
            >
              {item.label}
            </Link>
          ))}
        </Container>
      </nav>

      <main id="main" className="flex-1 py-8">
        <Container>{children}</Container>
      </main>
    </div>
  )
}
