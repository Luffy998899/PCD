import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo/metadata'
import { getContentBlocks } from '@/lib/content/blocks'
import { Container, Section } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { ContentBlocks } from '@/components/sections/content-blocks'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Company overview',
    description:
      'Company profile: what we manufacture and market, the divisions we operate, and where we supply.',
    path: '/about/overview',
  })
}

export default async function CompanyOverviewPage() {
  const blocks = await getContentBlocks('about-overview')

  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Company overview"
        description="What the company does, how it is structured, and where it operates."
        breadcrumbs={[
          { label: 'About Us', href: '/about' },
          { label: 'Company Overview', href: '/about/overview' },
        ]}
      />
      <Section>
        <Container size="narrow">
          <ContentBlocks
            blocks={blocks}
            emptyTitle="Company overview is being prepared"
            emptyDescription="This page is published once the company profile has been confirmed by the company."
          />
        </Container>
      </Section>
    </>
  )
}
