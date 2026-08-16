import type { Metadata } from 'next'

import { buildCanonicalUrl, buildMetadata } from '@/lib/seo/metadata'
import { displayName, getSiteSettings } from '@/lib/content/site-settings'
import { withoutPlaceholder } from '@/lib/content/placeholder'
import { compact } from '@/lib/utils'
import { JsonLd } from '@/components/seo/json-ld'
import { HomeHero, HomeSnapshot } from '@/components/sections/home/hero'
import {
  HomeAbout,
  HomeCertifications,
  HomeLeadership,
  HomeNetwork,
  HomePartners,
  HomeScience,
} from '@/components/sections/home/authority'
import {
  HomeCareers,
  HomeDivisions,
  HomeEnquiryStrip,
  HomeNews,
  HomeTherapies,
} from '@/components/sections/home/engagement'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const name = withoutPlaceholder(displayName(settings))

  return buildMetadata({
    title: name
      ? `${name} — pharmaceutical manufacturing and distribution`
      : 'Pharmaceutical manufacturing and distribution',
    description:
      withoutPlaceholder(settings.short_description) ??
      'Product portfolio, manufacturing and quality information, network coverage and enquiry routes.',
    path: '/',
  })
}

/**
 * Homepage (PRD §7, Phases.md §9).
 *
 * Assembled last, from content already verified on the inner pages. Each
 * section renders only when its records exist, so the page tells one coherent
 * story rather than showing empty scaffolding.
 *
 * Section order follows the PRD: hero → snapshot → about → divisions →
 * therapies → science → certifications → network → leadership → partners →
 * news → careers → enquiry strip.
 */
export default async function HomePage() {
  const settings = await getSiteSettings()
  const name = withoutPlaceholder(displayName(settings))

  // Organization schema is emitted only once the company's real identity is
  // known (Rules.md §19).
  const organisationSchema = name
    ? {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name,
        url: buildCanonicalUrl('/'),
        ...(withoutPlaceholder(settings.legal_name)
          ? { legalName: settings.legal_name }
          : {}),
        ...(withoutPlaceholder(settings.short_description)
          ? { description: settings.short_description }
          : {}),
        ...(settings.logo_url ? { logo: settings.logo_url } : {}),
        ...(settings.registered_address
          ? {
              address: {
                '@type': 'PostalAddress',
                streetAddress: settings.registered_address,
                addressCountry: 'IN',
              },
            }
          : {}),
        ...(settings.primary_phone || settings.primary_email
          ? {
              contactPoint: compact([
                settings.primary_phone
                  ? {
                      '@type': 'ContactPoint',
                      contactType: 'customer service',
                      telephone: settings.primary_phone,
                      email: settings.primary_email ?? undefined,
                    }
                  : null,
              ]),
            }
          : {}),
      }
    : null

  return (
    <>
      <JsonLd data={organisationSchema} />
      <HomeHero />
      <HomeSnapshot />
      <HomeAbout />
      <HomeDivisions />
      <HomeTherapies />
      <HomeScience />
      <HomeCertifications />
      <HomeNetwork />
      <HomeLeadership />
      <HomePartners />
      <HomeNews />
      <HomeCareers />
      <HomeEnquiryStrip />
    </>
  )
}
