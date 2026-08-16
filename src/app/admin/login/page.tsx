import type { Metadata } from 'next'

import { LoginForm } from '@/components/admin/login-form'
import { Container } from '@/components/ui/layout'
import { Logo } from '@/components/layout/logo'
import { displayName, getSiteSettings } from '@/lib/content/site-settings'

export const metadata: Metadata = {
  title: 'Partner login',
  robots: { index: false, follow: false },
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export default async function AdminLoginPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const settings = await getSiteSettings()
  const unavailable = params.unavailable === '1'

  return (
    <div className="flex min-h-dvh flex-col bg-surface-subtle">
      <header className="border-b border-border bg-surface">
        <Container className="flex h-16 items-center">
          <Logo name={displayName(settings)} />
        </Container>
      </header>

      <main id="main" className="flex flex-1 items-center justify-center px-5 py-14">
        <div className="w-full max-w-md rounded-md border border-border bg-surface p-6 sm:p-8">
          <h1 className="text-h3 text-foreground">Sign in</h1>
          <p className="mt-2 mb-6 text-sm text-muted-foreground">
            This area is for authorised staff. Accounts are created by the company
            administrator.
          </p>
          {unavailable ? (
            <p
              role="alert"
              className="mb-5 rounded-sm border border-warning/40 bg-warning/5 px-4 py-3 text-sm text-warning-strong"
            >
              Sign-in is not available: this deployment has no authentication service
              configured.
            </p>
          ) : null}
          <LoginForm />
        </div>
      </main>
    </div>
  )
}
