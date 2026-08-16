import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo/metadata'
import { Container, Section, SectionHeader } from '@/components/ui/layout'
import { LinkButton } from '@/components/ui/button'
import { PendingBlock } from '@/components/ui/pending'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Pharmaceutical manufacturing, distribution and PCD franchise',
    description:
      'Company overview, product portfolio, manufacturing and quality information, network coverage and enquiry routes.',
    path: '/',
  })
}

/**
 * Homepage shell.
 *
 * The homepage is assembled last (Phases.md §9) from content validated on the
 * inner pages. Until then it carries only navigation into the sections that
 * exist.
 */
export default function HomePage() {
  return (
    <Section>
      <Container className="flex flex-col gap-8">
        <SectionHeader
          as="h1"
          title="Company website"
          description="This homepage is assembled in the final build phase from content that has been verified on the inner pages."
        />
        <PendingBlock label="Homepage content is composed in Phase 9 from verified inner-page content" />
        <div className="flex flex-wrap gap-3">
          <LinkButton href="/products">Find products</LinkButton>
          <LinkButton href="/contact" variant="outline">
            Send an enquiry
          </LinkButton>
        </div>
      </Container>
    </Section>
  )
}
