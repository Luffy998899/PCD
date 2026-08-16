import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo/metadata'
import { getContentBlocks } from '@/lib/content/blocks'
import { Container, Section } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { ContentBlocks } from '@/components/sections/content-blocks'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Vision and mission',
    description: 'The company’s long-term direction and the commitments that follow from it.',
    path: '/about/vision-mission',
  })
}

export default async function VisionMissionPage() {
  const blocks = await getContentBlocks('about-vision-mission')

  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Vision and mission"
        description="The direction the company is working towards, and how it intends to get there."
        breadcrumbs={[
          { label: 'About Us', href: '/about' },
          { label: 'Vision & Mission', href: '/about/vision-mission' },
        ]}
      />
      <Section>
        <Container size="narrow">
          <ContentBlocks
            blocks={blocks}
            emptyTitle="Vision and mission statements are being prepared"
            emptyDescription="These statements are published once approved by the company."
          />
        </Container>
      </Section>
    </>
  )
}
