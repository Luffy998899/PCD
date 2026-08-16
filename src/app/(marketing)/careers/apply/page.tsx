import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo/metadata'
import { getOpenJobOpenings } from '@/lib/content/careers'
import { Container, Section, SectionHeader } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { ApplicationForm } from '@/components/forms/application-form'
import { Card, CardBody, CardTitle } from '@/components/ui/card'
import { LinkButton } from '@/components/ui/button'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Send us your CV',
    description: 'Submit your CV for consideration against current and future openings.',
    path: '/careers/apply',
  })
}

export default async function ApplyPage() {
  const openings = await getOpenJobOpenings()

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Send us your CV"
        description="Apply for a specific role, or send your CV for consideration against future openings."
        breadcrumbs={[
          { label: 'Careers', href: '/careers' },
          { label: 'Apply', href: '/careers/apply' },
        ]}
      />

      <Section>
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="flex flex-col gap-6">
            <SectionHeader
              title="Application"
              description="Fields marked with an asterisk are required."
            />
            <ApplicationForm />
          </div>

          <aside className="flex flex-col gap-4">
            {openings.length > 0 ? (
              <Card>
                <CardBody className="flex flex-col gap-3">
                  <CardTitle as="h2" className="text-base">
                    Open roles
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {openings.length} role{openings.length === 1 ? '' : 's'} currently advertised.
                    Applying against a specific role helps us route your CV faster.
                  </p>
                  <LinkButton href="/careers/openings" variant="outline" size="sm">
                    View openings
                  </LinkButton>
                </CardBody>
              </Card>
            ) : null}

            <Card>
              <CardBody className="flex flex-col gap-2">
                <CardTitle as="h2" className="text-base">
                  How we handle your CV
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Your CV is stored in private storage, is not published anywhere on this website,
                  and is seen only by our HR team. You can ask us to delete it at any time.
                </p>
              </CardBody>
            </Card>
          </aside>
        </Container>
      </Section>
    </>
  )
}
