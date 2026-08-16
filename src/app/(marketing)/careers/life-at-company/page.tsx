import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo/metadata'
import { getContentBlocks } from '@/lib/content/blocks'
import { Container, Section } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { ContentBlocks } from '@/components/sections/content-blocks'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Life at the company',
    description: 'How we work, and what to expect day to day.',
    path: '/careers/life-at-company',
  })
}

export default async function Page() {
  const blocks = await getContentBlocks('careers-life')

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Life at the company"
        description="How we work, and what to expect day to day."
        breadcrumbs={[
          { label: 'Careers', href: '/careers' },
          { label: 'Life at the company', href: '/careers/life-at-company' },
        ]}
      />
      <Section>
        <Container size="narrow">
          <ContentBlocks
            blocks={blocks}
            emptyTitle="Details about life at the company are being prepared"
            emptyDescription="This page is published once the content has been approved. Current openings are listed separately."
          />
        </Container>
      </Section>
    </>
  )
}
