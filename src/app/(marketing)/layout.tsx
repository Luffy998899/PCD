import { SiteFooter } from '@/components/layout/footer'
import { SiteHeader } from '@/components/layout/header'
import { CookieConsent } from '@/components/layout/cookie-consent'
import { Analytics } from '@/components/analytics/ga4'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <CookieConsent />
      <Analytics />
    </div>
  )
}
