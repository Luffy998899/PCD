import type { Metadata } from 'next'

import Link from 'next/link'

import { SiteFooter } from '@/components/layout/footer'
import { SiteHeader } from '@/components/layout/header'
import { LinkButton } from '@/components/ui/button'
import { Container, Section } from '@/components/ui/layout'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" className="flex-1">
        <Section>
          <Container size="narrow" className="flex flex-col items-start gap-5">
            <p className="text-sm font-semibold tracking-[0.14em] text-accent uppercase">
              Error 404
            </p>
            <h1 className="text-[2.125rem] leading-tight sm:text-h1">
              We could not find that page
            </h1>
            <p className="text-muted-foreground">
              The page may have been moved or removed. Use the links below to continue, or
              contact us if you were looking for something specific.
            </p>
            <div className="flex flex-wrap gap-3">
              <LinkButton href="/">Go to homepage</LinkButton>
              <LinkButton href="/contact" variant="outline">
                Contact us
              </LinkButton>
            </div>
            <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <li>
                <Link className="text-primary underline underline-offset-4" href="/products">
                  Products
                </Link>
              </li>
              <li>
                <Link className="text-primary underline underline-offset-4" href="/science-quality">
                  Science &amp; Quality
                </Link>
              </li>
              <li>
                <Link className="text-primary underline underline-offset-4" href="/about">
                  About us
                </Link>
              </li>
              <li>
                <Link className="text-primary underline underline-offset-4" href="/sitemap">
                  Sitemap
                </Link>
              </li>
            </ul>
          </Container>
        </Section>
      </main>
      <SiteFooter />
    </div>
  )
}
