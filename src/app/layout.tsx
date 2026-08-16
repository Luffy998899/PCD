import type { Metadata, Viewport } from 'next'
import { Inter, Manrope } from 'next/font/google'

import '@/styles/globals.css'
import { GOOGLE_SITE_VERIFICATION, SITE_URL } from '@/lib/env'
import { displayName, getSiteSettings } from '@/lib/content/site-settings'
import { withoutPlaceholder } from '@/lib/content/placeholder'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  weight: ['600', '700'],
  variable: '--font-manrope',
})

export const viewport: Viewport = {
  themeColor: '#0b3b5a',
  width: 'device-width',
  initialScale: 1,
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const name = withoutPlaceholder(displayName(settings))

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      // The company name is supplied by the client; until then the template
      // carries only the page title.
      default: name ?? 'Pharmaceutical Company',
      template: name ? `%s | ${name}` : '%s',
    },
    description: withoutPlaceholder(settings.short_description) ?? undefined,
    applicationName: name ?? undefined,
    formatDetection: { telephone: false },
    verification: GOOGLE_SITE_VERIFICATION
      ? { google: GOOGLE_SITE_VERIFICATION }
      : undefined,
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${manrope.variable}`}>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-100 focus:rounded-sm focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
