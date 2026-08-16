import type { Metadata } from 'next'
import Link from 'next/link'

import { legalNavigation } from '@/data/navigation'
import { getPrimaryNavigation } from '@/lib/content/navigation'
import { buildMetadata } from '@/lib/seo/metadata'
import { Container, Section } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Sitemap',
    description: 'Every section of this website, listed on one page.',
    path: '/sitemap',
  })
}

/**
 * Human-readable sitemap. The machine-readable XML sitemap is generated
 * separately at /sitemap.xml.
 */
export default async function SitemapPage() {
  const navigation = await getPrimaryNavigation()

  return (
    <>
      <PageHero
        title="Sitemap"
        description="Every section of this website, listed on one page."
        breadcrumbs={[{ label: 'Sitemap', href: '/sitemap' }]}
      />

      <Section>
        <Container>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {navigation.map((group) => (
              <nav key={group.label} aria-labelledby={`sitemap-${group.href}`}>
                <h2 id={`sitemap-${group.href}`} className="text-lg">
                  <Link href={group.href} className="text-foreground hover:text-primary">
                    {group.label}
                  </Link>
                </h2>
                <ul className="mt-3 flex flex-col gap-2 border-l border-border pl-4">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <nav aria-labelledby="sitemap-legal">
              <h2 id="sitemap-legal" className="text-lg text-foreground">
                Legal
              </h2>
              <ul className="mt-3 flex flex-col gap-2 border-l border-border pl-4">
                {legalNavigation.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </Container>
      </Section>
    </>
  )
}
