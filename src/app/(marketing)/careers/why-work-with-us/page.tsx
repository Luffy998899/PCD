import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo/metadata'
import { getContentBlocks } from '@/lib/content/blocks'
import { Container, Section } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { ContentBlocks } from '@/components/sections/content-blocks'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Why work with us',
    description: 'What we offer our people, and what we expect in return.',
    path: '/careers/why-work-with-us',
  })
}

export default async function Page() {
  const blocks = await getContentBlocks('careers-why')

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Why work with us"
        description="What we offer our people, and what we expect in return."
        breadcrumbs={[
          { label: 'Careers', href: '/careers' },
          { label: 'Why work with us', href: '/careers/why-work-with-us' },
        ]}
      />
      <Section>
        <Container size="narrow">
          <ContentBlocks
            blocks={blocks}
            emptyTitle="This page is being prepared"
            emptyDescription="This page is published once the content has been approved. Current openings are listed separately."
          />
        </Container>
      </Section>
    </>
  )
}
